import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/lib/index";
import { Layout } from "@/components/Layout";
import EmployeePage from "@/pages/EmployeePage";
import OrderHistory from "@/pages/OrderHistory";
import StaffSettings from "@/pages/StaffSettings";
import { useEmployees } from "@/hooks/useEmployees";

/**
 * TLCA Gun Register - Root Application
 * (c) 2026 TLCA Inventory Systems
 */
const App = () => {
  const { employees } = useEmployees();
  const hasEmployees = employees.length > 0;
  const defaultEmployeeSlug = hasEmployees ? employees[0].slug : null;

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Default landing redirects to the first employee ledger */}
          <Route
            path={ROUTE_PATHS.HOME}
            element={
              defaultEmployeeSlug ? (
                <Navigate to={`/employee/${defaultEmployeeSlug}`} replace />
              ) : (
                <Navigate to={ROUTE_PATHS.STAFF_SETTINGS} replace />
              )
            }
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
          {/* Staff Management */}
          <Route
            path={ROUTE_PATHS.STAFF_SETTINGS}
            element={<StaffSettings />}
          />
          {/* Catch-all route redirects to home */}
          <Route
            path="*"
            element={<Navigate to={ROUTE_PATHS.HOME} replace />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;