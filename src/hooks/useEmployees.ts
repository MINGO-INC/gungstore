import { useState, useEffect, useCallback } from 'react';
import { Employee } from '@/lib/index';

const STORAGE_KEY = 'tlca_employees_v1';
const STORAGE_EVENT = 'tlca_employees_updated';

// Default employees that will be used if no custom employees are stored
const DEFAULT_EMPLOYEES: Employee[] = [
  { id: 'emp_1', name: 'Cat', slug: 'cat' },
  { id: 'emp_2', name: 'Tom', slug: 'tom' },
  { id: 'emp_3', name: 'Rob', slug: 'rob' },
  { id: 'emp_4', name: 'Morris', slug: 'morris' },
  { id: 'emp_5', name: 'Extra', slug: 'extra' },
];

/**
 * Custom hook for managing employees with localStorage persistence
 */
export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load from localStorage
  useEffect(() => {
    const loadEmployees = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsedEmployees = JSON.parse(saved);
          setEmployees(parsedEmployees);
        } else {
          // Initialize with default employees
          setEmployees(DEFAULT_EMPLOYEES);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EMPLOYEES));
        }
      } catch (error) {
        console.error('TLCA Register: Failed to load employees.', error);
        setEmployees(DEFAULT_EMPLOYEES);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();

    // Listen for custom event when employees are updated
    const handleEmployeesUpdated = () => {
      loadEmployees();
    };

    window.addEventListener(STORAGE_EVENT, handleEmployeesUpdated);

    return () => {
      window.removeEventListener(STORAGE_EVENT, handleEmployeesUpdated);
    };
  }, []);

  /**
   * Generate a slug from a name
   */
  const generateSlug = useCallback((name: string): string => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }, []);

  /**
   * Generate a unique employee ID
   */
  const generateId = useCallback((): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `emp_${timestamp}_${random}`;
  }, []);

  /**
   * Adds a new employee to the list
   */
  const addEmployee = useCallback((name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Employee name cannot be empty');
    }

    const slug = generateSlug(trimmedName);
    
    // Check if employee with same name or slug already exists
    const existingEmployee = employees.find(
      (emp) => emp.name.toLowerCase() === trimmedName.toLowerCase() || emp.slug === slug
    );
    
    if (existingEmployee) {
      throw new Error('An employee with this name already exists');
    }

    const newEmployee: Employee = {
      id: generateId(),
      name: trimmedName,
      slug,
    };

    setEmployees((prevEmployees) => {
      const updatedEmployees = [...prevEmployees, newEmployee];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEmployees));
      return updatedEmployees;
    });

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event(STORAGE_EVENT));

    return newEmployee;
  }, [employees, generateSlug, generateId]);

  /**
   * Removes an employee by ID
   */
  const removeEmployee = useCallback((id: string) => {
    setEmployees((prevEmployees) => {
      const updatedEmployees = prevEmployees.filter((emp) => emp.id !== id);
      
      // Prevent removing the last employee
      if (updatedEmployees.length === 0) {
        throw new Error('Cannot remove the last employee');
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEmployees));
      return updatedEmployees;
    });

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, []);

  /**
   * Get employee by ID
   */
  const getEmployeeById = useCallback((id: string) => {
    return employees.find((emp) => emp.id === id);
  }, [employees]);

  /**
   * Get employee by slug
   */
  const getEmployeeBySlug = useCallback((slug: string) => {
    return employees.find((emp) => emp.slug === slug);
  }, [employees]);

  return {
    employees,
    addEmployee,
    removeEmployee,
    getEmployeeById,
    getEmployeeBySlug,
    isLoading,
  };
}
