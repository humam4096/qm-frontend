import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ActionDialog } from "@/components/ui/action-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import type { Company } from "../types";
import { useCreateCompany, useUpdateCompany } from "../api/company.api";
import { toast } from "sonner";

interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyToEdit?: Company | null;
}

const DEFAULT_VALUES: Partial<Company> = {
  registration_number: "",
  name: "",
  contact_phone: "",
  is_active: 1
};

export const CompanyFormDialog: React.FC<CompanyFormDialogProps> = ({
  open,
  onOpenChange,
  companyToEdit = null,
}) => {
  const { t } = useTranslation();

  const isEdit = !!companyToEdit;

  const { mutateAsync: createCompanyMutation, error: createError, isPending: isCreating } = useCreateCompany();
  const { mutateAsync: updateCompanyMutation, error: updateError, isPending: isUpdating } = useUpdateCompany();
  
  const isLoading = isCreating || isUpdating;
  const mutationError = createError || updateError;
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    setValue,
    formState: { errors } 
  } = useForm<Company>({
    defaultValues: companyToEdit || DEFAULT_VALUES
  });

  // Reset form whenever companyToEdit changes
  useEffect(() => {
    reset(companyToEdit || DEFAULT_VALUES);
  }, [companyToEdit, reset]);

  const isActive = watch("is_active");

  const onSubmit: SubmitHandler<Company> = async (data) => {
    try {
      if (isEdit && companyToEdit?.id) {
        await updateCompanyMutation({ id: companyToEdit.id, payload: data });
        toast.success(t('companies.updateSuccess'));
      } else {
        await createCompanyMutation(data);
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
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Company Name */}
        <div className="space-y-2">
          <Label>{t('companies.companyName')}</Label>
          <Input
            placeholder={t('companies.companyName')}
            {...register("name", { required: t('companies.requiredField') })}
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
            {...register("registration_number", { required: t('companies.requiredField') })}
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
            {...register("contact_phone", { required: t('companies.requiredField') })}
          />
          {errors.contact_phone && <p className="text-destructive text-sm">{errors.contact_phone.message}</p>}
        </div>

        {/* Active Toggle */}
        <div className="space-y-2 flex flex-col justify-center">
          <Label>{t('companies.active')}</Label>
          <Switch
            checked={!!isActive}
            onCheckedChange={(checked: boolean) => setValue("is_active", checked ? 1 : 0)}
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