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
import { useTranslation } from "react-i18next";


const FormSectionCard = ({ section }: { section: any }) => {
  const { t } = useTranslation();
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="group flex gap-3 items-start"
    >
      {/* Drag Handle (floating, subtle) */}
      <div
        {...listeners}
        className="mt-4 cursor-grab active:cursor-grabbing opacity-30 group-hover:opacity-100 transition"
      >
        ⋮⋮
      </div>

      {/* Section Card */}
      <div className="flex-1 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-3 w-full">

            {/* Expand */}
            <button
              onClick={() => setOpen(!open)}
              className="text-muted-foreground hover:text-foreground transition"
            >
              {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* Title */}
            <Input
              value={section.title}
              placeholder={t('forms.builder.sectionTitle')}
              onChange={(e) =>
                updateSection(section.id, { title: e.target.value })
              }
              className="border-none shadow-none text-base font-medium focus-visible:ring-0 px-0"
            />
          </div>

          {/* Delete */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => deleteSection(section.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Body */}
        {open && (
          <div className="px-5 py-5 space-y-5">

            {/* Description */}
            <Textarea
              value={section.description || ""}
              placeholder={t('forms.builder.sectionDescription')}
              onChange={(e) =>
                updateSection(section.id, {
                  description: e.target.value,
                })
              }
              className="min-h-[80px] bg-muted/30 border-none focus-visible:ring-1"
            />

            {/* Questions Block */}
            <div className="space-y-3">

              {/* Header */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {t('forms.builder.questions')} ({section.questions.length})
                </span>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => addQuestion(section.id)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {t('forms.builder.addQuestion')}
                </Button>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                <SortableContext
                  items={section.questions.map((q: FormQuestion) => q.id)}
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
    </div>
  );
};

export default FormSectionCard;