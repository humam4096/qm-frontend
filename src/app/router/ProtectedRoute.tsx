import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, type UserRole } from '../store/useAuthStore';
import { getFallbackRouteForRole } from './routeConfig';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    // Redirect to the login page if not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // User is logged in but doesn't have the explicit role to view this route.
    // Determine the correct fallback route based on their actual role.
    const fallbackPath = getFallbackRouteForRole(user.role);
    return <Navigate to={fallbackPath} replace />;
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
};


