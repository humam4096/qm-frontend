import { useTranslation } from 'react-i18next';
import { Building2, MapPin, ChefHat, FileText, Users, UserCheck, CheckCircle2, Clock, AlertCircle, AlertTriangle, Activity } from 'lucide-react';
import { StatCard } from '../../../components/dashboard/StatCard';
import { TeamOverviewCard } from '../../../components/dashboard/TeamOverviewCard';
import { StatusDistributionCard } from '../../../components/dashboard/StatusDistributionCard';

export const SystemManagerDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">{t('systemManager.overview')}</h1>
        {/* <p className="text-muted-foreground">{t('systemManager.subtitle')}</p> */}
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('systemManager.totalKitchens')}
          value="2"
          icon={<ChefHat className="w-6 h-6" />}
          iconBgColor="bg-primary/5"
          iconColor="text-primary"
        />
        <StatCard
          title={t('systemManager.activeZones')}
          value="2"
          icon={<MapPin className="w-6 h-6" />}
          iconBgColor="bg-secondary/10"
          iconColor="text-secondary"
        />
        <StatCard
          title={t('systemManager.branches')}
          value="2"
          icon={<Building2 className="w-6 h-6" />}
          iconBgColor="bg-[#E4D1FE]/20"
          iconColor="text-[#8B5CF6]"
        />
        <StatCard
          title={t('systemManager.totalReports')}
          value="3"
          icon={<FileText className="w-6 h-6" />}
          iconBgColor="bg-info/10"
          iconColor="text-info"
        />
      </div>

      {/* Team Overview Row */}
      <div className='bg-card p-4 rounded-xl'>
        <h2 className="text-xl font-bold text-foreground mb-4 mt-8x">{t('systemManager.teamOverview')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <TeamOverviewCard
            role={t('systemManager.projectManagers')}
            count={61}
            icon={<Users className="w-6 h-6" />}
            variant="secondary"
          />
          <TeamOverviewCard
            role={t('systemManager.qualityManagers')}
            count={11}
            icon={<UserCheck className="w-6 h-6" />}
            variant="info"
          />
          <TeamOverviewCard
            role={t('systemManager.supervisors')}
            count={1}
            icon={<Users className="w-6 h-6" />}
            variant="primary" // Will tint green per prototype styling mapping
          />
          <TeamOverviewCard
            role={t('systemManager.inspectors')}
            count={31}
            icon={<Users className="w-6 h-6" />}
            variant="primary" // Will tint green per prototype styling mapping
          />
        </div>
      </div>

      {/* Status Distributions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatusDistributionCard
          title={t('systemManager.reportsStatus')}
          items={[
            { id: 1, label: t('systemManager.completedReports'), count: 1, variant: 'success', icon: <CheckCircle2 className="w-5 h-5" /> },
            { id: 2, label: t('systemManager.pendingSupervisor'), count: 1, variant: 'warning', icon: <Clock className="w-5 h-5" /> },
            { id: 3, label: t('systemManager.pendingQualityManager'), count: 1, variant: 'primary', icon: <Clock className="w-5 h-5" /> }
          ]}
        />
        
        <StatusDistributionCard
          title={t('systemManager.complaintsOverview')}
          items={[
            { id: 1, label: t('systemManager.totalComplaints'), count: 2, variant: 'secondary', icon: <AlertCircle className="w-5 h-5" /> },
            { id: 2, label: t('systemManager.highPriority'), count: 1, variant: 'critical', icon: <AlertTriangle className="w-5 h-5" /> },
            { id: 3, label: t('systemManager.unresolved'), count: 1, variant: 'warning', icon: <Activity className="w-5 h-5" /> }
          ]}
        />
      </div>

    </div>
  );
};
