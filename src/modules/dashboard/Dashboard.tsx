import { useTranslation } from 'react-i18next';
import { 
  Building2, MapPin, ChefHat, FileText, Users, UserCheck, 
  CheckCircle2, Clock, AlertCircle, AlertTriangle, Activity, 
  XCircle, Shield, FileCheck, FileClock, Send
} from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard';
import { StatusDistributionCard } from '../../components/dashboard/StatusDistributionCard';
import { useDashboard } from './hooks/useDashboard';
import { Skeleton } from '../../components/ui/skeleton';
import { Card, CardContent } from '../../components/ui/card';
import { RoleGuard } from '@/app/router/RoleGuard';
import { safeNumber, calculateActive } from './utils/dashboardHelpers';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { data: response, isLoading, isError, error } = useDashboard();

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div>
          <Skeleton className="h-8 md:h-10 w-48 md:w-64 mb-2" />
          <Skeleton className="h-4 md:h-5 w-64 md:w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 md:h-32" />
          ))}
        </div>
        <Skeleton className="h-48 md:h-64" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          <Skeleton className="h-80 md:h-96" />
          <Skeleton className="h-80 md:h-96" />
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Failed to load dashboard data</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {error instanceof Error ? error.message : 'An error occurred'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dashboardData = response?.data;
  
  if (!dashboardData) {
    return null;
  }
  
  // Safe calculations with proper fallbacks
  const totalKitchens = safeNumber(dashboardData.kitchens_count);
  const inactiveKitchens = safeNumber(dashboardData.inactive_kitchens_count);
  const activeKitchens = calculateActive(totalKitchens, inactiveKitchens);
  const inactiveZones = safeNumber(dashboardData.inactive_zones_count);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Operations Overview */}
      <div>
        {/* <h2 className="text-lg font-semibold text-foreground mb-4">{t('dashboard.operationsOverview')}</h2> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title={t('dashboard.totalKitchens')}
            value={totalKitchens}
            icon={<ChefHat className="w-6 h-6" />}
            iconBgColor="bg-primary/10"
            iconColor="text-primary"
          />
          <StatCard
            title={t('dashboard.activeKitchens')}
            value={activeKitchens}
            icon={<Activity className="w-6 h-6" />}
            iconBgColor="bg-success/10"
            iconColor="text-success"
          />
          <StatCard
            title={t('dashboard.zones')}
            value={safeNumber(dashboardData.zones_count)}
            icon={<MapPin className="w-6 h-6" />}
            iconBgColor="bg-secondary/10"
            iconColor="text-secondary"
          />
          <RoleGuard allowedRoles={['system_manager', 'quality_manager']}>
            <StatCard
              title={t('dashboard.branches')}
              value={safeNumber(dashboardData.branches_count)}
              icon={<Building2 className="w-6 h-6" />}
              iconBgColor="bg-[#E4D1FE]/20"
              iconColor="text-[#8B5CF6]"
            />
        </RoleGuard>
        </div>
      </div>

      {/* Team Overview */}
      <div className='bg-card p-4 md:p-6 rounded-xl border border-border/50 shadow-sm'>
        <h2 className="text-lg font-semibold text-foreground mb-4 md:mb-6">{t('dashboard.team')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title={t('dashboard.projectMgrs')}
            value={safeNumber(dashboardData.project_managers_count)}
            icon={<Users className="w-6 h-6" />}
            iconBgColor="bg-secondary/10"
            iconColor="text-secondary"
          />
          <StatCard
            title={t('dashboard.qualityMgrs')}
            value={safeNumber(dashboardData.quality_managers_count)}
            icon={<Shield className="w-6 h-6" />}
            iconBgColor="bg-blue-500/10"
            iconColor="text-blue-600"
          />
          <StatCard
            title={t('dashboard.supervisors')}
            value={safeNumber(dashboardData.quality_supervisors_count)}
            icon={<UserCheck className="w-6 h-6" />}
            iconBgColor="bg-amber-500/10"
            iconColor="text-amber-600"
          />
          <StatCard
            title={t('dashboard.qualityInspectors')}
            value={safeNumber(dashboardData.quality_inspectors_count)}
            icon={<Users className="w-6 h-6" />}
            iconBgColor="bg-primary/10"
            iconColor="text-primary"
          />
        </div>
      </div>

      {/* Approval Status Cards */}
      <div className="bg-card p-4 md:p-6 rounded-xl border border-border/50 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4 md:mb-6">{t('dashboard.approvalStatus')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title={t('dashboard.pendingSupervisor')}
            value={safeNumber(dashboardData.pending_supervisor)}
            icon={<Clock className="w-6 h-6" />}
            iconBgColor="bg-amber-500/10"
            iconColor="text-amber-600"
          />
          <StatCard
            title={t('dashboard.pendingQM')}
            value={safeNumber(dashboardData.pending_quality_manager)}
            icon={<Clock className="w-6 h-6" />}
            iconBgColor="bg-blue-500/10"
            iconColor="text-blue-600"
          />
          <StatCard
            title={t('dashboard.approvedByQM')}
            value={safeNumber(dashboardData.approved_by_quality_manager_reports)}
            icon={<FileCheck className="w-6 h-6" />}
            iconBgColor="bg-emerald-500/10"
            iconColor="text-emerald-600"
          />
          <StatCard
            title={t('dashboard.approvedBySM')}
            value={safeNumber(dashboardData.approved_by_system_manager_reports)}
            icon={<FileCheck className="w-6 h-6" />}
            iconBgColor="bg-green-500/10"
            iconColor="text-green-600"
          />
        </div>
      </div>


      {/* Reports & Complaints */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* Reports Status */}
        <StatusDistributionCard
          title={t('dashboard.reports')}
          items={[
            { 
              id: 1, 
              label: t('dashboard.total'), 
              count: safeNumber(dashboardData.total_reports), 
              variant: 'secondary', 
              icon: <FileText className="w-5 h-5" /> 
            },
            { 
              id: 2, 
              label: t('dashboard.submitted'), 
              count: safeNumber(dashboardData.submitted_reports), 
              variant: 'info', 
              icon: <Send className="w-5 h-5" /> 
            },
            { 
              id: 3, 
              label: t('dashboard.branchPending'), 
              count: safeNumber(dashboardData.branch_pending_reports), 
              variant: 'warning', 
              icon: <FileClock className="w-5 h-5" /> 
            },
            { 
              id: 4, 
              label: t('dashboard.accepted'), 
              count: safeNumber(dashboardData.branch_accepted_reports), 
              variant: 'success', 
              icon: <CheckCircle2 className="w-5 h-5" /> 
            },
            { 
              id: 5, 
              label: t('dashboard.rejected'), 
              count: safeNumber(dashboardData.branch_rejected_reports), 
              variant: 'critical', 
              icon: <XCircle className="w-5 h-5" /> 
            }
          ]}
        />
        
        {/* Complaints Overview */}
        <StatusDistributionCard
          title={t('dashboard.complaintsOverview')}
          items={[
            { 
              id: 1, 
              label: t('dashboard.total'), 
              count: safeNumber(dashboardData.total_complaints), 
              variant: 'secondary', 
              icon: <AlertCircle className="w-5 h-5" /> 
            },
            { 
              id: 2, 
              label: t('dashboard.highPriority'), 
              count: safeNumber(dashboardData.high_priority_complaints), 
              variant: 'critical', 
              icon: <AlertTriangle className="w-5 h-5" /> 
            },
            { 
              id: 3, 
              label: t('dashboard.mediumPriority'), 
              count: safeNumber(dashboardData.medium_priority_complaints), 
              variant: 'warning', 
              icon: <AlertCircle className="w-5 h-5" /> 
            },
            { 
              id: 4, 
              label: t('dashboard.lowPriority'), 
              count: safeNumber(dashboardData.low_priority_complaints), 
              variant: 'info', 
              icon: <AlertCircle className="w-5 h-5" /> 
            },
            { 
              id: 5, 
              label: t('dashboard.resolved'), 
              count: safeNumber(dashboardData.resolved_complaints), 
              variant: 'success', 
              icon: <CheckCircle2 className="w-5 h-5" /> 
            }
          ]}
        />
      </div>


      {/* Inactive Resources Alert */}
      {(inactiveKitchens > 0 || inactiveZones > 0) && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 md:p-6">
          <div className="flex items-start gap-3 md:gap-4">
            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-warning shrink-0 mt-0.5 md:mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm md:text-base">{t('dashboard.inactiveResourcesDetected')}</h3>
              <div className="text-xs md:text-sm text-muted-foreground space-y-1">
                {inactiveKitchens > 0 && (
                  <p>• {inactiveKitchens} {t('dashboard.inactiveKitchens')}</p>
                )}
                {inactiveZones > 0 && (
                  <p>• {inactiveZones} {t('dashboard.inactiveZones')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
