import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../services/storage";

export default function ProtectedRoute({ allowedRole }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return <Outlet />;
}
