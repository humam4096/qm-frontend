import { ROLE_CONFIG } from "../config/userRoleConfig";

//  get roles that the current user can create
export function getCreatableRoles(userRole: string | undefined) {
  // @ts-ignore
  return ROLE_CONFIG[userRole as keyof typeof ROLE_CONFIG]?.canCreate ?? [];
}

// get required fields for a specific role
export function getRequiredFields(role: string) {
  return ROLE_CONFIG[role as keyof typeof ROLE_CONFIG]?.requires ?? [];
}