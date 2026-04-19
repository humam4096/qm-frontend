import { useState } from 'react';
import { LayoutGrid, BarChart3, Logs } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dashboard } from './Dashboard';
import { EnhancedDashboard } from './EnhancedDashboard';
import { LiveLogsPage } from '../live-logs/pages/LiveLogsPage';

type DashboardView = 'simple' | 'enhanced' | 'live-complaints' | 'live-logs';

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
        return <LiveLogsPage />;
      // case 'live-logs':
      //   return <LiveLogs />;
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
      <div className="flex items-center justify-between bg-card border border-border/50 rounded-xl p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
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
