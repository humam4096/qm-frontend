import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useContractBuilder } from "../context/ContractBuilderContext";
import { StepLayout } from "../StepLayout";
import { useGetContractDates, useCreateContractDate, useUpdateContractDate, useDeleteContractDate } from "../../../hooks/useContracts";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { syncArrays } from "../../../utils/syncUtils";

const dateSchema = z.object({
  id: z.string().optional(),
  service_date: z.string().min(1, "Service date is required"),
  notes: z.string().optional(),
});

const schema = z.object({
  dates: z.array(dateSchema).min(1, "Please add at least one service date"),
});

type FormValues = z.infer<typeof schema>;

export function DateList() {
  const { contractId, nextStep, setIsSaving } = useContractBuilder();
  
  const { data: contracDatesResponse, isLoading: isDatesLoading, refetch } = useGetContractDates(contractId || "");

  const contractDates = contracDatesResponse?.data;
  const createDate = useCreateContractDate();
  const updateDate = useUpdateContractDate();
  const deleteDate = useDeleteContractDate();

  const [isSubmitLoading, setSubmitLoading] = useState(false);

  console.log(contractDates)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { dates: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dates",
  });

  // Load Initial Data from Server
  useEffect(() => {
    if (contractDates) {
      form.reset({
        dates: contractDates?.map(d => ({
          id: d.id,
          service_date: d.service_date,
          notes: d.notes || "",
        }))
      });
    }
  }, [contractDates, form]);


  const [newDate, setNewDate] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const handleAddInline = () => {
    if (!newDate) return;
    append({ service_date: newDate, notes: newNotes });
    setNewDate("");
    setNewNotes("");
  };

  const onSubmit = async (values: FormValues) => {
    if (!contractId) return;
    
    setSubmitLoading(true);
    setIsSaving(true);
    
    try {
      // Find diff between Server mapping and Local mappings
      const { added, updated, deleted } = syncArrays(contractDates, values.dates, (serverItem, localItem) => {
        // Fast shallow check to avoid unnecessary updates
        return serverItem.service_date !== localItem.service_date || 
              (serverItem.notes || "") !== (localItem.notes || "");
      });

      const promises: Promise<any>[] = [];

      // Execute Deletions
      for (const id of deleted) promises.push(deleteDate.mutateAsync(id));
      
      // Execute Additions
      for (const item of added) {
        promises.push(createDate.mutateAsync({
          contract_id: contractId,
          service_date: item.service_date,
          notes: item.notes || undefined,
        }));
      }

      // Execute Updates
      for (const item of updated) {
        if (item.id) {
           promises.push(updateDate.mutateAsync({
             id: item.id,
             payload: {
               service_date: item.service_date,
               notes: item.notes || undefined,
             }
           }));
        }
      }

      await Promise.all(promises);

      // Force a refetch so the server assigns IDs and Step 3 gets clean data
      if (promises.length > 0) {
        await refetch();
      }

      // Navigate Next
      nextStep();
      
    } catch (error) {
      console.error("Failed to save and sync dates", error);
      toast.error("Failed to sync dates with the server.");
    } finally {
      setSubmitLoading(false);
      setIsSaving(false);
    }
  };

  if (isDatesLoading) {
    return <div className="py-10 text-center">Loading dates...</div>;
  }

  const hasDatesAssigned = fields.length > 0;
  const formErrors = form.formState.errors;

  return (
    <StepLayout
      title="Contract Dates"
      description="Add all the specific service dates for this contract."
      onNext={form.handleSubmit(onSubmit)}
      isNextDisabled={!hasDatesAssigned}
      isNextLoading={isSubmitLoading}
    >
      <div className="space-y-6 py-4">
        
        {/* Add New Date Local Form UI */}
        <div className="flex flex-col sm:flex-row items-end gap-4 p-4 rounded-xl border-2 border-dashed bg-muted/10">
          <div className="flex-1 w-full flex flex-col sm:flex-row gap-4">
            <Field className="mx-0" orientation="vertical">
              <FieldLabel htmlFor="service_date_input">Date</FieldLabel>
              <FieldContent>
                <Input 
                  id="service_date_input" 
                  type="date" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </FieldContent>
            </Field>

            <Field className="mx-0" orientation="vertical">
              <FieldLabel htmlFor="notes_input">Notes (Optional)</FieldLabel>
              <FieldContent>
                <Input 
                  id="notes_input" 
                  placeholder="e.g. First day of season..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </FieldContent>
            </Field>
          </div>

          <Button 
            type="button"
            onClick={handleAddInline} 
            disabled={!newDate} 
            className="w-full sm:w-auto"
          >
            <PlusIcon className="w-4 h-4 mr-2" /> Add Date
          </Button>
        </div>

        {formErrors.dates?.root && (
          <p className="text-sm text-destructive">{formErrors.dates.root.message}</p>
        )}

        {/* Existing Dates Forms mapped to RHF */}
        <div>
          <h3 className="text-sm font-medium mb-3">Service Dates ({fields.length})</h3>
          
          {fields.length === 0 ? (
            <div className="text-center py-6 border rounded-lg text-muted-foreground bg-muted/30">
              No dates added yet. Please add a date above.
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div 
                  key={field.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center p-3 border rounded-lg bg-card shadow-sm gap-4"
                >
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field orientation="vertical" className="mx-0">
                      <FieldContent>
                        <Input 
                          type="date"
                          className="h-9"
                          {...form.register(`dates.${index}.service_date`)} 
                        />
                      </FieldContent>
                      {formErrors.dates?.[index]?.service_date && (
                        <FieldError className="mt-1">{formErrors.dates[index]!.service_date!.message}</FieldError>
                      )}
                    </Field>

                    <Field orientation="vertical" className="mx-0">
                      <FieldContent>
                        <Input 
                          placeholder="Notes..."
                          className="h-9"
                          {...form.register(`dates.${index}.notes`)} 
                        />
                      </FieldContent>
                    </Field>
                  </div>

                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                    onClick={() => remove(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StepLayout>
  );
}
