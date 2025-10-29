import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import ManageUsers from "./pages/manage-users/ManageUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageTenants from "./pages/manage-tenants/ManageTenants";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

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
