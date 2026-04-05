import { Input } from "@/components/ui/input";
import { useFormBuilderContext } from "../../context/FormBuilderContext";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FormQuestionOptions from "./FormQuestionOptions";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";


const FormQuestionCard = ({
  sectionId,
  question,
}: {
  sectionId: string;
  question: any;
}) => {
  const { t } = useTranslation();
  const {
    updateQuestion,
    deleteQuestion,
  } = useFormBuilderContext();
  const { isDragging } = useDraggable({
    id: question.id,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelect =
    question.question_type === "single_select" ||
    question.question_type === "multi_select";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="group flex gap-3 items-start"
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className="mt-3 cursor-grab active:cursor-grabbing opacity-20 group-hover:opacity-100 transition"
      >
        ⋮⋮
      </div>

      {/* Card */}
      <div className="flex-1 rounded-xl bg-card border border-border/50 p-4 space-y-4 hover:shadow-md transition">

        {/* Question */}
        <Input
          value={question.question}
          placeholder={t('forms.builder.enterQuestion')}
          onChange={(e) =>
            updateQuestion(sectionId, question.id, {
              question: e.target.value,
            })
          }
          className="border-none shadow-none text-sm font-medium px-0 focus-visible:ring-0"
        />

        {/* Controls */}
        <div className="grid grid-cols-3 gap-3">

          {/* TYPE */}
          <Select
            value={question.question_type}
            onValueChange={(val) =>
              updateQuestion(sectionId, question.id, {
                question_type: val,
                options: [],
              })
            }
          >
            <SelectTrigger className="w-full ">
              <SelectValue placeholder={t('forms.builder.userRole')} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="text">{t('forms.builder.text')}</SelectItem>
                <SelectItem value="number">{t('forms.builder.number')}</SelectItem>
                <SelectItem value="boolean">{t('forms.builder.boolean')}</SelectItem>
                <SelectItem value="single_select">{t('forms.builder.singleSelect')}</SelectItem>
                <SelectItem value="multi_select">{t('forms.builder.multiSelect')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* WEIGHT */}
          <Input
            type="number"
            value={question.weight}
            onChange={(e) =>
              updateQuestion(sectionId, question.id, {
                weight: Number(e.target.value),
              })
            }
            className="bg-muted/40 border-none text-sm"
          />

          {/* REQUIRED */}
          <div className="flex items-center gap-2 justify-end">
            <Switch
              checked={question.is_required}
              onCheckedChange={(v) =>
                updateQuestion(sectionId, question.id, {
                  is_required: v,
                })
              }
            />
            <span className="text-xs text-muted-foreground">
              {t('forms.builder.required')}
            </span>
          </div>
        </div>

        {/* Notes */}
        <Textarea
          value={question.notes || ""}
          placeholder={t('forms.builder.notes')}
          onChange={(e) =>
            updateQuestion(sectionId, question.id, {
              notes: e.target.value,
            })
          }
          className="bg-muted/30 border-none text-sm"
        />

        {/* Options */}
        {isSelect && (
          <FormQuestionOptions
            question={question}
            sectionId={sectionId}
          />
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-[11px] text-muted-foreground">
            {question.question_type}
          </span>

          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => deleteQuestion(sectionId, question.id)}
          >
            {t('forms.builder.deleteQuestion')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormQuestionCard;