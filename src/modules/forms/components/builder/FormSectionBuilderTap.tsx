import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useFormBuilderContext } from "../../context/FormBuilderContext";
import FormSectionCard from "./FormSectionCard";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { reorderQuestionItems, reorderSectionItems } from "../../utils/form-builder-drag-utils";
import { FormStepLayout } from "./FormStepLayout";


export const FormSectionBuilderTap = () => {

  const { form, addSection, reorderSections, reorderQuestions, nextStep, updateForm } = useFormBuilderContext();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Section drag
    if (form.sections.some(s => s.id === activeId)) {
      const newSections = reorderSectionItems(form.sections, activeId, overId);
      reorderSections(newSections);
      return;
    }

    // Question drag
    for (const section of form.sections) {
      if (section.questions.some(q => q.id === activeId)) {
        const newQuestions = reorderQuestionItems(section.questions, activeId, overId);
        reorderQuestions(section.id, newQuestions);
        return;
      }
    }
  };

  // update form meta data
  const onSubmit = () => {
    updateForm(form);
    nextStep();
  };

  return (

    <FormStepLayout
      title="Form Sections"
      description="Form Sections"
      onNext={onSubmit}
    >
      <div className="space-y-4">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Sections</h3>
          <Button onClick={addSection}>
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        {/* Sections List */}
        {form.sections.length === 0 && (
          <div className="text-muted-foreground text-sm">
            No sections yet. Start by adding one.
          </div>
        )}

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {form.sections.map((section) => (
            <FormSectionCard key={section.id} section={section} />
          ))}
        </DndContext>
      </div>
    </FormStepLayout>
  );
};