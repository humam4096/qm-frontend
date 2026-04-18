import { ArrowRight, LayoutDashboard } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getFallbackRouteForRole } from './routeConfig';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';

export default function UserRouter() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  
   const dashboardPath = user
    ? getFallbackRouteForRole(user.role)
    : '/login';


  return (
    <div>
      {isAuthenticated && user ? (
        <div className="w-full flex items-center gap-3">
          <Link
            to={dashboardPath}
            className="w-full text-primary-foreground bg-primary hover:bg-primary/90 font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            {user.name.toLocaleLowerCase()}
          </Link>
        </div>
      ) : (
        <Link
          to="/login"
          className="w-full text-primary-foreground bg-primary hover:bg-primary/90 font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          {t('common.login')}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      )}
    </div>
  )
}
