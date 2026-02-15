import React, { useState } from 'react';
import { UserPlus, Trash2, Settings, Users } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Employee } from '@/lib/index';

export default function StaffSettings() {
  const { employees, addEmployee, removeEmployee } = useEmployees();
  const [name, setName] = useState('');
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState<Employee | null>(null);

  const handleAddEmployee = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const created = addEmployee(name);
    if (created) {
      setName('');
    }
  };

  const confirmRemove = (employee: Employee) => {
    setEmployeeToRemove(employee);
    setRemoveDialogOpen(true);
  };

  const handleRemove = () => {
    if (employeeToRemove) {
      removeEmployee(employeeToRemove.id);
    }
    setRemoveDialogOpen(false);
    setEmployeeToRemove(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Settings className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest font-mono">Staff Settings</span>
          </div>
          <h1 className="text-4xl font-heading text-foreground">Manage Staff</h1>
          <p className="text-muted-foreground">
            Add or remove register access. Historical sales remain in the ledger after removal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary" />
              Add New Staff Member
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-mono text-muted-foreground">
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="bg-background"
                />
              </div>
              <Button type="submit" className="w-full">
                Add Staff Member
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              Active Staff List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employees.length === 0 ? (
                <div className="text-sm text-muted-foreground italic">
                  No staff members found. Add someone to get started.
                </div>
              ) : (
                employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between gap-4 rounded-md border border-border bg-background/50 px-4 py-3"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-foreground">{employee.name}</div>
                      <div className="text-xs font-mono text-muted-foreground">{employee.slug}</div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={() => confirmRemove(employee)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Staff Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes register access but keeps all historical sales in the ledger.
              {employeeToRemove && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Removing: <span className="font-medium text-foreground">{employeeToRemove.name}</span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Staff
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
