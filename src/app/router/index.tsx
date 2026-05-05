import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';

// Eager load critical auth components
import { LoginPage } from '../../modules/auth/LoginPage';
import { RegisterPage } from '../../modules/auth/RegisterPage';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LandingPage } from '../pages/landing-page/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Lazy load dashboard pages (not needed on initial load)
const DashboardSwitcher = lazy(() => import('../../modules/dashboard/DashboardSwitcher').then(m => ({ default: m.DashboardSwitcher })));
const CompaniesPage = lazy(() => import('../../modules/companies/pages/CompaniesPage').then(m => ({ default: m.CompaniesPage })));
const UsersPage = lazy(() => import('../../modules/users/pages/UsersPage').then(m => ({ default: m.UsersPage })));
const BranchesPage = lazy(() => import('@/modules/branches/pages/BranchesPage').then(m => ({ default: m.BranchesPage })));
const LocationsPage = lazy(() => import('@/modules/locations/pages/LocationsPage').then(m => ({ default: m.LocationsPage })));
const ZonesPage = lazy(() => import('@/modules/zones/pages/ZonesPage').then(m => ({ default: m.ZonesPage })));
const KitchensPage = lazy(() => import('@/modules/kitchens/pages/KitchensPage').then(m => ({ default: m.KitchensPage })));
const InspectionStagesPage = lazy(() => import('@/modules/inspection-stages/pages/InspectionStagesPage').then(m => ({ default: m.InspectionStagesPage })));
const ComplaintTypesPage = lazy(() => import('@/modules/complaint-types/pages/ComplaintTypesPage').then(m => ({ default: m.ComplaintTypesPage })));
const ComplaintsPage = lazy(() => import('@/modules/complaints/pages/ComplaintsPage').then(m => ({ default: m.ComplaintsPage })));
const ContractsPage = lazy(() => import('@/modules/contracts/pages/ContractsPage').then(m => ({ default: m.ContractsPage })));
const KitchenShow = lazy(() => import('@/modules/kitchens/pages/KitchenShow').then(m => ({ default: m.KitchenShow })));
const FormsPage = lazy(() => import('@/modules/forms/pages/FormsPage').then(m => ({ default: m.FormsPage })));
const SubmitNewFromPage = lazy(() => import('@/modules/form-submissions/pages/SubmitNewFromPage'));
const FormSubmissionsPage = lazy(() => import('@/modules/form-submissions/pages/FormSubmissionsPage').then(m => ({ default: m.FormSubmissionsPage })));
const ReportsTimeWindowPage = lazy(() => import('@/modules/reports-time-window/pages/ReportsTimeWindowPage').then(m => ({ default: m.ReportsTimeWindowPage })));
const DailyReportsPage = lazy(() => import('@/modules/report-daily/pages/DailyReportsPage').then(m => ({ default: m.DailyReportsPage })));
const CateringSubmissionsPage = lazy(() => import('@/modules/form-submissions/pages/CateringSubmissionsPage').then(m => ({ default: m.CateringSubmissionsPage })));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen-mobile">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Wrapper for lazy loaded components
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element:<LazyWrapper> <LandingPage /></LazyWrapper>,
  },
  // Authentication Flow
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: <LazyWrapper><LoginPage /></LazyWrapper>,
          },
          {
            path: '/register',
            element: <LazyWrapper><RegisterPage /></LazyWrapper>,
          },
        ]
      },
    ]
  },
  
  // Authenticated Application Shell
  {
    element: <DashboardLayout />,
    children: [
      // 1. System Manager Route Group
      {
        path: '/system-manager',
        element: <ProtectedRoute allowedRoles={['system_manager']} />,
        children: [
          { path: 'dashboard', element: <DashboardSwitcher /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'companies', element: <CompaniesPage /> },
          { path: 'branches', element: <BranchesPage /> },
          { path: 'locations', element: <LocationsPage /> },
          { path: 'zones', element: <ZonesPage /> },
          { path: 'kitchens', element: <KitchensPage /> },
          { path: 'contracts', element: <ContractsPage /> },
          { path: 'forms', element: <FormsPage /> },
          { path: 'inspection-stages', element: <InspectionStagesPage /> },
          { path: 'complaints-types', element: <ComplaintTypesPage /> },
          { path: 'submissions', element: <FormSubmissionsPage /> },
          { path: 'complaints', element: <ComplaintsPage /> },
          { path: 'reports-time-window', element: <ReportsTimeWindowPage /> },
          { path: 'reports-daily', element: <DailyReportsPage /> },
        ]
      },
      // 2. Catering Manager Route Group
      {
        path: '/catering-manager',
        element: <ProtectedRoute allowedRoles={['catering_manager']} />,
        children: [
          { path: 'dashboard', element: <DashboardSwitcher /> },
          { path: 'kitchens', element: <KitchensPage /> },
          { path: 'reports-time-window', element: <ReportsTimeWindowPage /> },
          { path: 'reports-daily', element: <DailyReportsPage /> },
          { path: 'submissions', element: <CateringSubmissionsPage /> },
        ]
      },

      // 3. Project Manager Route Group
      {
        path: '/project-manager',
        element: <ProtectedRoute allowedRoles={['project_manager']} />,
        children: [
          { path: 'dashboard', element: <DashboardSwitcher /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'zones', element: <ZonesPage /> },
          { path: 'kitchens', element: <KitchensPage /> },
          { path: 'contracts', element: <ContractsPage /> },
          { path: 'submissions', element: <FormSubmissionsPage /> },
        ]
      },

      // 4. Quality Manager Route Group
      {
        path: '/quality-manager',
        element: <ProtectedRoute allowedRoles={['quality_manager']} />,
        children: [
          { path: 'dashboard', element: <DashboardSwitcher /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'companies', element: <CompaniesPage /> },
          { path: 'branches', element: <BranchesPage /> },
          { path: 'locations', element: <LocationsPage /> },
          { path: 'zones', element: <ZonesPage /> },
          { path: 'kitchens', element: <KitchensPage /> },
          { path: 'contracts', element: <ContractsPage /> },
          { path: 'forms', element: <FormsPage /> },
          { path: 'inspection-stages', element: <InspectionStagesPage /> },
          { path: 'complaints-types', element: <ComplaintTypesPage /> },
          { path: 'submissions', element: <FormSubmissionsPage /> },
          { path: 'complaints', element: <ComplaintsPage /> },
          { path: 'reports-time-window', element: <ReportsTimeWindowPage /> },
        ]
      },

      // 5. Quality Supervisor Route Group
      {
        path: '/supervisor',
        element: <ProtectedRoute allowedRoles={['quality_supervisor']} />,
        children: [
          { path: 'users', element: <UsersPage /> },
          { path: 'kitchens', element: <KitchensPage /> },
          { path: 'forms', element: <FormSubmissionsPage/> },
        ]
      },

      // 6. Quality Inspector Route Group
      {
        path: '/inspector',
        element: <ProtectedRoute allowedRoles={['quality_inspector']} />,
        children: [
          { path: 'forms', element: <FormSubmissionsPage/> },
          { path: 'complaints', element: <ComplaintsPage/> },
        ]
      },

      // Shared Routes (accessible by multiple roles)
      {
        path: '/',
        element: <ProtectedRoute 
          allowedRoles={[
            'catering_manager', 
            'system_manager',
            'project_manager', 
            'quality_manager', 
            'quality_supervisor',
          ]} 
        />,
        children: [
          { path: 'kitchens/:kitchen_id', element: <KitchenShow /> },
        ]
      },
      {
        path: '/',
        element: <ProtectedRoute 
          allowedRoles={[
            'project_manager', 
            'quality_inspector', 
            'system_manager', 
          ]} 
        />,
        children: [
          { path: 'form-submissions/new', element: <SubmitNewFromPage /> },
        ]
      },
      {
        path: '/',
        element: <ProtectedRoute allowedRoles={['quality_manager', 'system_manager', 'quality_inspector']} />,
        children: [
          { path: 'complaints', element: <ComplaintsPage /> },
        ]
      },
    ],
  },
  
  // Catch all 404
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
