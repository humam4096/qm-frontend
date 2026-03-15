import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ActionDialog } from "@/components/ui/action-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import type { ComplaintType } from "../types";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateComplaintType, useUpdateComplaintType } from "../hooks/useComplaintTypes";

interface ComplaintTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: ComplaintType | null;
}

const DEFAULT_VALUES: Partial<ComplaintType> = {
  name: "",
  description: "",
  is_active: true
};

export const ComplaintTypeFormDialog: React.FC<ComplaintTypeFormDialogProps> = ({
  open,
  onOpenChange,
  itemToEdit = null,
}) => {
  const { t } = useTranslation();

  const isEdit = !!itemToEdit;

  const { mutateAsync: createMutation, error: createError, isPending: isCreating } = useCreateComplaintType();
  const { mutateAsync: updateMutation, error: updateError, isPending: isUpdating } = useUpdateComplaintType();
  
  const isLoading = isCreating || isUpdating;
  const mutationError = createError || updateError;
  
  const complaintTypeSchema = z.object({
    name: z.string().min(1, t('complaintTypes.requiredField')),
    description: z.string().min(1, t('complaintTypes.requiredField')),
    is_active: z.union([z.boolean(), z.number()]).default(true)
  });

  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm<ComplaintType>({
    resolver: zodResolver(complaintTypeSchema) as any,
    defaultValues: itemToEdit || DEFAULT_VALUES
  });

  useEffect(() => {
    reset(itemToEdit || DEFAULT_VALUES);
  }, [itemToEdit, reset]);

  const isActive = watch("is_active");

  const onSubmit: SubmitHandler<ComplaintType> = async (formData) => {
    try {
      if (isEdit && itemToEdit?.id) {
        await updateMutation({ id: itemToEdit.id, payload: formData });
        toast.success(t('complaintTypes.updateSuccess'));
      } else {
        await createMutation(formData);
        toast.success(t('complaintTypes.createSuccess'));
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || t('complaintTypes.error'));
    }
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('complaintTypes.editComplaintType') : t('complaintTypes.addNewComplaintType')}
      submitText={isEdit ? t('complaintTypes.saveChanges') : t('complaintTypes.addComplaintType')}
      cancelText={t('complaintTypes.cancel')}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      contentClassName="max-w-2xl"
      footer
    >
      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label>{t('complaintTypes.name')}</Label>
          <Input
            placeholder={t('complaintTypes.name')}
            {...register("name")}
          />
          {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>{t('complaintTypes.description')}</Label>
          <textarea
            placeholder={t('complaintTypes.description')}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={3}
            {...register("description")}
          />
          {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
        </div>

        {/* Active Toggle */}
        <div className="space-y-2 flex flex-col justify-center">
          <Label>{t('complaintTypes.active')}</Label>
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
