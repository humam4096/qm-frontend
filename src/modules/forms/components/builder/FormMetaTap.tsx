import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormBuilderContext } from "../../context/FormBuilderContext";
import { FormStepLayout } from "./FormStepLayout";
import { useGetFormById } from "../../hooks/useForms";
import { FormMetaSkeleton } from "../skeleton/FormMetaSkeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";

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
  const { t } = useTranslation();

  const { form, updateForm, nextStep, formId, hydrateFormFromApiOnce } =
    useFormBuilderContext();

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
  const selectedRole = watch("user_role");
  const selectedFormType = watch("form_type");


  // Seed builder state from GET once per open session (ref lives in context; survives step changes).
  useEffect(() => {
    if (!formId || !existingForm) return;
    hydrateFormFromApiOnce(formId, existingForm);
  }, [existingForm, formId, hydrateFormFromApiOnce]);

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
        title={t('forms.builder.formMeta')}
        description={t('forms.builder.formMeta')}
        onNext={() => {}}
      >
        <FormMetaSkeleton />
      </FormStepLayout>
    );
  }

  return (
    <FormStepLayout
      title={t('forms.builder.formMeta')}
      onNext={handleSubmit(onSubmit)}
    >
      <form className="max-w-3xlx mx-auto space-y-8">

        {/* Section: Basic Info */}
        <div className="space-y-5 p-6 rounded-2xl border bg-muted/30 backdrop-blur-sm">
          
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">
              {t('forms.builder.formName')}
            </Label>
            <Input
              {...register("name")}
              className=" text-base"
              placeholder={t('forms.builder.formName')}
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">
              {t('forms.description')}
            </Label>
            <Input
              {...register("description")}
              className=" text-base"
              placeholder={t('forms.description')}
            />
          </div>
        </div>

        {/*  Section: Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border bg-muted/30 backdrop-blur-sm">

          {/* Role */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              {t('forms.builder.userRole')}
            </Label>

            <Select
              value={selectedRole}
              onValueChange={(val) =>
                setValue("user_role", val as any, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full ">
                <SelectValue placeholder={t('forms.builder.userRole')} />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {t(`forms.builder.${role}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {errors.user_role && (
              <p className="text-destructive text-xs">{errors.user_role.message}</p>
            )}
          </div>

          {/* Form Type */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              {t('forms.builder.formType')}
            </Label>

            <Select
              value={selectedFormType}
              onValueChange={(val) =>
                setValue("form_type", val as any, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full ">
                <SelectValue placeholder={t('forms.builder.formType')} />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {FORM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`forms.builder.${type}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {errors.form_type && (
              <p className="text-destructive text-xs">{errors.form_type.message}</p>
            )}
          </div>
        </div>

        {/* Section: Status */}
        <div className="flex items-center justify-between p-5 rounded-2xl border bg-muted/20">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {t('forms.builder.active')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('common.activeHint')}
            </p>
          </div>

          <Switch
            checked={isActive}
            onCheckedChange={(v) => setValue("is_active", v)}
          />
        </div>

      </form>
    </FormStepLayout>
  );
};