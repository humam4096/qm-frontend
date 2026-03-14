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
import { useCreateBranch, useUpdateBranch } from "../hooks/useBranches";
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
  company_id: number;
  name: string;
  logo?: FileList;
  contact_email: string;
  contact_phone: string;
  is_active: boolean;

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
  contact_email: "",
  contact_phone: "",
  is_active: true
};

export const BranchFormDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  itemToEdit = null
}) => {
  const { t } = useTranslation();

  const isEdit = !!itemToEdit;

  const branchSchema = z.object({
    company_id: isEdit ? z.any() : z.coerce.number().min(1, t("common.requiredField")),
    name: z.string().min(1, t("common.requiredField")),
    logo: z.any().optional(),
    contact_email: z.string().min(1, t("common.requiredField")).email(t("common.invalidEmail")),
    contact_phone: z.string().min(1, t("common.requiredField")).regex(/^[+\d]?\d{7,14}$/, t("common.invalidPhone")),
    is_active: z.boolean().default(true),
    
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
    formState: { errors }
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema) as any,
    defaultValues: DEFAULT_VALUES
  });

  const [selectedCompanyName, setSelectedCompanyName] = useState("");

  useEffect(() => {
    reset(itemToEdit || DEFAULT_VALUES);
  }, [itemToEdit, reset]);

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

      if (data.logo?.[0]) {
        formData.append("logo", data.logo[0]);
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
              setValue("company_id", Number(v), { shouldValidate: true });
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

        {/* Email */}
        <div className="space-y-2">
          <Label>{t("branches.email")}</Label>
          <Input {...register("contact_email")} />
          {errors.contact_email && <p className="text-destructive text-sm">{errors.contact_email.message}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label>{t("branches.phone")}</Label>
          <Input {...register("contact_phone")} />
          {errors.contact_phone && <p className="text-destructive text-sm">{errors.contact_phone.message}</p>}
        </div>

        {/* Logo */}
        <div className="space-y-2 col-span-2">
          <Label>{t("branches.logo")}</Label>
          <Input type="file" accept="image/*" {...register("logo")} />
          {errors.logo && <p className="text-destructive text-sm">{errors.logo?.message as string}</p>}
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

      {/* User Section */}
      {!isEdit && (
        <div className="mt-6 border-t pt-4 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t("users.name")}</Label>
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