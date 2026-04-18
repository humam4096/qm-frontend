import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActionDialog } from "@/components/ui/action-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBranch, useUpdateBranch } from "../hooks/useBranches";
import { ImageUploader } from "@/components/ui/image-uploader";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup
} from "@/components/ui/select";
import { CompanyAPI } from "@/modules/companies/api/company.api";
import { useQuery } from "@tanstack/react-query";
import type { Company } from "../types";

interface BranchFormValues {
  company_id: string;
  name: string;
  logo?: File;
  is_active: boolean;
  contact_email: string;
  contact_phone: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  user_password: string;
  user_password_confirmation: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: any | null;
}

const DEFAULT_VALUES: Partial<BranchFormValues> = {
  name: "",
  is_active: true,
  contact_email: "",
  contact_phone: "",
  logo: undefined,
  user_name: "",
  user_phone: "",
  user_email: "",
  user_password: "",
  user_password_confirmation: ""
};

export const BranchFormDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  itemToEdit = null
}) => {
  const { t } = useTranslation();

  const isEdit = !!itemToEdit;

  const ACCEPTED_LOGO_TYPES = ["image/jpeg", "image/png"];
  const MAX_LOGO_SIZE = 5 * 1024 * 1024;

  const branchSchema = z.object({
    company_id: isEdit ? z.any() : z.coerce.string().min(1, t("common.requiredField")),
    name: z.string().min(1, t("common.requiredField")),
    logo: z.any().optional(),
    is_active: z.boolean().default(true),
    contact_email: z.string().email(t("common.invalidEmail")),
    contact_phone: z.string().min(1, t("common.requiredField")).regex(/^[+\d]?\d{7,14}$/, t("common.invalidPhone")),
    user_name: isEdit ? z.any() : z.string().min(1, t("common.requiredField")),
    user_phone: isEdit ? z.any() : z.string().min(1, t("common.requiredField")).regex(/^[+\d]?\d{7,14}$/, t("common.invalidPhone")),
    user_email: isEdit ? z.any() : z.string().min(1, t("common.requiredField")).email(t("common.invalidEmail")),
    user_password: isEdit ? z.any() : z.string().min(6, t("common.requiredField")),
    user_password_confirmation: isEdit ? z.any() : z.string().min(6, t("common.requiredField"))
  }).refine((data) => {
    if (!isEdit && data.user_password !== data.user_password_confirmation) {
      return false;
    }
    return true;
  }, {
    message: t("users.passwordMismatch"),
    path: ["user_password_confirmation"],
  });

  // get companies
  const { data: companiesListData, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ['companies-list'],
    queryFn: () => CompanyAPI.getCompaniesList()
  });  
  
  const companiesList = companiesListData?.data ?? [];

  const { mutateAsync: createBranch, isPending: isCreating, error: createError, } = useCreateBranch();
  const { mutateAsync: updateBranch, isPending: isUpdating, error: updateError } = useUpdateBranch();

  const isLoading = isCreating || isUpdating;
  const mutationError = createError || updateError;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    clearErrors,
    setError,
    formState: { errors }
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema) as any,
    defaultValues: DEFAULT_VALUES
  });

  const [selectedCompanyName, setSelectedCompanyName] = useState("");

  function mapBranchToForm(branch: any): Partial<BranchFormValues> {
    return {
      ...DEFAULT_VALUES,
      ...branch,
      company_id: branch?.company_id
        ? String(branch.company_id)
        : branch?.company?.id
          ? String(branch.company.id)
          : "",
      is_active:
        typeof branch?.is_active === "boolean"
          ? branch.is_active
          : branch?.is_active != null
            ? Boolean(Number(branch.is_active))
            : DEFAULT_VALUES.is_active,
      logo: undefined,
    };
  }

  useEffect(() => {
    reset(itemToEdit ? mapBranchToForm(itemToEdit) : DEFAULT_VALUES);
  }, [itemToEdit, open, reset]);

  const isActive = watch("is_active");

  const onSubmit = async (data: BranchFormValues) => {
    try {
      const formData = new FormData();

      // only send company_id on create
      if (!isEdit) {
        formData.append("company_id", String(data.company_id));
      }
      
      formData.append("name", data.name);
      formData.append("contact_email", data.contact_email);
      formData.append("contact_phone", data.contact_phone);
      formData.append("is_active", data.is_active ? "1" : "0");

      if (data.logo) {
        formData.append("logo", data.logo);
      }

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      if (isEdit && itemToEdit?.id) {
        // UPDATE → only allowed fields
        await updateBranch({
          id: itemToEdit.id,
          payload: formData
        });

        toast.success(t("branches.updateSuccess"));
      } else {
        // CREATE → include user fields
        formData.append("contact_email", data.contact_email);
        formData.append("contact_phone", data.contact_phone);
        formData.append("user[name]", data.user_name);
        formData.append("user[phone]", data.user_phone);
        formData.append("user[email]", data.user_email);
        formData.append("user[password]", data.user_password);
        formData.append(
          "user[password_confirmation]",
          data.user_password_confirmation
        );

        await createBranch(formData);
        toast.success(t("branches.createSuccess"));
      }

      reset(DEFAULT_VALUES);
      setSelectedCompanyName("");

      onOpenChange(false);

    } catch (err: any) {
      toast.error(err?.message || t("common.error"));
    }
  };

  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t("branches.editBranch") : t("branches.addBranch")}
      submitText={t("common.save")}
      cancelText={t("common.cancel")}
      onSubmit={handleSubmit(onSubmit as any)}
      isLoading={isLoading}
      contentClassName="max-w-3xl"
      footer
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Company */}
        {!isEdit && (
          <div className="w-full space-y-2">
            <Label>{t("branches.company")}</Label>
            <Select onValueChange={(v) => {
              setValue("company_id", String(v), { shouldValidate: true });
              const company = companiesList.find((c: any) => String(c.id) === v);
              setSelectedCompanyName(company?.name ?? "");
            }}>
              <SelectTrigger className="w-full space-y-2">
                <SelectValue placeholder={t("branches.selectCompany")}>
                  {isCompaniesLoading
                    ? t("common.loading")
                    : selectedCompanyName || t("branches.selectCompany")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {companiesList.map((company: Company) => (
                    <SelectItem key={company.id} value={String(company.id)}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.company_id && <p className="text-destructive text-sm">{errors.company_id.message}</p>}
          </div>
       )}

        {/* Branch Name */}
        <div className="space-y-2">
          <Label>{t("branches.name")}</Label>
          <Input {...register("name")} />
          {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
        </div>

        {/* Contact Email */}
        <div className="space-y-2">
          <Label>{t("branches.contactEmail")}</Label>
          <Input {...register("contact_email")} />
          {errors.contact_email && <p className="text-destructive text-sm">{errors.contact_email.message}</p>}
        </div>

        {/* Contact Phone */}
        <div className="space-y-2">
          <Label>{t("branches.contactPhone")}</Label>
          <Input {...register("contact_phone")} />
          {errors.contact_phone && <p className="text-destructive text-sm">{errors.contact_phone.message}</p>}
        </div>

        {/* Active */}
        <div className="space-y-2 flex flex-col justify-center">
          <Label>{t("common.active")}</Label>
          <Switch
            checked={isActive}
            onCheckedChange={(value) => setValue("is_active", value)}
          />
        </div>

        {/* Logo */}
        <div className="space-y-2 col-span-2">
          <Label className="mb-4">{t("branches.logo")}</Label>
          <Controller
            control={control}
            name="logo"
            render={({ field }) => (
              <ImageUploader
                value={field.value ? [field.value] : []}
                onChange={(files) => {
                  clearErrors("logo");
                  field.onChange(files[0]);
                }}
                onErrorChange={(message) => {
                  if (message) {
                    setError("logo", { type: "manual", message });
                    return;
                  }
                  clearErrors("logo");
                }}
                accept={ACCEPTED_LOGO_TYPES}
                maxFiles={1}
                maxFileSizeInBytes={MAX_LOGO_SIZE}
                       labels={{
                    title: t("complaints.attachmentsUploaderTitle"),
                    description: t("complaints.attachmentsUploaderDescription"),
                    hint: t("complaints.attachmentsUploaderHint", {
                      count: 1,
                      size: 5,
                    }),
                    browse: t("complaints.attachmentsBrowse"),
                    remove: t("complaints.attachmentsRemove"),
                  }}
                  messages={{
                    invalidType: t("complaints.attachmentsInvalidType"),
                    fileTooLarge: t("complaints.attachmentsFileTooLarge", { size: 5 }),
                    tooManyFiles: t("complaints.attachmentsTooMany", { count: 1 }),
                  }}
              />
            )}
          />
          {errors.logo && <p className="text-destructive text-sm">{errors.logo?.message as string}</p>}
        </div>

 

      </div>

      {/* User Section */}
      {!isEdit && (
        <div className="mt-6 border-t pt-4 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t("users.username")}</Label>
            <Input {...register("user_name")} />
            {errors.user_name && <p className="text-destructive text-sm">{errors.user_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t("users.phone")}</Label>
            <Input {...register("user_phone")} />
            {errors.user_phone && <p className="text-destructive text-sm">{errors.user_phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t("users.email")}</Label>
            <Input {...register("user_email")} />
            {errors.user_email && <p className="text-destructive text-sm">{errors.user_email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t("users.password")}</Label>
            <Input type="password" {...register("user_password")} />
            {errors.user_password && <p className="text-destructive text-sm">{errors.user_password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t("users.passwordConfirm")}</Label>
            <Input type="password" {...register("user_password_confirmation")} />
            {errors.user_password_confirmation && (
              <p className="text-destructive text-sm">
                {errors.user_password_confirmation.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {mutationError && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-destructive text-sm">{mutationError.message}</p>
        </div>
      )}
    </ActionDialog>
  );
};