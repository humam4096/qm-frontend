import { useTranslation } from 'react-i18next';
import { 
  Building2, MapPin, ChefHat, FileText, Users, UserCheck, 
  CheckCircle2, Clock, AlertCircle, AlertTriangle, Activity, 
  XCircle, Shield
} from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard';
import { TeamOverviewCard } from '../../components/dashboard/TeamOverviewCard';
import { StatusDistributionCard } from '../../components/dashboard/StatusDistributionCard';
import { useDashboard } from './hooks/useDashboard';
import { Skeleton } from '../../components/ui/skeleton';
import { Card, CardContent } from '../../components/ui/card';
import { RoleGuard } from '@/app/router/RoleGuard';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { data: response, isLoading, isError, error } = useDashboard();

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
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
  
  const activeKitchens = dashboardData.active_kitchens_count || dashboardData.kitchens_count - dashboardData.inactive_kitchens_count;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Operations Overview */}
      <div>
        {/* <h2 className="text-lg font-semibold text-foreground mb-4">{t('dashboard.operationsOverview')}</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t('dashboard.totalKitchens')}
            value={dashboardData.kitchens_count || dashboardData.active_kitchens_count}
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
            value={dashboardData.zones_count}
            icon={<MapPin className="w-6 h-6" />}
            iconBgColor="bg-secondary/10"
            iconColor="text-secondary"
          />
          <RoleGuard allowedRoles={['system_manager', 'quality_manager']}>
            <StatCard
              title={t('dashboard.branches')}
              value={dashboardData.branches_count}
              icon={<Building2 className="w-6 h-6" />}
              iconBgColor="bg-[#E4D1FE]/20"
              iconColor="text-[#8B5CF6]"
            />
        </RoleGuard>
        </div>
      </div>

      {/* Team Overview */}
      <div className='bg-card p-6 rounded-xl border border-border/50 shadow-sm'>
        <h2 className="text-lg font-semibold text-foreground mb-6">{t('dashboard.team')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TeamOverviewCard
            role={t('dashboard.projectMgrs')}
            count={dashboardData.project_managers_count}
            icon={<Users className="w-6 h-6" />}
            variant="secondary"
          />
          <TeamOverviewCard
            role={t('dashboard.qualityMgrs')}
            count={dashboardData.quality_managers_count}
            icon={<Shield className="w-6 h-6" />}
            variant="info"
          />
          <TeamOverviewCard
            role={t('dashboard.supervisors')}
            count={dashboardData.quality_supervisors_count}
            icon={<UserCheck className="w-6 h-6" />}
            variant="warning"
          />
          <TeamOverviewCard
            role={t('dashboard.qualityInspectors')}
            count={dashboardData.quality_inspectors_count}
            icon={<Users className="w-6 h-6" />}
            variant="primary"
          />
        </div>
      </div>

      {/* Reports & Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports Status */}
        <StatusDistributionCard
          title={t('dashboard.reports')}
          items={[
            { 
              id: 1, 
              label: t('dashboard.total'), 
              count: dashboardData.total_reports, 
              variant: 'secondary', 
              icon: <FileText className="w-5 h-5" /> 
            },
            { 
              id: 2, 
              label: t('dashboard.accepted'), 
              count: dashboardData.branch_accepted_reports, 
              variant: 'success', 
              icon: <CheckCircle2 className="w-5 h-5" /> 
            },
            { 
              id: 3, 
              label: t('dashboard.pendingSupervisor'), 
              count: dashboardData.pending_supervisor, 
              variant: 'warning', 
              icon: <Clock className="w-5 h-5" /> 
            },
            { 
              id: 4, 
              label: t('dashboard.pendingQM'), 
              count: dashboardData.pending_quality_manager, 
              variant: 'info', 
              icon: <Clock className="w-5 h-5" /> 
            },
            { 
              id: 5, 
              label: t('dashboard.rejected'), 
              count: dashboardData.branch_rejected_reports, 
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
              count: dashboardData.total_complaints, 
              variant: 'secondary', 
              icon: <AlertCircle className="w-5 h-5" /> 
            },
            { 
              id: 2, 
              label: t('dashboard.highPriority'), 
              count: dashboardData.high_priority_complaints, 
              variant: 'critical', 
              icon: <AlertTriangle className="w-5 h-5" /> 
            },
            { 
              id: 3, 
              label: t('dashboard.unresolved'), 
              count: dashboardData.unresolved_complaints, 
              variant: 'warning', 
              icon: <Activity className="w-5 h-5" /> 
            },
            { 
              id: 4, 
              label: t('dashboard.resolved'), 
              count: dashboardData.resolved_complaints, 
              variant: 'success', 
              icon: <CheckCircle2 className="w-5 h-5" /> 
            }
          ]}
        />
      </div>

      {/* Inactive Resources Alert */}
      {(dashboardData.inactive_kitchens_count > 0 || dashboardData.inactive_zones_count > 0) && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-warning shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{t('dashboard.inactiveResourcesDetected')}</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                {dashboardData.inactive_kitchens_count > 0 && (
                  <p>• {dashboardData.inactive_kitchens_count} {t('dashboard.inactiveKitchens')}</p>
                )}
                {dashboardData.inactive_zones_count > 0 && (
                  <p>• {dashboardData.inactive_zones_count} {t('dashboard.inactiveZones')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
