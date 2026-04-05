import type { FormBuilderState } from "../types";

// Generate temp IDs
export const generateId = () => crypto.randomUUID();

// Reorder helper
export const reorder = <T>(list: T[]): T[] =>
  list.map((item, index) => ({
    ...item,
    sequence_order: index + 1,
  }));

/** i18n key under `forms.builder.*` — null when step 2 can advance to preview */
export function getSectionsStepValidationErrorKey(
  form: FormBuilderState
):
  | "sectionsRequired"
  | "sectionTitleRequired"
  | "sectionNeedsQuestion"
  | "questionTextRequired"
  | null {
  if (form.sections.length === 0) return "sectionsRequired";
  for (const section of form.sections) {
    if (!section.title?.trim()) return "sectionTitleRequired";
    if (section.questions.length === 0) return "sectionNeedsQuestion";
    for (const q of section.questions) {
      if (!q.question?.trim()) return "questionTextRequired";
    }
  }
  return null;
}