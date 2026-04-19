import { type ReactNode } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '@/modules/users/types';

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

export const developersAccess = ["humam4096@gmail.com"]