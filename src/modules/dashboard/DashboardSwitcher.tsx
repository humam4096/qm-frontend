import { useState } from 'react';
import { LayoutGrid, BarChart3, Clock, AlertTriangle, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dashboard } from './Dashboard';
import { EnhancedDashboard } from './EnhancedDashboard';
import { LiveComplaintsPage } from '../live-logs/complaint-logs/pages/LiveComplaintsPage';
import { SubmissionLogsPage } from '../live-logs/submissions-logs/pages/SubmissionLogsPage';
import { MealTimeLogsPage } from '../live-logs/meal-time-logs/pages/MealTimeLogsPage';
import { RoleGuard } from '@/app/router/RoleGuard';
import type { UserRole } from '@/modules/users/types';

type DashboardView = 'simple' | 'enhanced' | 'live-complaints' | 'live-submission-logs' | 'live-meal-time-logs';

export const DashboardSwitcher = () => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<DashboardView>('simple');

const dashboardOptions = [
  {
    id: 'simple' as DashboardView,
    icon: LayoutGrid,
    label: t('dashboard.simpleView'),
    description: t('dashboard.simpleViewDesc'),
    color: 'from-[#6F8166] to-[#3E503A]',
    bgColor: 'bg-[#F7F7EF] dark:bg-[#1E2522]',
    borderColor: 'border-[#EEECE0] dark:border-[#2C3531]',
    textColor: 'text-[#1E1E1E] dark:text-[#D1D5DB]',
    badge: null,
    roles: null as UserRole[] | null
  },
  {
    id: 'enhanced' as DashboardView,
    icon: BarChart3,
    label: t('dashboard.enhancedView'),
    description: t('dashboard.enhancedViewDesc'),
    color: 'from-[#94A378] to-[#6F8166]',
    bgColor: 'bg-[#F7F7EF] dark:bg-[#1E2522]',
    borderColor: 'border-[#94A378]/40 dark:border-[#94A378]/30',
    textColor: 'text-[#3E503A] dark:text-[#A7B89E]',
    badge: 'Pro',
    roles: null as UserRole[] | null
  },
  {
    id: 'live-meal-time-logs' as DashboardView,
    icon: Clock,
    label: t('dashboard.liveMealTimeLogs'),
    description: t('dashboard.liveMealTimeLogsDesc'),
    color: 'from-[#E6D2A3] to-[#E0B352]',
    bgColor: 'bg-[#F7F7EF] dark:bg-[#1E2522]',
    borderColor: 'border-[#E0B352]/40 dark:border-[#E0B352]/30',
    textColor: 'text-[#3E503A] dark:text-[#E6D2A3]',
    badge: 'Live',
    roles: null as UserRole[] | null
  },
  {
    id: 'live-submission-logs' as DashboardView,
    icon: FileText,
    label: t('dashboard.liveSubmissionLogs'),
    description: t('dashboard.liveSubmissionLogsDesc'),
    color: 'from-[#94A378] to-[#3E503A]',
    bgColor: 'bg-[#F7F7EF] dark:bg-[#1E2522]',
    borderColor: 'border-[#94A378]/40 dark:border-[#94A378]/30',
    textColor: 'text-[#3E503A] dark:text-[#A7B89E]',
    badge: 'Live',
    roles: ['system_manager', 'quality_manager', 'project_manager'] as UserRole[]
  },
  {
    id: 'live-complaints' as DashboardView,
    icon: AlertTriangle,
    label: t('dashboard.liveComplaints'),
    description: t('dashboard.liveComplaintsDesc'),
    color: 'from-[#C49A94] to-[#7A1F1F]',
    bgColor: 'bg-[#F7F7EF] dark:bg-[#1E2522]',
    borderColor: 'border-[#7A1F1F]/40 dark:border-[#7A1F1F]/30',
    textColor: 'text-[#7A1F1F] dark:text-[#E5B4AE]',
    badge: 'Live',
    roles: ['system_manager', 'quality_manager', 'project_manager'] as UserRole[]
  },
];

  const renderDashboard = () => {
    switch (activeView) {
      case 'simple':
        return <Dashboard />;
      case 'enhanced':
        return <EnhancedDashboard />;
      case 'live-complaints':
        return <LiveComplaintsPage />;
      case 'live-submission-logs':
        return <SubmissionLogsPage />;
      case 'live-meal-time-logs':
        return <MealTimeLogsPage />;
      default:
        return <Dashboard />;
    }
  };

  const DashboardOption = ({ option, isActive, onClick }: { 
    option: typeof dashboardOptions[0], 
    isActive: boolean, 
    onClick: () => void 
  }) => {
    const Icon = option.icon;
    
    return (
      <button
        onClick={onClick}
        className={`
          group relative flex items-center gap-3 w-full p-2 rounded-lg transition-all duration-200
          ${isActive 
            ? `${option.bgColor} ${option.borderColor} border shadow-sm` 
            : 'bg-card hover:bg-muted/30 border border-border/40 hover:border-border/60 hover:shadow-sm'
          }
        `}
      >
        {/* Subtle gradient background for active state */}
        {isActive && (
          <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-[0.02] rounded-lg`} />
        )}
        
        {/* Icon */}
        <div className={`
          relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200
          ${isActive 
            ? `bg-gradient-to-r ${option.color} text-white shadow-sm` 
            : 'bg-muted/60 text-muted-foreground group-hover:bg-muted group-hover:text-foreground'
          }
        `}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-8">
            <h3 className={`font-medium text-sm truncate ${isActive ? option.textColor : 'text-foreground'}`}>
              {option.label}
            </h3>
            {option.badge && (
              <span>
                {option.badge === 'Live' && (
                  <div className="flex flex-col items-center gap-2 pt-2">
                    <div className="relative">
                      <div className="h-2 w-2 rounded-full bg-rose-900/70 ring-4 ring-rose-900/10" />
                      <div className="absolute inset-0 h-2 w-2 rounded-full bg-rose-900/70 animate-ping" />
                    </div>
                    <div className="h-full w-px bg-linear-to-b from-border to-transparent" />
                  </div>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Active indicator */}
        {isActive && (
          <div className={`w-0.5 h-6 bg-gradient-to-b ${option.color} rounded-full opacity-60`} />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border/50 rounded-xl shadow-sm">
        <div className="p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {dashboardOptions.map((option) => {
              if (option.roles) {
                return (
                  <RoleGuard key={option.id} allowedRoles={option.roles}>
                    <DashboardOption
                      option={option}
                      isActive={activeView === option.id}
                      onClick={() => setActiveView(option.id)}
                    />
                  </RoleGuard>
                );
              }
              
              return (
                <DashboardOption
                  key={option.id}
                  option={option}
                  isActive={activeView === option.id}
                  onClick={() => setActiveView(option.id)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Dashboard Content with Smooth Transition */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {renderDashboard()}
      </div>
    </div>
  );
};
