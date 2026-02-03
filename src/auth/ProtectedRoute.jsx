import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  // Ha nem bejelentkezett és nem guest szerep kell
  if (!isAuthenticated && !allowedRoles.includes("guest")) {
    return <Navigate to="/bejelentkezes" state={{ from: location }} replace />;
  }

  // Ha a szerepkör nem engedélyezett
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
