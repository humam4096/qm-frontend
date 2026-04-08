import { useEffect, useMemo } from "react";
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
import { useGetInspectionStagesList } from "@/modules/inspection-stages/hooks/useInspectionStages";

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
  inspection_stage_id: z.string().optional(),
}).superRefine((date, ctx) => {
  if (date.form_type === "report" && !date.inspection_stage_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["inspection_stage_id"],
      message: "Inspection stage is required for reports",
    })
  }
});

type FormMetaValues = z.infer<typeof schema>;

export const FormMetaTab = () => {
  const { t } = useTranslation();

  const { form, updateForm, nextStep, formId, hydrateFormFromApiOnce } = useFormBuilderContext();
  const { data: inspectionStagesResponse, isLoading: isLoadingInspectionStages } = useGetInspectionStagesList();
  const inspectionStages = inspectionStagesResponse?.data || [];

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
      inspection_stage_id: undefined,
      form_type: "report",
      is_active: true,
    },
  });

  // watch all the form values
  const isActive = watch("is_active");
  const selectedRole = watch("user_role");
  const selectedFormType = watch("form_type");
  const selectedInspectionStageId = watch("inspection_stage_id");


  // Seed builder state from GET once per open session (ref lives in context; survives step changes).
  useEffect(() => {
    if (!formId || !existingForm) return;
    hydrateFormFromApiOnce(formId, existingForm);
  }, [existingForm, formId, hydrateFormFromApiOnce]);


  const selectedStage = useMemo(
    () => inspectionStages.find((s) => s.id === selectedInspectionStageId),
    [inspectionStages, selectedInspectionStageId]
  );

  console.log(form?.inspection_stage?.id)

  //  Sync RHF values to reflect builder state initially
  useEffect(() => {
    if (!form) return;
    reset({
      name: form.name,
      description: form.description,
      user_role: form.user_role,
      form_type: form.form_type,
      inspection_stage_id: form?.inspection_stage?.id ?? undefined,
      is_active: form.is_active,
    });
  }, [form, reset]);

  // update form meta data
  const onSubmit = (data: FormMetaValues) => {
    const peyload = {
      ...data, 
      inspection_stage_id: data.form_type === "report" ? data.inspection_stage_id : undefined,
    }
    updateForm(peyload);
    nextStep();
  };

  const isStagesEmpty = inspectionStages.length === 0;

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
      <form className="max-w-4xl mx-auto space-y-6">

        {/* ================= BASIC INFO ================= */}
        <div className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-border/50">
            <p className="text-sm font-medium text-muted-foreground">
              {t('forms.builder.basicInfo')}
            </p>
          </div>

          {/* Body */}
          <div className="px-5 py-5 space-y-5">

            {/* Name */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                {t('forms.builder.formName')}
              </Label>

              <Input
                {...register("name")}
                placeholder={t('forms.builder.formName')}
                className="border-none bg-muted/30 focus-visible:ring-1"
              />

              {errors.name && (
                <p className="text-destructive text-xs">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                {t('forms.description')}
              </Label>

              <Input
                {...register("description")}
                placeholder={t('forms.description')}
                className="border-none bg-muted/30 focus-visible:ring-1"
              />
            </div>

          </div>
        </div>

        {/* ================= CONFIG ================= */}
        <div className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition">

          {/* Header */}
          <div className="px-5 py-4 border-b border-border/50">
            <p className="text-sm font-medium text-muted-foreground">
              {t('forms.builder.configuration')}
            </p>
          </div>

          {/* Body */}
          <div className="px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Role */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                {t('forms.builder.userRole')}
              </Label>

              <Select
                value={selectedRole}
                onValueChange={(val) =>
                  setValue("user_role", val as any, { shouldValidate: true })
                }
              >
                <SelectTrigger className="bg-muted/30 border-none focus:ring-1 w-full">
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
                <p className="text-destructive text-xs">
                  {errors.user_role.message}
                </p>
              )}
            </div>

            {/* Form Type */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                {t('forms.builder.formType')}
              </Label>

              <Select
                value={selectedFormType}
                onValueChange={(val) =>
                  setValue("form_type", val as any, { shouldValidate: true })
                }
              >
                <SelectTrigger className="bg-muted/30 border-none focus:ring-1 w-full">
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
                <p className="text-destructive text-xs">
                  {errors.form_type.message}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ================= STATUS ================= */}
        <div className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition">

          {/* Header */}
          <div className="px-5 py-4 border-b border-border/50">
            <p className="text-sm font-medium text-muted-foreground">
              {t('forms.builder.status')}
            </p>
          </div>

          {/* Body */}
          <div className={`px-5 py-5 grid ${selectedFormType === "report" ? 'md:grid-cols-2' : ''} gap-5`}>

            {/* Active Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3">
              <div className="space-y-0.5">
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

            {/* Inspection Stage */}
            {selectedFormType === "report" && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  {t('inspectionStages.inspectionStage')}
                </Label>

                <Select
                  value={selectedInspectionStageId}
                  onValueChange={(val) =>
                    setValue("inspection_stage_id", String(val), { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="bg-muted/30 border-none focus:ring-1 w-full">
                    <SelectValue>
                      {isLoadingInspectionStages
                        ? t("common.loading")
                        : selectedStage?.name ||
                          t("inspectionStages.selectInspectionStage")}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {isLoadingInspectionStages && (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      )}

                      {!isLoadingInspectionStages && isStagesEmpty && (
                        <SelectItem value="empty" disabled>
                          No inspection stages available
                        </SelectItem>
                      )}

                      {inspectionStages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {errors.inspection_stage_id && (
                  <p className="text-destructive text-xs">
                    {errors.inspection_stage_id.message}
                  </p>
                )}
              </div>
            )}

          </div>
        </div>

      </form>
    </FormStepLayout>
  );
};