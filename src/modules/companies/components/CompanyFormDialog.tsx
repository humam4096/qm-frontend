
import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ActionDialog } from "@/components/ui/action-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import type { Company } from "../types";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCompany, useUpdateCompany } from "../hooks/useCompay";

interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: Company | null;
}

const DEFAULT_VALUES: Partial<Company> = {
  registration_number: "",
  name: "",
  contact_phone: "",
  is_active: true
};

export const CompanyFormDialog: React.FC<CompanyFormDialogProps> = ({
  open,
  onOpenChange,
  itemToEdit = null,
}) => {
  const { t } = useTranslation();

  const isEdit = !!itemToEdit;

  const { mutateAsync: createCompanyMutation, error: createError, isPending: isCreating } = useCreateCompany();
  const { mutateAsync: updateCompanyMutation, error: updateError, isPending: isUpdating } = useUpdateCompany();
  
  const isLoading = isCreating || isUpdating;
  const mutationError = createError || updateError;
  
  const companySchema = z.object({
    name: z.string().min(1, t('companies.requiredField')),
    registration_number: z.string().min(1, t('companies.requiredField')),
    contact_phone: z.string().min(1, t('companies.requiredField')).regex(/^[+\d]?\d{7,14}$/, t("common.invalidPhone")),
    is_active: z.union([z.boolean(), z.number()]).default(true)
  });

  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm<Company>({
    resolver: zodResolver(companySchema) as any,
    defaultValues: itemToEdit || DEFAULT_VALUES
  });

  // Reset form whenever itemToEdit changes
  useEffect(() => {
    reset(itemToEdit || DEFAULT_VALUES);
  }, [itemToEdit, reset]);

  const isActive = watch("is_active");

  const onSubmit: SubmitHandler<Company> = async (formData) => {
    try {
      
      if (isEdit && itemToEdit?.id) {
        await updateCompanyMutation({ id: itemToEdit.id, payload: formData });
        toast.success(t('companies.updateSuccess'));
      } else {
        await createCompanyMutation(formData);
        toast.success(t('companies.createSuccess'));
      }
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || t('companies.error'));
    }
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('companies.editCompany') : t('companies.addNewCompany')}
      submitText={isEdit ? t('companies.saveChanges') : t('companies.addCompany')}
      cancelText={t('companies.cancel')}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      contentClassName="max-w-2xl"
      footer
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Company Name */}
        <div className="space-y-2">
          <Label>{t('companies.companyName')}</Label>
          <Input
            placeholder={t('companies.companyName')}
            {...register("name")}
          />
          {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
        </div>

        {/* Registration Number */}
        <div className="space-y-2">
          <Label>{t('companies.crNumber')}</Label>
          <Input
            placeholder={t('companies.crPlaceholder', { defaultValue: 'CR-XXXX-XXX' })}
            type="text"
            dir="ltr"
            className="text-left"
            {...register("registration_number")}
          />
          {errors.registration_number && <p className="text-destructive text-sm">{errors.registration_number.message}</p>}
        </div>

        {/* Contact Phone */}
        <div className="space-y-2">
          <Label>{t('companies.contactNumber')}</Label>
          <Input
            placeholder={t('companies.phonePlaceholder', { defaultValue: '+966XXXXXXXXX' })}
            type="text"
            dir="ltr"
            className="text-left"
            {...register("contact_phone")}
          />
          {errors.contact_phone && <p className="text-destructive text-sm">{errors.contact_phone.message}</p>}
        </div>

        {/* Active Toggle */}
        <div className="space-y-2 flex flex-col justify-center">
          <Label>{t('companies.active')}</Label>
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