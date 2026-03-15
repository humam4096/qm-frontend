import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Mail, Phone, User, Building2, Utensils, Map } from 'lucide-react';
import type { Kitchen } from '../types';

interface KitchenDisplayProps {
  data: Kitchen | null;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ data }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-6 text-left" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full">
          <Utensils className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{data?.name}</h3>
          <div className="flex gap-2 mt-2">
            <Badge variant={data?.is_active ? 'default' : 'secondary'}>
              {data?.is_active ? t('common.active') : t('common.inactive')}
            </Badge>
            {data?.is_hajj && (
              <Badge variant="outline">{t('kitchens.hajj')}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Owner Info */}
        <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
          <User className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t('kitchens.ownerName')}</p>
            <p className="font-medium">{data?.owner_name}</p>
          </div>
        </div>

        {/* License */}
        <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
          <Building2 className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t('kitchens.licenseNumber')}</p>
            <p className="font-medium">{data?.license_number}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
          <Mail className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t('kitchens.contactEmail')}</p>
            <p className="font-medium text-sm">{data?.contact_email}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
          <Phone className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t('kitchens.responsiblePhone')}</p>
            <p className="font-medium" dir="ltr">{data?.responsible_phone}</p>
          </div>
        </div>

        {/* Branch */}
        {data?.branch?.name && (
          <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{t('kitchens.branch')}</p>
              <p className="font-medium">{data?.branch.name}</p>
            </div>
          </div>
        )}

        {/* Zone */}
        {data?.zone?.name && (
          <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{t('kitchens.zone')}</p>
              <p className="font-medium">{data?.zone.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Capacity Section */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">{t('kitchens.capacity')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-card border rounded-lg">
            <p className="text-sm text-muted-foreground">{t('kitchens.hajjMakkahCapacity')}</p>
            <p className="font-medium">{data?.hajj_makkah_capacity} {t('kitchens.persons')}</p>
          </div>
          <div className="p-3 bg-card border rounded-lg">
            <p className="text-sm text-muted-foreground">{t('kitchens.hajjMashaerCapacity')}</p>
            <p className="font-medium">{data?.hajj_mashaer_capacity} {t('kitchens.persons')}</p>
          </div>
          <div className="p-3 bg-card border rounded-lg">
            <p className="text-sm text-muted-foreground">{t('kitchens.areaSqm')}</p>
            <p className="font-medium">{data?.area_sqm} m²</p>
          </div>
        </div>
      </div>

      {/* Storage Section */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">{t('kitchens.storage')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-card border rounded-lg">
            <p className="text-sm text-muted-foreground">{t('kitchens.dryStorageVolume')}</p>
            <p className="font-medium">{data?.dry_storage_volume} m³</p>
          </div>
          <div className="p-3 bg-card border rounded-lg">
            <p className="text-sm text-muted-foreground">{t('kitchens.coldStorageVolume')}</p>
            <p className="font-medium">{data?.cold_storage_volume} m³</p>
          </div>
          <div className="p-3 bg-card border rounded-lg">
            <p className="text-sm text-muted-foreground">{t('kitchens.frozenStorageVolume')}</p>
            <p className="font-medium">{data?.frozen_storage_volume} m³</p>
          </div>
        </div>
      </div>

      {/* Equipment Section */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">{t('kitchens.equipment')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-card border rounded-lg">
            <p className="text-sm text-muted-foreground">{t('kitchens.cookingPlatformsCount')}</p>
            <p className="font-medium">{data?.cooking_platforms_count}</p>
          </div>
          <div className="p-3 bg-card border rounded-lg">
            <p className="text-sm text-muted-foreground">{t('kitchens.foodTransportCabinetsCount')}</p>
            <p className="font-medium">{data?.food_transport_cabinets_count}</p>
          </div>
          <div className="p-3 bg-card border rounded-lg">
            <p className="text-sm text-muted-foreground">{t('kitchens.vehiclesCount')}</p>
            <p className="font-medium">{data?.vehicles_count}</p>
          </div>
        </div>
      </div>

      {/* Location */}
      {(data?.map_lat || data?.map_lng) && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
            <Map className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{t('kitchens.coordinates')}</p>
              <p className="font-medium text-sm" dir="ltr">
                {data?.map_lat}, {data?.map_lng}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Created At */}
      {data?.created_at && (
        <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t('common.createdAt')}</p>
            <p className="font-medium text-sm">
              {new Date(data?.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
