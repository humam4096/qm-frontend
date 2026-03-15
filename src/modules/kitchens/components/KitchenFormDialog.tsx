import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SheetAction } from "@/components/ui/sheet-action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateKitchen, useUpdateKitchen } from "../hooks/useKitchens";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup
} from "@/components/ui/select";
import { BranchAPI } from "@/modules/branches/api/branches.api";
import { ZoneAPI } from "@/modules/zones/api/zones.api";
import { useQuery } from "@tanstack/react-query";

interface KitchenFormValues {
  branch_id: number;
  zone_id: number;
  name: string;
  owner_name: string;
  responsible_phone: string;
  contact_email: string;
  license_number: string;
  hajj_makkah_capacity: number;
  hajj_mashaer_capacity: number;
  area_sqm: number;
  dry_storage_volume: number;
  cold_storage_volume: number;
  frozen_storage_volume: number;
  cooking_platforms_count: number;
  food_transport_cabinets_count: number;
  vehicles_count: number;
  map_lat: number | null;
  map_lng: number | null;
  is_hajj: boolean;
  is_active: boolean;
  logo?: FileList;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: any | null;
}

const DEFAULT_VALUES: Partial<KitchenFormValues> = {
  name: "",
  owner_name: "",
  responsible_phone: "",
  contact_email: "",
  license_number: "",
  hajj_makkah_capacity: 0,
  hajj_mashaer_capacity: 0,
  area_sqm: 0,
  dry_storage_volume: 0,
  cold_storage_volume: 0,
  frozen_storage_volume: 0,
  cooking_platforms_count: 0,
  food_transport_cabinets_count: 0,
  vehicles_count: 0,
  map_lat: null,
  map_lng: null,
  is_hajj: false,
  is_active: true
};

