import { Badge } from "@/components/ui/badge";
import { QuestionPreview } from "./QuestionPreview";
import { useCreateForm, useUpdateForm } from "@/modules/forms/hooks/useForms";
import { FormStepLayout } from "../FormStepLayout";
import { ErrorMsg } from "@/components/dashboard/ErrorMsg";
import { useFormBuilderContext } from "@/modules/forms/context/FormBuilderContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const FormPreview = () => {
  const { t } = useTranslation();

  const { mutateAsync: createForm, isPending: isCreating, error: createError } = useCreateForm();
  const {form, resetForm, setCurrentStep, setIsOpen, formId } = useFormBuilderContext();
  const { mutateAsync: updateForm, isPending: isUpdating, error: updateError } = useUpdateForm();

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;
  
  console.log(form)

  const handleSubmit = async () => {
    try {
      if(formId) {
        await updateForm({id: formId, payload: form});
        toast.success(t('common.success'));
      } else {
        await createForm(form);
        toast.success(t('common.success'));
      }

      setCurrentStep(1);
      resetForm();
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t('common.somethingWentWrong'));
    }
  };

  if (!form.sections.length) {
    return <p className="text-muted-foreground">{t('forms.builder.noSectionsAdded')}</p>;
  }

  return (
    <FormStepLayout
      title={t('forms.builder.formPreview')}
      onNext={handleSubmit}
      isLoading={isLoading}
    >
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ================= FORM HEADER ================= */}
        <div className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition">
           {/* Top Row */}
           <div className="px-6 py-5 space-y-4">
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold tracking-tight">
                    {form.name}
                  </h2>

                  {form.description && (
                    <p className="text-sm text-muted-foreground">
                      {form.description}
                    </p>
                  )}
                </div>

                <Badge
                  variant={form.is_active ? "default" : "destructive"}
                  className="px-3 py-1 rounded-full"
                >
                  {form.is_active
                    ? t('forms.builder.active')
                    : t('forms.builder.inactive')}
                </Badge>
              </div>

              {/* Meta Info Row */}
              <div className="flex flex-wrap gap-2">

                {/* Form Type */}
                <Badge variant="secondary" className="rounded-full">
                  {t('forms.builder.formType')}:
                  <span className="ml-1 font-medium">
                    {t(`forms.builder.${form.form_type}`)}
                  </span>
                </Badge>

                {/* User Role */}
                <Badge variant="secondary" className="rounded-full">
                  {t('forms.builder.userRole')}:
                  <span className="ml-1 font-medium">
                    {t(`forms.builder.${form.user_role}`)}
                  </span>
                </Badge>

                {/* Inspection Stage (only for report) */}
                {form.form_type === "report" && form.inspection_stage && (
                  <Badge variant="outline" className="rounded-full">
                    {t('inspectionStages.inspectionStage')}:
                    <span className="ml-1 font-medium">
                      {form.inspection_stage.name}
                    </span>
                  </Badge>
                )}
              </div>
            </div>
        </div>

        {/* ================= SECTIONS ================= */}
        <div className="space-y-5">
          {form.sections.map((section) => (
            <div
              key={section.id}
              className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition"
            >

              {/* Section Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium">
                    {section.title}
                  </h3>

                  {section.description && (
                    <p className="text-xs text-muted-foreground">
                      {section.description}
                    </p>
                  )}
                </div>

                <Badge variant="secondary" className="rounded-full">
                  {t('forms.builder.section')} {section.sequence_order}
                </Badge>
              </div>

              {/* Questions */}
              <div className="px-5 py-5 space-y-4">
                {section.questions.map((q) => (
                  <QuestionPreview key={q.id} question={q} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <ErrorMsg message={error?.message} />
          </div>
        )}

      </div>
    </FormStepLayout>
  );
};