import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, isAdminUser } from "@/utils/authUtils";

/**
 * ProtectedAdminRoute — only allows access if user is logged in AND has role='admin'.
 * Non-admins are redirected to / with an error state.
 * Unauthenticated users are redirected to /login.
 */
export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location, reason: "auth" }} replace />;
  }

  if (!isAdminUser()) {
    return <Navigate to="/" state={{ reason: "forbidden" }} replace />;
  }

  return <>{children}</>;
}

/**
 * ProtectedUserRoute — only allows access if user is logged in.
 * Admin users are redirected to /admin (they should use the admin dashboard).
 * Unauthenticated users are redirected to /login.
 */
export function ProtectedUserRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location, reason: "auth" }} replace />;
  }

  if (isAdminUser()) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
