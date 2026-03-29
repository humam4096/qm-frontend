import { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useContractBuilder } from "../context/ContractBuilderContext";
import { StepLayout } from "../StepLayout";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { ContractAPI } from "../../../api/contracts.api";
import { 
  useGetContractDates, 
  useCreateMealTimeWindow, 
  useUpdateMealTimeWindow, 
  useDeleteMealTimeWindow 
} from "../../../hooks/useContracts";
import { PlusIcon, TrashIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { syncArrays } from "../../../utils/syncUtils";

const windowSchema = z.object({
  id: z.string().optional(),
  contract_date_id: z.string(),
  label: z.string().min(1, "Label is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
});

const schema = z.object({
  timeWindows: z.array(windowSchema).min(1, "Please define at least one time window across all dates"),
});

type FormValues = z.infer<typeof schema>;

export function TimeWindowList() {
  const { contractId, nextStep, setIsSaving } = useContractBuilder();
  const queryClient = useQueryClient();
  
  const { data: contractDatesResponse, isLoading: isDatesLoading } = useGetContractDates(contractId || "");
  const contractDates = contractDatesResponse?.data;

  
  const createTimeWindow = useCreateMealTimeWindow();
  const updateTimeWindow = useUpdateMealTimeWindow();
  const deleteTimeWindow = useDeleteMealTimeWindow();

  // Parallel fetch all time windows for all dates
  const windowQueries = useQueries({
    queries: (contractDates || []).map(d => ({
      queryKey: ['mealTimeWindows', d.id],
      queryFn: () => ContractAPI.getMealTimeWindows(d.id),
      enabled: !!d.id
    }))
  });

  const isWindowsLoading = windowQueries.some(q => q.isLoading) || isDatesLoading;
  
  const serverTimeWindows = useMemo(() => {
    return windowQueries.flatMap((q, index) => {
      const d = q.data as any;
      const array = (Array.isArray(d) ? d : d?.data) || [];
      const parentId = contractDates?.[index]?.id;
      return array.map((item: any) => ({ ...item, contract_date_id: item.contract_date_id || parentId }));
    });
  }, [windowQueries, contractDates]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { timeWindows: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "timeWindows",
  });

  // form debug removed
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const isSuccess = windowQueries.every(q => q.isSuccess);
    if (!hasInitialized && contractDates && isSuccess) {
      form.reset({
        timeWindows: serverTimeWindows.map(tw => ({
          id: tw.id,
          contract_date_id: tw.contract_date_id,
          label: tw.label,
          start_time: tw.start_time,
          end_time: tw.end_time,
        }))
      });
      setHasInitialized(true);
    }
  }, [hasInitialized, contractDates, windowQueries, serverTimeWindows, form]);


  const [isSubmitLoading, setSubmitLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setSubmitLoading(true);
    setIsSaving(true);
    
    try {
      const { added, updated, deleted } = syncArrays(serverTimeWindows, values.timeWindows, (s, l) => {
        return s.label !== l.label || s.start_time !== l.start_time || s.end_time !== l.end_time;
      });

      const promises: Promise<any>[] = [];

      // Execute Deletions
      for (const id of deleted) promises.push(deleteTimeWindow.mutateAsync(id));
      
      // Execute Additions
      for (const item of added) {
        promises.push(createTimeWindow.mutateAsync({
          contract_date_id: item.contract_date_id,
          label: item.label,
          start_time: item.start_time,
          end_time: item.end_time,
        }));
      }

      // Execute Updates
      for (const item of updated) {
        if (item.id) {
           promises.push(updateTimeWindow.mutateAsync({
             id: item.id,
             payload: {
               label: item.label,
               start_time: item.start_time,
               end_time: item.end_time,
             }
           }));
        }
      }

      await Promise.all(promises);

      // Force refetch to sync all specific caches
      if (promises.length > 0 && contractDates) {
        for (const date of contractDates) {
           await queryClient.refetchQueries({ queryKey: ['mealTimeWindows', date.id] });
        }
      }

      toast.success("Time windows saved.");
      nextStep();
    } catch (error) {
      console.error("Failed to sync logic", error);
      toast.error("Failed to sync time windows with the server.");
    } finally {
      setSubmitLoading(false);
      setIsSaving(false);
    }
  };

  if (isWindowsLoading || !hasInitialized) {
    return <div className="py-10 text-center">Loading time windows...</div>;
  }

  const hasDates = contractDates && contractDates.length > 0;
  const formErrors = form.formState.errors;

  return (
    <StepLayout
      title="Time Windows"
      description="Define meal time windows (e.g., Breakfast, Lunch, Dinner) for each service date."
      onNext={form.handleSubmit(onSubmit)}
      isNextDisabled={!hasDates}
      isNextLoading={isSubmitLoading}
    >
      <div className="space-y-6 py-4">
        {!hasDates ? (
          <div className="text-center py-10 bg-muted/30 rounded-xl border-dashed border-2">
            No dates found. Please go back and add service dates first.
          </div>
        ) : (
          <div className="space-y-6">
            
            {formErrors.timeWindows?.root && (
               <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg font-medium">
                 {formErrors.timeWindows.root.message}
               </div>
            )}

            {contractDates.map((date) => {
              // Group fields by date
              const indexes = fields.map((f, i) => f.contract_date_id === date.id ? i : -1).filter(i => i !== -1);
              const dateLabel = date.service_date + (date.notes ? ` (${date.notes})` : '');

              return (
                <div key={date.id} className="border rounded-xl p-4 bg-card shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <ClockIcon className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-lg">{dateLabel}</h4>
                  </div>

                  <div className="space-y-3 mb-4">
                    {indexes.length === 0 ? (
                      <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg text-center border-dashed border">
                        No time windows defined for this date.
                      </div>
                    ) : (
                      indexes.map(index => (
                        <div key={fields[index].id} className="flex flex-col sm:flex-row items-end gap-3 bg-muted/10 p-3 rounded-lg border-dashed border">
                          <Field orientation="vertical" className="w-full sm:w-1/3 mx-0">
                            <FieldLabel className="text-xs">Label</FieldLabel>
                            <FieldContent>
                              <Input size={1} className="h-8 shadow-none" {...form.register(`timeWindows.${index}.label`)} />
                            </FieldContent>
                            {formErrors.timeWindows?.[index]?.label && (
                              <FieldError className="text-xs mt-1">{formErrors.timeWindows[index]!.label!.message}</FieldError>
                            )}
                          </Field>
                          
                          <Field orientation="vertical" className="w-full sm:w-1/4 mx-0">
                            <FieldLabel className="text-xs">Start Time</FieldLabel>
                            <FieldContent>
                              <Input type="time" size={1} className="h-8 shadow-none" {...form.register(`timeWindows.${index}.start_time`)} />
                            </FieldContent>
                            {formErrors.timeWindows?.[index]?.start_time && (
                              <FieldError className="text-xs mt-1">{formErrors.timeWindows[index]!.start_time!.message}</FieldError>
                            )}
                          </Field>

                          <Field orientation="vertical" className="w-full sm:w-1/4 mx-0">
                            <FieldLabel className="text-xs">End Time</FieldLabel>
                            <FieldContent>
                              <Input type="time" size={1} className="h-8 shadow-none" {...form.register(`timeWindows.${index}.end_time`)} />
                            </FieldContent>
                            {formErrors.timeWindows?.[index]?.end_time && (
                              <FieldError className="text-xs mt-1">{formErrors.timeWindows[index]!.end_time!.message}</FieldError>
                            )}
                          </Field>

                          <Button 
                            type="button"
                            variant="ghost"
                            size="icon-sm" 
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 mb-0.5" 
                            onClick={() => remove(index)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                  <Button 
                    type="button"
                    variant="outline"
                    size="sm" 
                    onClick={() => append({ contract_date_id: date.id, label: "", start_time: "", end_time: "" })}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" /> Add Time Window
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StepLayout>
  );
}
