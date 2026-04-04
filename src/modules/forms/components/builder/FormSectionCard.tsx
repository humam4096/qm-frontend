import { Button } from "@/components/ui/button";
import { useFormBuilderContext } from "../../context/FormBuilderContext";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import FormQuestionCard from "./FormQuestionCard";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FormQuestion } from "../../types";
import { useDraggable } from "@dnd-kit/core";


const FormSectionCard = ({ section }: { section: any }) => {
  const {
    updateSection,
    deleteSection,
    addQuestion,
  } = useFormBuilderContext();
  const { isDragging } = useDraggable({
    id: section.id,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [open, setOpen] = useState(true);

  return (
    <div className="flex items-center gap-2" ref={setNodeRef} style={style} {...attributes}>
      {/* Section content */}
      <div className="border rounded-lg bg-white shadow-sm w-full">

        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-muted/40">
          <div className="flex items-center gap-2 w-full">

            {/* Expand Toggle */}
            <button onClick={() => setOpen(!open)}>
              {open ? <ChevronUp /> : <ChevronDown />}
            </button>

            {/* Title */}
            <Input
              value={section.title}
              placeholder="Section title..."
              onChange={(e) =>
                updateSection(section.id, { title: e.target.value })
              }
              className="max-w-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deleteSection(section.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Body */}
        {open && (
          <div className="p-4 space-y-4">

            {/* Description */}
            <Textarea
              value={section.description || ""}
              placeholder="Section description..."
              onChange={(e) =>
                updateSection(section.id, {
                  description: e.target.value,
                })
              }
            />

            {/* Questions Placeholder */}
            <div className="border rounded p-3 space-y-2 bg-muted/20">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Questions ({section.questions.length})
                </span>

                <Button
                  size="sm"
                  onClick={() => addQuestion(section.id)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-2">
                <SortableContext
                  items={section.questions.map((q:FormQuestion) => q.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {section.questions.map((q: FormQuestion) => (
                    <FormQuestionCard
                      key={q.id}
                      sectionId={section.id}
                      question={q}
                    />
                  ))}
                </SortableContext>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* drag handle */}
      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        ☰ 
      </div>
    </div>
  );
};

export default FormSectionCard;