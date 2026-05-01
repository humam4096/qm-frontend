import { X, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MobileDrawer } from '../../../../components/layout/MobileDrawer';
import UserRouter from '../../../router/UserRouter';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isRtl: boolean;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

export const MobileMenu = ({ isOpen, onClose, isRtl, onNavClick }: MobileMenuProps) => {
  const { t } = useTranslation();

  return (
    <MobileDrawer
      isOpen={isOpen}
      onClose={onClose}
      side={isRtl ? 'left' : 'right'}
      ariaLabel={t('landing.brand')}
    >
      <div className="flex items-center justify-between px-6 h-16 border-b border-sidebar-border shrink-0">
        <span className="text-xl font-bold text-sidebar-foreground tracking-tight">
          {t('landing.brand')}
        </span>
        <button
          onClick={onClose}
          aria-label={t('common.close')}
          className="p-2 text-sidebar-foreground/70 hover:text-destructive bg-muted hover:bg-muted/80 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <a
          href="#features"
          onClick={(e) => onNavClick(e, '#features')}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-sidebar-foreground hover:text-primary hover:bg-primary/5 transition-colors"
        >
          <Activity className="w-5 h-5 shrink-0" />
          {t('landing.nav.features')}
        </a>
        <a
          href="#how-it-works"
          onClick={(e) => onNavClick(e, '#how-it-works')}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-sidebar-foreground hover:text-primary hover:bg-primary/5 transition-colors"
        >
          <Zap className="w-5 h-5 shrink-0" />
          {t('landing.nav.howItWorks')}
        </a>
        <a
          href="#benefits"
          onClick={(e) => onNavClick(e, '#benefits')}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-sidebar-foreground hover:text-primary hover:bg-primary/5 transition-colors"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {t('landing.nav.benefits')}
        </a>
        <div className="pt-4">
          <UserRouter />
        </div>
      </div>
    </MobileDrawer>
  );
};
