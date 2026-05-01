import { Outlet, useNavigate, NavLink, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../app/store/useAuthStore';
import { LogOut, ChevronLeft, ChevronRight, LogOutIcon, User, Menu } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import { ROLE_NAVIGATION } from '../../app/router/navigationConfig';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { ScrollToTop } from '@/utils/ScrollToTop';
import { NotificationsDropdown } from '@/modules/notifications/components/NotificationsDropdown';
import { useMobileDrawer } from '@/hooks/useMobileDrawer';
import MobileDrawerEl from '../dashboard/MobileDrawerEl';

export const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRtl = i18n.language === 'ar';

  // Desktop sidebar collapse state (persisted in localStorage)
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? saved === 'true' : true;
  });

  // Mobile drawer state — managed by the reusable hook
  const { isOpen: isMenuOpen, open: openMenu, close: closeMenu, triggerRef } = useMobileDrawer();

  // Persist desktop collapse preference
  useEffect(() => {
    localStorage.setItem('sidebarExpanded', String(isExpanded));
  }, [isExpanded]);

  // Close mobile drawer whenever the route changes
  useEffect(() => {
    closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = user ? ROLE_NAVIGATION[user.role] : [];

  return (
    <div
      className="flex h-screen-mobile bg-background text-foreground w-full overflow-hidden transition-colors"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ─────────────── Mobile Drawer (overlay + slide-in panel) ─────────────── */}
      <MobileDrawerEl closeMobile={closeMenu} isMenuOpen={isMenuOpen} navItems={navItems}/>

      {/* ─────────────── Desktop Sidebar ─────────────── */}
      <aside
        className={`hidden md:flex shrink-0 bg-sidebar border-e border-border flex-col transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <img src="/Humam-Logo.svg" alt="Humam Logo" className="w-12 h-12 shrink-0" />
            {isExpanded && (
              <div className="flex flex-col whitespace-nowrap transition-opacity duration-300">
                <span className="font-bold font-sans text-sidebar-foreground">
                  {t('nav.system')}
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Desktop nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {isExpanded && (
            <div className="px-3 pb-2 text-[10px] uppercase tracking-wider text-sidebar-primary font-semibold">
              {t('nav.menu')}
            </div>
          )}
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
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {t(item.labelKey)}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop sidebar footer — logout */}
        <div className="p-4 border-t border-border shrink-0">
          <button
            onClick={handleLogout}
            title={!isExpanded ? t('nav.logout') : undefined}
            className={`flex items-center gap-3 w-full p-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-colors text-sm font-medium cursor-pointer ${
              !isExpanded ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isExpanded && (
              <span className="whitespace-nowrap overflow-hidden">{t('nav.logout')}</span>
            )}
          </button>
        </div>
      </aside>

      {/* ─────────────── Main Content ─────────────── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header / Toolbar */}
        <header className="h-16 bg-background backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger — only visible on small screens */}
            <button
              ref={triggerRef as React.RefObject<HTMLButtonElement>}
              onClick={openMenu}
              className="md:hidden p-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-all focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              aria-label={t('nav.menu')}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-drawer"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold md:hidden">QMS</h1>
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden md:flex p-1.5 rounded-lg text-foreground/80 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isRtl
              ? isExpanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />
              : isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>

          {/* Right-side toolbar items */}
          <div className="flex items-center gap-2 ms-auto">
            {/* User Profile Dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center text-md gap-2 rounded-lg p-[0.4rem] hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none cursor-pointer">
                  <User size={18} />
                  <div className="hidden md:flex">
                    {user.name.toLocaleLowerCase()}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className="w-60 mt-2"
                  align="center"
                >
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
                    <DropdownMenuItem
                      className="w-full flex items-center justify-between text-rose-800 cursor-pointer"
                      onClick={handleLogout}
                    >
                      {t('nav.logout')}
                      <LogOutIcon className="w-4 h-4" />
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <LanguageSwitcher />
            <ThemeToggle />
            <NotificationsDropdown />
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8" data-scroll-container>
          <ScrollToTop />
          <Outlet />
        </div>
      </main>
    </div>
  );
};
