import { useCallback, useEffect, useMemo, useState } from 'react';
import { Employee, EMPLOYEES } from '@/lib/index';

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

  const persistEmployees = useCallback((nextEmployees: Employee[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEmployees));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, []);

  useEffect(() => {
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

    window.addEventListener('storage', handleStorage);
    window.addEventListener(STORAGE_EVENT, handleCustomEvent);

    if (!localStorage.getItem(STORAGE_KEY)) {
      persistEmployees(loadEmployeesFromStorage());
    }

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(STORAGE_EVENT, handleCustomEvent);
    };
  }, [persistEmployees]);

  const addEmployee = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;

    let created: Employee | null = null;

    setEmployees((prev) => {
      const existingSlugs = new Set(prev.map((emp) => emp.slug));
      const baseSlug = slugifyName(trimmed);
      const slug = buildUniqueSlug(baseSlug, existingSlugs);

      created = {
        id: createEmployeeId(),
        name: trimmed,
        slug,
      };

      const next = [...prev, created];
      persistEmployees(next);
      return next;
    });

    return created;
  }, [persistEmployees]);

  const removeEmployee = useCallback((employeeId: string) => {
    setEmployees((prev) => {
      const next = prev.filter((emp) => emp.id !== employeeId);
      persistEmployees(next);
      return next;
    });
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
