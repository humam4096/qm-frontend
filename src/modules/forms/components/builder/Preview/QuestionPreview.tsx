import { Badge } from "@/components/ui/badge";
import type { FormQuestion } from "@/modules/forms/types";

interface QuestionPreviewProps {
  question: FormQuestion;
}

export const QuestionPreview = ({ question }: QuestionPreviewProps) => {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <label className="font-medium">
          {question.question} {question.is_required && <span className="text-red-500">*</span>}
        </label>
        <Badge variant="outline">{question.weight} pts</Badge>
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
          <option>Yes</option>
          <option>No</option>
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
              <span>{opt.option || "Option"}</span>
              {opt.weight > 0 && <Badge variant="secondary">{opt.weight} pts</Badge>}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};