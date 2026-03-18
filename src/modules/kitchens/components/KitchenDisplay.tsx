import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Calendar,
  Mail,
  Phone,
  User,
  Building2,
  Utensils,
  Map
} from 'lucide-react';
import type { Kitchen } from '../types';

interface KitchenDisplayProps {
  data: Kitchen | null;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ data }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!data) return null;

  return (
    <div className="space-y-6 text-left" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl shadow-sm">
        <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full">
          <Utensils className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold">{data.name}</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge variant={data.is_active ? 'default' : 'secondary'}>
              {data.is_active ? t('common.active') : t('common.inactive')}
            </Badge>
            {data.is_hajj && <Badge variant="outline">{t('kitchens.hajj')}</Badge>}
          </div>
        </div>
      </div>

      {/* Contact & Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: User, label: t('kitchens.ownerName'), value: data.owner_name },
          { icon: Building2, label: t('kitchens.licenseNumber'), value: data.license_number },
          { icon: Mail, label: t('kitchens.contactEmail'), value: data.contact_email },
          { icon: Phone, label: t('kitchens.responsiblePhone'), value: data.responsible_phone, dir: 'ltr' },
          { icon: Building2, label: t('kitchens.branch'), value: data.branch?.name },
          { icon: MapPin, label: t('kitchens.zone'), value: data.zone?.location?.name },
        ].map((item, idx) => (
          item.value && (
            <div
              key={idx}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <item.icon className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="font-medium" dir={item.dir || undefined}>{item.value}</p>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Capacity */}
      <section className="border-t pt-4 space-y-3">
        <h4 className="text-lg font-semibold">{t('kitchens.capacity')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">{t('kitchens.hajjMakkahCapacity')}</p>
            <p className="font-medium">{data.capacity?.hajj_makkah} {t('kitchens.persons')}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">{t('kitchens.hajjMashaerCapacity')}</p>
            <p className="font-medium">{data.capacity?.hajj_mashaer} {t('kitchens.persons')}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">{t('kitchens.areaSqm')}</p>
            <p className="font-medium">{data.storage?.area_sqm} m²</p>
          </div>
        </div>
      </section>

      {/* Storage */}
      <section className="border-t pt-4 space-y-3">
        <h4 className="text-lg font-semibold">{t('kitchens.storage')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">{t('kitchens.dryStorageVolume')}</p>
            <p className="font-medium">{data.storage?.dry} m³</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">{t('kitchens.coldStorageVolume')}</p>
            <p className="font-medium">{data.storage?.cold} m³</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">{t('kitchens.frozenStorageVolume')}</p>
            <p className="font-medium">{data.storage?.frozen} m³</p>
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="border-t pt-4 space-y-3">
        <h4 className="text-lg font-semibold">{t('kitchens.equipment')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">{t('kitchens.cookingPlatformsCount')}</p>
            <p className="font-medium">{data.operations?.cooking_platforms}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">{t('kitchens.foodTransportCabinetsCount')}</p>
            <p className="font-medium">{data.operations?.food_transport_cabinets}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">{t('kitchens.vehiclesCount')}</p>
            <p className="font-medium">{data.operations?.vehicles}</p>
          </div>
        </div>
      </section>

      {/* Coordinates */}
      {(data.coordinates?.lat || data.coordinates?.lng) && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <Map className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">{t('kitchens.coordinates')}</p>
              <p className="font-medium" dir="ltr">
                {data.coordinates?.lat}, {data.coordinates?.lng}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Created At */}
      {data.created_at && (
        <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm text-gray-500">{t('common.createdAt')}</p>
            <p className="font-medium text-sm">
              {new Date(data.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};