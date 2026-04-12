import { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useContractBuilder } from "../context/ContractBuilderContext";
import { StepLayout } from "../StepLayout";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { ContractAPI } from "../../../api/contracts.api";
import { 
  useGetContractDates, 
  useCreateMealTimeWindow, 
  useUpdateMealTimeWindow, 
  useDeleteMealTimeWindow,
  queryKeys,
} from "../../../hooks/useContracts";
import { PlusIcon, TrashIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { syncArrays } from "../../../utils/syncUtils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function TimeWindowList() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { contractId, nextStep, setIsSaving } = useContractBuilder();
  const queryClient = useQueryClient();

  const windowSchema = z.object({
    id: z.string().optional(),
    contract_date_id: z.string(),
    label: z.string().min(1, t('contracts.timeWindowList.labelRequired')),
    start_time: z.string().min(1, t('contracts.timeWindowList.startTimeRequired')),
    end_time: z.string().min(1, t('contracts.timeWindowList.endTimeRequired')),
  });

  const schema = z.object({
    timeWindows: z.array(windowSchema).min(1, t('contracts.timeWindowList.addAtLeastOneWindow')),
  });

  type FormValues = z.infer<typeof schema>;
  
  const { data: contractDatesResponse, isLoading: isDatesLoading } = useGetContractDates(contractId || "", {
    enabled: !!contractId,
  });
  const contractDates = contractDatesResponse?.data;

  
  const createTimeWindow = useCreateMealTimeWindow();
  const updateTimeWindow = useUpdateMealTimeWindow();
  const deleteTimeWindow = useDeleteMealTimeWindow();

  // Parallel fetch all time windows for all dates
  const windowQueries = useQueries({
    queries: (contractDates || []).map(d => ({
      queryKey: queryKeys.mealTimeWindows(d.id),
      queryFn: () => ContractAPI.getMealTimeWindows(d.id),
      enabled: Boolean(d.id) && Boolean(contractDates && contractDates.length > 0),
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh, no refetch
      gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
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
           await queryClient.refetchQueries({ queryKey: queryKeys.mealTimeWindows(date.id) });
        }
      }

      toast.success(t('contracts.timeWindowList.timeWindowsSaved'));
      nextStep();
    } catch (error) {
      console.error("Failed to sync logic", error);
      toast.error(t('contracts.timeWindowList.failedToSyncWindows'));
    } finally {
      setSubmitLoading(false);
      setIsSaving(false);
    }
  };

  if (isWindowsLoading || !hasInitialized) {
    return (
      <div className="space-y-6 py-4  mx-auto animate-pulse">

        {/* Global Error Placeholder */}
        <Skeleton className="h-5 w-3/4x rounded-md bg-destructive/10" />

        {/* Contract Dates List */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-card/60 backdrop-blur p-5 space-y-5 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ClockIcon className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>

            {/* Empty State */}
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, j) => (
                <div
                  key={j}
                  className="flex flex-col sm:flex-row items-end gap-3 rounded-xl border bg-muted/20 px-3 py-3"
                >
                  <Skeleton className="h-10 w-full sm:w-1/3 rounded-lg" />
                  <Skeleton className="h-10 w-full sm:w-1/4 rounded-lg" />
                  <Skeleton className="h-10 w-full sm:w-1/4 rounded-lg" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const hasDates = contractDates && contractDates.length > 0;
  const formErrors = form.formState.errors;

  return (
    <StepLayout
      title={t('contracts.timeWindowList.title')}
      description={t('contracts.timeWindowList.description')}
      onNext={form.handleSubmit(onSubmit)}
      isNextDisabled={!hasDates}
      isNextLoading={isSubmitLoading}
    >
      <div className="space-y-6 py-4 max-w-5xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        
        {!hasDates ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed bg-muted/20 text-center">
            <ClockIcon className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {t('contracts.dateList.noDatesFound')}
            </p>
          </div>
        ) : (
          <>
            {/* Global Error */}
            {formErrors.timeWindows?.root && (
              <div className="px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                {formErrors.timeWindows.root.message}
              </div>
            )}

            <div className="space-y-6">
              {contractDates.map((date) => {
                const indexes = fields
                  .map((f, i) => (f.contract_date_id === date.id ? i : -1))
                  .filter((i) => i !== -1);

                const dateLabel =
                  date.service_date + (date.notes ? ` • ${date.notes}` : '');

                return (
                  <div
                    key={date.id}
                    className="rounded-2xl border bg-card/60 backdrop-blur p-5 space-y-5 shadow-sm hover:shadow-md transition"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <ClockIcon className="w-4 h-4 text-primary" />
                        </div>

                        <div>
                          <p className="font-semibold text-sm">
                            {dateLabel}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {indexes.length} {t('contracts.contractBuilderSteps.timeWindows')}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          append({
                            contract_date_id: date.id,
                            label: "",
                            start_time: "",
                            end_time: "",
                          })
                        }
                      >
                        <PlusIcon className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                        {t('contracts.timeWindowList.addTimeWindow')}
                      </Button>
                    </div>

                    {/* Empty State */}
                    {indexes.length === 0 && (
                      <div className="text-xs text-muted-foreground text-center py-6 border rounded-xl bg-muted/20">
                        {t('contracts.timeWindowList.noTimeWindowsDefined')}
                      </div>
                    )}

                    {/* Windows */}
                    <div className="space-y-3">
                      {indexes.map((index) => (
                        <div
                          key={fields[index].id}
                          className="group flex flex-col sm:flex-row items-end gap-3 rounded-xl border bg-muted/20 px-3 py-3 hover:border-primary/40 transition"
                        >
                          {/* Label */}
                          <Field className="w-full sm:w-1/3 mx-0">
                            <FieldLabel className="text-[11px] text-muted-foreground">
                              {t('contracts.timeWindowList.label')}
                            </FieldLabel>

                            <FieldContent>
                              <Input
                                placeholder={t('contracts.timeWindowList.label')}
                                className="h-10 rounded-lg bg-background border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                {...form.register(`timeWindows.${index}.label`)}
                              />
                            </FieldContent>

                            {formErrors.timeWindows?.[index]?.label && (
                              <FieldError className="text-xs mt-1">
                                {formErrors.timeWindows[index]!.label!.message}
                              </FieldError>
                            )}
                          </Field>

                          {/* Start Time */}
                          <Field className="w-full sm:w-1/4 mx-0">
                            <FieldLabel className="text-[11px] text-muted-foreground">
                              {t('contracts.timeWindowList.startTime')}
                            </FieldLabel>

                            <FieldContent>
                              <Input
                                type="time"
                                className="h-10 rounded-lg bg-background border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                {...form.register(`timeWindows.${index}.start_time`)}
                              />
                            </FieldContent>

                            {formErrors.timeWindows?.[index]?.start_time && (
                              <FieldError className="text-xs mt-1">
                                {formErrors.timeWindows[index]!.start_time!.message}
                              </FieldError>
                            )}
                          </Field>

                          {/* End Time */}
                          <Field className="w-full sm:w-1/4 mx-0">
                            <FieldLabel className="text-[11px] text-muted-foreground">
                              {t('contracts.timeWindowList.endTime')}
                            </FieldLabel>

                            <FieldContent>
                              <Input
                                type="time"
                                className="h-10 rounded-lg bg-background border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                {...form.register(`timeWindows.${index}.end_time`)}
                              />
                            </FieldContent>

                            {formErrors.timeWindows?.[index]?.end_time && (
                              <FieldError className="text-xs mt-1">
                                {formErrors.timeWindows[index]!.end_time!.message}
                              </FieldError>
                            )}
                          </Field>

                          {/* Delete */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="opacity-0 group-hover:opacity-100 transition text-destructive hover:bg-destructive/10"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </StepLayout>
  );
}
