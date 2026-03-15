import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Building, Calendar, Store } from 'lucide-react';
import type { Branch } from '../types';

interface BranchDisplayProps {
  data: Branch | null;
}

export const BranchDisplay: React.FC<BranchDisplayProps> = ({ data }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-6 text-left" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        {data?.logo_url ? (
          <img src={data?.logo_url} alt={data?.name} className="w-16 h-16 rounded-full object-cover border" />
        ) : (
          <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full">
            <Store className="w-8 h-8" />
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold">{data?.name}</h3>
          <div className="flex gap-2 mt-2">
            <Badge variant={data?.is_active ? 'default' : 'secondary'}>
              {data?.is_active ? t('users.active') : t('users.inactive')}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
          <Building className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t('companies.company')}</p>
            <p className="font-medium">{data?.company?.name || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
          <Mail className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t('users.email')}</p>
            <p className="font-medium">{data?.contact_email || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
          <Phone className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t('users.phone')}</p>
            <p className="font-medium" dir="ltr">{data?.contact_phone || 'N/A'}</p>
          </div>
        </div>
        
        {data?.created_at && (
          <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{t('users.createdAt')}</p>
              <p className="font-medium text-sm">
                {new Date(data?.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
