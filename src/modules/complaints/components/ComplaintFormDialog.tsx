import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { Complaint } from '../types';
import { ActionDialog } from '@/components/ui/action-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateComplaint, useUpdateComplaint } from '../hooks/useComplaints';
import { useKitchensList } from '@/modules/kitchens/hooks/useKitchens';
import { useGetComplaintTypesList } from '@/modules/complaint-types/hooks/useComplaintTypes';
import type { Kitchen } from '@/modules/kitchens/types';
import type { ComplaintType } from '@/modules/complaint-types/types';

interface ComplaintFormValues {
  kitchen_id: number;
  complaint_type_id: string;
  priority: "low" | "medium" | "high";
  description: string;
  resolution_notes?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: Complaint | null;
}


export const ComplaintFormDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  itemToEdit,
}) => {
  const { t } = useTranslation();

  const complaintSchema = z.object({
    kitchen_id: z.number().min(1, t("common.requiredField")),
    complaint_type_id: z.string().min(1, t("common.requiredField")),
    priority: z.enum(["low", "medium", "high"]),
    description: z.string().min(3, t("complaints.descriptionMustBeAtLeast3Characters")),
    resolution_notes: z.string().optional(),
  });

  const [selectedKitchenName, setSelectedKitchenName] = useState("");
  const [selectedComplaintTypeName, setSelectedComplaintTypeName] = useState("");
  
  const { mutateAsync: createComplaint, isPending: isCreating, error: createError } = useCreateComplaint();
  const { mutateAsync: updateComplaint, isPending: isUpdating, error: updateError } = useUpdateComplaint();

  const { data: kitchensData, isLoading: isKitchensListLoading } = useKitchensList();
  const { data: complaintTypesData, isLoading: isComplaintTypesListLoading } = useGetComplaintTypesList();

  const mutationError = createError || updateError;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      priority: "medium",
    },
  });

  const priority = watch("priority");

  useEffect(() => {
    if (itemToEdit) {
      setValue("kitchen_id", itemToEdit.kitchen_id);
      setValue("complaint_type_id", itemToEdit.complaint_type_id);
      setValue("priority", itemToEdit.priority);
      setValue("description", itemToEdit.description);
      setValue("resolution_notes", itemToEdit.resolution_notes || "");
    } else {
      reset();
    }
  }, [itemToEdit, open, setValue, reset]);

  const onSubmit = async (data: ComplaintFormValues) => {
    console.log(data) 
    try {
      if (itemToEdit) {
        await updateComplaint({
          id: itemToEdit.id,
          payload: data,
        });
        toast.success(t("complaints.updateSuccess"));
      } else {
        await createComplaint(data);
        toast.success(t("complaints.createSuccess"));
      }
      onOpenChange(false);
      reset();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        t("common.unexpectedError");
      toast.error(message);
    }
  };

  const kitchensList = kitchensData?.data ?? [];
  const complaintTypesList = complaintTypesData?.data ?? [];

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={itemToEdit ? t("complaints.editComplaint") : t("complaints.addComplaint")}
      description={itemToEdit ? t("complaints.editComplaintDesc") : t("complaints.addComplaintDesc")}
      submitText={t("common.save")}
      cancelText={t("common.cancel")}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isCreating || isUpdating}
      footer
      contentClassName="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        {/* Kitchen Selection */}
        <div className="space-y-2">
          <Label htmlFor="kitchen_id">{t("complaints.kitchen")}</Label>
          <Select
            // value={kitchenId?.toString() || ""}
            onValueChange={(value) => {
              setValue("kitchen_id", Number(value), { shouldValidate: true });
              const kitchen = kitchensList.find((k: Kitchen) => String(k.id) === value);
              setSelectedKitchenName(kitchen?.name ?? "");
            }}
          >
            <SelectTrigger className="w-full" id="kitchen_id">
              <SelectValue placeholder={t("complaints.selectKitchen")}>
                {isKitchensListLoading
                  ? t("common.loading")
                  : selectedKitchenName || t("complaints.selectKitchen")
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {kitchensList.map((kitchen: Kitchen) => (
                  <SelectItem key={kitchen?.id} value={kitchen?.id.toString()}>
                    {kitchen?.name}
                  </SelectItem>
              ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.kitchen_id && (
            <p className="text-sm text-destructive">{errors.kitchen_id.message}</p>
          )}
        </div>

        {/* Complaint Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="complaint_type_id">{t("complaints.complaintType")}</Label>
          <Select
            // value={complaintTypeId || ""}
            onValueChange={(value) => {
              console.log('complaint type value', value)
              setValue("complaint_type_id", String(value), { shouldValidate: true });
              const complaintType = complaintTypesList.find((type: ComplaintType) => String(type.id) === value);
              setSelectedComplaintTypeName(complaintType?.name ?? "");
            }}
          >
            <SelectTrigger className="w-full" id="complaint_type_id">
              <SelectValue placeholder={t("complaints.selectComplaintType")}>
                {isComplaintTypesListLoading
                  ? t("common.loading")
                  : selectedComplaintTypeName || t("complaints.selectComplaintType")
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {complaintTypesList.map((type: ComplaintType) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.complaint_type_id && (
            <p className="text-sm text-destructive">{errors.complaint_type_id.message}</p>
          )}
        </div>

        {/* Priority Selection */}
        <div className="space-y-2">
          <Label htmlFor="priority">{t("complaints.priority")}</Label>
          <Select value={priority} onValueChange={(value: any) => setValue("priority", value)}>
            <SelectTrigger className="w-full" id="priority">
              <SelectValue placeholder={t("complaints.selectPriority")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="low">{t("complaints.priorityLow")}</SelectItem>
                <SelectItem value="medium">{t("complaints.priorityMedium")}</SelectItem>
                <SelectItem value="high">{t("complaints.priorityHigh")}</SelectItem>
                {/* <SelectItem value="critical">{t("complaints.priorityCritical")}</SelectItem> */}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.priority && (
            <p className="text-sm text-destructive">{errors.priority.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">{t("complaints.description")}</Label>
          <Textarea
            id="description"
            placeholder={t("complaints.descriptionPlaceholder")}
            {...register("description")}
            className="min-h-24"
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* Resolution Notes (for edit only) */}
        {itemToEdit && (
          <div className="space-y-2">
            <Label htmlFor="resolution_notes">{t("complaints.resolutionNotes")}</Label>
            <Textarea
              id="resolution_notes"
              placeholder={t("complaints.resolutionNotesPlaceholder")}
              {...register("resolution_notes")}
              className="min-h-24"
            />
            {errors.resolution_notes && (
              <p className="text-sm text-destructive">{errors.resolution_notes.message}</p>
            )}
          </div>
        )}
      </form>

      {/* Error Display */}
      {mutationError && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-md text-center">
          <p className="text-destructive text-sm">{mutationError.message}</p>
        </div>
      )}
    </ActionDialog>
  );
};
