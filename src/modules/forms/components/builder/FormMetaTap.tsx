import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormBuilderContext } from "../../context/FormBuilderContext";
import { FormStepLayout } from "./FormStepLayout";
import { useGetFormById } from "../../hooks/useForms";
import { FormMetaSkeleton } from "../skeleton/FormMetaSkeleton";

const USER_ROLES = [
  'system_manager',
  'catering_manager',
  'project_manager',
  'quality_manager',
  'quality_supervisor',
  'quality_inspector',
] as const;

const FORM_TYPES = [
  'report',
  'readiness_assessment',
] as const;

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  user_role: z.enum(USER_ROLES),
  form_type: z.enum(FORM_TYPES),
  is_active: z.boolean(),
});

type FormMetaValues = z.infer<typeof schema>;

export const FormMetaTab = () => {


  const { form, updateForm, nextStep, formId, setEntireForm } = useFormBuilderContext();
const [initialized, setInitialized] = useState(false);


  const { data: formResponse, isLoading: isLoadingForm } = useGetFormById(formId!);
  const existingForm = formResponse?.data;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormMetaValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      user_role: "quality_manager",
      form_type: "report",
      is_active: true,
    },
  });

  const isActive = watch("is_active");

  //  Initialize builder state once from existingForm
  useEffect(() => {
    if (!existingForm || initialized) return;
    setEntireForm(existingForm);
    setInitialized(true);
  }, [existingForm, initialized, setEntireForm]);

  //  Sync RHF values to reflect builder state initially
  useEffect(() => {
    reset({
      name: form.name,
      description: form.description,
      user_role: form.user_role,
      form_type: form.form_type,
      is_active: form.is_active,
    });
  }, [form, reset]);

  // update form meta data
  const onSubmit = (data: FormMetaValues) => {
    updateForm(data);
    nextStep();
  };

  if (isLoadingForm) {
    return (
      <FormStepLayout
        title="Form Meta"
        description="Form Meta"
        onNext={() => {}}
      >
        <FormMetaSkeleton />
      </FormStepLayout>
    );
  }

  return (
    <FormStepLayout
      title="Form Meta"
      description="Form Meta"
      onNext={handleSubmit(onSubmit)}
    >
      <form
        className="space-y-6 max-w-2xlx"
      >
        {/* Name */}
        <div className="space-y-1">
          <Label>Form Name</Label>
          <Input {...register("name")} />
          {errors.name && (
            <p className="text-destructive text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label>Description</Label>
          <Input {...register("description")} />
        </div>

        {/* Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>User Role</Label>
            <select
              {...register("user_role")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="project_manager">Project Manager</option>
              <option value="quality_manager">Quality Manager</option>
              <option value="quality_supervisor">Supervisor</option>
              <option value="quality_inspector">Inspector</option>
            </select>
          </div>

          {/* Form Type */}
          <div className="space-y-1">
            <Label>Form Type</Label>
            <select
              {...register("form_type")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="report">Report</option>
              <option value="readiness_assessment">Readiness Assessment</option>
            </select>
          </div>
        </div>

        {/* Active */}
        <div className="flex items-center justify-between">
          <Label>Active</Label>
          <Switch
            checked={isActive}
            onCheckedChange={(v) => setValue("is_active", v)}
          />
        </div>
      </form>
    </FormStepLayout>

  );
};