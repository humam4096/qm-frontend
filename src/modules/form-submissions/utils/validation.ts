import type { Form } from '@/modules/forms/types';
import type { Answer } from '../types';

export function validateForm(form: Form, answers: Answer[]): boolean {
  for (const section of form.sections) {
    for (const question of section.questions) {
      if (!question.is_required) continue;

      const answer = answers.find(a => a.question_id === question.id);
      if (!answer) return false;

      const hasValue =
        (answer.answer_text && answer.answer_text.trim() !== '') ||
        answer.answer_number !== undefined ||
        answer.answer_boolean !== undefined ||
        (answer.selected_options && answer.selected_options.length > 0);

      if (!hasValue) return false;
    }
  }
  return true;
}

export function calculateProgress(form: Form, answers: Answer[]): number {
  let total = 0;
  let answered = 0;

  for (const section of form.sections) {
    for (const question of section.questions) {
      total++;
      const answer = answers.find(a => a.question_id === question.id);
      
      if (answer) {
        const hasValue =
          (answer.answer_text && answer.answer_text.trim() !== '') ||
          answer.answer_number !== undefined ||
          answer.answer_boolean !== undefined ||
          (answer.selected_options && answer.selected_options.length > 0);
        
        if (hasValue) answered++;
      }
    }
  }

  return total === 0 ? 0 : Math.round((answered / total) * 100);
}
