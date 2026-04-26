
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useFormRunner } from '../context/FormRunnerContext';
import { FormSubmissionStepLayout } from './FormSubmissionStepLayout';
import { FormRenderer } from './FormRenderer';
import { calculateProgress, validateForm } from '../utils/validation';
import { useGetFormsByInspectionStage, useGetFormsList } from '@/modules/forms/hooks/useForms';
import type { Form } from '@/modules/forms/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileText, CheckCircle2, Circle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export function FormsStep() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const {
    answers,
    stage_id,
    updateAnswer,
    nextStep,
    setForms,
  } = useFormRunner();

  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const formContentRef = useRef<HTMLDivElement>(null);

  // ================= ROLE =================
  const isProjectManager = user?.role === 'project_manager';

  // ================= QUERIES =================
  const {
    data: roleBasedForms,
    isLoading: isLoadingRoleBasedForms,
  } = useGetFormsList(isProjectManager);

  const {
    data: inspectionForms,
    isLoading: isLoadingInspectionForms,
  } = useGetFormsByInspectionStage(
    stage_id ?? '',
    !!stage_id && !isProjectManager
  );

  const isLoadingForms = isProjectManager
    ? isLoadingRoleBasedForms
    : isLoadingInspectionForms;

  // ================= DATA =================
  const forms = isProjectManager
    ? roleBasedForms?.data ?? []
    : inspectionForms?.data ?? [];

  // ================= SYNC TO CONTEXT =================
  const lastFormsRef = useRef<string>('');
  useEffect(() => {
    if (!forms.length) return;

    const newKey = forms.map(f => f.id).join(',');

    if (lastFormsRef.current === newKey) return;

    lastFormsRef.current = newKey;
    setForms(forms);
  }, [forms, setForms]);

  // ================= RESET INDEX =================
  useEffect(() => {
    setCurrentFormIndex(0);
  }, [stage_id, forms.length]);

  // ================= SCROLL TO TOP ON FORM CHANGE =================
  useEffect(() => {
    if (formContentRef.current) {
      formContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentFormIndex]);

  // ================= HELPERS =================
  const handleFormNavigation = (newIndex: number) => {
    setCurrentFormIndex(newIndex);
  };

  const getFormAnswers = useCallback(
    (formId?: string) => {
      if (!formId) return [];
      return answers[formId]?.answers ?? [];
    },
    [answers]
  );

  const getFormProgress = useCallback(
    (form: Form) => calculateProgress(form, getFormAnswers(form.id)),
    [getFormAnswers]
  );

  // ================= CURRENT =================
  const currentForm = forms[currentFormIndex] ?? forms[0];
  const currentAnswers = getFormAnswers(currentForm?.id);

  const currentProgress = currentForm
    ? calculateProgress(currentForm, currentAnswers)
    : 0;

  // ================= VALIDATION =================
  const isStepValid =
    forms.length > 0 &&
    forms.every((form) =>
      validateForm(form, getFormAnswers(form.id))
    );

  // ================= STATES =================
  if (isLoadingForms) {
    return (
      <div className="min-h-[700px] flex flex-col items-center justify-center py-16 px-4">
        <div className="p-4 rounded-full bg-primary/10 mb-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <p className="text-sm font-medium text-foreground">{t('formSubmissions.loadingForms')}</p>
        <p className="text-xs text-muted-foreground mt-1">{t('common.pleaseWait')}</p>
      </div>
    );
  }

  if (!forms.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="p-4 rounded-full bg-muted/50 mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          {t('formSubmissions.noFormsTitle')}
        </p>
        <p className="text-xs text-muted-foreground text-center max-w-sm">
          {isProjectManager
            ? `${t('formSubmissions.noFormsAvailableForRole')}: ${user?.role}`
            : t('formSubmissions.noFormsAvailable')}
        </p>
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <FormSubmissionStepLayout
      isNextDisabled={!isStepValid}
      onNext={nextStep}
    >
      {/* ================= HEADER ================= */}
      <div ref={formContentRef} className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 pb-3 md:pb-4 -mx-1">
        <div className="rounded-lg md:rounded-xl bg-linear-to-br from-card via-card to-card/95 border border-border/50 shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden">

          {/* Info Header */}
          <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3 bg-muted/20 dark:bg-muted/10 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base md:text-lg font-semibold tracking-tight truncate">
                  {currentForm?.name || t('formSubmissions.forms')}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t('formSubmissions.formCount', { current: currentFormIndex + 1, total: forms.length })}
                </p>
              </div>
            </div>
            
            {/* Progress Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                currentProgress === 100 
                  ? "bg-primary text-white dark:text-white border border-primary/20" 
                  : "bg-primary/10 text-primary border border-primary/20"
              )}>
                {currentProgress}% {t('formSubmissions.complete')}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="hidden md:block px-4 md:px-6 py-3">
            <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500 ease-out rounded-full",
                  currentProgress === 100 
                    ? "bg-linear-to-r from-primary to-primary/80" 
                    : "bg-linear-to-r from-primary to-primary/80"
                )}
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>

          {/* Form Tabs - Mobile Optimized */}
          {forms.length > 1 && (
            <div className="px-4 md:px-6 pb-3 md:pb-4">
              <div className="flex flex-col md:flex-row gap-2 overflow-x-auto scrollbar-thin pb-2">
                {forms.map((form, index) => {
                  const progress = getFormProgress(form);
                  const isActive = index === currentFormIndex;
                  const isComplete = progress === 100;

                  return (
                    <button
                      key={form.id}
                      onClick={() => handleFormNavigation(index)}
                      className={cn(
                        "flex items-center justify-between gap-2 whitespace-nowrap px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all shrink-0",
                        "border shadow-sm",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-primary/20"
                          : "bg-background/80 dark:bg-background/50 text-muted-foreground border-border/50 hover:bg-muted hover:border-border"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {isComplete ? (
                          <CheckCircle2 className={cn(
                            "h-3.5 w-3.5",
                            isActive ? "text-primary-foreground" : "text-green-500"
                          )} />
                        ) : (
                          <Circle className={cn(
                            "h-3.5 w-3.5",
                            isActive ? "text-primary-foreground fill-primary-foreground/20" : "text-muted-foreground/40"
                          )} />
                        )}
                        <span className="truncate max-w-[100px] md:max-w-[150px]">
                          {form.name}
                        </span>
                      </div>

                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-semibold",
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {progress}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= FORM CONTENT ================= */}
      <div className="max-w-5xl mx-auto mt-3 md:mt-4">
        <div className="rounded-lg md:rounded-xl bg-linear-to-br from-card via-card to-card/95 border border-border/50 shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden">
          <div className="px-4 md:px-6 py-5 md:py-6">
            <FormRenderer
              form={currentForm}
              answers={currentAnswers}
              onAnswerChange={(answer) => {
                if (!currentForm) return;
                updateAnswer(currentForm.id, answer);
              }}
            />
          </div>

          {/* Form Navigation Buttons - Mobile Optimized */}
          {forms.length > 1 && (
            <div className="px-4 md:px-6 pb-4 md:pb-5 pt-3 md:pt-4 border-t border-border/50 bg-muted/10 dark:bg-muted/5">
              <div className="flex items-center justify-between gap-3">
                <Button
                  size='sm'
                  variant="outline"
                  onClick={() => handleFormNavigation(Math.max(0, currentFormIndex - 1))}
                  disabled={currentFormIndex === 0}
                  className={cn(
                    "flex items-center gap-1.5 px-3 md:px-4 h-9 text-xs md:text-sm font-medium",
                    "transition-all duration-200",
                    "disabled:opacity-40"
                  )}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t('forms.previousform')}</span>
                  <span className="sm:hidden">{t('common.prev')}</span>
                </Button>

                {/* Center Indicator - Hidden on small mobile */}
                <div className="hidden xs:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
                  <span className="text-xs font-medium text-foreground">
                    {currentFormIndex + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">/</span>
                  <span className="text-xs text-muted-foreground">
                    {forms.length}
                  </span>
                </div>

                <Button
                  size='sm'
                  variant="outline"
                  onClick={() => handleFormNavigation(Math.min(forms.length - 1, currentFormIndex + 1))}
                  disabled={currentFormIndex === forms.length - 1}
                  className={cn(
                    "flex items-center gap-1.5 px-3 md:px-4 h-9 text-xs md:text-sm font-medium",
                    "transition-all duration-200",
                    "disabled:opacity-40"
                  )}
                >
                  <span className="hidden sm:inline">{t('forms.nextform')}</span>
                  <span className="sm:hidden">{t('common.next')}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </FormSubmissionStepLayout>
  );
}
