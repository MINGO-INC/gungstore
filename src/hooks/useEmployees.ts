import { useCallback, useEffect, useMemo, useState } from 'react';
import { Employee, EMPLOYEES } from '@/lib/index';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'tlca_employees_v1';
const STORAGE_EVENT = 'tlca_employees_updated';

function slugifyName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildUniqueSlug(base: string, existing: Set<string>) {
  const sanitizedBase = base.length > 0 ? base : 'staff';
  let slug = sanitizedBase;
  let counter = 1;

  while (existing.has(slug)) {
    counter += 1;
    slug = `${sanitizedBase}-${counter}`;
  }

  return slug;
}

function createEmployeeId() {
  return `emp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadEmployeesFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Employee[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('TLCA Register: Failed to read staff list, using defaults.', error);
  }

  return EMPLOYEES;
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(() => loadEmployeesFromStorage());
  const [isLoadingFromDB, setIsLoadingFromDB] = useState(true);

  const persistEmployees = useCallback((nextEmployees: Employee[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEmployees));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, []);

  useEffect(() => {
    // Load employees from database on mount
    const loadFromDatabase = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase.from('employees').select('*');
          if (error) {
            console.warn('Failed to load employees from database:', error);
            setIsLoadingFromDB(false);
            return;
          }
          if (data && data.length > 0) {
            setEmployees(data as Employee[]);
            persistEmployees(data as Employee[]);
          }
        } catch (error) {
          console.warn('Failed to load employees from database:', error);
        } finally {
          setIsLoadingFromDB(false);
        }
      } else {
        setIsLoadingFromDB(false);
      }
    };

    loadFromDatabase();

    // Subscribe to real-time updates
    let unsubscribe: (() => void) | null = null;
    if (supabase) {
      try {
        const subscription = supabase
          .channel('employees_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'employees' },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setEmployees((prev) => {
                  const exists = prev.find((e) => e.id === (payload.new as Employee).id);
                  if (exists) return prev;
                  const updated = [...prev, payload.new as Employee];
                  persistEmployees(updated);
                  return updated;
                });
              } else if (payload.eventType === 'DELETE') {
                setEmployees((prev) => {
                  const updated = prev.filter((e) => e.id !== (payload.old as Employee).id);
                  persistEmployees(updated);
                  return updated;
                });
              }
            }
          )
          .subscribe();

        unsubscribe = () => {
          supabase.removeChannel(subscription);
        };
      } catch (error) {
        console.warn('Failed to subscribe to employee updates:', error);
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [persistEmployees]);

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    if (event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue) as Employee[];
        if (Array.isArray(parsed)) {
          setEmployees(parsed);
        }
      } catch (error) {
        console.warn('TLCA Register: Failed to sync staff list.', error);
      }
    }
  };

  const handleCustomEvent = () => {
    setEmployees(loadEmployeesFromStorage());
  };

  useEffect(() => {
    window.addEventListener('storage', handleStorage);
    window.addEventListener(STORAGE_EVENT, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(STORAGE_EVENT, handleCustomEvent);
    };
  }, []);

  const addEmployee = useCallback(async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;

    // Create the employee object first, outside of state updater
    const existingSlugs = new Set(employees.map((emp) => emp.slug));
    const baseSlug = slugifyName(trimmed);
    const slug = buildUniqueSlug(baseSlug, existingSlugs);

    const created: Employee = {
      id: createEmployeeId(),
      name: trimmed,
      slug,
    };

    // Update state with the new employee
    setEmployees((prev) => {
      const next = [...prev, created];
      persistEmployees(next);
      return next;
    });

    // Persist to database - now we know `created` is definitely defined
    if (supabase) {
      try {
        await supabase.from('employees').insert({
          id: created.id,
          name: created.name,
          slug: created.slug,
        });
      } catch (error) {
        console.error('Failed to add employee to database:', error);
        // Remove from local state if database insert fails
        setEmployees((prev) => prev.filter((emp) => emp.id !== created.id));
      }
    }

    return created;
  }, [employees, persistEmployees]);
  }, [persistEmployees]);

  const removeEmployee = useCallback(async (employeeId: string) => {
    setEmployees((prev) => {
      const next = prev.filter((emp) => emp.id !== employeeId);
      persistEmployees(next);
      return next;
    });

    // Remove from database if available
    if (supabase) {
      try {
        await supabase.from('employees').delete().eq('id', employeeId);
      } catch (error) {
        console.error('Failed to remove employee from database:', error);
      }
    }
  }, [persistEmployees]);

  const employeesById = useMemo(() => {
    return new Map(employees.map((emp) => [emp.id, emp]));
  }, [employees]);

  return {
    employees,
    employeesById,
    addEmployee,
    removeEmployee,
  };
}
