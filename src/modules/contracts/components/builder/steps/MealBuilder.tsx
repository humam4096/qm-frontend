import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray, type Control, type UseFormRegister } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

// --- REUSABLE COMPONENTS ---

function IngredientsField({ control, register, windowId, mealIndex }: { control: Control<FormValues>; register: UseFormRegister<FormValues>; windowId: string; mealIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `mealsByWindow.${windowId}.${mealIndex}.ingredients` as const,
  });

  return (
    <div className="mt-4 pt-4 border-t">
      <h5 className="text-sm font-medium mb-3 text-muted-foreground">Ingredients</h5>
      <div className="space-y-2 mb-3">
        {fields.map((field, ingIndex) => (
          <div key={field.id} className="flex gap-2 items-center text-sm">
            <input type="hidden" {...register(`mealsByWindow.${windowId}.${mealIndex}.ingredients.${ingIndex}.id` as const)} />
            <Field className="mx-0 flex-1 my-0"><FieldContent>
              <Input placeholder="Name" {...register(`mealsByWindow.${windowId}.${mealIndex}.ingredients.${ingIndex}.name` as const)} className="h-8 text-xs shadow-none" />
            </FieldContent></Field>
            <Field className="mx-0 w-24 my-0"><FieldContent>
              <Input placeholder="Qty" {...register(`mealsByWindow.${windowId}.${mealIndex}.ingredients.${ingIndex}.quantity_required` as const)} className="h-8 text-xs shadow-none" />
            </FieldContent></Field>
            <Button type="button" variant="ghost" size="icon-sm" className="h-8 w-8 text-destructive" onClick={() => remove(ingIndex)}>
              <TrashIcon className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className="h-7 text-xs px-3" onClick={() => append({ name: "", quantity_required: "" })}>
        <PlusIcon className="w-3 h-3 mr-1" /> Add Ingredient
      </Button>
    </div>
  );
}

function WeightSpecsField({ control, register, windowId, mealIndex }: { control: Control<FormValues>; register: UseFormRegister<FormValues>; windowId: string; mealIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `mealsByWindow.${windowId}.${mealIndex}.weightSpecs` as const,
  });

  return (
    <div className="mt-4 pt-4 border-t">
      <h5 className="text-sm font-medium mb-3 text-muted-foreground">Weight Specs</h5>
      <div className="space-y-2 mb-3">
        {fields.map((field, spIndex) => (
          <div key={field.id} className="flex gap-2 items-center text-sm">
            <input type="hidden" {...register(`mealsByWindow.${windowId}.${mealIndex}.weightSpecs.${spIndex}.id` as const)} />
            <Field className="mx-0 flex-1 my-0"><FieldContent>
              <Input placeholder="Title" {...register(`mealsByWindow.${windowId}.${mealIndex}.weightSpecs.${spIndex}.title` as const)} className="h-8 text-xs shadow-none" />
            </FieldContent></Field>
            <Field className="mx-0 w-16 my-0"><FieldContent>
              <Input type="number" placeholder="Val" {...register(`mealsByWindow.${windowId}.${mealIndex}.weightSpecs.${spIndex}.value` as const)} className="h-8 text-xs shadow-none" />
            </FieldContent></Field>
            <Field className="mx-0 w-16 my-0"><FieldContent>
              <Input placeholder="Unit" {...register(`mealsByWindow.${windowId}.${mealIndex}.weightSpecs.${spIndex}.unit` as const)} className="h-8 text-xs shadow-none" />
            </FieldContent></Field>
            <Button type="button" variant="ghost" size="icon-sm" className="h-8 w-8 text-destructive" onClick={() => remove(spIndex)}>
              <TrashIcon className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className="h-7 text-xs px-3" onClick={() => append({ title: "", value: 0, unit: "g" })}>
        <PlusIcon className="w-3 h-3 mr-1" /> Add Weight Spec
      </Button>
    </div>
  );
}

function MealItemCard({ windowId, mealIndex, control, register, removeMeal }: { windowId: string, mealIndex: number, control: Control<FormValues>, register: UseFormRegister<FormValues>, removeMeal: () => void }) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="border rounded-lg bg-card shadow-sm overflow-hidden mb-3">
      <input type="hidden" {...register(`mealsByWindow.${windowId}.${mealIndex}.id` as const)} />
      <div className="flex items-start gap-3 p-3 bg-muted/10">
        <div className="flex-1 flex gap-3">
          <Field className="mx-0 my-0"><FieldContent>
            <Input placeholder="Meal Name (e.g. Biryani)" className="h-9 font-medium shadow-none" {...register(`mealsByWindow.${windowId}.${mealIndex}.name` as const)} />
          </FieldContent></Field>
          <Field className="mx-0 my-0"><FieldContent>
            <Input placeholder="Description (Optional)" className="h-8 text-sm shadow-none" {...register(`mealsByWindow.${windowId}.${mealIndex}.description` as const)} />
          </FieldContent></Field>
        </div>
        
        <div className="flex items-center gap-1 mt-1">
          <Button type="button" variant="ghost" size="icon-sm" className="h-8 w-8 text-destructive" onClick={removeMeal}>
            <TrashIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" className="h-8 w-8" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {isOpen && (
        <div className="p-4 bg-transparent border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IngredientsField control={control} register={register} windowId={windowId} mealIndex={mealIndex} />
            <WeightSpecsField control={control} register={register} windowId={windowId} mealIndex={mealIndex} />
          </div>
        </div>
      )}
    </div>
  );
}

