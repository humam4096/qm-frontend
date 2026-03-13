import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "../../../components/ui/action-dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useCreateUser, useUpdateUser } from "../hooks/useUsers";
import type { User, CreateUserPayload } from "../types";
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
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  // state
  const isEditing = !!userToEdit;
  const isLoading = isCreating || isUpdating;

  // Form
  const { register, handleSubmit, reset, watch, setValue } = useForm<CreateUserPayload>({
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
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoading}
      contentClassName="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1">
          <Label>{t("users.name")}</Label>
          <Input {...register("name", { required: true })} disabled={isLoading} />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label>{t("users.email")}</Label>
          <Input type="email" {...register("email", { required: true })} disabled={isLoading} />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <Label>{t("users.phone")}</Label>
          <Input {...register("phone", { required: true })} disabled={isLoading} />
        </div>

        {/* Role */}
        <div className="space-y-1">
          <Label>{t("users.role")}</Label>
          <Select
            value={watch("role")}
            onValueChange={(val) => setValue("role", val as any)}
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
        </div>

        {/* Zone */}
        <div className="space-y-1">
          <Label>Zone ID</Label>
          <Input type="number" {...register("zone_id")} disabled={isLoading} />
        </div>

        {/* Branch */}
        <div className="space-y-1">
          <Label>Branch ID</Label>
          <Input type="number" {...register("branch_id")} disabled={isLoading} />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <Label>
            {t("users.password")} {isEditing && `(${t("users.leaveBlankToKeep")})`}
          </Label>
          <Input type="password" {...register("password", { required: !isEditing })} disabled={isLoading} />
        </div>

        {/* Password Confirm */}
        <div className="space-y-1">
          <Label>{t("users.passwordConfirm")}</Label>
          <Input type="password" {...register("password_confirmation")} disabled={isLoading} />
        </div>
      </div>
    </ActionDialog>
  );
};