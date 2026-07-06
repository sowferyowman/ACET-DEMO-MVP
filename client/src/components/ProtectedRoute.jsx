import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/storage";

export default function ProtectedRoute({ allowedRole }) {
  const user = getCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  if (allowedRole === "student" && !user.profileCompleted && location.pathname !== "/student-profiling") {
    return <Navigate to="/student-profiling" replace />;
  }

  if (allowedRole === "student" && user.profileCompleted && location.pathname === "/student-profiling") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
