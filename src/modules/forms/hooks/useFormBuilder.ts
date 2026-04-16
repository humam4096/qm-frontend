import { useCallback, useRef, useState } from "react";
import { generateId, reorder } from "../utils/form-builder.utils";
import type {
  FormBuilderState,
  FormQuestion,
  FormQuestionOption,
  FormSection,
} from "../types";

export const useFormBuilder = () => {
  const [form, setForm] = useState<FormBuilderState>({
    name: "",
    description: "",
    user_role: "quality_inspector",
    form_type: "report",
    inspection_stage_id: "",
    is_active: true,
    sections: [],
  });

  // Stepper state
  const [currentStep, setCurrentStep] = useState(1);
  const [highestStep, setHighestStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);

  /** Prevents re-applying GET /forms/:id on every FormMetaTab remount (step navigation). */
  const hydratedFormIdRef = useRef<string | null>(null);

  const hydrateFormFromApiOnce = useCallback((id: string, data: FormBuilderState) => {
    if (hydratedFormIdRef.current === id) return;
    hydratedFormIdRef.current = id;
    setForm(data);
  }, []);

  const handleSetIsOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCurrentStep(1);
      setHighestStep(1);
      setFormId(null);
      hydratedFormIdRef.current = null;
      resetForm();
    }
  };

  const nextStep = () => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (highestStep < next) setHighestStep(next);
        return next;
      });
    };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < form.sections.length) {
      setCurrentStep(stepIndex);
    }
  };

  // FORM META
  // ------------------------
  const updateForm = (data: Partial<FormBuilderState>) => {
    setForm((prev) => ({ ...prev, ...data }));
  };

  // set entire form data
  const setEntireForm = (data: FormBuilderState) => {
    setForm(data);
  };

  // reset form data
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      user_role: "quality_manager",
      form_type: "report",
      inspection_stage_id: "",
      is_active: true,
      sections: [],
    });
  };

  // SECTIONS
  const addSection = () => {
    const newSection: FormSection = {
      id: generateId(),
      title: "",
      description: "",
      sequence_order: form.sections.length + 1,
      questions: [],
    };

    setForm((prev) => ({
      ...prev,
      sections: reorder([...prev.sections, newSection]),
    }));
  };

  const updateSection = (sectionId: string, data: Partial<FormSection>) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, ...data } : s
      ),
    }));
  };

  const deleteSection = (sectionId: string) => {
    setForm((prev) => ({
      ...prev,
      sections: reorder(prev.sections.filter((s) => s.id !== sectionId)),
    }));
  };

  // QUESTIONS
  const addQuestion = (sectionId: string) => {
    const newQuestion: FormQuestion = {
      id: generateId(),
      question: "",
      notes: "",
      question_type: "text",
      weight: 1,
      is_required: true,
      sequence_order: 1,
      options: [],
    };

    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: reorder([...section.questions, newQuestion]),
            }
          : section
      ),
    }));
  };

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    data: Partial<FormQuestion>
  ) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id !== sectionId) return section;

        return {
          ...section,
          questions: section.questions.map((q) => {
            if (q.id !== questionId) return q;

            const updated = { ...q, ...data };

            // ✅ UX RULE: manage options automatically
            if (data.question_type) {
              const isSelect =
                data.question_type === "single_select" ||
                data.question_type === "multi_select";

              if (isSelect) {
                if (!updated.options || updated.options.length === 0) {
                  updated.options = [
                    { id: generateId(), option: "", weight: 0 },
                  ];
                }
              } else {
                updated.options = [];
              }
            }

            return updated;
          }),
        };
      }),
    }));
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: reorder(
                section.questions.filter((q) => q.id !== questionId)
              ),
            }
          : section
      ),
    }));
  };

  // OPTIONS
  const addOption = (sectionId: string, questionId: string) => {
    const newOption: FormQuestionOption = {
      id: generateId(),
      option: "",
      weight: 0,
    };

    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId
                  ? { ...q, options: [...q.options, newOption] }
                  : q
              ),
            }
          : section
      ),
    }));
  };

  const updateOption = (
    sectionId: string,
    questionId: string,
    optionId: string,
    data: Partial<FormQuestionOption>
  ) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: q.options.map((opt) =>
                        opt.id === optionId ? { ...opt, ...data } : opt
                      ),
                    }
                  : q
              ),
            }
          : section
      ),
    }));
  };

  const removeOption = (
    sectionId: string,
    questionId: string,
    optionId: string
  ) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) => {
                if (q.id !== questionId) return q;

                // ✅ prevent removing last option (UX safety)
                if (q.options.length <= 1) return q;

                return {
                  ...q,
                  options: q.options.filter((o) => o.id !== optionId),
                };
              }),
            }
          : section
      ),
    }));
  };

  // REORDER
  const reorderSections = (sections: FormSection[]) => {
    setForm((prev) => ({
      ...prev,
      sections: reorder(sections),
    }));
  };

  const reorderQuestions = (
    sectionId: string,
    questions: FormQuestion[]
  ) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, questions: reorder(questions) }
          : section
      ),
    }));
  };

  // HELPERS
  const isSelectType = (type: string) =>
    type === "single_select" || type === "multi_select";

  // EXPORT
  return {
    form,

    updateForm,
    setEntireForm,
    hydrateFormFromApiOnce,
    resetForm,

    addSection,
    updateSection,
    deleteSection,
    reorderSections,

    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,

    addOption,
    updateOption,
    removeOption,

    isSelectType,

    // Stepper
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    goToStep,

    // Modal
    isOpen, 
    setIsOpen: handleSetIsOpen,

    // Contract ID  
    formId, 
    setFormId,
  };
};