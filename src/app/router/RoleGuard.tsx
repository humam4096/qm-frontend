import { type ReactNode } from 'react';
import { useAuthStore, type UserRole } from '../store/useAuthStore';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

/**
 * A UI helper component used to conditionally render elements (like an "Approve" button)
 * only if the current user has the specified roles.
 */
export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};
