import { Badge } from "@/components/ui/badge";
import type { FormQuestion } from "@/modules/forms/types";
import { useTranslation } from "react-i18next";

interface QuestionPreviewProps {
  question: FormQuestion;
}

export const QuestionPreview = ({ question }: QuestionPreviewProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="rounded-xl bg-muted/30 border border-border/40 p-4 space-y-3">

      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none">
            {question.question}

            {question.is_required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </label>

          {question.notes && (
            <p className="text-xs text-muted-foreground">
              {question.notes}
            </p>
          )}
        </div>

        <Badge variant="secondary" className="rounded-full shrink-0">
          {question.weight} {t('forms.builder.pts')}
        </Badge>
      </div>

      {/* Answer Preview */}
      <div className="pt-1">

        {question.question_type === "text" && (
          <input
            type="text"
            disabled
            className="w-full rounded-md bg-background border border-border/50 px-3 py-2 text-sm"
          />
        )}

        {question.question_type === "number" && (
          <input
            type="number"
            disabled
            className="w-full rounded-md bg-background border border-border/50 px-3 py-2 text-sm"
          />
        )}

        {question.question_type === "boolean" && (
          <select
            disabled
            className="w-full rounded-md bg-background border border-border/50 px-3 py-2 text-sm"
          >
            <option>{t('forms.builder.yes')}</option>
            <option>{t('forms.builder.no')}</option>
          </select>
        )}

        {(question.question_type === "single_select" ||
          question.question_type === "multi_select") && (
          <div className="space-y-2">
            {question.options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center justify-between gap-3 rounded-md px-3 py-2 bg-background border border-border/40"
              >
                <div className="flex items-center gap-2">
                  <input
                    type={
                      question.question_type === "single_select"
                        ? "radio"
                        : "checkbox"
                    }
                    name={question.id}
                    disabled
                  />
                  <span className="text-sm">
                    {opt.option || t('forms.builder.option')}
                  </span>
                </div>

                {opt.weight > 0 && (
                  <Badge variant="secondary" className="rounded-full">
                    {opt.weight} {t('forms.builder.pts')}
                  </Badge>
                )}
              </label>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};