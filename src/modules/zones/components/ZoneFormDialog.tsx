import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ActionDialog } from "@/components/ui/action-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

interface ZoneFormValues {
  location_id: number;
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
    location_id: z.coerce.number().min(1, t("common.requiredField")),
    code: z.string().min(1, t("common.requiredField")),
    name: z.string().min(1, t("common.requiredField")),
    map_lat: z.union([z.number(), z.string().transform(val => val ? parseFloat(val) : null)]).nullable(),
    map_lng: z.union([z.number(), z.string().transform(val => val ? parseFloat(val) : null)]).nullable(),
    is_active: z.boolean().default(true),
  });

  // get locations
  const { data: locationsListData, isLoading: isLocationsLoading } = useQuery({
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
    formState: { errors }
  } = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneSchema) as any,
    defaultValues: DEFAULT_VALUES
  });

  const [selectedLocationName, setSelectedLocationName] = useState("");

  useEffect(() => {
    reset(itemToEdit || DEFAULT_VALUES);
  }, [itemToEdit, reset]);

  const isActive = watch("is_active");

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
        await createZone(payload);
        toast.success(t("zones.createSuccess"));
      }

      onOpenChange(false);

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
          <Select onValueChange={(v) => {
            setValue("location_id", Number(v), { shouldValidate: true });
            const location = locationsList.find((l: Location) => String(l.id) === v);
            setSelectedLocationName(location?.name ?? "");
          }}>
            <SelectTrigger className="w-full space-y-2">
              <SelectValue placeholder={t("zones.selectLocation")}>
                {isLocationsLoading
                  ? t("common.loading")
                  : selectedLocationName || t("zones.selectLocation")
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {locationsList.map((location: Location) => (
                  <SelectItem key={location.id} value={String(location.id)}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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

        {/* Map Latitude */}
        <div className="space-y-2">
          <Label>{t("zones.mapLat")}</Label>
          <Input type="number" step="any" {...register("map_lat")} />
          {errors.map_lat && <p className="text-destructive text-sm">{errors.map_lat.message}</p>}
        </div>

        {/* Map Longitude */}
        <div className="space-y-2">
          <Label>{t("zones.mapLng")}</Label>
          <Input type="number" step="any" {...register("map_lng")} />
          {errors.map_lng && <p className="text-destructive text-sm">{errors.map_lng.message}</p>}
        </div>

        {/* Active */}
        <div className="space-y-2 flex flex-col justify-center">
          <Label>{t("common.active")}</Label>
          <Switch
            checked={isActive}
            onCheckedChange={(value) => setValue("is_active", value)}
          />
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