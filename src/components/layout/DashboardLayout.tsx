import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../app/store/useAuthStore';
import { LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import { ROLE_NAVIGATION } from '../../app/router/navigationConfig';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

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
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = user ? ROLE_NAVIGATION[user.role] : [];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 w-full overflow-hidden transition-colors" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside 
        className={`shrink-0 fixed md:relative top-0 bottom-0 z-50 bg-white dark:bg-gray-900 border-r rtl:border-r-0 rtl:border-l border-gray-200 dark:border-gray-800 flex flex-col transition-transform md:transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-20'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full md:translate-x-0 md:rtl:translate-x-0'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">QM</span>
            </div>
            
            {isExpanded && (
              <div className="flex flex-col whitespace-nowrap transition-opacity duration-300">
                <span className="font-bold font-sans text-emerald-800 dark:text-emerald-400">QMS System</span>
                <span className="text-[10px] text-gray-500 capitalize">{user?.role.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            )}
          </div>

       

          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {isExpanded && <div className="px-3 pb-2 text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Menu</div>}
          
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={!isExpanded ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full p-2.5 rounded-xl transition-all duration-200 font-medium text-sm group ${
                  isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                } ${!isExpanded ? 'justify-center' : ''}`
              }
            >
              <item.icon className={`w-5 h-5 shrink-0 ${!isExpanded ? 'mx-autox' : ''}`} />
              
              {isExpanded && (
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={handleLogout}
            title={!isExpanded ? "Logout" : undefined}
            className={`flex items-center gap-3 w-full p-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-sm font-medium ${!isExpanded ? 'justify-center' : ''} cursor-pointer`}
          >
            <LogOut className={`w-5 h-5 shrink-0 ${!isExpanded ? 'mx-auto' : ''}`} />
            {isExpanded && <span className="whitespace-nowrap overflow-hidden">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header & Desktop Toolbar */}
        <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button - Only visible on small screens */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className=" md:hidden p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all focus:outline-none"
              title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <div className="relative w-4 h-3.5">
                <span className={`absolute h-[2px] bg-current rounded-full transition-all duration-300 ease-in-out w-1/2 top-0 rtl:right-0`} />
                <span className={`absolute h-[2px] w-full bg-current rounded-full transition-all duration-300 ease-in-out  top-1.5 rtl:right-0`} />
                <span className={`absolute h-[2px] bg-current rounded-full transition-all duration-300 ease-in-out w-3/4 top-3 rtl:right-0`} />
              </div>
            </button>
            <h1 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 md:hidden">QMS</h1>
          </div>
             {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden md:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {i18n.language === 'ar' 
              ? (isExpanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />)
              : (isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />)
            }
          </button>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse ml-auto rtl:ml-0 rtl:mr-auto">
            <LanguageSwitcher />
            <ThemeToggle />
            {/* Future user profile dropdown can go here */}
          </div>
        </header>

        {/* Page Content wrapped in Outlet */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
