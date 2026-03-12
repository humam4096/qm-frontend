import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Badge } from '../../../components/ui/badge';
import { useUser } from '../hooks/useUsers';
import { Skeleton } from '../../../components/ui/skeleton';
import { User, Phone, Mail, MapPin, Building, Calendar } from 'lucide-react';

interface UserDetailsDialogProps {
  userId: string | number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({ userId, open, onOpenChange }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // Only query if we have an ID and the dialog is open
  const { data: user, isLoading } = useUser(userId || '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('users.userDetails')}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                 <Skeleton className="w-16 h-16 rounded-full" />
                 <div className="space-y-2">
                   <Skeleton className="h-4 w-32" />
                   <Skeleton className="h-3 w-24" />
                 </div>
               </div>
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-10 w-full" />
            </div>
          ) : user ? (
            <>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={user.is_active ? 'default' : 'secondary'}>
                      {user.is_active ? t('users.active') : t('users.inactive')}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {user.role.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{t('users.email')}</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{t('users.phone')}</p>
                    <p className="font-medium" dir="ltr">{user.phone}</p>
                  </div>
                </div>

                {user.scope != null && (
                  <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                        {user.scope.type === 'zone' ? <MapPin className="w-5 h-5 text-muted-foreground" /> : <Building className="w-5 h-5 text-muted-foreground" />}
                        <div>
                          <p className="text-sm text-muted-foreground">{user.scope.type === 'zone' ? 'Zone' : 'Branch'}</p>
                          <p className="font-medium">{user.scope.name}</p>
                        </div>
                      </div>
                  </div>
                )}
                
                {user.created_at && (
                  <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Created At</p>
                    <p className="font-medium text-sm">{new Date(user.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</p>
                  </div>
                </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No user data found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
