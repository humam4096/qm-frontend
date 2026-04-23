import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SheetAction } from "@/components/ui/sheet-action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LocationPicker } from "@/components/ui/location-picker";
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
// import type { Zone } from "@/modules/zones/types";
import type { Branch } from "@/modules/branches/types";
import type { Zone } from "@/modules/zones/types";

interface KitchenFormValues {
  branch_id: string;
  zone_id: string;
  name: string;
  owner_name: string;
  responsible_phone: string;
  contact_email: string;
  center_name: string;
  center_number: string;
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
  branch_id: "",
  zone_id: "",
  name: "",
  owner_name: "",
  center_name: "",
  center_number: "",
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
  is_hajj: true,
  is_active: true
};

  const Section = ({
    title,
    children,
    defaultOpen = true,
  }: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
      <div className="border rounded-lg">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold bg-muted/40"
        >
          {title}
          <span className="text-xs">{open ? "−" : "+"}</span>
        </button>

        {open && <div className="p-4 space-y-4">{children}</div>}
      </div>
    );
  };
export const KitchenFormDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  itemToEdit = null
}) => {
  const { t } = useTranslation();
  const isEdit = !!itemToEdit;

  const kitchenSchema = z.object({
    branch_id: z.string().min(1, t("common.requiredField")),
    zone_id: z.string().min(1, t("common.requiredField")),
    name: z.string().min(1, t("common.requiredField")).min(3, t("kitchens.nameMinLength")),
    owner_name: z.string(),

    responsible_phone: z.string(),
    contact_email: z.string(),
    license_number: z.string(),
    center_name: z.string(),
    center_number: z.string(),
    hajj_makkah_capacity: z.coerce.number(),
    hajj_mashaer_capacity: z.coerce.number(),
    area_sqm: z.coerce.number(),

    // owner_name: z.string().min(1, t("common.requiredField")).min(3, t("kitchens.ownerNameMinLength")),
    // owner_name: z.string().min(1, t("common.requiredField")).min(3, t("kitchens.ownerNameMinLength")),
    // responsible_phone: z.string().min(1, t("common.requiredField")).regex(/^[+\d]?\d{7,14}$/, t("common.invalidPhone")),
    // contact_email: z.string().min(1, t("common.requiredField")).email(t("common.invalidEmail")),
    // license_number: z.string().min(1, t("common.requiredField")).min(5, t("kitchens.licenseNumberMinLength")),
    // center_name: z.string().min(1, t("common.requiredField")),
    // center_number: z.string().min(1, t("common.requiredField")),
    // hajj_makkah_capacity: z.coerce.number().min(0, t("kitchens.capacityMinValue")).max(999999, t("kitchens.capacityMaxValue")),
    // hajj_mashaer_capacity: z.coerce.number().min(0, t("kitchens.capacityMinValue")).max(999999, t("kitchens.capacityMaxValue")),
    // area_sqm: z.coerce.number().min(0.01, t("kitchens.areaMinValue")).max(999999, t("kitchens.areaMaxValue")),
    
    dry_storage_volume: z.coerce.number(),
    cold_storage_volume: z.coerce.number(),
    frozen_storage_volume: z.coerce.number(),
    cooking_platforms_count: z.coerce.number().min(0, t("kitchens.countMinValue")).max(999, t("kitchens.countMaxValue")),
    food_transport_cabinets_count: z.coerce.number().min(0, t("kitchens.countMinValue")).max(999, t("kitchens.countMaxValue")),
    vehicles_count: z.coerce.number().min(0, t("kitchens.countMinValue")).max(999, t("kitchens.countMaxValue")),
    map_lat: z.union([z.number().min(-90, t("kitchens.latitudeRange")).max(90, t("kitchens.latitudeRange")), z.string().transform(val => val ? parseFloat(val) : null)]).nullable(),
    map_lng: z.union([z.number().min(-180, t("kitchens.longitudeRange")).max(180, t("kitchens.longitudeRange")), z.string().transform(val => val ? parseFloat(val) : null)]).nullable(),
    is_hajj: z.boolean().default(true),
    is_active: z.boolean().default(true),
    logo: z.any().optional(),
  });

  const [selectedBranchName, setSelectedBranchName] = useState("");
  const [selectedZoneName, setSelectedZoneName] = useState("");


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
    formState: { errors },
    control
  } = useForm<KitchenFormValues>({
    resolver: zodResolver(kitchenSchema) as any,
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
    reValidateMode: "onChange"
  });

  useEffect(() => {
    if (!itemToEdit) {
      reset(DEFAULT_VALUES);
      setSelectedBranchName("");
      setSelectedZoneName("");
      return;
    }

    reset({
      branch_id: String(itemToEdit.branch?.id ?? ""),
      zone_id: String(itemToEdit.zone?.id ?? ""),
      name: itemToEdit.name ?? "",
      owner_name: itemToEdit.owner_name ?? "",
      responsible_phone: itemToEdit.responsible_phone ?? "",
      contact_email: itemToEdit.contact_email ?? "",
      license_number: itemToEdit.license_number ?? "",
      center_name: itemToEdit.center_name ?? "",
      center_number: itemToEdit.center_number ?? "",
      hajj_makkah_capacity: itemToEdit.capacity?.hajj_makkah ?? 0,
      hajj_mashaer_capacity: itemToEdit.capacity?.hajj_mashaer ?? 0,
      area_sqm: itemToEdit.storage?.area_sqm ?? 0,
      dry_storage_volume: itemToEdit.storage?.dry ?? 0,
      cold_storage_volume: itemToEdit.storage?.cold ?? 0,
      frozen_storage_volume: itemToEdit.storage?.frozen ?? 0,
      cooking_platforms_count: itemToEdit.operations?.cooking_platforms ?? 0,
      food_transport_cabinets_count: itemToEdit.operations?.food_transport_cabinets ?? 0,
      vehicles_count: itemToEdit.operations?.vehicles ?? 0,
      map_lat: itemToEdit.coordinates?.lat ?? null,
      map_lng: itemToEdit.coordinates?.lng ?? null,
      is_hajj: itemToEdit.is_hajj ?? false,
      is_active: itemToEdit.is_active ?? true,
    });

  }, [itemToEdit]); 

  useEffect(() => {
    if (!itemToEdit) return;

    const branch = branchesList?.find(b => b.id === itemToEdit.branch?.id);
    const zone = zonesList?.find(z => z.id === itemToEdit.zone?.id);

    setSelectedBranchName(branch?.name ?? "");
    setSelectedZoneName(zone?.name ?? "");

  }, [itemToEdit, branchesList, zonesList]);
  
  const isActive = watch("is_active");
  const isHajj = watch("is_hajj");
  const mapLat = watch("map_lat");
  const mapLng = watch("map_lng");

  const handleLocationChange = (lat: number, lng: number) => {
    setValue("map_lat", lat);
    setValue("map_lng", lng);
  };

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
      formData.append("center_name", data.center_name);
      formData.append("center_number", data.center_number);
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

      // RESET EVERYTHING
      reset(DEFAULT_VALUES);
      setSelectedBranchName("");
      setSelectedZoneName("");

      // CLOSE MODAL
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
      <div className="space-y-4 px-2">

        {/* BASIC INFO */}
        <Section title={t('kitchens.basicInfo')} defaultOpen>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Branch */}
            <div className="w-full space-y-2">
              <Controller
                control={control}
                name="branch_id"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>{t("kitchens.branch")}</Label>

                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        const branch = branchesList.find((b: Branch) => String(b.id) === v);
                        setSelectedBranchName(branch?.name ?? "");
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("kitchens.selectBranch")}>
                          {isBranchesLoading ? t("common.loading") : selectedBranchName || t("kitchens.selectBranch")}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {branchesList.map((branch: Branch) => (
                            <SelectItem key={branch.id} value={String(branch.id)}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {errors.branch_id && (
                      <p className="text-destructive text-xs">
                        {errors.branch_id.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Zone */}
            <div className="w-full space-y-2">
               <Controller
                control={control}
                name="zone_id"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>{t("kitchens.zone")}</Label>

                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        const zone = zonesList.find((z: Zone) => String(z.id) === v);
                        setSelectedZoneName(zone?.name ?? "");
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("kitchens.selectZone")}>
                          {isZonesLoading ? t("common.loading") : selectedZoneName || t("kitchens.selectZone")}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {zonesList.map((zone: Zone) => (
                            <SelectItem key={zone.id} value={String(zone.id)}>
                              {zone.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {errors.zone_id && (
                      <p className="text-destructive text-xs">
                        {errors.zone_id.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Name */}
            <div className="space-y-1 md:col-span-2">
              <Label>{t("kitchens.name")}</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            {/* Owner */}
            <div className="space-y-1">
              <Label>{t("kitchens.ownerName")}</Label>
              <Input {...register("owner_name")} />
              {errors.owner_name && <p className="text-destructive text-sm">{errors.owner_name.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label>{t("kitchens.responsiblePhone")}</Label>
              <Input {...register("responsible_phone")} />
              {errors.responsible_phone && <p className="text-destructive text-sm">{errors.responsible_phone.message}</p>}

            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label>{t("kitchens.contactEmail")}</Label>
              <Input type="email" {...register("contact_email")} />
              {errors.contact_email && <p className="text-destructive text-sm">{errors.contact_email.message}</p>}
            </div>

            {/* License */}
            <div className="space-y-1">
              <Label>{t("kitchens.licenseNumber")}</Label>
              <Input {...register("license_number")} />
              {errors.license_number && <p className="text-destructive text-sm">{errors.license_number.message}</p>}
            </div>

            {/* Center Name */}
            <div className="space-y-1">
              <Label>{t("kitchens.centerName")}</Label>
              <Input {...register("center_name")} />
              {errors.center_name && <p className="text-destructive text-sm">{errors.center_name.message}</p>}
            </div>

            {/* Center Number */}
            <div className="space-y-1">
              <Label>{t("kitchens.centerNumber")}</Label>
              <Input {...register("center_number")} />
              {errors.center_number && <p className="text-destructive text-sm">{errors.center_number.message}</p>}
            </div>
          </div>
        </Section>

        {/* CAPACITY */}
        <Section title={t('kitchens.capacity')}>
         <div>
          <div className="grid grid-cols-3 gap-4">
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
        </Section>

        {/* STORAGE */}
        <Section title={t('kitchens.storage')} defaultOpen={false}>
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
        </Section>

        {/* EQUIPMENT */}
        <Section title={t('kitchens.equipment')} defaultOpen={false}>
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
        </Section>

        {/* LOCATION */}
        <Section title={t('kitchens.location')} defaultOpen={false}>
          <div className="space-y-2">
            <Label>{t("kitchens.selectLocation") || "Select Location on Map"}</Label>
            <LocationPicker
              latitude={mapLat}
              longitude={mapLng}
              onLocationChange={handleLocationChange}
              height="400px"
            />
            {(mapLat && mapLng) && (
              <p className="text-sm text-muted-foreground">
                {t("kitchens.coordinates") || "Coordinates"}: {mapLat.toFixed(6)}, {mapLng.toFixed(6)}
              </p>
            )}
          </div>
        </Section>

        {/* STATUS */}
        <Section title={t('common.status')} defaultOpen={false}>
          <div className="grid grid-cols-2">
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
        </Section>

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
