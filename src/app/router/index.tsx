import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../../modules/auth/LoginPage';
import { RegisterPage } from '../../modules/auth/RegisterPage';
import { LandingPage } from '../pages/LandingPage';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DashboardSwitcher } from '../../modules/dashboard/DashboardSwitcher';
import { CompaniesPage } from '../../modules/companies/pages/CompaniesPage';
import { UsersPage } from '../../modules/users/pages/UsersPage';
import { BranchesPage } from '@/modules/branches/pages/BranchesPage';
import { LocationsPage } from '@/modules/locations/pages/LocationsPage';
import { ZonesPage } from '@/modules/zones/pages/ZonesPage';
import { KitchensPage } from '@/modules/kitchens/pages/KitchensPage';
import { InspectionStagesPage } from '@/modules/inspection-stages/pages/InspectionStagesPage';
import { ComplaintTypesPage } from '@/modules/complaint-types/pages/ComplaintTypesPage';
import { ComplaintsPage } from '@/modules/complaints/pages/ComplaintsPage';
import { ContractsPage } from '@/modules/contracts/pages/ContractsPage';
import { KitchenShow } from '@/modules/kitchens/pages/KitchenShow';
import { FormsPage } from '@/modules/forms/pages/FormsPage';
import SubmitNewFromPage from '@/modules/form-submissions/pages/SubmitNewFromPage';
import { FormSubmissionsPage } from '@/modules/form-submissions/pages/FormSubmissionsPage';
import { GuestRoute } from './GuestRoute';
import { ReportsTimeWindowPage } from '@/modules/reports-time-window/pages/ReportsTimeWindowPage';
import { DailyReportsPage } from '@/modules/report-daily/pages/DailyReportsPage';
import { CateringSubmissionsPage } from '@/modules/form-submissions/pages/CateringSubmissionsPage';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
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
            element: <LoginPage />,
          },
          {
            path: '/register',
            element: <RegisterPage />,
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
    element: (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      </div>
    )
  }
]);
