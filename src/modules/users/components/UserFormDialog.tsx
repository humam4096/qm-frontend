import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "../../../components/ui/action-dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useCreateUser, useUpdateUser } from "../hooks/useUsers";
import type { User, CreateUserPayload } from "../types";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit?: User | null;
}
const DEFAULT_VALUES: CreateUserPayload = {
  name: "",
  email: "",
  phone: "",
  role: "quality_inspector",
  zone_id: undefined,
  branch_id: undefined,
  password: "",
  password_confirmation: "",
};


export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onOpenChange,
  userToEdit,
}) => {
  const { t } = useTranslation();

  // mutations
  const { mutate: createUser, isPending: isCreating, error: createError } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating, error: updateError } = useUpdateUser();

  // state
  const isEditing = !!userToEdit;
  const isLoading = isCreating || isUpdating;
  const mutationError = createError || updateError;


  // Schema
  const userSchema = z.object({
    name: z.string().min(1, t("common.requiredField")),
    email: z.string().min(1, t("common.requiredField")).email(t("common.invalidEmail")),
    phone: z.string().min(1, t("common.requiredField")).regex(/^[+\d]?\d{7,14}$/, t("common.invalidPhone")),
    role: z.string().min(1, t("common.requiredField")),
    zone_id: z.coerce.number().optional().nullable(),
    branch_id: z.coerce.number().optional().nullable(),
    password: isEditing ? z.string().optional() : z.string().min(6, t("common.requiredField")),
    password_confirmation: isEditing ? z.string().optional() : z.string().min(6, t("common.requiredField"))
  }).refine((data) => {
    if (data.password || data.password_confirmation || !isEditing) {
        return data.password === data.password_confirmation;
    }
    return true;
  }, {
    message: t("users.passwordMismatch"),
    path: ["password_confirmation"],
  });

  // Form
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CreateUserPayload>({
    resolver: zodResolver(userSchema) as any,
    defaultValues: DEFAULT_VALUES,
  });

  // Reset form whenever dialog opens or userToEdit changes
  useEffect(() => {
    if (!open) return;
    if (userToEdit) {
      reset({
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        role: userToEdit.role,
        zone_id: userToEdit.scope?.type === "zone" ? Number(userToEdit.scope.id) : undefined,
        branch_id: userToEdit.scope?.type === "branch" ? Number(userToEdit.scope.id) : undefined,
        password: "",
        password_confirmation: "",
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [open, userToEdit, reset]);


  // Form submission
  const onSubmit = async (data: CreateUserPayload) => {
    try {
      const payload = {
        ...data,
        zone_id: data.zone_id ? Number(data.zone_id) : undefined,
        branch_id: data.branch_id ? Number(data.branch_id) : undefined,
      };

      if (isEditing && userToEdit) {
        // Remove empty passwords
        if (!payload.password) {
          delete payload.password;
          delete payload.password_confirmation;
        }
        
        await updateUser({ id: userToEdit.id, payload });
        toast.success(t("users.updatedSuccessfully"));
      } else {
        await createUser(payload);
        toast.success(t("users.createdSuccessfully"));
      }

      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || t("common.somethingWentWrong"));
    }
  };


  return (
    <ActionDialog
      isOpen={open}
      onOpenChange={onOpenChange}
      title={isEditing ? t("users.editUser") : t("users.addUser")}
      submitText={isEditing ? t("common.save") : t("users.addUser")}
      cancelText={t("common.cancel")}
      onSubmit={handleSubmit(onSubmit as any)}
      isLoading={isLoading}
      contentClassName="max-w-3xl"
      footer
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1">
          <Label>{t("users.name")}</Label>
          <Input {...register("name")} disabled={isLoading} />
          {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label>{t("users.email")}</Label>
          <Input type="email" {...register("email")} disabled={isLoading} />
          {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <Label>{t("users.phone")}</Label>
          <Input {...register("phone")} disabled={isLoading} />
          {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
        </div>

        {/* Role */}
        <div className="space-y-1">
          <Label>{t("users.role")}</Label>
          <Select
            value={watch("role")}
            onValueChange={(val) => setValue("role", val as any, { shouldValidate: true })}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder={t("users.role")} />
            </SelectTrigger>
            <SelectContent className="p-2">
              <SelectItem value="system_manager">System Manager (مدير النظام)</SelectItem>
              <SelectItem value="quality_manager">Quality Manager (مدير الجودة)</SelectItem>
              <SelectItem value="project_manager">Project Manager (مدير المشروع)</SelectItem>
              <SelectItem value="quality_supervisor">Quality Supervisor (مشرف الجودة)</SelectItem>
              <SelectItem value="quality_inspector">Quality Inspector (مفتش الجودة)</SelectItem>
              <SelectItem value="catering_manager">Catering Manager (مدير التموين)</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-destructive text-sm">{errors.role.message}</p>}
        </div>

        {/* Zone */}
        <div className="space-y-1">
          <Label>Zone ID</Label>
          <Input type="number" {...register("zone_id")} disabled={isLoading} />
          {errors.zone_id && <p className="text-destructive text-sm">{errors.zone_id.message}</p>}
        </div>

        {/* Branch */}
        <div className="space-y-1">
          <Label>Branch ID</Label>
          <Input type="number" {...register("branch_id")} disabled={isLoading} />
          {errors.branch_id && <p className="text-destructive text-sm">{errors.branch_id.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <Label>
            {t("users.password")} {isEditing && `(${t("users.leaveBlankToKeep")})`}
          </Label>
          <Input type="password" {...register("password")} disabled={isLoading} />
          {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
        </div>

        {/* Password Confirm */}
        <div className="space-y-1">
          <Label>{t("users.passwordConfirm")}</Label>
          <Input type="password" {...register("password_confirmation")} disabled={isLoading} />
          {errors.password_confirmation && <p className="text-destructive text-sm">{errors.password_confirmation.message}</p>}
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