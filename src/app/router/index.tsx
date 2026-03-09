import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../../modules/auth/LoginPage';
import { RegisterPage } from '../../modules/auth/RegisterPage';
import { LandingPage } from '../pages/LandingPage';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

/**
 * Placeholder components for the various dashboards 
 * (These will be eventually moved to their respective modules)
 */
const DummyDashboard = ({ title }: { title: string }) => (
  <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <p className="text-gray-500 mt-2">Welcome to your secure workspace.</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  
  // Authentication Flow
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
  
  // Authenticated Application Shell
  {
    element: <DashboardLayout />,
    children: [
      // 1. System Manager Route Group
      {
        path: '/system-manager',
        element: <ProtectedRoute allowedRoles={['SystemManager']} />,
        children: [
          { path: 'dashboard', element: <DummyDashboard title="General System Manager Dashboard" /> },
          // Future routes: /system-manager/companies, /system-manager/zones, etc.
        ]
      },

      // 2. Catering Manager Route Group
      {
        path: '/catering-manager',
        element: <ProtectedRoute allowedRoles={['CateringManager']} />,
        children: [
          { path: 'dashboard', element: <DummyDashboard title="Catering Manager Dashboard" /> },
        ]
      },

      // 3. Project Manager Route Group
      {
        path: '/project-manager',
        element: <ProtectedRoute allowedRoles={['ProjectManager']} />,
        children: [
          { path: 'dashboard', element: <DummyDashboard title="Project Manager Dashboard" /> },
        ]
      },

      // 4. Quality Manager Route Group
      {
        path: '/quality-manager',
        element: <ProtectedRoute allowedRoles={['QualityManager']} />,
        children: [
          { path: 'dashboard', element: <DummyDashboard title="Quality Manager Dashboard" /> },
        ]
      },

      // 5. Quality Supervisor Route Group
      {
        path: '/supervisor',
        element: <ProtectedRoute allowedRoles={['QualitySupervisor']} />,
        children: [
          { path: 'dashboard', element: <DummyDashboard title="Quality Supervisor Dashboard" /> },
        ]
      },

      // 6. Quality Inspector Route Group
      {
        path: '/inspector',
        element: <ProtectedRoute allowedRoles={['QualityInspector']} />,
        children: [
          { path: 'dashboard', element: <DummyDashboard title="Quality Inspector Dashboard" /> },
        ]
      }
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
