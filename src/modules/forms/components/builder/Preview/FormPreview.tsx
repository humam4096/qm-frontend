import { Badge } from "@/components/ui/badge";
import { QuestionPreview } from "./QuestionPreview";
import { useCreateForm, useUpdateForm } from "@/modules/forms/hooks/useForms";
import { FormStepLayout } from "../FormStepLayout";
import { ErrorMsg } from "@/components/dashboard/ErrorMsg";
import { useFormBuilderContext } from "@/modules/forms/context/FormBuilderContext";
import { toast } from "sonner";

export const FormPreview = () => {

  const { mutateAsync: createForm, isPending: isCreating, error: createError } = useCreateForm();
  const {form, resetForm, setCurrentStep, setIsOpen, formId } = useFormBuilderContext();
  const { mutateAsync: updateForm, isPending: isUpdating, error: updateError } = useUpdateForm();

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;

  console.log(form)
  
  const handleSubmit = async () => {
    try {
      if(formId) {
        await updateForm({id: formId, payload: form});
        toast.success("Form updated successfully!");
      } else {
        await createForm(form);
        toast.success("Form saved successfully!");
      }

      setCurrentStep(1);
      resetForm();
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  };

  if (!form.sections.length) {
    return <p className="text-muted-foreground">No sections added yet.</p>;
  }

  return (
    <FormStepLayout
      title="Form Preview"
      description="Form Preview"
      onNext={handleSubmit}
      isLoading={isLoading}
    >
      <div className="space-y-6 p-6 border rounded-lg bg-white shadow-sm">
        {/* Form Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{form.name}</h2>
            {form.description && (
              <p className="text-sm text-muted-foreground mt-1">{form.description}</p>
            )}
          </div>
          <Badge variant={form.is_active ? "default" : "destructive"}>
            {form.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Sections */}
        {form.sections.map((section) => (
          <div key={section.id} className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <Badge variant="secondary">Section {section.sequence_order}</Badge>
            </div>
            {section.description && (
              <p className="text-sm text-muted-foreground">{section.description}</p>
            )}
            <div className="space-y-4">
              {section.questions.map((q) => (
                <QuestionPreview key={q.id} question={q} />
              ))}
            </div>
          </div>
        ))}

        {error &&
          <div className="mt-4">
            <ErrorMsg message={error?.message} />
          </div>
        }
      </div>
    </FormStepLayout>

  );
};