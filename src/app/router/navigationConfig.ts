import type { ElementType } from 'react';
import type { UserRole } from '../store/useAuthStore';
import {
  LayoutDashboard, Users, Building,
  Building2, MapPin, ChefHat, FileText, AlertTriangle,
  CheckSquare, Settings, ClipboardList
} from 'lucide-react';

export type NavItem = {
  label: string;
  path: string;
  icon: ElementType;
};

// Map each Role to their specific allowed Navigation paths
export const ROLE_NAVIGATION: Record<UserRole, NavItem[]> = {
  SystemManager: [
    { label: 'Dashboard', path: '/system-manager/dashboard', icon: LayoutDashboard },
    { label: 'Users Management', path: '/users', icon: Users },
    { label: 'Companies', path: '/companies', icon: Building2 },
    { label: 'Branches', path: '/branches', icon: Building },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings },
  ],
  CateringManager: [
    { label: 'Dashboard', path: '/catering-manager/dashboard', icon: LayoutDashboard },
    { label: 'My Branches', path: '/branches', icon: Building },
    { label: 'Kitchens Overview', path: '/kitchens', icon: ChefHat },
    { label: 'Reports', path: '/reports', icon: FileText },
  ],
  ProjectManager: [
    { label: 'Dashboard', path: '/project-manager/dashboard', icon: LayoutDashboard },
    { label: 'Supervised Zones', path: '/zones', icon: MapPin },
    { label: 'Kitchens', path: '/kitchens', icon: ChefHat },
    { label: 'Analytics', path: '/reports', icon: FileText },
  ],
  QualityManager: [
    { label: 'Dashboard', path: '/quality-manager/dashboard', icon: LayoutDashboard },
    { label: 'Zones Map', path: '/zones', icon: MapPin },
    { label: 'Evaluations', path: '/evaluations', icon: CheckSquare },
    { label: 'Complaints', path: '/complaints', icon: AlertTriangle },
    { label: 'Compliance Reports', path: '/reports', icon: FileText },
  ],
  QualitySupervisor: [
    { label: 'Dashboard', path: '/supervisor/dashboard', icon: LayoutDashboard },
    { label: 'Assigned Kitchens', path: '/kitchens', icon: ChefHat },
    { label: 'Pending Approvals', path: '/approvals', icon: CheckSquare },
    { label: 'Live Alerts', path: '/alerts', icon: AlertTriangle },
  ],
  QualityInspector: [
    { label: 'Dashboard', path: '/inspector/dashboard', icon: LayoutDashboard },
    { label: 'New Inspection', path: '/inspections/new', icon: ClipboardList },
    { label: 'My Reports', path: '/inspector/reports', icon: FileText },
  ],
};