export const KitchenFormDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  itemToEdit = null
}) => {
  const { t } = useTranslation();
  const isEdit = !!itemToEdit;

  const kitchenSchema = z.object({
    branch_id: z.coerce.number().min(1, t("common.requiredField")),
    zone_id: z.coerce.number().min(1, t("common.requiredField")),
    name: z.string().min(1, t("common.requiredField")).min(3, t("kitchens.nameMinLength")),
    owner_name: z.string().min(1, t("common.requiredField")).min(3, t("kitchens.ownerNameMinLength")),
    responsible_phone: z.string().min(1, t("common.requiredField")).regex(/^[+\d]?\d{7,14}$/, t("common.invalidPhone")),
    contact_email: z.string().min(1, t("common.requiredField")).email(t("common.invalidEmail")),
    license_number: z.string().min(1, t("common.requiredField")).min(5, t("kitchens.licenseNumberMinLength")),
    hajj_makkah_capacity: z.coerce.number().min(0, t("kitchens.capacityMinValue")).max(999999, t("kitchens.capacityMaxValue")),
    hajj_mashaer_capacity: z.coerce.number().min(0, t("kitchens.capacityMinValue")).max(999999, t("kitchens.capacityMaxValue")),
    area_sqm: z.coerce.number().min(0.01, t("kitchens.areaMinValue")).max(999999, t("kitchens.areaMaxValue")),
    dry_storage_volume: z.coerce.number(),
    cold_storage_volume: z.coerce.number(),
    frozen_storage_volume: z.coerce.number(),
    // dry_storage_volume: z.coerce.number().min(0, t("kitchens.storageMinValue")).max(99999, t("kitchens.storageMaxValue")),
    // cold_storage_volume: z.coerce.number().min(0, t("kitchens.storageMinValue")).max(99999, t("kitchens.storageMaxValue")),
    // frozen_storage_volume: z.coerce.number().min(0, t("kitchens.storageMinValue")).max(99999, t("kitchens.storageMaxValue")),
    cooking_platforms_count: z.coerce.number().min(0, t("kitchens.countMinValue")).max(999, t("kitchens.countMaxValue")),
    food_transport_cabinets_count: z.coerce.number().min(0, t("kitchens.countMinValue")).max(999, t("kitchens.countMaxValue")),
    vehicles_count: z.coerce.number().min(0, t("kitchens.countMinValue")).max(999, t("kitchens.countMaxValue")),
    map_lat: z.union([z.number().min(-90, t("kitchens.latitudeRange")).max(90, t("kitchens.latitudeRange")), z.string().transform(val => val ? parseFloat(val) : null)]).nullable(),
    map_lng: z.union([z.number().min(-180, t("kitchens.longitudeRange")).max(180, t("kitchens.longitudeRange")), z.string().transform(val => val ? parseFloat(val) : null)]).nullable(),
    is_hajj: z.boolean().default(true),
    is_active: z.boolean().default(true),
    logo: z.any().optional(),
  });

  // Get branches
  const { data: branchesListData, isLoading: isBranchesLoading } = useQuery({
    queryKey: ['branches-list'],
    queryFn: () => BranchAPI.getBranches({ per_page: 100 })
  });
  const branchesList = branchesListData?.data ?? [];

  // Get zones
  const { data: zonesListData, isLoading: isZonesLoading } = useQuery({
    queryKey: ['zones-list'],
    queryFn: () => ZoneAPI.getZones({ per_page: 100 })
  });
  const zonesList = zonesListData?.data ?? [];

  const { mutateAsync: createKitchen, isPending: isCreating, error: createError } = useCreateKitchen();
  const { mutateAsync: updateKitchen, isPending: isUpdating, error: updateError } = useUpdateKitchen();

  const isLoading = isCreating || isUpdating;
  const mutationError = createError || updateError;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<KitchenFormValues>({
    resolver: zodResolver(kitchenSchema) as any,
    defaultValues: DEFAULT_VALUES
  });

  const [selectedBranchName, setSelectedBranchName] = useState("");
  const [selectedZoneName, setSelectedZoneName] = useState("");

  useEffect(() => {
    reset(itemToEdit || DEFAULT_VALUES);
  }, [itemToEdit, reset]);

  const isActive = watch("is_active");
  const isHajj = watch("is_hajj");

  const onSubmit = async (data: KitchenFormValues) => {
    try {
      const formData = new FormData();

      formData.append("branch_id", String(data.branch_id));
      formData.append("zone_id", String(data.zone_id));
      formData.append("name", data.name);
      formData.append("owner_name", data.owner_name);
      formData.append("responsible_phone", data.responsible_phone);
      formData.append("contact_email", data.contact_email);
      formData.append("license_number", data.license_number);
      formData.append("hajj_makkah_capacity", String(data.hajj_makkah_capacity));
      formData.append("hajj_mashaer_capacity", String(data.hajj_mashaer_capacity));
      formData.append("area_sqm", String(data.area_sqm));
      formData.append("dry_storage_volume", String(data.dry_storage_volume));
      formData.append("cold_storage_volume", String(data.cold_storage_volume));
      formData.append("frozen_storage_volume", String(data.frozen_storage_volume));
      formData.append("cooking_platforms_count", String(data.cooking_platforms_count));
      formData.append("food_transport_cabinets_count", String(data.food_transport_cabinets_count));
      formData.append("vehicles_count", String(data.vehicles_count));
      formData.append("map_lat", String(data.map_lat ?? ""));
      formData.append("map_lng", String(data.map_lng ?? ""));
      formData.append("is_hajj", data.is_hajj ? "1" : "0");
      formData.append("is_active", data.is_active ? "1" : "0");

      if (data.logo?.[0]) {
        formData.append("logo", data.logo[0]);
      }

      if (isEdit && itemToEdit?.id) {
        await updateKitchen({
          id: itemToEdit.id,
          payload: formData
        });
        toast.success(t("kitchens.updateSuccess"));
      } else {
        await createKitchen(formData);
        toast.success(t("kitchens.createSuccess"));
      }

      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || t("common.error"));
    }
  };

  return (
    <SheetAction
      isOpen={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t("kitchens.editKitchen") : t("kitchens.addKitchen")}
      submitText={t("common.save")}
      cancelText={t("common.cancel")}
      onSubmit={handleSubmit(onSubmit as any)}
      isLoading={isLoading}
      footer
      contentClassName="max-w-2xl p-10"
    >
      <div className="space-y-6 px-4">
        {/* Basic Info */}
        <div>
          <h4 className="font-semibold mb-3">{t('kitchens.basicInfo')}</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Branch */}
            <div className="w-full space-y-2">
              <Label>{t("kitchens.branch")}</Label>
              <Select onValueChange={(v) => {
                setValue("branch_id", Number(v), { shouldValidate: true });
                const branch = branchesList.find((b: any) => String(b.id) === v);
                setSelectedBranchName(branch?.name ?? "");
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("kitchens.selectBranch")}>
                    {isBranchesLoading ? t("common.loading") : selectedBranchName || t("kitchens.selectBranch")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {branchesList.map((branch: any) => (
                      <SelectItem key={branch.id} value={String(branch.id)}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.branch_id && <p className="text-destructive text-sm">{errors.branch_id.message}</p>}
            </div>

            {/* Zone */}
            <div className="w-full space-y-2">
              <Label>{t("kitchens.zone")}</Label>
              <Select onValueChange={(v) => {
                setValue("zone_id", Number(v), { shouldValidate: true });
                const zone = zonesList.find((z: any) => String(z.id) === v);
                setSelectedZoneName(zone?.name ?? "");
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("kitchens.selectZone")}>
                    {isZonesLoading ? t("common.loading") : selectedZoneName || t("kitchens.selectZone")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {zonesList.map((zone: any) => (
                      <SelectItem key={zone.id} value={String(zone.id)}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.zone_id && <p className="text-destructive text-sm">{errors.zone_id.message}</p>}
            </div>

            {/* Kitchen Name */}
            <div className="space-y-2">
              <Label>{t("kitchens.name")}</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            {/* Owner Name */}
            <div className="space-y-2">
              <Label>{t("kitchens.ownerName")}</Label>
              <Input {...register("owner_name")} />
              {errors.owner_name && <p className="text-destructive text-sm">{errors.owner_name.message}</p>}
            </div>

            {/* License Number */}
            <div className="space-y-2">
              <Label>{t("kitchens.licenseNumber")}</Label>
              <Input {...register("license_number")} />
              {errors.license_number && <p className="text-destructive text-sm">{errors.license_number.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>{t("kitchens.contactEmail")}</Label>
              <Input type="email" {...register("contact_email")} />
              {errors.contact_email && <p className="text-destructive text-sm">{errors.contact_email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>{t("kitchens.responsiblePhone")}</Label>
              <Input {...register("responsible_phone")} />
              {errors.responsible_phone && <p className="text-destructive text-sm">{errors.responsible_phone.message}</p>}
            </div>

            {/* Logo */}
            <div className="space-y-2 col-span-2">
              <Label>{t("kitchens.logo")}</Label>
              <Input type="file" accept="image/*" {...register("logo")} />
              {errors.logo && <p className="text-destructive text-sm">{errors.logo?.message as string}</p>}
            </div>
          </div>
        </div>

        {/* Capacity */}
        <div>
          <h4 className="font-semibold mb-3">{t('kitchens.capacity')}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("kitchens.hajjMakkahCapacity")}</Label>
              <Input type="number" {...register("hajj_makkah_capacity")} />
              {errors.hajj_makkah_capacity && <p className="text-destructive text-sm">{errors.hajj_makkah_capacity.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t("kitchens.hajjMashaerCapacity")}</Label>
              <Input type="number" {...register("hajj_mashaer_capacity")} />
              {errors.hajj_mashaer_capacity && <p className="text-destructive text-sm">{errors.hajj_mashaer_capacity.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t("kitchens.areaSqm")}</Label>
              <Input type="number" step="0.01" {...register("area_sqm")} />
              {errors.area_sqm && <p className="text-destructive text-sm">{errors.area_sqm.message}</p>}
            </div>
          </div>
        </div>

        {/* Storage */}
        <div>
          <h4 className="font-semibold mb-3">{t('kitchens.storage')}</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t("kitchens.dryStorageVolume")}</Label>
              <Input type="number" step="0.01" {...register("dry_storage_volume")} />
              {errors.dry_storage_volume && <p className="text-destructive text-sm">{errors.dry_storage_volume.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t("kitchens.coldStorageVolume")}</Label>
              <Input type="number" step="0.01" {...register("cold_storage_volume")} />
              {errors.cold_storage_volume && <p className="text-destructive text-sm">{errors.cold_storage_volume.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t("kitchens.frozenStorageVolume")}</Label>
              <Input type="number" step="0.01" {...register("frozen_storage_volume")} />
              {errors.frozen_storage_volume && <p className="text-destructive text-sm">{errors.frozen_storage_volume.message}</p>}
            </div>
          </div>
        </div>

        {/* Equipment */}
        <div>
          <h4 className="font-semibold mb-3">{t('kitchens.equipment')}</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t("kitchens.cookingPlatformsCount")}</Label>
              <Input type="number" {...register("cooking_platforms_count")} />
              {errors.cooking_platforms_count && <p className="text-destructive text-sm">{errors.cooking_platforms_count.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t("kitchens.foodTransportCabinetsCount")}</Label>
              <Input type="number" {...register("food_transport_cabinets_count")} />
              {errors.food_transport_cabinets_count && <p className="text-destructive text-sm">{errors.food_transport_cabinets_count.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t("kitchens.vehiclesCount")}</Label>
              <Input type="number" {...register("vehicles_count")} />
              {errors.vehicles_count && <p className="text-destructive text-sm">{errors.vehicles_count.message}</p>}
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="font-semibold mb-3">{t('kitchens.location')}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("kitchens.mapLat")}</Label>
              <Input type="number" step="any" {...register("map_lat")} />
              {errors.map_lat && <p className="text-destructive text-sm">{errors.map_lat.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t("kitchens.mapLng")}</Label>
              <Input type="number" step="any" {...register("map_lng")} />
              {errors.map_lng && <p className="text-destructive text-sm">{errors.map_lng.message}</p>}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="border-t pt-4 grid grid-cols-2 gap-4">
          <div className="space-y-2 flex flex-col justify-center">
            <Label>{t("common.active")}</Label>
            <Switch
              checked={isActive}
              onCheckedChange={(value) => setValue("is_active", value)}
            />
          </div>
          <div className="space-y-2 flex flex-col justify-center">
            <Label>{t("kitchens.isHajj")}</Label>
            <Switch
              checked={isHajj}
              onCheckedChange={(value) => setValue("is_hajj", value)}
            />
          </div>
        </div>

        {/* Error Display */}
        {mutationError && (
          <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-destructive text-sm">{mutationError.message}</p>
          </div>
        )}
      </div>
    </SheetAction>
  );
};
