import type { FormSection, FormQuestion } from "../types";

// 🔹 Reorder sections
export const reorderSectionItems = (
  sections: FormSection[],
  activeId: string,
  overId: string
) => {
  const oldIndex = sections.findIndex(s => s.id === activeId);
  const newIndex = sections.findIndex(s => s.id === overId);
  if (oldIndex === -1 || newIndex === -1) return sections;

  const newSections = [...sections];
  const [moved] = newSections.splice(oldIndex, 1);
  newSections.splice(newIndex, 0, moved);

  return newSections;
};

// 🔹 Reorder questions
export const reorderQuestionItems = (
  questions: FormQuestion[],
  activeId: string,
  overId: string
) => {
  const oldIndex = questions.findIndex(q => q.id === activeId);
  const newIndex = questions.findIndex(q => q.id === overId);
  if (oldIndex === -1 || newIndex === -1) return questions;

  const newQuestions = [...questions];
  const [moved] = newQuestions.splice(oldIndex, 1);
  newQuestions.splice(newIndex, 0, moved);

  return newQuestions;
};