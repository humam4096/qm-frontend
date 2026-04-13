import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ActionDialog } from "@/components/ui/action-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import type { InspectionStage, InspectionStageForm } from "../types";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateInspectionStage, useUpdateInspectionStage } from "../hooks/useInspectionStages";

interface InspectionStageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: InspectionStage | null;
}

const DEFAULT_VALUES: Partial<InspectionStageForm> = {
  name: "",
  description: "",
  sequence_order: 1,
  allowed_early_minutes: 0,
  allowed_delay_minutes: 0,
  requires_notification: false,
  is_active: true,
  is_for_hajj: false
};

export const InspectionStageFormDialog: React.FC<InspectionStageFormDialogProps> = ({
  open,
  onOpenChange,
  itemToEdit = null,
}) => {
  const { t } = useTranslation();
  const isEdit = !!itemToEdit;

  const { mutateAsync: createMutation, isPending: isCreating } = useCreateInspectionStage();
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateInspectionStage();
  
  const isLoading = isCreating || isUpdating;

  const schema = z.object({
    name: z.string().min(1, t('common.requiredField')),
    description: z.string().min(1, t('common.requiredField')),
    sequence_order: z.preprocess(
      (val) => (val === '' || val === null || val === undefined) ? 1 : Number(val),
      z.number().min(1, t('inspectionStages.sequenceOrderMin'))
    ),
    allowed_early_minutes: z.preprocess(
      (val) => (val === '' || val === null || val === undefined) ? 0 : Number(val),
      z.number().min(0, t('inspectionStages.minutesMin'))
    ),
    allowed_delay_minutes: z.preprocess(
      (val) => (val === '' || val === null || val === undefined) ? 0 : Number(val),
      z.number().min(0, t('inspectionStages.minutesMin'))
    ),
    requires_notification: z.union([z.boolean(), z.number()]).default(false),
    is_active: z.union([z.boolean(), z.number()]).default(true),
    is_for_hajj: z.union([z.boolean(), z.number()]).default(false)
  });

  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm<InspectionStageForm>({
    resolver: zodResolver(schema) as any,
    defaultValues: itemToEdit || DEFAULT_VALUES
  });

  function mapStageToForm(stage: InspectionStage): InspectionStageForm {
      return {
        name: stage.name,
        description: stage.description,
        sequence_order: stage.sequence_order,
        allowed_early_minutes: stage.timing.allowed_early_minutes,
        allowed_delay_minutes: stage.timing.allowed_delay_minutes,
        requires_notification: stage.timing.requires_notification,
        is_active: stage.is_active,
        is_for_hajj: stage.is_for_hajj
      };
    }

  useEffect(() => {
    reset(itemToEdit ? mapStageToForm(itemToEdit) : DEFAULT_VALUES);
  }, [itemToEdit, reset, open]);

  const isActive = watch("is_active");
  const requiresNotification = watch("requires_notification");
  const isForHajj = watch("is_for_hajj");

  const onSubmit: SubmitHandler<InspectionStageForm> = async (formData) => {
    try {
      if (isEdit && itemToEdit?.id) {
        await updateMutation({ id: itemToEdit.id, payload: formData });
        toast.success(t('inspectionStages.updateSuccess'));
      } else {
        await createMutation(formData);
        toast.success(t('inspectionStages.createSuccess'));
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || t('common.error'));
    }
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('inspectionStages.editStage') : t('inspectionStages.addNewStage')}
      submitText={isEdit ? t('common.save') : t('inspectionStages.addStage')}
      cancelText={t('common.cancel')}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      contentClassName="max-w-2xl"
      footer
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2">
          <Label>{t('inspectionStages.name')}</Label>
          <Input placeholder={t('inspectionStages.name')} {...register("name")} />
          {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
        </div>

        {/* Sequence Order */}
        <div className="space-y-2">
          <Label>{t('inspectionStages.sequenceOrder')}</Label>
          <Input type="number" placeholder="1" {...register("sequence_order")} />
          {errors.sequence_order && <p className="text-destructive text-sm">{errors.sequence_order.message}</p>}
        </div>

        {/* Allowed Early Minutes */}
        <div className="space-y-2">
          <Label>{t('inspectionStages.allowedEarlyMinutes')}</Label>
          <Input type="number" placeholder="0" {...register("allowed_early_minutes")} />
          {errors.allowed_early_minutes && <p className="text-destructive text-sm">{errors.allowed_early_minutes.message}</p>}
        </div>

        {/* Allowed Delay Minutes */}
        <div className="space-y-2">
          <Label>{t('inspectionStages.allowedDelayMinutes')}</Label>
          <Input type="number" placeholder="0" {...register("allowed_delay_minutes")} />
          {errors.allowed_delay_minutes && <p className="text-destructive text-sm">{errors.allowed_delay_minutes.message}</p>}
        </div>
      </div>

      {/* Description - Full Width */}
      <div className="space-y-2 mt-4">
        <Label>{t('inspectionStages.description')}</Label>
        <textarea
          placeholder={t('inspectionStages.description')}
          className="w-full px-3 py-2 border rounded-md text-sm"
          rows={3}
          {...register("description")}
        />
        {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label>{t('inspectionStages.requiresNotification')}</Label>
          <Switch
            checked={requiresNotification}
            onCheckedChange={(value) => setValue("requires_notification", value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>{t('inspectionStages.isForHajj')}</Label>
          <Switch
            checked={isForHajj}
            onCheckedChange={(value) => setValue("is_for_hajj", value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>{t('common.active')}</Label>
          <Switch
            checked={isActive}
            onCheckedChange={(value) => setValue("is_active", value)}
          />
        </div>
      </div>
    </ActionDialog>
  );
};
