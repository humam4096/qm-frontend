import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useContractBuilder } from "../context/ContractBuilderContext";
import { StepLayout } from "../StepLayout";
import { useGetContractDates, useCreateContractDate, useUpdateContractDate, useDeleteContractDate } from "../../../hooks/useContracts";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { syncArrays } from "../../../utils/syncUtils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function DateList() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { contractId, nextStep, setIsSaving } = useContractBuilder();

  const dateSchema = z.object({
    id: z.string().optional(),
    service_date: z.string().min(1, t('contracts.dateList.serviceDateRequired')),
    notes: z.string().optional(),
  });

  const schema = z.object({
    dates: z.array(dateSchema).min(1, t('contracts.dateList.addAtLeastOneDate')),
  });

  type FormValues = z.infer<typeof schema>;
  
  const { data: contracDatesResponse, isLoading: isDatesLoading, refetch } = useGetContractDates(contractId || "");

  const contractDates = contracDatesResponse?.data;
  const createDate = useCreateContractDate();
  const updateDate = useUpdateContractDate();
  const deleteDate = useDeleteContractDate();

  const [isSubmitLoading, setSubmitLoading] = useState(false);

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

      toast.success(t('contracts.dateList.serviceeDatesSaved'));
      // Navigate Next
      nextStep();
      
    } catch (error) {
      console.error("Failed to save and sync dates", error);
      toast.error(t('contracts.dateList.failedToSyncDates'));
    } finally {
      setSubmitLoading(false);
      setIsSaving(false);
    }
  };

  if (isDatesLoading) {
    return (
      <div className="space-y-6 py-4 mx-auto animate-pulse">

        {/* ➕ Add New Date */}
        <div className="flex flex-col sm:flex-row items-end gap-4 p-5 rounded-2xl bg-muted/20 backdrop-blur border border-border/50 shadow-sm">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Skeleton className="h-10 rounded-lg w-full" />
            <Skeleton className="h-10 rounded-lg w-full" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* Error placeholder */}
        <Skeleton className="h-4 w-1/2 rounded-md" />

        {/* Dates List Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/3 rounded-md" />
          <Skeleton className="h-3 w-10 rounded-md" />
        </div>

        {/* Dates List Items */}
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/50"
            >
              <Skeleton className="h-9 w-[160px] rounded-lg" />
              <Skeleton className="h-9 flex-1 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          ))}
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed">
          <Skeleton className="h-4 w-1/3 rounded-md mb-2" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
      </div>
    );
  }

  const hasDatesAssigned = fields.length > 0;
  const formErrors = form.formState.errors;

  return (
    <StepLayout
      title={t('contracts.dateList.title')}
      description={t('contracts.dateList.description')}
      onNext={form.handleSubmit(onSubmit)}
      isNextDisabled={!hasDatesAssigned}
      isNextLoading={isSubmitLoading}
    >
      <div className="space-y-6 py-4" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* ➕ Add New Date */}
        <div className="flex flex-col sm:flex-row items-end gap-4 p-4 rounded-2xl bg-muted/20 backdrop-blur border border-border/50">

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Field orientation="vertical" className="mx-0">
              <FieldLabel className="text-xs text-muted-foreground">
                {t('contracts.dateList.date')}
              </FieldLabel>
              <FieldContent>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="h-10"
                />
              </FieldContent>
            </Field>

            <Field orientation="vertical" className="mx-0">
              <FieldLabel className="text-xs text-muted-foreground">
                {t('contracts.dateList.notes')}
              </FieldLabel>
              <FieldContent>
                <Input
                  placeholder={t('contracts.dateList.notesPlaceholder')}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="h-10"
                />
              </FieldContent>
            </Field>
          </div>

          <Button
            type="button"
            onClick={handleAddInline}
            disabled={!newDate}
            className="h-10 px-4 rounded-xl shadow-sm"
          >
            <PlusIcon className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
            {t('contracts.dateList.addDate')}
          </Button>
        </div>

        {/* Error */}
        {formErrors.dates?.root && (
          <p className="text-sm text-destructive">
            {formErrors.dates.root.message}
          </p>
        )}

        {/* 📅 Dates List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('contracts.dateList.serviceDates')}
            </h3>
            <span className="text-xs text-muted-foreground">
              {fields.length}
            </span>
          </div>

          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed text-muted-foreground text-sm">
              {t('contracts.dateList.noDatesAdded')}
            </div>
          ) : (
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-sm transition"
                >
                  {/* Date */}
                  <Input
                    type="date"
                    className="h-9 w-[160px]"
                    {...form.register(`dates.${index}.service_date`)}
                  />

                  {/* Notes */}
                  <Input
                    placeholder={t('contracts.notes')}
                    className="h-9 flex-1"
                    {...form.register(`dates.${index}.notes`)}
                  />

                  {/* Delete */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-destructive"
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
