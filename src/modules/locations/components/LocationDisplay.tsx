import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';
import type { Location } from '../types';

interface LocationDisplayProps {
  data: Location | null;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({ data }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-6 text-left" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full">
          <MapPin className="w-8 h-8" />
        </div>
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
