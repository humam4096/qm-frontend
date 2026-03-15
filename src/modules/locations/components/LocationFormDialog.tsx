import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActionDialog } from "@/components/ui/action-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateLocation, useUpdateLocation } from "../hooks/useLocations";

interface LocationFormValues {
  name: string;
  is_active: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: any | null;
}

const DEFAULT_VALUES: Partial<LocationFormValues> = {
  name: "",
  is_active: true
};

export const LocationFormDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  itemToEdit = null
}) => {
  const { t } = useTranslation();

  const isEdit = !!itemToEdit;

  const locationSchema = z.object({
    name: z.string().min(1, t("common.requiredField")),
    is_active: z.boolean().default(true),
  });

  const { mutateAsync: createLocation, isPending: isCreating, error: createError, } = useCreateLocation();
  const { mutateAsync: updateLocation, isPending: isUpdating, error: updateError } = useUpdateLocation();

  const isLoading = isCreating || isUpdating;
  const mutationError = createError || updateError;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema) as any,
    defaultValues: DEFAULT_VALUES
  });

  useEffect(() => {
    reset(itemToEdit || DEFAULT_VALUES);
  }, [itemToEdit, reset]);

  const isActive = watch("is_active");

  const onSubmit = async (data: LocationFormValues) => {
    try {
      if (isEdit && itemToEdit?.id) {
        await updateLocation({
          id: itemToEdit.id,
          payload: {
            name: data.name,
            is_active: data.is_active ? 1 : 0
          } as any
        });

        toast.success(t("locations.updateSuccess"));
      } else {
        await createLocation({
          name: data.name,
          is_active: data.is_active ? 1 : 0
        });
        toast.success(t("locations.createSuccess"));
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
      title={isEdit ? t("locations.editLocation") : t("locations.addLocation")}
      submitText={t("common.save")}
      cancelText={t("common.cancel")}
      onSubmit={handleSubmit(onSubmit as any)}
      isLoading={isLoading}
      contentClassName="max-w-md"
      footer
    >
      <div className="space-y-4">
        {/* Location Name */}
        <div className="space-y-2">
          <Label>{t("locations.name")}</Label>
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