function TimeWindowSection({ tw, control, register }: { tw: any, control: Control<FormValues>, register: UseFormRegister<FormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `mealsByWindow.${tw.id}` as const,
  });

  return (
    <div className="pl-4 border-l-2 py-2">
      <h4 className="font-medium text-primary mb-3 text-sm uppercase tracking-wide">
        {tw.label} <span className="text-muted-foreground lowercase">({tw.start_time} - {tw.end_time})</span>
      </h4>
      
      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground italic mb-4">No meals added to this window.</p>
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
        <PlusIcon className="w-4 h-4 mr-2" /> Add Meal
      </Button>
    </div>
  );
}

// --- MAIN COMPONENT ---

export function MealBuilder() {
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

      toast.success("Meals saved successfully.");
      nextStep();
      
    } catch (error) {
      console.error("Failed deeply syncing meals array", error);
      toast.error("Failed to sync deeply nested meal specifications with the server.");
    } finally {
      setSubmitLoading(false);
      setIsSaving(false);
    }
  };

  if (isLoading || !hasInitialized) {
    return <div className="py-10 text-center">Loading meal structures...</div>;
  }

  const formErrors = form.formState.errors;

  return (
    <StepLayout
      title="Build Meals"
      description="Configure meals, ingredients, and weight specifications for each time window."
      onNext={form.handleSubmit(onSubmit)}
      isNextDisabled={contractDates.length === 0}
      isNextLoading={isSubmitLoading}
    >
      <div className="space-y-6 py-4">
        
        {formErrors.mealsByWindow?.root && (
           <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg font-medium">
             {formErrors.mealsByWindow.root.message}
           </div>
        )}

        {contractDates.length === 0 ? (
          <div className="text-center py-10 bg-muted/30 rounded-xl border-dashed border-2">
            No dates available to build meals for. Please add dates and time windows first.
          </div>
        ) : (
          contractDates.map((date: any) => {
             const timeWindows = serverTimeWindows.filter(tw => tw.contract_date_id === date.id);
             return (
               <div key={date.id} className="border rounded-xl mb-4 overflow-hidden shadow-sm bg-card">
                 <div className="bg-muted/30 p-4 border-b">
                   <h3 className="font-semibold text-md">{date.service_date} {date.notes && <span className="text-muted-foreground font-normal">({date.notes})</span>}</h3>
                 </div>
                 <div className="p-4 space-y-6">
                   {timeWindows.length === 0 ? (
                     <p className="text-sm text-muted-foreground italic">No time windows defined.</p>
                   ) : (
                     timeWindows.map(tw => (
                       <TimeWindowSection key={tw.id} tw={tw} control={form.control} register={form.register} />
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
