import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && allowedRoles.some((r) => r !== "guest")) {
    return <Navigate to="/bejelentkezes" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
