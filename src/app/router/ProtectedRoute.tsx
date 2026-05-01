import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { getFallbackRouteForRole } from './routeConfig';
import type { UserRole } from '@/modules/users/types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isInitialized } = useAuthStore();

  // 1. Wait until we've checked the token against the API (prevents flash of login)
  if (!isInitialized) {
    return (
      <div className="flex h-screen-mobile items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-gray-500 font-medium tracking-wide">Authenticating...</p>
        </div>
      </div>
    );
  }

  // 2. Not logged in -> send to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Logged in, but wrong role for this specific route branch
  if (!allowedRoles.includes(user.role as UserRole)) {
    const fallbackPath = getFallbackRouteForRole(user.role as UserRole);
    return <Navigate to={fallbackPath} replace />;
  }

  // 4. Authorized
  return <Outlet />;
};


