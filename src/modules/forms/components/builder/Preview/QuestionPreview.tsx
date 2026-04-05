import { Badge } from "@/components/ui/badge";
import type { FormQuestion } from "@/modules/forms/types";
import { useTranslation } from "react-i18next";

interface QuestionPreviewProps {
  question: FormQuestion;
}

export const QuestionPreview = ({ question }: QuestionPreviewProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <label className="font-medium">
          {question.question} {question.is_required && <span className="text-red-500">*</span>}
        </label>
        <Badge variant="outline">{question.weight} {t('forms.builder.pts')}</Badge>
      </div>

      {question.notes && <p className="text-xs text-muted-foreground mb-2">{question.notes}</p>}

      {question.question_type === "text" && (
        <input type="text" className="border rounded px-2 py-1 w-full" disabled />
      )}

      {question.question_type === "number" && (
        <input type="number" className="border rounded px-2 py-1 w-full" disabled />
      )}

      {question.question_type === "boolean" && (
        <select className="border rounded px-2 py-1 w-full" disabled>
          <option>{t('forms.builder.yes')}</option>
          <option>{t('forms.builder.no')}</option>
        </select>
      )}

      {(question.question_type === "single_select" || question.question_type === "multi_select") && (
        <div className="flex flex-col space-y-1">
          {question.options.map((opt) => (
            <label key={opt.id} className="flex items-center space-x-2">
              <input
                type={question.question_type === "single_select" ? "radio" : "checkbox"}
                name={question.id}
                disabled
              />
              <span>{opt.option || t('forms.builder.option')}</span>
              {opt.weight > 0 && <Badge variant="secondary">{opt.weight} {t('forms.builder.pts')}</Badge>}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};