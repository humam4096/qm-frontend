import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../app/store/useAuthStore';
import { LogOut, ChevronLeft, ChevronRight, X, LogOutIcon } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import { ROLE_NAVIGATION } from '../../app/router/navigationConfig';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ScrollToTop } from '@/utils/ScrollToTop';

export const DashboardLayout = () => {
  const { user, logout } = useAuthStore();

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Desktop collapse state (persisted)
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? saved === 'true' : true;
  });
  
  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', String(isExpanded));
  }, [isExpanded]);

  // Close mobile menu when route changes
  useEffect(() => {
    // Only invoke setState if it was actually open to avoid cascading renders
    if (isMobileOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMobileOpen(false);
    }
  }, [location.pathname, isMobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = user ? ROLE_NAVIGATION[user.role] : [];

  return (
    <div className="flex h-screen bg-background text-foreground w-full overflow-hidden transition-colors" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside 
        className={`shrink-0 fixed md:relative top-0 bottom-0 z-50 bg-sidebar border-r border-border rtl:border-r-0 rtl:border-l flex flex-col transition-transform md:transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-20'} 
          ${isMobileOpen 
             ? 'inset-s-0 translate-x-0' 
             : 'inset-s-0 -translate-x-full rtl:translate-x-full md:translate-x-0 md:rtl:translate-x-0'
          }
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-sm">QM</span>
            </div>
            
            {isExpanded && (
              <div className="flex flex-col whitespace-nowrap transition-opacity duration-300">
                <span className="font-bold font-sans text-sidebar-foreground">{t('nav.system')}</span>
                <span className="text-[10px] text-sidebar-primary capitalize">{user?.role.replace(/_/g, ' ')}</span>
              </div>
            )}
          </div>

       

          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {isExpanded && <div className="px-3 pb-2 text-[10px] uppercase tracking-wider text-sidebar-primary font-semibold">{t('nav.menu')}</div>}
          
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={!isExpanded ? t(item.labelKey) : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full p-2.5 rounded-xl transition-all duration-200 font-medium text-sm group ${
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                } ${!isExpanded ? 'justify-center' : ''}`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              
              {isExpanded && (
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{t(item.labelKey)}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            title={!isExpanded ? t('nav.logout') : undefined}
            className={`flex items-center gap-3 w-full p-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-colors text-sm font-medium ${!isExpanded ? 'justify-center' : ''} cursor-pointer`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isExpanded && <span className="whitespace-nowrap overflow-hidden">{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header & Desktop Toolbar */}
        <header className="h-16 bg-backgroundx bg-primaryx text-whitex backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button - Only visible on small screens */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-all focus:outline-none cursor-pointer"
              title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <div className="relative w-4 h-3.5">
                <span className={`absolute h-[2px] bg-current rounded-full transition-all duration-300 ease-in-out w-1/2 top-0 inset-e-0`} />
                <span className={`absolute h-[2px] w-full bg-current rounded-full transition-all duration-300 ease-in-out top-1.5 inset-e-0`} />
                <span className={`absolute h-[2px] bg-current rounded-full transition-all duration-300 ease-in-out w-3/4 top-3 inset-e-0`} />
              </div>
            </button>
            <h1 className="text-lg font-bold md:hidden">QMS</h1>
          </div>
             {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden md:flex p-1.5 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            {i18n.language === 'ar' 
              ? (isExpanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />)
              : (isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />)
            }
          </button>
          
          <div className="flex items-center gap-2 ms-auto">
     
            
            {/* User Profile Dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className='flex items-center justify-center gap-2 rounded-lg p-[0.4rem] hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none cursor-pointer'>
                  <img src="/user-avatar.webp" alt="user avatar" className="w-6 h-6 rounded-full" />
                  {user.name}
                </DropdownMenuTrigger>
                <DropdownMenuContent dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}   className="w-60 mt-2" align="center">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{t('nav.account')}</DropdownMenuLabel>
                    <DropdownMenuLabel>
                      {t('nav.name')}: {user.name}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel>
                      {t('nav.email')}: {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel>
                      {t('nav.role')}: {user.role}
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="w-full flex items-center justify-between text-rose-800 cursor-pointer" onClick={handleLogout}>
                      {t('nav.logout')}
                      <LogOutIcon className="w-4 h-4" />
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </header>

        {/* Page Content wrapped in Outlet */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8" data-scroll-container>
          <ScrollToTop />
          <Outlet />
        </div>
      </main>
    </div>
  );
};
