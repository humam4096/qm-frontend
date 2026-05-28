import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import { lazyPage, lazyWithRetry } from '@/utils/chunkLoadRecovery';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import { RouteErrorFallback } from './RouteErrorFallback';

// Eager load critical auth components
import { LoginPage } from '../../modules/auth/LoginPage';
import { RegisterPage } from '../../modules/auth/RegisterPage';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LandingPage } from '../pages/landing-page/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Lazy load dashboard pages (post-deploy safe via chunkLoadRecovery)
const DashboardSwitcher = lazyPage(() => import('../../modules/dashboard/DashboardSwitcher'), 'DashboardSwitcher');
const CompaniesPage = lazyPage(() => import('../../modules/companies/pages/CompaniesPage'), 'CompaniesPage');
const UsersPage = lazyPage(() => import('../../modules/users/pages/UsersPage'), 'UsersPage');
const BranchesPage = lazyPage(() => import('@/modules/branches/pages/BranchesPage'), 'BranchesPage');
const LocationsPage = lazyPage(() => import('@/modules/locations/pages/LocationsPage'), 'LocationsPage');
const ZonesPage = lazyPage(() => import('@/modules/zones/pages/ZonesPage'), 'ZonesPage');
const KitchensPage = lazyPage(() => import('@/modules/kitchens/pages/KitchensPage'), 'KitchensPage');
const InspectionStagesPage = lazyPage(() => import('@/modules/inspection-stages/pages/InspectionStagesPage'), 'InspectionStagesPage');
const ComplaintTypesPage = lazyPage(() => import('@/modules/complaint-types/pages/ComplaintTypesPage'), 'ComplaintTypesPage');
const ComplaintsPage = lazyPage(() => import('@/modules/complaints/pages/ComplaintsPage'), 'ComplaintsPage');
const ContractsPage = lazyPage(() => import('@/modules/contracts/pages/ContractsPage'), 'ContractsPage');
const KitchenShow = lazyPage(() => import('@/modules/kitchens/pages/KitchenShow'), 'KitchenShow');
const FormsPage = lazyPage(() => import('@/modules/forms/pages/FormsPage'), 'FormsPage');
const SubmitNewFromPage = lazyWithRetry(() => import('@/modules/form-submissions/pages/SubmitNewFromPage'));
const FormSubmissionsPage = lazyPage(() => import('@/modules/form-submissions/pages/FormSubmissionsPage'), 'FormSubmissionsPage');
const ReportsTimeWindowPage = lazyPage(() => import('@/modules/reports-time-window/pages/ReportsTimeWindowPage'), 'ReportsTimeWindowPage');
const DailyReportsPage = lazyPage(() => import('@/modules/report-daily/pages/DailyReportsPage'), 'DailyReportsPage');
const CateringSubmissionsPage = lazyPage(() => import('@/modules/form-submissions/pages/CateringSubmissionsPage'), 'CateringSubmissionsPage');

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
    errorElement: <RouteErrorFallback />,
    children: [
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
              { path: 'reports-daily', element: <DailyReportsPage /> },
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
                'quality_supervisor', 
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
      },
    ],
  },
]);
