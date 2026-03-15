import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Hash, Map } from 'lucide-react';
import type { Zone } from '../types';

interface ZoneDisplayProps {
  data: Zone;
}

export const ZoneDisplay: React.FC<ZoneDisplayProps> = ({ data }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-6 text-left" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full">
          <Map className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{data.name}</h3>
          <div className="flex gap-2 mt-2">
            <Badge variant={data.is_active ? 'default' : 'secondary'}>
              {data.is_active ? t('users.active') : t('users.inactive')}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.location?.name && (
          <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{t('zones.location')}</p>
              <p className="font-medium">{data.location.name}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
          <Hash className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t('zones.code')}</p>
            <p className="font-medium">{data.code || 'N/A'}</p>
          </div>
        </div>
        
        {(data.map_lat || data.map_lng) && (
          <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
            <Map className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{t('zones.coordinates')}</p>
              <p className="font-medium text-sm" dir="ltr">
                {data.map_lat}, {data.map_lng}
              </p>
            </div>
          </div>
        )}

        {data.created_at && (
          <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{t('users.createdAt')}</p>
              <p className="font-medium text-sm">
                {new Date(data.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
