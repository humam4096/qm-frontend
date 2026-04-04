import { Input } from "@/components/ui/input";
import { useFormBuilderContext } from "../../context/FormBuilderContext";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FormQuestionOptions from "./FormQuestionOptions";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";


const FormQuestionCard = ({
  sectionId,
  question,
}: {
  sectionId: string;
  question: any;
}) => {
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
   
    <div className="flex items-center gap-2" ref={setNodeRef} style={style} {...attributes}>
      {/* Question content */}
      <div className="border rounded-md p-3 bg-white space-y-3 w-full hover:shadow-md transition">
        {/* QUESTION TEXT */}
        <Input
          value={question.question}
          placeholder="Enter question..."
          onChange={(e) =>
            updateQuestion(sectionId, question.id, {
              question: e.target.value,
            })
          }
        />

        {/* TYPE + WEIGHT + REQUIRED */}
        <div className="grid grid-cols-3 gap-3">

          {/* TYPE */}
          <select
            value={question.question_type}
            onChange={(e) =>
              updateQuestion(sectionId, question.id, {
                question_type: e.target.value,
                options: [], // reset options when type changes
              })
            }
            className="border rounded px-2 py-1"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="single_select">Single Select</option>
            <option value="multi_select">Multi Select</option>
          </select>

          {/* WEIGHT */}
          <Input
            type="number"
            value={question.weight}
            onChange={(e) =>
              updateQuestion(sectionId, question.id, {
                weight: Number(e.target.value),
              })
            }
          />

          {/* REQUIRED */}
          <div className="flex items-center gap-2">
            <Switch
              checked={question.is_required}
              onCheckedChange={(v) =>
                updateQuestion(sectionId, question.id, {
                  is_required: v,
                })
              }
            />
            <span className="text-xs">Required</span>
          </div>
        </div>

        {/* NOTES */}
        <Textarea
          value={question.notes || ""}
          placeholder="Notes (optional)"
          onChange={(e) =>
            updateQuestion(sectionId, question.id, {
              notes: e.target.value,
            })
          }
        />

        {/* OPTIONS (CONDITIONAL) */}
          {isSelect && (
            <FormQuestionOptions
              question={question}
              sectionId={sectionId}
            />
          )}

        {/* DELETE */}
        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteQuestion(sectionId, question.id)}
          >
            Delete Question
          </Button>
        </div>
      </div>

      {/* drag handle */}
      <div {...listeners} className="cursor-grab active:cursor-grabbing text-xl font-bold">
        ⋮⋮
      </div>

    </div>
  );
};

export default FormQuestionCard;