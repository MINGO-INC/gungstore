import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/lib/index";
import { useEmployees } from "@/hooks/useEmployees";
import { Layout } from "@/components/Layout";
import EmployeePage from "@/pages/EmployeePage";
import OrderHistory from "@/pages/OrderHistory";

const queryClient = new QueryClient();

function AppRoutes() {
  const { employees, isLoading } = useEmployees();
  
  // Wait for employees to load before determining redirect path
  // This prevents multiple rapid navigations that can trigger the
  // "Too many calls to Location or History APIs" browser error
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Routes>
        {/* Default landing redirects to the first employee ledger */}
        <Route
          path={ROUTE_PATHS.HOME}
          element={<Navigate to={employees.length > 0 ? `/employee/${employees[0].slug}` : ROUTE_PATHS.ORDER_HISTORY} replace />}
        />
        {/* Individual Employee Ledger Sheets */}
        <Route
          path={ROUTE_PATHS.EMPLOYEE}
          element={<EmployeePage />}
        />
        {/* Global Order History Sheet */}
        <Route
          path={ROUTE_PATHS.ORDER_HISTORY}
          element={<OrderHistory />}
        />
        {/* Catch-all route redirects to home */}
        <Route 
          path="*" 
          element={<Navigate to={ROUTE_PATHS.HOME} replace />} 
        />
      </Routes>
    </Layout>
  );
}

/**
 * TLCA Gun Register - Root Application
 * © 2026 TLCA Inventory Systems
 */
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;