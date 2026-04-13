import { type UserRole } from '../store/useAuthStore';

/**
 * A centralized mapping of user roles to their default dashboard entry points.
 * This prevents duplicating switch statements across login redirects and 
 * unauthorized fallback routings.
 */
export const ROLE_BASE_ROUTES: Record<UserRole, string> = {
  system_manager: '/system-manager/dashboard',
  catering_manager: '/catering-manager/dashboard',
  project_manager: '/project-manager/dashboard',
  quality_manager: '/quality-manager/dashboard',
  quality_supervisor: '/supervisor/users',
  quality_inspector: '/inspector/forms',
};

/**
 * Returns the correct base dashboard route for a given user role.
 * Falls back to /login if the role is unrecognized or undefined.
 */
export const getFallbackRouteForRole = (role?: UserRole): string => {
  if (!role || !ROLE_BASE_ROUTES[role]) {
    return '/login';
  }
  return ROLE_BASE_ROUTES[role];
};
