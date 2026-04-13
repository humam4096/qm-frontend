import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ROLE_BASE_ROUTES } from './routeConfig';

/**
 * GuestRoute - Prevents authenticated users from accessing auth pages
 * If user is logged in, redirect them to their role-specific dashboard
 */
export const GuestRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    // Redirect to their role-specific dashboard
    return <Navigate to={ROLE_BASE_ROUTES[user.role]} replace />;
  }

  return <Outlet />;
};
