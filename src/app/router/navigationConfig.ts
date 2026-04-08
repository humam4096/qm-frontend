import type { ElementType } from 'react';
import type { UserRole } from '../store/useAuthStore';
import {
  LayoutDashboard, Users, Building,
  Building2, MapPin, ChefHat, FileText, AlertTriangle,
  CheckSquare, ClipboardList,
  CookingPot
} from 'lucide-react';

export type NavItem = {
  labelKey: string;
  path: string;
  icon: ElementType;
};

// Map each Role to their specific allowed Navigation paths
export const ROLE_NAVIGATION: Record<UserRole, NavItem[]> = {
  system_manager: [
    { labelKey: 'nav.dashboard', path: '/system-manager/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav.users', path: '/system-manager/users', icon: Users },
    { labelKey: 'nav.companies', path: '/system-manager/companies', icon: Building2 },
    { labelKey: 'nav.branches', path: '/system-manager/branches', icon: Building },
    { labelKey: 'nav.locations', path: '/system-manager/locations', icon: MapPin },
    { labelKey: 'nav.zones', path: '/system-manager/zones', icon: MapPin },
    { labelKey: 'nav.kitchens', path: '/system-manager/kitchens', icon: CookingPot },
    { labelKey: 'nav.contracts', path: '/system-manager/contracts', icon: FileText },
    { labelKey: 'nav.forms', path: '/system-manager/forms', icon: FileText },
    { labelKey: 'nav.inspectionStages', path: '/system-manager/inspection-stages', icon: ClipboardList },
    { labelKey: 'nav.complaintTypes', path: '/system-manager/complaints-types', icon: AlertTriangle },
    { labelKey: 'nav.complaints', path: '/system-manager/complaints', icon: AlertTriangle },
    { labelKey: 'nav.reports', path: '/system-manager/reports', icon: FileText },
  ],
  catering_manager: [
    { labelKey: 'nav.dashboard', path: '/catering-manager/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav.kitchens', path: '/catering-manager/kitchens', icon: CookingPot },
    { labelKey: 'nav.reports', path: '/catering-manager/reports', icon: FileText },
  ],
  project_manager: [
    { labelKey: 'nav.dashboard', path: '/project-manager/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav.supervisedZones', path: '/zones', icon: MapPin },
    { labelKey: 'nav.kitchens', path: '/kitchens', icon: ChefHat },
    { labelKey: 'nav.reports', path: '/reports', icon: FileText },
  ],
  quality_manager: [
    { labelKey: 'nav.users', path: '/quality-manager/users', icon: Users },
    { labelKey: 'nav.complaints', path: '/quality-manager/complaints', icon: AlertTriangle },

    { labelKey: 'nav.dashboard', path: '/quality-manager/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav.zonesMap', path: '/zones', icon: MapPin },
    { labelKey: 'nav.evaluations', path: '/evaluations', icon: CheckSquare },
    { labelKey: 'nav.complaints', path: '/complaints', icon: AlertTriangle },
    { labelKey: 'nav.complianceReports', path: '/reports', icon: FileText },
  ],
  quality_supervisor: [
    { labelKey: 'nav.dashboard', path: '/supervisor/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav.assignedKitchens', path: '/kitchens', icon: ChefHat },
    { labelKey: 'nav.pendingApprovals', path: '/approvals', icon: CheckSquare },
    { labelKey: 'nav.liveAlerts', path: '/alerts', icon: AlertTriangle },
  ],
  quality_inspector: [
    { labelKey: 'nav.dashboard', path: '/inspector/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav.reports', path: '/inspector/reports', icon: FileText },
  ],
};
