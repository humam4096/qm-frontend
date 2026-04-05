import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray, type Control, type UseFormRegister } from "react-hook-form";
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
  useCreateMeal, useUpdateMeal, useDeleteMeal,
  useCreateMealIngredient, useUpdateMealIngredient, useDeleteMealIngredient,
  useCreateMealWeightSpec, useUpdateMealWeightSpec, useDeleteMealWeightSpec
} from "../../../hooks/useContracts";
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { syncArrays } from "../../../utils/syncUtils";
import { Field, FieldContent } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// --- REUSABLE COMPONENTS ---

function IngredientsField({ control, register, windowId, mealIndex }: { control: Control<FormValues>; register: UseFormRegister<FormValues>; windowId: string; mealIndex: number }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { fields, append, remove } = useFieldArray({
    control,
    name: `mealsByWindow.${windowId}.${mealIndex}.ingredients` as const,
  });

  return (
    <div className="mt-4 pt-4 border-t">
      <h5 className="text-sm font-medium mb-3 text-muted-foreground">{t('contracts.mealBuilder.ingredients')}</h5>
      <div className="space-y-2 mb-3">
        {fields.map((field, ingIndex) => (
          <div key={field.id} className="flex gap-2 items-center text-sm">
            <input type="hidden" {...register(`mealsByWindow.${windowId}.${mealIndex}.ingredients.${ingIndex}.id` as const)} />
            <Field className="mx-0 flex-1 my-0"><FieldContent>
              <Input placeholder={t('contracts.mealBuilder.namePlaceholder')} {...register(`mealsByWindow.${windowId}.${mealIndex}.ingredients.${ingIndex}.name` as const)} className="h-8 text-xs shadow-none" />
            </FieldContent></Field>
            <Field className="mx-0 w-24 my-0"><FieldContent>
              <Input placeholder={t('contracts.mealBuilder.qtyPlaceholder')} {...register(`mealsByWindow.${windowId}.${mealIndex}.ingredients.${ingIndex}.quantity_required` as const)} className="h-8 text-xs shadow-none" />
            </FieldContent></Field>
            <Button type="button" variant="ghost" size="icon-sm" className="h-8 w-8 text-destructive" onClick={() => remove(ingIndex)}>
              <TrashIcon className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className="h-7 text-xs px-3" onClick={() => append({ name: "", quantity_required: "" })}>
        <PlusIcon className={cn("w-3 h-3", isRTL ? "ml-1" : "mr-1")} /> {t('contracts.mealBuilder.addIngredient')}
      </Button>
    </div>
  );
}

function WeightSpecsField({ control, register, windowId, mealIndex }: { control: Control<FormValues>; register: UseFormRegister<FormValues>; windowId: string; mealIndex: number }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { fields, append, remove } = useFieldArray({
    control,
    name: `mealsByWindow.${windowId}.${mealIndex}.weightSpecs` as const,
  });

  return (
    <div className="mt-4 pt-4 border-t">
      <h5 className="text-sm font-medium mb-3 text-muted-foreground">{t('contracts.mealBuilder.weightSpecs')}</h5>
      <div className="space-y-2 mb-3">
        {fields.map((field, spIndex) => (
          <div key={field.id} className="flex gap-2 items-center text-sm">
            <input type="hidden" {...register(`mealsByWindow.${windowId}.${mealIndex}.weightSpecs.${spIndex}.id` as const)} />
            <Field className="mx-0 flex-1 my-0"><FieldContent>
              <Input placeholder={t('contracts.mealBuilder.titlePlaceholder')} {...register(`mealsByWindow.${windowId}.${mealIndex}.weightSpecs.${spIndex}.title` as const)} className="h-8 text-xs shadow-none" />
            </FieldContent></Field>
            <Field className="mx-0 w-16 my-0"><FieldContent>
              <Input type="number" placeholder={t('contracts.mealBuilder.valuePlaceholder')} {...register(`mealsByWindow.${windowId}.${mealIndex}.weightSpecs.${spIndex}.value` as const)} className="h-8 text-xs shadow-none" />
            </FieldContent></Field>
            <Field className="mx-0 w-16 my-0"><FieldContent>
              <Input placeholder={t('contracts.mealBuilder.unitPlaceholder')} {...register(`mealsByWindow.${windowId}.${mealIndex}.weightSpecs.${spIndex}.unit` as const)} className="h-8 text-xs shadow-none" />
            </FieldContent></Field>
            <Button type="button" variant="ghost" size="icon-sm" className="h-8 w-8 text-destructive" onClick={() => remove(spIndex)}>
              <TrashIcon className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className="h-7 text-xs px-3" onClick={() => append({ title: "", value: 0, unit: "g" })}>
        <PlusIcon className={cn("w-3 h-3", isRTL ? "ml-1" : "mr-1")} /> {t('contracts.mealBuilder.addWeightSpec')}
      </Button>
    </div>
  );
}

function MealItemCard({ windowId, mealIndex, control, register, removeMeal }: { windowId: string, mealIndex: number, control: Control<FormValues>, register: UseFormRegister<FormValues>, removeMeal: () => void }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="group rounded-xl border border-border/50 bg-background/60 backdrop-blur mb-3 transition hover:border-primary/40 hover:shadow-sm">
      
      <input
        type="hidden"
        {...register(`mealsByWindow.${windowId}.${mealIndex}.id` as const)}
      />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">

        {/* Inputs */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3">

          <Field className="mx-0 my-0 flex-1">
            <FieldContent>
              <Input
                placeholder={t('contracts.mealBuilder.mealNamePlaceholder')}
                className="
                  h-9 
                  px-3 
                  bg-muted/40 
                  border border-transparent 
                  rounded-md
                  font-medium
                  transition
                  focus:bg-background
                  focus:border-primary/40
                  focus:ring-2 focus:ring-primary/20
                "
                {...register(`mealsByWindow.${windowId}.${mealIndex}.name` as const)}
              />
            </FieldContent>
          </Field>

          <Field className="mx-0 my-0 flex-1">
            <FieldContent>
            <Input
              placeholder={t('contracts.mealBuilder.descriptionOptional')}
              className="
                h-9 
                px-3 
                bg-muted/30 
                border border-transparent 
                rounded-md
                text-muted-foreground
                transition
                focus:bg-background
                focus:text-foreground
                focus:border-primary/40
                focus:ring-2 focus:ring-primary/20
              "
              {...register(`mealsByWindow.${windowId}.${mealIndex}.description` as const)}
            />
            </FieldContent>
          </Field>

        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={removeMeal}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>

        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/40 mx-4" />

      {/* Body */}
      {isOpen && (
        <div className="px-4 py-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {t('contracts.mealBuilder.ingredients')}
              </p>
              <IngredientsField
                control={control}
                register={register}
                windowId={windowId}
                mealIndex={mealIndex}
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {t('contracts.mealBuilder.weightSpecs')}
              </p>
              <WeightSpecsField
                control={control}
                register={register}
                windowId={windowId}
                mealIndex={mealIndex}
              />
            </div>

          </div>

        </div>
      )}
    </div>
  );
}

function TimeWindowSection({ tw, control, register }: { tw: any, control: Control<FormValues>, register: UseFormRegister<FormValues> }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { fields, append, remove } = useFieldArray({
    control,
    name: `mealsByWindow.${tw.id}` as const,
  });

  return (
    <div className="pl-4 border-l-2 py-2">
      <h4 className="font-medium text-primary mb-3 text-sm uppercase tracking-wide">
        {tw.label} 
        <span className="text-muted-foreground lowercase">
          ({isRTL ? 
            `${t('contracts.timeDisplay.from')} ${tw.start_time} ${t('contracts.timeDisplay.to')} ${tw.end_time}` : 
            `${tw.start_time} - ${tw.end_time}`
          })
        </span>
      </h4>
      
      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground italic mb-4">{t('contracts.mealBuilder.noMealsAdded')}</p>
      ) : (
        fields.map((field, index) => (
          <MealItemCard 
            key={field.id} 
            windowId={tw.id}
            mealIndex={index} 
            control={control} 
            register={register} 
            removeMeal={() => remove(index)}
          />
        ))
      )}
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full mt-2 border-dashed border-2 bg-muted/20 hover:bg-muted/40" 
        onClick={() => append({ meal_time_window_id: tw.id, name: "", description: "", ingredients: [], weightSpecs: [] })}
      >
        <PlusIcon className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} /> {t('contracts.mealBuilder.addMeal')}
      </Button>
    </div>
  );
}

const ingredientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name required"),
  quantity_required: z.string().min(1, "Qty required"),
});

const weightSpecSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title required"),
  value: z.any(),
  unit: z.string().min(1, "Unit required"),
});

