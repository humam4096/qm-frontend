import { useState } from 'react';
import { LayoutGrid, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dashboard } from './Dashboard';
import { EnhancedDashboard } from './EnhancedDashboard';

type DashboardView = 'simple' | 'enhanced';

export const DashboardSwitcher = () => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<DashboardView>('simple');

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
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground px-3">
          {activeView === 'simple' ? (
            <span>{t('dashboard.simpleViewDesc')}</span>
          ) : (
            <span>{t('dashboard.enhancedViewDesc')}</span>
          )}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="animate-in fade-in zoom-in-95 duration-300">
        {activeView === 'simple' ? <Dashboard /> : <EnhancedDashboard />}
      </div>
    </div>
  );
};
