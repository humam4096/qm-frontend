import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useFormBuilderContext } from "../../context/FormBuilderContext";
import FormSectionCard from "./FormSectionCard";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { reorderQuestionItems, reorderSectionItems } from "../../utils/form-builder-drag-utils";
import { getSectionsStepValidationErrorKey } from "../../utils/form-builder.utils";
import { FormStepLayout } from "./FormStepLayout";
import { ErrorMsg } from "@/components/dashboard/ErrorMsg";


export const FormSectionBuilderTap = () => {
  const { t } = useTranslation();
  const { form, addSection, reorderSections, reorderQuestions, nextStep, updateForm } = useFormBuilderContext();

  console.log(form)
  
  const sectionsStepErrorKey = useMemo(
    () => getSectionsStepValidationErrorKey(form),
    [form]
  );

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

  const onSubmit = () => {
    if (sectionsStepErrorKey) {
      toast.error(t(`forms.builder.${sectionsStepErrorKey}`));
      return;
    }
    updateForm(form);
    nextStep();
  };

  return (

    <FormStepLayout
      // title={t('forms.builder.sections')}
      onNext={onSubmit}
      isNextDisabled={Boolean(sectionsStepErrorKey)}
    >
      <div className="space-y-4">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t('forms.builder.sections')}</h3>
          <Button onClick={addSection}>
            <Plus className="w-4 h-4 mr-2" />
            {t('forms.builder.addSection')}
          </Button>
        </div>

        {/* Sections List */}
        {form.sections.length === 0 && (
          <div className="text-muted-foreground text-sm">
            {t('forms.builder.noSectionsYet')}
          </div>
        )}

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {form.sections.map((section) => (
            <FormSectionCard key={section.id} section={section} />
          ))}
        </DndContext>


        {/* Error Message */}
        {sectionsStepErrorKey && (
          <ErrorMsg message={t(`forms.builder.${sectionsStepErrorKey}`)} />
        )}
      </div>
    </FormStepLayout>
  );
};