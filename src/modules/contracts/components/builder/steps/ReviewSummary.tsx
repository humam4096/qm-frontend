import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useContractBuilder } from "../context/ContractBuilderContext";
import { StepLayout } from "../StepLayout";
import { 
  useGetContractById, 
  useToggleContractStatus,
  useGetContractDates
} from "../../../hooks/useContracts";
import { useQueries } from "@tanstack/react-query";
import { ContractAPI } from "../../../api/contracts.api";
import { Badge } from "@/components/ui/badge";

export function ReviewSummary() {
  const { contractId, setIsOpen, setIsSaving } = useContractBuilder();
  
  const { data: contractResponse, isLoading: isContractLoading } = useGetContractById(contractId || "");
  const contract = contractResponse?.data;
  
  const toggleStatus = useToggleContractStatus();
  
  const [isPublishing, setIsPublishing] = useState(false);

  // --- RELATION FETCHING (Replicating deep fetchers for accurate local state) ---
  const { data: datesResponse, isLoading: isDatesLoading } = useGetContractDates(contractId || "");
  const contractDates = (datesResponse as any)?.data || datesResponse || [];

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

  const isRelLoading = 
    isDatesLoading ||
    windowQueries.some(q => q.isLoading) || 
    mealQueries.some(q => q.isLoading) || 
    ingredientQueries.some(q => q.isLoading) || 
    specQueries.some(q => q.isLoading);

  // --- ACTIONS ---
  
  const handlePublish = async () => {
    if (!contractId) return;
    setIsPublishing(true);
    setIsSaving(true);
    try {
      await toggleStatus.mutateAsync(contractId);
      setIsOpen(false);
      toast.success("Contract successfully published!");
    } catch (e) {
      console.error("Failed to publish contract", e);
      toast.error("An error occurred while publishing the contract.");
    } finally {
      setIsPublishing(false);
      setIsSaving(false);
    }
  };

  if (isContractLoading || isRelLoading) {
    return <div className="py-10 text-center text-muted-foreground animate-pulse">Assembling contract details...</div>;
  }

  if (!contract) {
    return <div className="py-10 text-center text-destructive">Contract not found.</div>;
  }

  return (
    <StepLayout
      title="Review & Publish"
      description="Review all contract details before final publishing."
      onNext={handlePublish}
      isNextLoading={isPublishing}
    >
      <div className="space-y-8 py-4 px-2">
        
        {/* Basic Info */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wide">Contract Name</span>
              <span className="font-medium text-base">{contract.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wide">Meal Type</span>
              <Badge variant="secondary" className="mt-1 capitalize">{contract.meal_type}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wide">Total Daily Meals</span>
              <span className="font-medium text-base">{contract.total_meals}</span>
            </div>
          </div>
        </section>

        {/* Kitchens */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Assigned Kitchens</h3>
          {(() => {
            return (
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-muted/50">{contract.kitchen.name}</Badge>
              </div>
            ) 
          })()}
        </section>

        {/* Dates & Nested */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold border-b pb-2">Schedule & Meals</h3>
          
          {contractDates.length > 0 ? (
            <div className="space-y-4">
              {contractDates.map((date: any) => {
                const dayWindows = serverTimeWindows.filter(tw => tw.contract_date_id === date.id);
                return (
                  <div key={date.id} className="border rounded-xl p-4 bg-muted/5 shadow-sm">
                    <div className="font-bold text-lg mb-2">
                      {date.service_date} <span className="text-sm font-normal text-muted-foreground">{date.notes && `— ${date.notes}`}</span>
                    </div>
                    
                    {/* Time Windows */}
                    {dayWindows.length > 0 ? (
                      <div className="space-y-3 mt-3 pl-4 border-l-2">
                        {dayWindows.map(tw => {
                          const windowMeals = serverMeals.filter(m => m.meal_time_window_id === tw.id);
                          return (
                            <div key={tw.id} className="space-y-2">
                              <div className="text-sm font-bold text-primary uppercase tracking-wider">{tw.label} <span className="lowercase text-muted-foreground">({tw.start_time} - {tw.end_time})</span></div>
                              
                              {/* Meals */}
                              {windowMeals.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                  {windowMeals.map(meal => {
                                    const ings = serverIngredients.filter(i => i.meal_id === meal.id);
                                    const specs = serverSpecs.filter(s => s.meal_id === meal.id);
                                    return (
                                      <div key={meal.id} className="bg-background border rounded-lg p-3 shadow-sm text-sm hover:shadow-md transition-shadow">
                                        <div className="font-bold text-base">{meal.name}</div>
                                        {meal.description && <div className="text-xs text-muted-foreground mt-0.5">{meal.description}</div>}
                                        
                                        <div className="mt-3 flex gap-4 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                          <div className="flex flex-col">
                                            <span className="text-primary mb-0.5">{ings.length} INGREDIENTS</span>
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-primary mb-0.5">{specs.length} SPECS</span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground italic">No meals added.</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic pl-4">No time windows defined.</div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
             <div className="text-sm text-muted-foreground italic">No dates scheduled.</div>
          )}
        </section>
        
        <div className="pt-6">
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 text-sm text-primary/80">
            Publishing this contract will activate it. Ensure all details are correct.
          </div>
        </div>
      </div>
    </StepLayout>
  );
}
