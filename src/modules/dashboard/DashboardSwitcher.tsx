import { useState } from 'react';
import { LayoutGrid, BarChart3, Logs } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dashboard } from './Dashboard';
import { EnhancedDashboard } from './EnhancedDashboard';
import { LiveComplaintsPage } from '../live-logs/complaint-logs/pages/LiveComplaintsPage';
import { SubmissionLogsPage } from '../live-logs/submissions-logs/pages/SubmissionLogsPage';
import { MealTimeLogsPage } from '../live-logs/meal-time-logs/pages/MealTimeLogsPage';

type DashboardView = 'simple' | 'enhanced' | 'live-complaints' | 'live-submission-logs' | 'live-meal-time-logs';

export const DashboardSwitcher = () => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<DashboardView>('simple');

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

  const renderDescription = () => {
    switch (activeView) {
      case 'simple':
        return t('dashboard.simpleViewDesc');
      case 'enhanced':
        return t('dashboard.enhancedViewDesc');
      case 'live-complaints':
        return t('dashboard.liveComplaintsDesc');
      default:
        return t('dashboard.simpleViewDesc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard View Switcher */}
      <div className="sticky -top-4 z-50 flex items-center justify-between bg-card border border-border/50 rounded-xl p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveView('simple')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${activeView === 'simple' 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{t('dashboard.simpleView')}</span>
            </button>
            <button
              onClick={() => setActiveView('enhanced')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${activeView === 'enhanced' 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{t('dashboard.enhancedView')}</span>
            </button>
            <button
              onClick={() => setActiveView('live-complaints')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${activeView === 'live-complaints' 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Logs className="w-4 h-4" />
              <span>{t('dashboard.liveComplaints')}</span>
            </button>
            <button
              onClick={() => setActiveView('live-meal-time-logs')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${activeView === 'live-meal-time-logs' 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Logs className="w-4 h-4" />
              <span>{t('dashboard.liveMealTimeLogs')}</span>
            </button>
            <button
              onClick={() => setActiveView('live-submission-logs')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${activeView === 'live-submission-logs' 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Logs className="w-4 h-4" />
              <span>{t('dashboard.liveSubmissionLogs')}</span>
            </button>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground px-3">
          {renderDescription()}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="animate-in fade-in zoom-in-95 duration-300">
        {renderDashboard()}
      </div>
    </div>
  );
};
