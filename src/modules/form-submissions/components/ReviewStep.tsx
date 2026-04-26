import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { useFormRunner } from '../context/FormRunnerContext';
import { validateForm, calculateProgress } from '../utils/validation';
import { toast } from 'sonner';
import { FormSubmissionStepLayout } from './FormSubmissionStepLayout';
import { useCreateFormSubmission } from '../hooks/useFormSubmissions';
import { ErrorMsg } from '@/components/dashboard/ErrorMsg';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, FileText, MapPin, Calendar, Utensils, ClipboardCheck, Loader2 } from 'lucide-react';

export function ReviewStep() {
  const { t } = useTranslation();
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { kitchen_id, day, meal_id, stage_id, forms, answers, resetRunner, setIsOpen, setCurrentStep } = useFormRunner();
  const { mutateAsync: formSubmissionMutation, error: submissionError, isPending: isSubmitting } = useCreateFormSubmission()

  // Role-based validation
  const isProjectManager = user?.role === 'project_manager';

  const formSummaries = forms.map((form) => {
    const formAnswers = answers[form.id]?.answers ?? [];

    return {
      form,
      answers: formAnswers,
      isValid: validateForm(form, formAnswers),
      progress: calculateProgress(form, formAnswers),
    };
  });

  const isAllValid =
    forms.length > 0 &&
    formSummaries.every((f) => f.isValid);

  const redirect =
    user?.role === 'quality_inspector'
      ? '/inspector/forms'
      : user?.role === 'project_manager'
      ? '/project-manager/forms'
      : '/dashboard/forms';


  const handleSubmit = async () => {

    if (!kitchen_id) {
      toast.error("Missing required context");
      return;
    }

    if (!isProjectManager && !meal_id) {
      toast.error("Missing required context");
      return;
    }

    if (!isAllValid) {
      toast.error(t('formSubmissions.requiredQuestionsNotAnswered'));
      return;
    }

    if (!forms.length) {
      toast.error("No forms to submit");
      return false;
    }
    try {
      await Promise.all(
        formSummaries.map(({ form, answers }) => {
          // For project_manager, only send form_id, kitchen_id, and answers
          // For other roles, include time_id
          const payload = isProjectManager
            ? {
                form_id: form.id,
                kitchen_id,
                answers,
              }
            : {
                form_id: form.id,
                kitchen_id,
                time_id: meal_id,
                answers,
              };

          return formSubmissionMutation(payload);

        })
      );

      toast.success(t('formSubmissions.submitSuccess'));

      resetRunner();
      setIsOpen(false);
      setCurrentStep(1);
      navigate(redirect);

    } catch (err) {
      console.error(err);
      toast.error(t('formSubmissions.submitError'));
    }
  };

  return (
    <FormSubmissionStepLayout
      description={t('formSubmissions.reviewDesc')}
      isNextDisabled={isSubmitting}
      isLoading={isSubmitting}
      onNext={handleSubmit}
    >
      <div className="space-y-4 md:space-y-5 max-w-4xl mx-auto">
        {/* Header */}
        <div className="rounded-lg md:rounded-xl bg-linear-to-br from-primary/5 via-primary/3 to-transparent border border-primary/20 p-4 md:p-6">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="p-2 md:p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <ClipboardCheck className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">
                {t('formSubmissions.review')}
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {t('formSubmissions.reviewDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Context Information */}
        <div className="hidden rounded-lg md:rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
          <div className="px-4 md:px-6 py-3 md:py-4 bg-muted/30 dark:bg-muted/10 border-b border-border/50">
            <h3 className="text-sm md:text-base font-semibold text-foreground">
              {t('formSubmissions.context')}
            </h3>
          </div>
          
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Kitchen */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 dark:bg-background/30 border border-border/40">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">
                    {t('formSubmissions.kitchen')}
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {kitchen_id || t('formSubmissions.notSelected')}
                  </p>
                </div>
              </div>

              {/* Only show these fields for non-project_manager roles */}
              {!isProjectManager && (
                <>
                  {/* Day */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 dark:bg-background/30 border border-border/40">
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        {t('formSubmissions.day')}
                      </p>
                      <p className="text-sm font-medium text-foreground truncate">
                        {day || t('formSubmissions.notSelected')}
                      </p>
                    </div>
                  </div>

                  {/* Meal */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 dark:bg-background/30 border border-border/40">
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                      <Utensils className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        {t('formSubmissions.meal')}
                      </p>
                      <p className="text-sm font-medium text-foreground truncate">
                        {meal_id || t('formSubmissions.notSelected')}
                      </p>
                    </div>
                  </div>

                  {/* Stage */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 dark:bg-background/30 border border-border/40">
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                      <ClipboardCheck className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        {t('formSubmissions.stage')}
                      </p>
                      <p className="text-sm font-medium text-foreground truncate">
                        {stage_id || t('formSubmissions.notSelected')}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Forms Summary */}
        <div className="rounded-lg md:rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
          <div className="px-4 md:px-6 py-3 md:py-4 bg-muted/30 dark:bg-muted/10 border-b border-border/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm md:text-base font-semibold text-foreground">
                {t('formSubmissions.formsSummary')}
              </h3>
              <span className="text-xs font-medium text-muted-foreground">
                {formSummaries.filter(f => f.isValid).length} / {formSummaries.length} {t('formSubmissions.complete')}
              </span>
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-3">
            {formSummaries.map(({ form, isValid, progress }) => (
              <div 
                key={form.id} 
                className={cn(
                  "rounded-lg border transition-all duration-200 overflow-hidden",
                  isValid 
                    ? "border-green-500/30 bg-green-500/3" 
                    : "border-red-500/30 bg-red-500/3"
                )}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-1.5 rounded-lg shrink-0",
                      isValid ? "bg-green-500/10 text-green-600 dark:text-green-500" : "bg-red-500/10 text-red-600 dark:text-red-500"
                    )}>
                      <FileText className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="text-sm md:text-base font-semibold text-foreground">
                          {form.name}
                        </h4>
                        
                        <Badge 
                          variant={isValid ? "default" : "destructive"}
                          className="shrink-0 hidden md:block"
                        >
                          {isValid ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {t('formSubmissions.complete')}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {t('formSubmissions.incomplete')}
                            </span>
                          )}
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {t('formSubmissions.progress')}
                          </span>
                          <span className="font-semibold text-foreground">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-500 rounded-full",
                              isValid 
                                ? "bg-linear-to-r from-green-500 to-green-400" 
                                : "bg-linear-to-r from-red-500 to-red-400"
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {!isValid && (
                        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-md bg-red-500/10 border border-red-500/20">
                          <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-500 shrink-0" />
                          <p className="text-xs text-red-600 dark:text-red-400">
                            {t('formSubmissions.requiredQuestionsNotAnswered')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {submissionError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/3 p-4">
            <ErrorMsg message={submissionError?.message} />
          </div>
        )}

        {/* Submit Status */}
        {isSubmitting && (
          <div className="rounded-lg border border-primary/30 bg-primary/3 p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t('common.loading')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormSubmissionStepLayout>
  );
}
