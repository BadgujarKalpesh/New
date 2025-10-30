import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import ManageUsers from "./pages/manage-users/ManageUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageTenants from "./pages/manage-tenants/ManageTenants";
import TwoFactorSetup from "./pages/authentication/TwoFactorSetup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/setup-2fa"
        element={
          <ProtectedRoute>
            <TwoFactorSetup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-users"
        element={
          <ProtectedRoute>
            <ManageUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-tenants"
        element={
          <ProtectedRoute>
            <ManageTenants />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
