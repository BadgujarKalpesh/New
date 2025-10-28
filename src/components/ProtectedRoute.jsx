import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const isAuthenticated = sessionStorage.getItem("token");
    return isAuthenticated ? children : <Navigate to="/" replace />;
}
