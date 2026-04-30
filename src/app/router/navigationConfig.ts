import type { ElementType } from 'react';
import type { UserRole } from '@/modules/users/types';

import {
  LayoutDashboard,
  Users,
  Building2,
  Building,
  ClipboardList,
  AlertTriangle,
  ChefHat,
  CookingPot,
  FileCheck,
  FileWarning,
  Layers,
  ClipboardCheck,
  BarChart3,
  Map,
  Network,
} from 'lucide-react';

export type NavItem = {
  labelKey: string;
  path: string;
  icon: ElementType;
};

export const ROLE_NAVIGATION: Record<UserRole, NavItem[]> = {
  system_manager: [
    { labelKey: 'nav.dashboard', path: '/system-manager/dashboard', icon: LayoutDashboard },

    { labelKey: 'nav.users', path: '/system-manager/users', icon: Users },

    { labelKey: 'nav.companies', path: '/system-manager/companies', icon: Building2 },
    { labelKey: 'nav.branches', path: '/system-manager/branches', icon: Building },

    { labelKey: 'nav.locations', path: '/system-manager/locations', icon: Map },
    { labelKey: 'nav.zones', path: '/system-manager/zones', icon: Network },

    { labelKey: 'nav.kitchens', path: '/system-manager/kitchens', icon: CookingPot },

    { labelKey: 'nav.contracts', path: '/system-manager/contracts', icon: FileCheck },

    { labelKey: 'nav.forms', path: '/system-manager/forms', icon: ClipboardList },

    { labelKey: 'nav.inspectionStages', path: '/system-manager/inspection-stages', icon: Layers },

    { labelKey: 'nav.complaintTypes', path: '/system-manager/complaints-types', icon: FileWarning },

    { labelKey: 'nav.complaints', path: '/system-manager/complaints', icon: AlertTriangle },

    { labelKey: 'nav.formSubmissions', path: '/system-manager/submissions', icon: ClipboardCheck },

    { labelKey: 'nav.timeWindowReports', path: '/system-manager/reports-time-window', icon: BarChart3 },
    { labelKey: 'nav.dailyReports', path: '/system-manager/reports-daily', icon: BarChart3 },
    // { labelKey: 'nav.complaintsLive', path: '/system-manager/complaints-live', icon: AlertTriangle },
  ],

  catering_manager: [
    { labelKey: 'nav.dashboard', path: '/catering-manager/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav.kitchens', path: '/catering-manager/kitchens', icon: CookingPot },
    { labelKey: 'nav.kitchenReadiness', path: '/catering-manager/submissions', icon: ClipboardCheck },
    { labelKey: 'nav.timeWindowReports', path: '/catering-manager/reports-time-window', icon: BarChart3 },
    { labelKey: 'nav.dailyReports', path: '/catering-manager/reports-daily', icon: BarChart3 },

  ],

  project_manager: [
    { labelKey: 'nav.dashboard', path: '/project-manager/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav.users', path: '/project-manager/users', icon: Users },
    { labelKey: 'nav.zones', path: '/project-manager/zones', icon: Network },
    { labelKey: 'nav.kitchens', path: '/project-manager/kitchens', icon: ChefHat },
    { labelKey: 'nav.contracts', path: '/project-manager/contracts', icon: FileCheck },
    { labelKey: 'nav.formSubmissions', path: '/project-manager/submissions', icon: ClipboardCheck },


    // { labelKey: 'nav.timeWindowReports', path: '/project-manager/reports-time-window', icon: BarChart3 },
  ],

  quality_manager: [
    { labelKey: 'nav.dashboard', path: '/quality-manager/dashboard', icon: LayoutDashboard },

    { labelKey: 'nav.users', path: '/quality-manager/users', icon: Users },

    { labelKey: 'nav.companies', path: '/quality-manager/companies', icon: Building2 },
    { labelKey: 'nav.branches', path: '/quality-manager/branches', icon: Building },

    { labelKey: 'nav.locations', path: '/quality-manager/locations', icon: Map },
    { labelKey: 'nav.zones', path: '/quality-manager/zones', icon: Network },

    { labelKey: 'nav.kitchens', path: '/quality-manager/kitchens', icon: CookingPot },

    { labelKey: 'nav.contracts', path: '/quality-manager/contracts', icon: FileCheck },

    { labelKey: 'nav.forms', path: '/quality-manager/forms', icon: ClipboardList },

    { labelKey: 'nav.inspectionStages', path: '/quality-manager/inspection-stages', icon: Layers },

    { labelKey: 'nav.complaintTypes', path: '/quality-manager/complaints-types', icon: FileWarning },

    { labelKey: 'nav.complaints', path: '/quality-manager/complaints', icon: AlertTriangle },

    { labelKey: 'nav.formSubmissions', path: '/quality-manager/submissions', icon: ClipboardCheck },

    { labelKey: 'nav.timeWindowReports', path: '/quality-manager/reports-time-window', icon: BarChart3 },
  ],

  quality_supervisor: [
    { labelKey: 'nav.users', path: '/supervisor/users', icon: Users },
    { labelKey: 'nav.kitchens', path: '/supervisor/kitchens', icon: ChefHat },
    { labelKey: 'nav.forms', path: '/supervisor/forms', icon: ClipboardList },
  ],

  quality_inspector: [
    { labelKey: 'nav.forms', path: '/inspector/forms', icon: ClipboardCheck },
    { labelKey: 'nav.complaints', path: '/inspector/complaints', icon: AlertTriangle },
  ],
};