import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { Complaint, CreateComplaintPayload } from '../types';
import { ActionDialog } from '@/components/ui/action-dialog';
import { ImageUploader } from '@/components/ui/image-uploader';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateComplaint, useUpdateComplaint } from '../hooks/useComplaints';
import { useKitchensList } from '@/modules/kitchens/hooks/useKitchens';
import { useGetComplaintTypesList } from '@/modules/complaint-types/hooks/useComplaintTypes';
import type { Kitchen } from '@/modules/kitchens/types';
import type { ComplaintType } from '@/modules/complaint-types/types';

interface ComplaintFormValues extends CreateComplaintPayload {
  resolution_notes?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: Complaint | null;
}


const DEFAULT_VALUES: Partial<ComplaintFormValues> = {
  kitchen_id: "",
  complaint_type_id: "",
  priority: "medium",
  description: "",
  attachments: [],
  resolution_notes: "",
};

const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const ACCEPTED_ATTACHMENT_TYPES = ["image/jpeg", "image/png", "image/webp"];


export const ComplaintFormDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  itemToEdit,
}) => {
  const { t } = useTranslation();

  const complaintSchema = z.object({
    kitchen_id: z.string().min(1, t("common.requiredField")),
    complaint_type_id: z.string().min(1, t("common.requiredField")),
    priority: z.enum(["low", "medium", "high"]),
    description: z.string().min(3, t("complaints.descriptionMustBeAtLeast3Characters")),
    attachments: z.array(z.instanceof(File)).optional(),
    resolution_notes: z.string().optional(),
  });

  const { mutateAsync: createComplaint, isPending: isCreating, error: createError } = useCreateComplaint();
  const { mutateAsync: updateComplaint, isPending: isUpdating, error: updateError } = useUpdateComplaint();

  const { data: kitchensData, isLoading: isKitchensListLoading } = useKitchensList();
  const { data: complaintTypesData, isLoading: isComplaintTypesListLoading } = useGetComplaintTypesList();

  const mutationError = createError || updateError;

  const {
    register,
    handleSubmit,
    reset,
    control,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      priority: "medium",
      attachments: [],
    },
  });

  function mapComplaintToForm(complaint: Complaint): ComplaintFormValues {
    return {
      kitchen_id: complaint.kitchen?.id
        ? String(complaint.kitchen.id)
        : "",
      complaint_type_id: complaint.complaint_type?.id
        ? String(complaint.complaint_type.id)
        : "",
      priority: complaint.priority ?? "medium",
      description: complaint.description ?? "",
      attachments: [],
      resolution_notes: complaint.resolution_notes ?? "",
    };
  }

  useEffect(() => {
    reset(itemToEdit ? mapComplaintToForm(itemToEdit) : DEFAULT_VALUES)
  }, [itemToEdit, open, reset]);

  const onSubmit = async (data: ComplaintFormValues) => {
    try {
      if (itemToEdit) {
        const { attachments: _attachments, ...updatePayload } = data;

        await updateComplaint({
          id: itemToEdit.id,
          payload: { ...updatePayload, status: 'closed' },
        });
        toast.success(t("complaints.updateSuccess"));
      } else {
        const formData = new FormData();

        formData.append("kitchen_id", data.kitchen_id);
        formData.append("complaint_type_id", data.complaint_type_id);
        formData.append("priority", data.priority);
        formData.append("description", data.description);

        data.attachments?.forEach((file) => {
          formData.append("attachments[]", file);
        });

        // for (const [key, value] of formData.entries()) {
        //   console.log(key, value);
        // }

        await createComplaint(formData);
        toast.success(t("complaints.createSuccess"));
      }
      onOpenChange(false);
      reset(DEFAULT_VALUES);
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
      submitText={itemToEdit ? t("common.resolve") : t("common.save")}
      cancelText={t("common.cancel")}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isCreating || isUpdating}
      footer
      contentClassName="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Kitchen Selection */}
        <div className="space-y-2">
          <Label htmlFor="kitchen_id">{t("complaints.kitchen")}</Label>
          <Controller
            control={control}
            name="kitchen_id"
            render={({ field }) => {
              const selectedKitchen = kitchensList.find((k: Kitchen) => k.id === field.value);
              return (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  readOnly={!!itemToEdit}
                >
                  <SelectTrigger className="w-full" id="kitchen_id">
                    <SelectValue placeholder={t("complaints.selectKitchen")}>
                      {isKitchensListLoading
                        ? t("common.loading")
                        : selectedKitchen?.name || t("complaints.selectKitchen")
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
              )
            }}
          />

          {errors.kitchen_id && (
            <p className="text-sm text-destructive">{errors.kitchen_id.message}</p>
          )}
        </div>

        {/* Complaint Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="complaint_type_id">{t("complaints.complaintType")}</Label>
          <Controller
            control={control}
            name="complaint_type_id"
            render={({ field }) => {
              const selectedComplaintType = complaintTypesList.find(
                (type: ComplaintType) => String(type.id) === field.value);
              
              return (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  readOnly={!!itemToEdit}

                >
                  <SelectTrigger className="w-full" id="complaint_type_id">
                    <SelectValue placeholder={t("complaints.selectComplaintType")}>
                      {isComplaintTypesListLoading
                        ? t("common.loading")
                        : selectedComplaintType?.name || t("complaints.selectComplaintType")
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
              )
            }}
            />
          {errors.complaint_type_id && (
            <p className="text-sm text-destructive">{errors.complaint_type_id.message}</p>
          )}
        </div>

        {/* Priority Selection */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="priority">{t("complaints.priority")}</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => {
              return (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full" id="priority">
                    <SelectValue placeholder={t("complaints.selectPriority")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="low">{t("complaints.priorityLow")}</SelectItem>
                      <SelectItem value="medium">{t("complaints.priorityMedium")}</SelectItem>
                      <SelectItem value="high">{t("complaints.priorityHigh")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )
            }}
          />
          {errors.priority && (
            <p className="text-sm text-destructive">{errors.priority.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">{t("complaints.description")}</Label>
          <Textarea
            id="description"
            readOnly={!!itemToEdit}
            placeholder={t("complaints.descriptionPlaceholder")}
            {...register("description")}
            className="min-h-24"
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        {!itemToEdit && (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="attachments">{t("complaints.attachments")}</Label>
            <Controller
              control={control}
              name="attachments"
              render={({ field }) => (
                <ImageUploader
                  value={field.value ?? []}
                  onChange={(files) => {
                    clearErrors("attachments");
                    field.onChange(files);
                  }}
                  onErrorChange={(message) => {
                    if (message) {
                      setError("attachments", {
                        type: "manual",
                        message,
                      });
                      return;
                    }

                    clearErrors("attachments");
                  }}
                  accept={ACCEPTED_ATTACHMENT_TYPES}
                  maxFiles={MAX_ATTACHMENTS}
                  maxFileSizeInBytes={MAX_ATTACHMENT_SIZE}
                  labels={{
                    title: t("complaints.attachmentsUploaderTitle"),
                    description: t("complaints.attachmentsUploaderDescription"),
                    hint: t("complaints.attachmentsUploaderHint", {
                      count: MAX_ATTACHMENTS,
                      size: 5,
                    }),
                    browse: t("complaints.attachmentsBrowse"),
                    remove: t("complaints.attachmentsRemove"),
                  }}
                  messages={{
                    invalidType: t("complaints.attachmentsInvalidType"),
                    fileTooLarge: t("complaints.attachmentsFileTooLarge", { size: 5 }),
                    tooManyFiles: t("complaints.attachmentsTooMany", { count: MAX_ATTACHMENTS }),
                  }}
                />
              )}
            />
          </div>
        )}

        {/* Resolution Notes (for edit only) */}
        {itemToEdit && (
          <div className="space-y-2 sm:col-span-2">
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
        <div className="mt-4 rounded-md border border-destructive bg-destructive/10 p-3 text-center">
          <p className="text-destructive text-sm">{mutationError.message}</p>
        </div>
      )}
    </ActionDialog>
  );
};
