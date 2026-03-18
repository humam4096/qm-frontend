import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActionDialog } from "../../../components/ui/action-dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useCreateUser, useUpdateUser } from "../hooks/useUsers";
import type { User, CreateUserPayload, UserRole } from "../types";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";
import { useZonesList } from "@/modules/zones/hooks/useZones";
import type { Zone } from "@/modules/zones/types";
import type { Branch } from "@/modules/branches/types";
import { useBranchesList } from "@/modules/branches/hooks/useBranches";
import { getCreatableRoles, getRequiredFields } from "../utils/roleUtils";
import { useAuthStore } from "@/app/store/useAuthStore";
import { ErrorMsg } from "@/components/dashboard/ErrorMsg";
import { buildUserPayload } from "../utils/build-user-payload";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit?: User | null;
}
const DEFAULT_VALUES: CreateUserPayload = {
  name: "",
  email: "",
  phone: "",
  role: "",
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

  // roles data for select dropdown
  const rolesData = useMemo(() => [
    { id: "system_manager", name: t("users.systemManager") },
    { id: "quality_manager", name: t("users.qualityManager") },
    { id: "project_manager", name: t("users.projectManager") },
    { id: "quality_supervisor", name: t("users.qualitySupervisor") },
    { id: "quality_inspector", name: t("users.qualityInspector") },
    { id: "catering_manager", name: t("users.cateringManager") },
  ], [t]);


  const { user } = useAuthStore();
  
  // mutations
  const { mutate: createUser, isPending: isCreating, error: createError } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating, error: updateError } = useUpdateUser();

  const { data: zonesList, isLoading: zonesListLoading } = useZonesList();
  const { data: branchesList, isLoading: branchesListLoading } = useBranchesList();

  // state
  const isEditing = !!userToEdit;
  const isLoading = isCreating || isUpdating;
  const mutationError = createError || updateError;


  // Schema
  const userSchema = useMemo(() => z.object({
    name: z.string().min(1, t("common.requiredField")),
    email: z.string().min(1, t("common.requiredField")).email(t("common.invalidEmail")),
    phone: z.string().min(1, t("common.requiredField")).regex(/^[+\d]?\d{7,14}$/, t("common.invalidPhone")),
    role: z.string().min(1, t("common.requiredField")),
    zone_id: z.coerce.string().optional().nullable(),
    branch_id: z.coerce.string().optional().nullable(),
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
  }).superRefine((data, ctx) => {
    const requiredFields = getRequiredFields(data.role)
    requiredFields.forEach((field) => {
      if (!data[field as keyof typeof data]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("common.requiredField"),
          path: [field],
        });
      }
    });
  }), [t, isEditing]); 

  // Form
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CreateUserPayload>({
    resolver: zodResolver(userSchema) as any,
    defaultValues: DEFAULT_VALUES,
  });

  // watch role changes & conditoinal inputs
  const selectedRole = watch("role");
  // Available roles that the current user can create
  const availableRoles = getCreatableRoles(user?.role ?? "");
  // what fields are required for the selected role
  const requiredFields: string[] = getRequiredFields(selectedRole);

  // check if zone and branch are required for the selected role
  const isZoneRequired = requiredFields.includes("zone_id");
  const isBranchRequired = requiredFields.includes("branch_id");

  //  get the selected zone and branch and rold data
  const selectedZone = zonesList?.data.find((z) => z.id === watch("zone_id"));
  const selectedBranch = branchesList?.data.find((b) => b.id === watch("branch_id"));
  const selectedRoleData = rolesData.find((r: {id: string, name: string}) => r.id === selectedRole);

  // Reset form whenever dialog opens or userToEdit changes
  useEffect(() => {
    if (!open) return;
    if (userToEdit) {
      reset({
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        role: userToEdit.role,
        zone_id: userToEdit.scope?.type === "zone" ? userToEdit.scope.id : undefined,
        branch_id: userToEdit.scope?.type === "branch" ? userToEdit.scope.id : undefined,
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

      const payload = buildUserPayload(data, isZoneRequired, isBranchRequired);

      // update user
      if (isEditing && userToEdit) {
        // Remove empty passwords
        if (!payload.password) {
          delete payload.password;
          delete payload.password_confirmation;
        }
        
        console.log("updateUser", { id: userToEdit.id, payload })
        await updateUser({ id: userToEdit.id, payload });
        toast.success(t("users.updatedSuccessfully"));

      } else {
        // create user
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
            value={String(watch("role") ?? "")}
            onValueChange={(val) => {
              setValue("role", val as UserRole, { shouldValidate: true });
              
              // reset dependent fields
              setValue("zone_id", null);
              setValue("branch_id", null);
            }}
            disabled={isLoading || isEditing}
          >
            <SelectTrigger className="w-full cursor-pointer">
               <SelectValue placeholder={t("users.userRole")}>
                {selectedRoleData?.name || t("users.userRole")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="p-2">
              {availableRoles.map((role: UserRole) => {
                const roleData = rolesData.find((r: {id: string, name: string}) => r.id === role);
                return (
                  <SelectItem key={roleData?.id} value={roleData?.id}>
                    {roleData?.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.role && <p className="text-destructive text-sm">{errors.role.message}</p>}
        </div>

        {/* Zone */}
        {isZoneRequired && <div className="col-span-2 space-y-1">
          <Label>{t("zones.zone")}</Label>
          <Select 
            value={String(watch("zone_id") ?? "")}
            onValueChange={(v) => {
            setValue("zone_id", v as any, { shouldValidate: true });
          }}>
            <SelectTrigger className="w-full space-y-2">
              <SelectValue placeholder={t("zones.selectZone")}>
                {zonesListLoading
                  ? t("common.loading")
                  : selectedZone?.name || t("zones.selectZone")
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {zonesList?.data.map((zone: Zone) => (
                  <SelectItem key={zone.id} value={String(zone.id)}>
                    {zone.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.zone_id && <p className="text-destructive text-sm">{errors.zone_id.message}</p>}
        </div>}

        {/* Branch */}
        {isBranchRequired && <div className="col-span-2 space-y-1">
          <Label>{t("branches.branch")}</Label>
          <Select 
            value={String(watch("branch_id") ?? "")}
            onValueChange={(v) => {
            setValue("branch_id", v as any, { shouldValidate: true });
          }}>
            <SelectTrigger className="w-full space-y-2">
              <SelectValue placeholder={t("branches.selectBranch")}>
                {branchesListLoading
                  ? t("common.loading")
                  : selectedBranch?.name || t("branches.selectBranch")
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {branchesList?.data.map((branch: Branch) => (
                  <SelectItem key={branch.id} value={String(branch.id)}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.branch_id && <p className="text-destructive text-sm">{errors.branch_id.message}</p>}</div>}

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
        <ErrorMsg message={mutationError?.message} />
      )}
    </ActionDialog>
  );
};