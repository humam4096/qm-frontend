import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActionDialog } from "@/components/ui/action-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LocationPicker } from "@/components/ui/location-picker";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateZone, useUpdateZone } from "../hooks/useZones";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup
} from "@/components/ui/select";
import { LocationAPI } from "@/modules/locations/api/locations.api";
import { useQuery } from "@tanstack/react-query";
import type { Location } from "@/modules/locations/types";
import type { Zone } from "../types";

interface ZoneFormValues {
  location_id: string;
  code: string;
  name: string;
  map_lat: number | null;
  map_lng: number | null;
  is_active: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: any | null;
}

const DEFAULT_VALUES: Partial<ZoneFormValues> = {
  code: "",
  name: "",
  map_lat: null,
  map_lng: null,
  is_active: true
};

export const ZoneFormDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  itemToEdit = null
}) => {
  const { t } = useTranslation();

  const isEdit = !!itemToEdit;

  const zoneSchema = z.object({
    location_id: z.string().min(1, t("common.requiredField")),
    code: z.string().min(1, t("common.requiredField")),
    name: z.string().min(1, t("common.requiredField")),
    map_lat: z.union([z.number(), z.string().transform(val => val ? parseFloat(val) : null)]).nullable(),
    map_lng: z.union([z.number(), z.string().transform(val => val ? parseFloat(val) : null)]).nullable(),
    is_active: z.boolean().default(true),
  });

  // get locations
  const { data: locationsListData } = useQuery({
    queryKey: ['locations-list'],
    queryFn: () => LocationAPI.getLocationsList()
  });  
  
  const locationsList = locationsListData?.data ?? [];

  const { mutateAsync: createZone, isPending: isCreating, error: createError, } = useCreateZone();
  const { mutateAsync: updateZone, isPending: isUpdating, error: updateError } = useUpdateZone();

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
  } = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneSchema) as any,
    defaultValues: DEFAULT_VALUES
  });

  function mapZoneToForm(zone: Zone): ZoneFormValues {
    return {
      location_id: zone.location?.id
        ? String(zone.location.id)
        : "",
      code: zone.code ?? "",
      name: zone.name ?? "",
      map_lat: zone.map_lat ?? null,
      map_lng: zone.map_lng ?? null,
      is_active: zone.is_active ?? true,
    };
  }

  useEffect(() => {
    reset(itemToEdit ? mapZoneToForm(itemToEdit) : DEFAULT_VALUES);
  }, [itemToEdit, reset, open]);
  
  const isActive = watch("is_active");
  const mapLat = watch("map_lat");
  const mapLng = watch("map_lng");

  const handleLocationChange = (lat: number, lng: number) => {
    setValue("map_lat", lat);
    setValue("map_lng", lng);
  };

  const onSubmit = async (data: ZoneFormValues) => {
    try {
      const payload = {
        location_id: data.location_id,
        code: data.code,
        name: data.name,
        map_lat: data.map_lat,
        map_lng: data.map_lng,
        is_active: data.is_active ? 1 : 0
      };

      if (isEdit && itemToEdit?.id) {
        // UPDATE
        await updateZone({
          id: itemToEdit.id,
          payload
        });
        toast.success(t("zones.updateSuccess"));
      } else {
        // CREATE
        console.log(payload)
        await createZone(payload);
        toast.success(t("zones.createSuccess"));

      }

      onOpenChange(false);
      reset(DEFAULT_VALUES)

    } catch (err: any) {
      toast.error(err?.message || t("common.error"));
    }
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t("zones.editZone") : t("zones.addZone")}
      submitText={t("common.save")}
      cancelText={t("common.cancel")}
      onSubmit={handleSubmit(onSubmit as any)}
      isLoading={isLoading}
      contentClassName="max-w-3xl"
      footer
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Location */}
        <div className="w-full space-y-2">
          <Label>{t("zones.location")}</Label>
      
          <Controller
              control={control}
              name="location_id"
              render={({ field }) => {
                const selectedLocation = locationsList.find(
                  (k: any) => String(k.id) === String(field.value)
                );
                return (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('zones.selectLocation')}>
                        {selectedLocation?.name}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {locationsList?.map((k: Location) => (
                          <SelectItem key={k.id} value={String(k.id)}>
                            {k.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                );
              }}
            />
          {errors.location_id && <p className="text-destructive text-sm">{errors.location_id.message}</p>}
        </div>

        {/* Zone Code */}
        <div className="space-y-2">
          <Label>{t("zones.code")}</Label>
          <Input {...register("code")} />
          {errors.code && <p className="text-destructive text-sm">{errors.code.message}</p>}
        </div>

        {/* Zone Name */}
        <div className="space-y-2">
          <Label>{t("zones.name")}</Label>
          <Input {...register("name")} />
          {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
        </div>

        {/* Active */}
        <div className="space-y-2 flex flex-col justify-center">
          <Label>{t("common.active")}</Label>
          <Switch
            checked={isActive}
            onCheckedChange={(value) => setValue("is_active", value)}
          />
        </div>

        {/* Location Picker - Full Width */}
        <div className="col-span-2 space-y-2">
          <Label>{t("zones.selectLocation") || "Select Location on Map"}</Label>
          <LocationPicker
            latitude={mapLat}
            longitude={mapLng}
            onLocationChange={handleLocationChange}
            height="400px"
          />
          {(mapLat && mapLng) && (
            <p className="text-sm text-muted-foreground">
              {t("zones.coordinates") || "Coordinates"}: {mapLat.toFixed(6)}, {mapLng.toFixed(6)}
            </p>
          )}
        </div>

      </div>

      {/* Error Display */}
      {mutationError && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-destructive text-sm">{mutationError.message}</p>
        </div>
      )}
    </ActionDialog>
  );
};