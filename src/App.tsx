import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTE_PATHS, EMPLOYEES } from "@/lib/index";
import { Layout } from "@/components/Layout";
import EmployeePage from "@/pages/EmployeePage";
import OrderHistory from "@/pages/OrderHistory";

/**
 * TLCA Gun Register - Root Application
 * (c) 2026 TLCA Inventory Systems
 */
const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Default landing redirects to the first employee ledger */}
          <Route
            path={ROUTE_PATHS.HOME}
            element={<Navigate to={`/employee/${EMPLOYEES[0].slug}`} replace />}
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
    </BrowserRouter>
  );
};

export default App;