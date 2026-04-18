import { MobileDrawer } from '../layout/MobileDrawer'
import { useAuthStore } from '@/app/store/useAuthStore';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';

export default function MobileDrawerEl({closeMobile, isMenuOpen, navItems}: {closeMobile: () => void, isMenuOpen: boolean, navItems: any[]}) {
  const { user, logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
      <MobileDrawer
        isOpen={isMenuOpen}
        onClose={closeMobile}
        side={isRtl ? 'right' : 'left'}
        ariaLabel={t('nav.menu')}
      >
        {/* Drawer header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src="/Humam-Logo.svg" alt="Humam Logo" className="w-10 h-10" />
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-bold font-sans text-sidebar-foreground">{t('nav.system')}</span>
              <span className="text-[10px] text-sidebar-primary capitalize">
                {user?.role.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
            aria-label={t('common.close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] uppercase tracking-wider text-sidebar-primary font-semibold">
            {t('nav.menu')}
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full p-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`
              }
            >
              {item.icon && <item.icon className="w-5 h-5 shrink-0" />}
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                {t(item.labelKey)}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Drawer footer — logout */}
        <div className="p-4 border-t border-sidebar-border shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-colors text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap overflow-hidden">{t('nav.logout')}</span>
          </button>
        </div>
      </MobileDrawer>
  )
}
