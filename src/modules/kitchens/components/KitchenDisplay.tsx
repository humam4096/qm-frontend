import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  MapPin,
  Calendar,
  Mail,
  Phone,
  User,
  Building2,
  Utensils,
  Map,
  Warehouse,
  Truck,
  Flame,
  FileTextIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Kitchen } from '../types';
import type { Contract } from '@/modules/contracts/types';
import { KitchenContractCard } from './KitchenContractCard';
import { RoleGuard } from '@/app/router/RoleGuard';

interface KitchenDisplayProps {
  data: Kitchen | undefined;
  openView: (item: Contract) => void;
  contracts: Contract[] | undefined;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ data, openView, contracts }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!data) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 🔥 Hero Header */}
        <div className="relative overflow-hidden bg-linear-to-br from-primary via-primary/90 to-secondary rounded-2xl p-6 text-white shadow-2xl">
          <div className="absolute inset-0 bg-white/5" />
          
          <div className="relative flex items-center gap-5">
            <div className="w-20 h-20 bg-white/10 backdrop-blur border border-white/20 rounded-2xl flex items-center justify-center">
              <Utensils className="w-10 h-10" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold">{data.name}</h1>

              <div className="w-full flex justify-between gap-3 mt-3 flex-wrap">
               
                <div className='flex gap-6'>
                  <Badge
                    className={cn(
                      "px-4 py-1.5 text-sm",
                      data.is_active
                        ? "bg-success text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {data.is_active ? t('common.active') : t('common.inactive')}
                  </Badge>

                  {data.is_hajj && (
                    <Badge className="bg-white/20 text-white border-white/30">
                      {t('kitchens.hajj')}
                    </Badge>
                  )}
                  <div className='px-10 flex items-center gap-10 justify-between'>
                    <div>
                      <p className="text-sm ">{t('kitchens.centerName')}</p>
                      <p className="font-bold">{data.center_name}</p>
                    </div>
                    <div>
                      <p className="text-sm">{t('kitchens.centerNumber')}</p>
                      <p className="font-bold">{data.center_number}</p>
                    </div>
                  </div>

                </div>
                <div className='flex'>
                  <Badge variant="warning" className="flex gap-2">
                    <div className="px-2x rounded-xl">
                      <FileTextIcon className="w-4 h-4" />
                    </div>
                    {t('nav.contracts')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* 📊 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card className="border-0 shadow-lg bg-linear-to-br from-primary/5 to-primary/10">
          <CardContent className="p-5 flex items-center gap-4">
            <User className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{t('kitchens.ownerName')}</p>
              <p className="font-bold">{data.owner_name}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-linear-to-br from-secondary/5 to-secondary/10">
          <CardContent className="p-5 flex items-center gap-4">
            <Building2 className="w-8 h-8 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">{t('kitchens.branch')}</p>
              <p className="font-bold">{data.branch?.name}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-linear-to-br from-warning/5 to-warning/10">
          <CardContent className="p-5 flex items-center gap-4">
            <MapPin className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">{t('kitchens.zone')}</p>
              <p className="font-bold">{data.zone?.location?.name}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-linear-to-br from-info/5 to-info/10">
          <CardContent className="p-5 flex items-center gap-4">
            <Calendar className="w-8 h-8 text-info" />
            <div>
              <p className="text-sm text-muted-foreground">{t('common.createdAt')}</p>
              <p className="font-bold text-sm">
                {new Date(data.created_at).toLocaleDateString(
                  isRTL ? 'ar-SA' : 'en-US'
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 📇 Contact Info */}
      <Card className="border-0 shadow-xl">
        <CardContent className="grid md:grid-cols-3 gap-6 p-6">
          <InfoItem icon={Mail} label={t('kitchens.contactEmail')} value={data.contact_email} />
          <InfoItem icon={Phone} label={t('kitchens.responsiblePhone')} value={data.responsible_phone} dir="ltr" />
          <InfoItem icon={Building2} label={t('kitchens.licenseNumber')} value={data.license_number} />
        </CardContent>
      </Card>

      {/* 🏭 Capacity & Storage */}
      <div className="grid md:grid-cols-2 gap-6">
        
        <Card className="shadow-xl border-0">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">{t('kitchens.capacity')}</h3>

            <Stat icon={Flame} label={t('kitchens.hajjMakkahCapacity')} value={`${data.capacity?.hajj_makkah} ${t('kitchens.persons')}`} />
            <Stat icon={Flame} label={t('kitchens.hajjMashaerCapacity')} value={`${data.capacity?.hajj_mashaer} ${t('kitchens.persons')}`} />
            <Stat icon={Warehouse} label={t('kitchens.areaSqm')} value={`${data.storage?.area_sqm} m²`} />
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">{t('kitchens.storage')}</h3>

            <Stat icon={Warehouse} label={t('kitchens.dryStorageVolume')} value={`${data.storage?.dry} m³`} />
            <Stat icon={Warehouse} label={t('kitchens.coldStorageVolume')} value={`${data.storage?.cold} m³`} />
            <Stat icon={Warehouse} label={t('kitchens.frozenStorageVolume')} value={`${data.storage?.frozen} m³`} />
          </CardContent>
        </Card>
      </div>

      {/* 🚚 Operations */}
      <Card className="shadow-xl border-0">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">{t('kitchens.equipment')}</h3>

          <div className="grid md:grid-cols-3 gap-4">
            <Stat icon={Flame} label={t('kitchens.cookingPlatformsCount')} value={data.operations?.cooking_platforms} />
            <Stat icon={Truck} label={t('kitchens.foodTransportCabinetsCount')} value={data.operations?.food_transport_cabinets} />
            <Stat icon={Truck} label={t('kitchens.vehiclesCount')} value={data.operations?.vehicles} />
          </div>
        </CardContent>
      </Card>

      {/* 📍 Coordinates */}
      {(data.coordinates?.lat || data.coordinates?.lng) && (
        <Card className="shadow-xl border-0">
          <CardContent className="p-6 flex items-center gap-4">
            <Map className="w-6 h-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">{t('kitchens.coordinates')}</p>
              <p className="font-medium" dir="ltr">
                {data.coordinates?.lat}, {data.coordinates?.lng}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contracts */} 
      <RoleGuard allowedRoles={['system_manager', 'quality_manager']}>
        {contracts?.length ? (
          <Card className="shadow-xl border-0">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">{t('kitchens.contracts')}</h3>

              <div className="grid md:grid-cols-1 gap-4">
                {contracts.map((contract, index) => (
                  <KitchenContractCard
                    key={contract.id}
                    index={index}
                    contract={contract}
                    onView={openView}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          
          <Card className="shadow-xl border-0">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">{t('kitchens.contracts')}</h3>
              <div className="text-center py-10 text-muted-foreground border rounded-xl bg-muted/20">
                {t('kitchens.noContractAssigned')}
              </div>
            </CardContent>
          </Card>
        )}
      </RoleGuard>

    </div>
  );
};

/* 🔹 Small reusable components */

const InfoItem = ({ icon: Icon, label, value, dir }: any) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium" dir={dir}>{value}</p>
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-primary" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <span className="font-semibold">{value ?? '-'}</span>
  </div>
);