const mealSchema = z.object({
  id: z.string().optional(),
  meal_time_window_id: z.string(),
  name: z.string().min(1, "Name Required"),
  description: z.string().optional(),
  ingredients: z.array(ingredientSchema),
  weightSpecs: z.array(weightSpecSchema),
});

const schema = z.object({
  mealsByWindow: z.record(z.string(), z.array(mealSchema))
});

type FormValues = z.infer<typeof schema>;

// --- MAIN COMPONENT ---

export function MealBuilder() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { contractId, nextStep, setIsSaving } = useContractBuilder();
  const queryClient = useQueryClient();
  
  const createMeal = useCreateMeal();
  const updateMeal = useUpdateMeal();
  const deleteMeal = useDeleteMeal();
  
  const createIng = useCreateMealIngredient();
  const updateIng = useUpdateMealIngredient();
  const deleteIng = useDeleteMealIngredient();
  
  const createSpec = useCreateMealWeightSpec();
  const updateSpec = useUpdateMealWeightSpec();
  const deleteSpec = useDeleteMealWeightSpec();

  // --- QUERY ORCHESTRATION ---
  const { data: contractDatesResponse, isLoading: isDatesLoading } = useGetContractDates(contractId || "");
  const contractDates = contractDatesResponse?.data || [];

  const windowQueries = useQueries({
    queries: contractDates.map((d: any) => ({
      queryKey: ['mealTimeWindows', d.id],
      queryFn: () => ContractAPI.getMealTimeWindows(d.id),
      enabled: !!d.id
    }))
  });
  const serverTimeWindows = useMemo(() => windowQueries.flatMap((q, index) => {
    const d = q.data as any;
    const array = (Array.isArray(d) ? d : d?.data) || [];
    const parentId = contractDates?.[index]?.id;
    return array.map((item: any) => ({ ...item, contract_date_id: item.contract_date_id || parentId }));
  }), [windowQueries, contractDates]);

  const mealQueries = useQueries({
    queries: serverTimeWindows.map((tw: any) => ({
      queryKey: ['meals', tw.id],
      queryFn: () => ContractAPI.getMeals(tw.id),
      enabled: !!tw.id
    }))
  });
  const serverMeals = useMemo(() => mealQueries.flatMap((q, index) => {
    const d = q.data as any;
    const array = (Array.isArray(d) ? d : d?.data) || [];
    const parentId = serverTimeWindows?.[index]?.id;
    return array.map((item: any) => ({ ...item, meal_time_window_id: item.meal_time_window_id || parentId }));
  }), [mealQueries, serverTimeWindows]);

  const ingredientQueries = useQueries({
    queries: serverMeals.map((m: any) => ({
      queryKey: ['mealIngredients', m.id],
      queryFn: () => ContractAPI.getMealIngredients(m.id),
      enabled: !!m.id
    }))
  });
  const serverIngredients = useMemo(() => ingredientQueries.flatMap((q, index) => {
    const d = q.data as any;
    const array = (Array.isArray(d) ? d : d?.data) || [];
    const parentId = serverMeals?.[index]?.id;
    return array.map((item: any) => ({ ...item, meal_id: item.meal_id || parentId }));
  }), [ingredientQueries, serverMeals]);

  const specQueries = useQueries({
    queries: serverMeals.map((m: any) => ({
      queryKey: ['mealWeightSpecs', m.id],
      queryFn: () => ContractAPI.getMealWeightSpecs(m.id),
      enabled: !!m.id
    }))
  });
  const serverSpecs = useMemo(() => specQueries.flatMap((q, index) => {
    const d = q.data as any;
    const array = (Array.isArray(d) ? d : d?.data) || [];
    const parentId = serverMeals?.[index]?.id;
    return array.map((item: any) => ({ ...item, meal_id: item.meal_id || parentId }));
  }), [specQueries, serverMeals]);

  const isLoading = 
    isDatesLoading ||
    windowQueries.some(q => q.isLoading) || 
    mealQueries.some(q => q.isLoading) || 
    ingredientQueries.some(q => q.isLoading) || 
    specQueries.some(q => q.isLoading);

  // Consider it successful only if queries that fired are successful. If arrays are empty, it's technically success.
  const isAllQueriesSuccess = 
    (!windowQueries.length || windowQueries.every(q => q.isSuccess)) && 
    (!mealQueries.length || mealQueries.every(q => q.isSuccess)) && 
    (!ingredientQueries.length || ingredientQueries.every(q => q.isSuccess)) && 
    (!specQueries.length || specQueries.every(q => q.isSuccess));

  // --- FORM INITIALIZATION ---
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { mealsByWindow: {} },
  });

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized && contractDates.length > 0 && isAllQueriesSuccess && !isLoading) {
      const mealsByWindow: Record<string, z.infer<typeof mealSchema>[]> = {};
      
      // Initialize arrays for all windows to ensure empty windows are tracked
      serverTimeWindows.forEach(tw => {
        mealsByWindow[tw.id] = [];
      });

      // Populate meals natively into their respective windows
      serverMeals.forEach(sm => {
        const ings = serverIngredients.filter(i => i.meal_id === sm.id);
        const specs = serverSpecs.filter(s => s.meal_id === sm.id);
        
        const structuredMeal = {
          id: sm.id,
          meal_time_window_id: sm.meal_time_window_id,
          name: sm.name,
          description: sm.description || "",
          ingredients: ings.map(i => ({ id: i.id, name: i.name, quantity_required: String(i.quantity_required) })),
          weightSpecs: specs.map(s => ({ id: s.id, title: s.title, value: Number(s.value as any), unit: s.unit }))
        };

        if (mealsByWindow[sm.meal_time_window_id]) {
          mealsByWindow[sm.meal_time_window_id].push(structuredMeal);
        }
      });

      form.reset({ mealsByWindow });
      setHasInitialized(true);
    } else if (!hasInitialized && contractDates.length === 0 && !isLoading) {
      // If there are no contract dates, just mark it initialized
      setHasInitialized(true);
    }
  }, [hasInitialized, contractDates, isAllQueriesSuccess, isLoading, serverTimeWindows, serverMeals, serverIngredients, serverSpecs, form]);

  const [isSubmitLoading, setSubmitLoading] = useState(false);

  // --- REUSABLE SYNC HELPERS ---
  const syncIngredientsForMeal = async (mealId: string, localIngs: any[], serverIngs: any[]) => {
    const diff = syncArrays(serverIngs, localIngs, (s, l) => s.name !== l.name || String(s.quantity_required) !== String(l.quantity_required));
    
    await Promise.all([
      ...diff.deleted.map(id => deleteIng.mutateAsync(id)),
      ...diff.added.map(ing => createIng.mutateAsync({ meal_id: mealId, name: ing.name, quantity_required: String(ing.quantity_required) })),
      ...diff.updated.map(ing => updateIng.mutateAsync({ id: ing.id!, payload: { name: ing.name, quantity_required: String(ing.quantity_required) } }))
    ]);
  };

  const syncSpecsForMeal = async (mealId: string, localSpecs: any[], serverWs: any[]) => {
    const diff = syncArrays(serverWs, localSpecs, (s, l) => s.title !== l.title || Number(s.value) !== Number(l.value) || s.unit !== l.unit);
    
    await Promise.all([
      ...diff.deleted.map(id => deleteSpec.mutateAsync(id)),
      ...diff.added.map(ws => createSpec.mutateAsync({ meal_id: mealId, title: ws.title, value: Number(ws.value), unit: ws.unit })),
      ...diff.updated.map(ws => updateSpec.mutateAsync({ id: ws.id!, payload: { title: ws.title, value: Number(ws.value), unit: ws.unit } }))
    ]);
  };

  const syncMealsForWindow = async (windowId: string, localMeals: any[]) => {
    const serverMealsForWindow = serverMeals.filter(m => m.meal_time_window_id === windowId);
    const mealDiff = syncArrays(serverMealsForWindow, localMeals, (s, l) => s.name !== l.name || s.description !== l.description);
      
    // 1. DELETE MEALS
    await Promise.all(mealDiff.deleted.map(id => deleteMeal.mutateAsync(id)));
    
    // 2. ADD MEALS (and their nested children)
    for (const meal of mealDiff.added) {
      const res = await createMeal.mutateAsync({
        meal_time_window_id: windowId,
        name: meal.name,
        description: meal.description || undefined
      });
      const newMealId = res?.data?.id || res?.id || res?.meal?.id;
      
      if (newMealId) {
         // Pass empty arrays for serverIngs/serverWs since this is a new meal
         await syncIngredientsForMeal(newMealId, meal.ingredients, []);
         await syncSpecsForMeal(newMealId, meal.weightSpecs, []);
      }
    }
    
    // 3. UPDATE MEALS CORE DATA
    for (const meal of mealDiff.updated) {
      if (!meal.id) continue;
      await updateMeal.mutateAsync({
        id: meal.id,
        payload: { name: meal.name, description: meal.description || undefined }
      });
    }

    // 4. SYNC NESTED FOR ALL EXISTING MEALS
    // Any meal that wasn't freshly added needs to have its nested forms synchronized.
    const existingMeals = localMeals.filter(m => m.id);
    for (const meal of existingMeals) {
       const serverIngs = serverIngredients.filter(i => i.meal_id === meal.id);
       const serverWs = serverSpecs.filter(s => s.meal_id === meal.id);
       await syncIngredientsForMeal(meal.id, meal.ingredients, serverIngs);
       await syncSpecsForMeal(meal.id, meal.weightSpecs, serverWs);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitLoading(true);
    setIsSaving(true);
    
    try {
      // Loop through each window scope and synchronize its meals deeply
      for (const [windowId, meals] of Object.entries(values.mealsByWindow)) {
        await syncMealsForWindow(windowId, meals);
      }
      // Flush caches so changes propagate safely
      await queryClient.invalidateQueries({ queryKey: ['meals'] });
      await queryClient.invalidateQueries({ queryKey: ['mealIngredients'] });
      await queryClient.invalidateQueries({ queryKey: ['mealWeightSpecs'] });

      toast.success(t('contracts.mealBuilder.mealsSavedSuccessfully'));
      nextStep();
      
    } catch (error) {
      console.error("Failed deeply syncing meals array", error);
      toast.error(t('contracts.mealBuilder.failedToSyncMeals'));
    } finally {
      setSubmitLoading(false);
      setIsSaving(false);
    }
  };

  if (isLoading || !hasInitialized) {
    return (
      <div className="space-y-8 mx-auto animate-pulse">

        {/* Empty / No Dates */}
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-5">

            {/* Date Header */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>

            {/* Time Windows */}
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, j) => (
                <div
                  key={j}
                  className="rounded-2xl border bg-card/60 backdrop-blur p-4 space-y-4"
                >
                  {/* Time Window Header */}
                  <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-4 w-24 rounded-md bg-primary/20" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>

                  {/* Meals Section */}
                  <div className="pt-2 border-t border-border/50 space-y-2">
                    {Array.from({ length: 3 }).map((_, k) => (
                      <Skeleton key={k} className="h-10 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const formErrors = form.formState.errors;

  return (
    <StepLayout
      title={t('contracts.mealBuilder.title')}
      description={t('contracts.mealBuilder.description')}
      onNext={form.handleSubmit(onSubmit)}
      isNextDisabled={contractDates.length === 0}
      isNextLoading={isSubmitLoading}
    >
      <div className="space-y-8 py-4 max-w-5xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* Error */}
        {formErrors.mealsByWindow?.root && (
          <div className="px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
            {formErrors.mealsByWindow.root.message}
          </div>
        )}

        {/* Empty */}
        {contractDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed bg-muted/20 text-center">
            <p className="text-sm text-muted-foreground">
              {t('contracts.mealBuilder.noDatesAvailable')}
            </p>
          </div>
        ) : (
          contractDates.map((date: any) => {
            const timeWindows = serverTimeWindows.filter(
              (tw) => tw.contract_date_id === date.id
            );

            return (
              <div
                key={date.id}
                className="space-y-5"
              >
                {/* 🔹 Date Header (no heavy box) */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-base">
                      {date.service_date}
                    </h3>
                    {date.notes && (
                      <p className="text-xs text-muted-foreground">
                        {date.notes}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {timeWindows.length} {t('contracts.contractBuilderSteps.timeWindows')}
                  </span>
                </div>

                {/* 🔹 Time Windows */}
                <div className="space-y-4">
                  {timeWindows.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-6 border rounded-xl bg-muted/20">
                      {t('contracts.mealBuilder.noTimeWindowsDefined')}
                    </div>
                  ) : (
                    timeWindows.map((tw) => (
                      <div
                        key={tw.id}
                        className="rounded-2xl border bg-card/60 backdrop-blur p-4 space-y-4 hover:shadow-sm transition"
                      >
                        {/* Time Window Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                              {tw.label || t('contracts.mealBuilder.timeWindow')}
                            </div>

                            <span className="text-xs text-muted-foreground">
                              {tw.start_time} → {tw.end_time}
                            </span>
                          </div>
                        </div>

                        {/* Meals */}
                        <div className="pt-2 border-t border-border/50">
                          <TimeWindowSection
                            tw={tw}
                            control={form.control}
                            register={form.register}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </StepLayout>
  );
}
