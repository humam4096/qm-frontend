import { 
  Building2, MapPin, ChefHat, FileText, Users, UserCheck, 
  CheckCircle2, Clock, AlertCircle, AlertTriangle, Activity, 
  XCircle, Shield, Zap, Target, Award
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BarChart } from '../../components/dashboard/BarChart';
import { DonutChart } from '../../components/dashboard/DonutChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useDashboard } from './hooks/useDashboard';
import { Skeleton } from '../../components/ui/skeleton';

export const EnhancedDashboard = () => {
  const { t } = useTranslation();
  const { data: response, isLoading, isError, error } = useDashboard();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
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
                <h3 className="font-semibold">{t('dashboard.failedToLoad')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {error instanceof Error ? error.message : t('common.unexpectedError')}
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

  const activeKitchens = dashboardData.kitchens_count - dashboardData.inactive_kitchens_count;
  // const activeZones = dashboardData.zones_count - dashboardData.inactive_zones_count;
  const totalTeam = dashboardData.project_managers_count + dashboardData.quality_managers_count + 
                    dashboardData.quality_supervisors_count + dashboardData.quality_inspectors_count;

  // Calculate percentages
  const kitchenActiveRate = ((activeKitchens / dashboardData.kitchens_count) * 100).toFixed(1);
  const complaintResolvedRate = ((dashboardData.resolved_complaints / dashboardData.total_complaints) * 100).toFixed(1);
  // const zoneActiveRate = ((activeZones / dashboardData.zones_count) * 100).toFixed(1);

  // Prepare chart data
  const reportsChartData = [
    { 
      label: t('dashboard.accepted'), 
      value: dashboardData.branch_accepted_reports, 
      color: '#3E503A' // success/primary color
    },
    { 
      label: t('dashboard.pendingSupervisor'), 
      value: dashboardData.pending_supervisor, 
      color: '#E0B352' // warning color
    },
    { 
      label: t('dashboard.pendingQM'), 
      value: dashboardData.pending_quality_manager, 
      color: '#6F8166' // info color
    },
    { 
      label: t('dashboard.rejected'), 
      value: dashboardData.branch_rejected_reports, 
      color: '#7A1F1F' // destructive color
    }
  ];

  const complaintsChartData = [
    { 
      label: t('dashboard.highPriority'), 
      value: dashboardData.high_priority_complaints, 
      color: '#7A1F1F' // destructive color
    },
    { 
      label: t('dashboard.unresolved'), 
      value: dashboardData.unresolved_complaints, 
      color: '#E0B352' // warning color
    },
    { 
      label: t('dashboard.resolved'), 
      value: dashboardData.resolved_complaints, 
      color: '#3E503A' // success/primary color
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Hero Stats Section - Full Width */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Operations Health */}
        <Card className="border-border/50 shadow-lg bg-linear-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">{t('dashboard.operationsHealth')}</div>
                <div className="text-3xl font-bold text-foreground">{kitchenActiveRate}%</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('dashboard.activeKitchens')}</span>
                <span className="font-semibold">{activeKitchens}/{dashboardData.kitchens_count}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${kitchenActiveRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Strength */}
        <Card className="border-border/50 shadow-lg bg-gradient-to-br from-secondary/5 to-secondary/10">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-secondary/20 rounded-xl">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">{t('dashboard.totalTeam')}</div>
                <div className="text-3xl font-bold text-foreground">{totalTeam}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-card/50 p-2 rounded-lg">
                <div className="text-muted-foreground">{t('dashboard.inspectors')}</div>
                <div className="font-bold text-lg">{dashboardData.quality_inspectors_count}</div>
              </div>
              <div className="bg-card/50 p-2 rounded-lg">
                <div className="text-muted-foreground">{t('dashboard.managers')}</div>
                <div className="font-bold text-lg">{dashboardData.project_managers_count + dashboardData.quality_managers_count}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Rate */}
        <Card className="border-border/50 shadow-lg bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-success/20 rounded-xl">
                <Award className="w-8 h-8 text-success" />
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">{t('dashboard.resolutionRate')}</div>
                <div className="text-3xl font-bold text-foreground">{complaintResolvedRate}%</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('dashboard.resolved')}</span>
                <span className="font-semibold">{dashboardData.resolved_complaints}/{dashboardData.total_complaints}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all" 
                  style={{ width: `${complaintResolvedRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Wider (2/3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/50 shadow-lg bg-gradient-to-br from-info/5 to-info/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-foreground">{t('dashboard.reportsAnalysis')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('dashboard.statusBreakdown')}</p>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <BarChart data={reportsChartData} height={260} />
              </CardContent>
            </Card>
            
            <Card className="border-border/50 shadow-lg bg-gradient-to-br from-warning/5 to-warning/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-foreground">{t('dashboard.complaintsOverview')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('dashboard.priorityDistribution')}</p>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <DonutChart data={complaintsChartData} size={200} />
              </CardContent>
            </Card>
          </div>

          {/* Infrastructure Overview */}
          <Card className="border-border/50 shadow-lg bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-secondary" />
                {t('dashboard.infrastructureOverview')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-card/60 backdrop-blur rounded-xl border border-primary/20">
                  <ChefHat className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{dashboardData.kitchens_count}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t('dashboard.totalKitchens')}</div>
                </div>
                <div className="text-center p-4 bg-card/60 backdrop-blur rounded-xl border border-success/20">
                  <Activity className="w-8 h-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{activeKitchens}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t('dashboard.active')}</div>
                </div>
                <div className="text-center p-4 bg-card/60 backdrop-blur rounded-xl border border-secondary/20">
                  <MapPin className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{dashboardData.zones_count}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t('dashboard.zones')}</div>
                </div>
                <div className="text-center p-4 bg-card/60 backdrop-blur rounded-xl border border-info/20">
                  <Building2 className="w-8 h-8 text-info mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{dashboardData.branches_count}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t('dashboard.branches')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Narrower (1/3) */}
        <div className="space-y-6 lg:col-span-3 gap-6 grid grid-cols-1 lg:grid-cols-3">
          
          {/* Team Breakdown */}
          <Card className="border-border/50 shadow-lg bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-secondary" />
                {t('dashboard.team')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-card/60 backdrop-blur rounded-lg border border-secondary/20">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">{t('dashboard.projectMgrs')}</span>
                </div>
                <span className="text-lg font-bold">{dashboardData.project_managers_count}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-card/60 backdrop-blur rounded-lg border border-info/20">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-info" />
                  <span className="text-sm font-medium">{t('dashboard.qualityMgrs')}</span>
                </div>
                <span className="text-lg font-bold">{dashboardData.quality_managers_count}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-card/60 backdrop-blur rounded-lg border border-warning/20">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium">{t('dashboard.supervisors')}</span>
                </div>
                <span className="text-lg font-bold">{dashboardData.quality_supervisors_count}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-card/60 backdrop-blur rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{t('dashboard.qualityInspectors')}</span>
                </div>
                <span className="text-lg font-bold">{dashboardData.quality_inspectors_count}</span>
              </div>
            </CardContent>
          </Card>

          {/* Reports Summary */}
          <Card className="border-border/50 shadow-lg bg-gradient-to-br from-info/5 to-info/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-info" />
                {t('dashboard.reports')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-card/60 backdrop-blur rounded-lg border border-secondary/20">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">{t('dashboard.total')}</span>
                </div>
                <span className="text-lg font-bold">{dashboardData.total_reports}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-card/60 backdrop-blur rounded-lg border border-success/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">{t('dashboard.accepted')}</span>
                </div>
                <span className="text-lg font-bold">{dashboardData.branch_accepted_reports}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-card/60 backdrop-blur rounded-lg border border-warning/20">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium">{t('dashboard.pending')}</span>
                </div>
                <span className="text-lg font-bold">
                  {dashboardData.pending_supervisor + dashboardData.pending_quality_manager}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-card/60 backdrop-blur rounded-lg border border-destructive/20">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium">{t('dashboard.rejected')}</span>
                </div>
                <span className="text-lg font-bold">{dashboardData.branch_rejected_reports}</span>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          {(dashboardData.inactive_kitchens_count > 0 || dashboardData.inactive_zones_count > 0 || 
            dashboardData.high_priority_complaints > 0) && (
            <Card className="border-warning/50 shadow-lg bg-gradient-to-br from-warning/5 to-warning/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-5 h-5" />
                  {t('dashboard.alerts')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {dashboardData.high_priority_complaints > 0 && (
                  <div className="flex items-start gap-2 p-2 bg-card/60 backdrop-blur rounded-lg border border-destructive/20">
                    <Zap className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <span className="text-foreground">
                      <strong>{dashboardData.high_priority_complaints}</strong> {t('dashboard.highPriorityComplaints')}
                    </span>
                  </div>
                )}
                {dashboardData.inactive_kitchens_count > 0 && (
                  <div className="flex items-start gap-2 p-2 bg-card/60 backdrop-blur rounded-lg border border-warning/20">
                    <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <span className="text-foreground">
                      <strong>{dashboardData.inactive_kitchens_count}</strong> {t('dashboard.inactiveKitchens')}
                    </span>
                  </div>
                )}
                {dashboardData.inactive_zones_count > 0 && (
                  <div className="flex items-start gap-2 p-2 bg-card/60 backdrop-blur rounded-lg border border-warning/20">
                    <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                    <span className="text-foreground">
                      <strong>{dashboardData.inactive_zones_count}</strong> {t('dashboard.inactiveZones')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

    </div>
  );
};
