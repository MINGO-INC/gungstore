import React, { useState } from 'react';
import { UserPlus, Trash2, AlertCircle } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EmployeeManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployeeManagementDialog({ open, onOpenChange }: EmployeeManagementDialogProps) {
  const { employees, addEmployee, removeEmployee } = useEmployees();
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [error, setError] = useState('');
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const handleAddEmployee = () => {
    try {
      setError('');
      addEmployee(newEmployeeName);
      setNewEmployeeName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add employee');
    }
  };

  const handleRemoveEmployee = (id: string) => {
    try {
      removeEmployee(id);
      setEmployeeToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove employee');
      setEmployeeToDelete(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Manage Employees</DialogTitle>
            <DialogDescription>
              Add new employees or remove existing ones from the roster.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Add Employee Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">Add New Employee</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Employee Name"
                  value={newEmployeeName}
                  onChange={(e) => {
                    setNewEmployeeName(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newEmployeeName.trim()) {
                      handleAddEmployee();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddEmployee}
                  disabled={!newEmployeeName.trim()}
                  size="default"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Employee List Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">
                Current Employees ({employees.length})
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto border border-border rounded-lg p-3 bg-muted/20">
                {employees.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No employees found
                  </div>
                ) : (
                  employees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-3 bg-card border border-border rounded-md hover:border-primary/30 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{employee.name}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          @{employee.slug}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEmployeeToDelete(employee.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!employeeToDelete} onOpenChange={(open) => !open && setEmployeeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Employee?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <span className="font-semibold">
                {employees.find((e) => e.id === employeeToDelete)?.name}
              </span>
              ? This action cannot be undone. Their sales history will remain in the ledger.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => employeeToDelete && handleRemoveEmployee(employeeToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
