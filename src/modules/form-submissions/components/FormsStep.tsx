import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useFormRunner } from '../context/FormRunnerContext';
import { FormRenderer } from './FormRenderer';
import { calculateProgress, validateForm } from '../utils/validation';
import { FormSubmissionStepLayout } from './FormSubmissionStepLayout';
import { useGetFormsByInspectionStage } from '@/modules/forms/hooks/useForms';

export function FormsStep() {

  const {
    answers,
    stage_id,
    updateAnswer,
    nextStep,
    setForms,
  } = useFormRunner();

  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const lastStageIdRef = useRef<string | null>(null);

  
  const {
    data: inspectionForms,
    isLoading: isLoadingForms,
  } = useGetFormsByInspectionStage(stage_id ?? '');

  // Memoized forms list
  const forms = useMemo(() => {
    return inspectionForms?.data ?? [];
  }, [inspectionForms]);

  // Helper to get answers safely
  const getFormAnswers = useCallback(
    (formId?: string) => {
      if (!formId) return [];
      return answers[formId]?.answers ?? [];
    },
    [answers]
  );

  // Sync forms to context ONLY when stage changes or forms first load
  useEffect(() => {
    if (!forms.length) return;
    if (lastStageIdRef.current === stage_id) return;
    
    setForms(forms);
    lastStageIdRef.current = stage_id;
  }, [forms.length, stage_id, setForms]);

  // Reset index when forms change
  useEffect(() => {
    if (currentFormIndex < forms.length) return;
    setCurrentFormIndex(0);
  }, [forms.length, currentFormIndex]);

  // Current form
  const currentForm = forms[currentFormIndex];

  // Current form answers
  const currentAnswers = useMemo(() => {
    return getFormAnswers(currentForm?.id);
  }, [currentForm?.id, getFormAnswers]);

  // Progress for current form
  const currentProgress = useMemo(() => {
    if (!currentForm) return 0;
    return calculateProgress(currentForm, currentAnswers);
  }, [currentForm, currentAnswers]);

  // Step validation
  const isStepValid = useMemo(() => {
    if (!forms.length) return false;

    return forms.every((form) =>
      validateForm(form, getFormAnswers(form.id))
    );
  }, [forms, getFormAnswers]);

  // Loading state
  if (isLoadingForms) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading forms...</p>
      </div>
    );
  }

  // Empty state
  if (!forms.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No forms available for this inspection stage
        </p>
      </div>
    );
  }

  
  return (
    <FormSubmissionStepLayout
      isNextDisabled={!isStepValid}
      onNext={nextStep}
    >
      {/* ================= STICKY HEADER ================= */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 pb-4 -mx-1">
        <div>
          <div className="rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden">

            {/* Header Info */}
            <div className="px-6 py-5 flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight">
                  Forms
                </h2>
                <p className="text-xs text-muted-foreground">
                  Form {currentFormIndex + 1} of {forms.length}
                </p>
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {currentProgress}% complete
              </div>
            </div>

            {/* Main Progress Bar */}
            <div className="px-6 pb-4">
              <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-primary to-primary/80 transition-all duration-500"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
            </div>

            {/* Form Tabs */}
            {forms.length > 1 && (
              <div className="px-6 pb-4">
                <div className="flex gap-4 overflow-x-auto">
                  {forms.map((form, index) => {
                    const progress = calculateProgress(
                      form,
                      getFormAnswers(form.id)
                    );
                    const isActive = index === currentFormIndex;
                    const isComplete = progress === 100;

                    return (
                      <button
                        key={form.id}
                        onClick={() => setCurrentFormIndex(index)}
                        className={`
                          group flex flex-1 items-center justify-between gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all
                          ${isActive
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`
                              w-2 h-2 rounded-full
                              ${isComplete
                                ? 'bg-green-500'
                                : isActive
                                  ? 'bg-white'
                                  : 'bg-muted-foreground/40'}
                            `}
                          />
                          <span className="truncate max-w-[120px]">{form.name}</span>
                        </div>

                        <span
                          className={`
                            text-[10px] px-2 py-0.5 rounded-full
                            ${isActive
                              ? 'bg-white/20'
                              : 'bg-background border border-border/40'}
                          `}
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
      </div>

      {/* ================= FORM RENDERER ================= */}
      <div className="max-w-5xl mx-auto mt-4">
        <div className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition">
          <div className="px-6 py-6">
            <FormRenderer
              form={currentForm}
              answers={currentAnswers}
              onAnswerChange={(answer) =>
                updateAnswer(currentForm?.id, answer)
              }
            />
          </div>
        </div>
      </div>
    </FormSubmissionStepLayout>
  );
}




