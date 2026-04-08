
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useFormRunner } from '../context/FormRunnerContext';
import { FormSubmissionStepLayout } from './FormSubmissionStepLayout';
import { FormRenderer } from './FormRenderer';
import { calculateProgress, validateForm } from '../utils/validation';
import { useGetForms, useGetFormsByInspectionStage } from '@/modules/forms/hooks/useForms';
import type { Form } from '@/modules/forms/types';

export function FormsStep() {
  const { user } = useAuthStore();
  const {
    answers,
    stage_id,
    updateAnswer,
    nextStep,
    setForms,
  } = useFormRunner();

  const [currentFormIndex, setCurrentFormIndex] = useState(0);

  // ================= ROLE =================
  const isProjectManager = user?.role === 'project_manager';

  // ================= QUERIES =================
  const {
    data: roleBasedForms,
    isLoading: isLoadingRoleBasedForms,
  } = useGetForms();

  // const {
  //   data: roleBasedForms,
  //   isLoading: isLoadingRoleBasedForms,
  // } = useGetFormsList(isProjectManager);

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

  // ================= HELPERS =================
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
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading forms...</p>
      </div>
    );
  }

  if (!forms.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {isProjectManager
            ? `No forms available for role: ${user?.role}`
            : 'No forms available for this inspection stage'}
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
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 pb-4 -mx-1">
        <div className="rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden">

          {/* Info */}
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

          {/* Progress */}
          <div className="px-6 pb-4">
            <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-primary to-primary/80 transition-all duration-500"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>

          {/* Tabs */}
          {forms.length > 1 && (
            <div className="px-6 pb-4">
              <div className="flex gap-4 overflow-x-auto">
                {forms.map((form, index) => {
                  const progress = getFormProgress(form);
                  const isActive = index === currentFormIndex;
                  const isComplete = progress === 100;

                  return (
                    <button
                      key={form.id}
                      onClick={() => setCurrentFormIndex(index)}
                      className={`
                        flex items-center justify-between gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all
                        ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`
                            w-2 h-2 rounded-full
                            ${
                              isComplete
                                ? 'bg-green-500'
                                : isActive
                                ? 'bg-white'
                                : 'bg-muted-foreground/40'
                            }
                          `}
                        />
                        <span className="truncate max-w-[120px]">
                          {form.name}
                        </span>
                      </div>

                      <span
                        className={`
                          text-[10px] px-2 py-0.5 rounded-full
                          ${
                            isActive
                              ? 'bg-white/20'
                              : 'bg-background border border-border/40'
                          }
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

      {/* ================= FORM ================= */}
      <div className="max-w-5xl mx-auto mt-4">
        <div className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition">
          <div className="px-6 py-6">
            <FormRenderer
              form={currentForm}
              answers={currentAnswers}
              onAnswerChange={(answer) => {
                if (!currentForm) return;
                updateAnswer(currentForm.id, answer);
              }}
            />
          </div>
        </div>
      </div>
    </FormSubmissionStepLayout>
  );
}

// import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// import { useFormRunner } from '../context/FormRunnerContext';
// import { FormRenderer } from './FormRenderer';
// import { calculateProgress, validateForm } from '../utils/validation';
// import { FormSubmissionStepLayout } from './FormSubmissionStepLayout';
// import { useGetFormsByInspectionStage, useGetForms, useGetFormsList } from '@/modules/forms/hooks/useForms';
// import { useAuthStore } from '@/app/store/useAuthStore';

// export function FormsStep() {
//   const { user } = useAuthStore();
//   const {
//     answers,
//     stage_id,
//     updateAnswer,
//     nextStep,
//     setForms,
//   } = useFormRunner();

//   const [currentFormIndex, setCurrentFormIndex] = useState(0);
//   const lastStageIdRef = useRef<string | null>(null);
//   const formsSetRef = useRef(false);

//   // Role-based form fetching: project_manager uses useGetForms, others use useGetFormsByInspectionStage
//   const isProjectManager = user?.role === 'project_manager';
  
//   const {
//     data: roleBasedForms,
//     isLoading: isLoadingRoleBasedForms,
//   } = useGetFormsList(!isProjectManager);

//   const {
//     data: inspectionForms,
//     isLoading: isLoadingInspectionForms,
//   } = useGetFormsByInspectionStage(stage_id ?? '', !isProjectManager);

//   const isLoadingForms = isProjectManager
//     ? isLoadingRoleBasedForms
//     : isLoadingInspectionForms;

//   // Memoized forms list - use roleBasedForms for project_manager, inspectionForms for others
//   const forms = useMemo(() => {
//     if (isProjectManager) {
//       return roleBasedForms?.data ?? [];
//     }
//     return inspectionForms?.data ?? [];
//   }, [isProjectManager, roleBasedForms, inspectionForms]);

//   // Create a stable key for forms to prevent infinite loops
//   const formsKey = useMemo(() => {
//     return forms.map(f => f.id).join(',');
//   }, [forms]);

//   // Helper to get answers safely
//   const getFormAnswers = useCallback(
//     (formId?: string) => {
//       if (!formId) return [];
//       return answers[formId]?.answers ?? [];
//     },
//     [answers]
//   );

//   // Sync forms to context ONLY when stage changes or forms first load
//   // For project_manager, sync when forms load (no stage dependency)
//   useEffect(() => {
//     if (!forms.length) return;
    
//     // For non-project managers, check if stage has changed
//     if (!isProjectManager) {
//       if (lastStageIdRef.current === stage_id) return;
//       lastStageIdRef.current = stage_id;
//     } else {
//       // For project managers, only set forms once
//       if (formsSetRef.current) return;
//       formsSetRef.current = true;
//     }
    
//     setForms(forms);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [formsKey, stage_id, isProjectManager]);

//   // Reset formsSetRef when component unmounts or stage changes for project managers
//   useEffect(() => {
//     return () => {
//       formsSetRef.current = false;
//     };
//   }, []);

//   // Reset index when forms change
//   useEffect(() => {
//     if (currentFormIndex < forms.length) return;
//     setCurrentFormIndex(0);
//   }, [forms.length, currentFormIndex]);

//   // Current form
//   const currentForm = forms[currentFormIndex];

//   // Current form answers
//   const currentAnswers = useMemo(() => {
//     return getFormAnswers(currentForm?.id);
//   }, [currentForm?.id, getFormAnswers]);

//   // Progress for current form
//   const currentProgress = useMemo(() => {
//     if (!currentForm) return 0;
//     return calculateProgress(currentForm, currentAnswers);
//   }, [currentForm, currentAnswers]);

//   // Step validation
//   const isStepValid = useMemo(() => {
//     if (!forms.length) return false;

//     return forms.every((form) =>
//       validateForm(form, getFormAnswers(form.id))
//     );
//   }, [forms, getFormAnswers]);

//   // Loading state
//   if (isLoadingForms) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-muted-foreground">Loading forms...</p>
//       </div>
//     );
//   }

//   // Empty state
//   if (!forms.length) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-muted-foreground">
//           {isProjectManager 
//             ? `No forms available for this role: ${user?.role}`
//             : 'No forms available for this inspection stage'}
//         </p>
//       </div>
//     );
//   }

  
//   return (
//     <FormSubmissionStepLayout
//       isNextDisabled={!isStepValid}
//       onNext={nextStep}
//     >
//       {/* ================= STICKY HEADER ================= */}
//       <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 pb-4 -mx-1">
//         <div>
//           <div className="rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden">

//             {/* Header Info */}
//             <div className="px-6 py-5 flex items-center justify-between">
//               <div className="space-y-1">
//                 <h2 className="text-lg font-semibold tracking-tight">
//                   Forms
//                 </h2>
//                 <p className="text-xs text-muted-foreground">
//                   Form {currentFormIndex + 1} of {forms.length}
//                 </p>
//               </div>
//               <div className="text-sm font-medium text-muted-foreground">
//                 {currentProgress}% complete
//               </div>
//             </div>

//             {/* Main Progress Bar */}
//             <div className="px-6 pb-4">
//               <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-linear-to-r from-primary to-primary/80 transition-all duration-500"
//                   style={{ width: `${currentProgress}%` }}
//                 />
//               </div>
//             </div>

//             {/* Form Tabs */}
//             {forms.length > 1 && (
//               <div className="px-6 pb-4">
//                 <div className="flex gap-4 overflow-x-auto">
//                   {forms.map((form, index) => {
//                     const progress = calculateProgress(
//                       form,
//                       getFormAnswers(form.id)
//                     );
//                     const isActive = index === currentFormIndex;
//                     const isComplete = progress === 100;

//                     return (
//                       <button
//                         key={form.id}
//                         onClick={() => setCurrentFormIndex(index)}
//                         className={`
//                           group flex flex-1 items-center justify-between gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all
//                           ${isActive
//                             ? 'bg-primary text-primary-foreground shadow-sm'
//                             : 'bg-muted/40 text-muted-foreground hover:bg-muted'
//                           }
//                         `}
//                       >
//                         <div className="flex items-center gap-2">
//                           <span
//                             className={`
//                               w-2 h-2 rounded-full
//                               ${isComplete
//                                 ? 'bg-green-500'
//                                 : isActive
//                                   ? 'bg-white'
//                                   : 'bg-muted-foreground/40'}
//                             `}
//                           />
//                           <span className="truncate max-w-[120px]">{form.name}</span>
//                         </div>

//                         <span
//                           className={`
//                             text-[10px] px-2 py-0.5 rounded-full
//                             ${isActive
//                               ? 'bg-white/20'
//                               : 'bg-background border border-border/40'}
//                           `}
//                         >
//                           {progress}%
//                         </span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ================= FORM RENDERER ================= */}
//       <div className="max-w-5xl mx-auto mt-4">
//         <div className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition">
//           <div className="px-6 py-6">
//             <FormRenderer
//               form={currentForm}
//               answers={currentAnswers}
//               onAnswerChange={(answer) =>
//                 updateAnswer(currentForm?.id, answer)
//               }
//             />
//           </div>
//         </div>
//       </div>
//     </FormSubmissionStepLayout>
//   );
// }




