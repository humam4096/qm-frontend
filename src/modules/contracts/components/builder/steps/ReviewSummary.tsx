import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { contractId, setContractId, setCurrentStep, setHighestStep, setIsOpen, setIsSaving } = useContractBuilder();
  
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
      
      // if contract is already published, do nothing
      if (contract?.is_active) {
        toast.success(t('contracts.reviewSummary.contractUpdatedSuccessfully'));
        return;
      }

      await toggleStatus.mutateAsync(contractId);
      toast.success(t('contracts.reviewSummary.contractSuccessfullyPublished'));

      // reset builder
      setContractId(null);
      setCurrentStep(1);
      setHighestStep(1);
    } catch (e) {
      console.error("Failed to publish contract", e);
      toast.error(t('contracts.reviewSummary.errorPublishing'));
    } finally {
      setIsPublishing(false);
      setIsSaving(false);
      setIsOpen(false);
    }
  };

  if (isContractLoading || isRelLoading) {
    return <div className="py-10 text-center text-muted-foreground animate-pulse">{t('contracts.reviewSummary.assemblingDetails')}</div>;
  }

  if (!contract) {
    return <div className="py-10 text-center text-destructive">{t('contracts.reviewSummary.contractNotFound')}</div>;
  }

  return (
    <StepLayout
      title={t('contracts.reviewSummary.title')}
      description={t('contracts.reviewSummary.description')}
      onNext={handlePublish}
      isNextLoading={isPublishing}
    >
      <div className="space-y-6 md:space-y-8 py-4 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* Basic Info */}
        <section className="space-y-3">
          <h3 className="text-base md:text-lg font-semibold border-b pb-2">{t('contracts.reviewSummary.basicInformation')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wide">{t('contracts.reviewSummary.contractName')}</span>
              <span className="font-medium text-base">{contract.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wide">{t('contracts.reviewSummary.mealType')}</span>
              <Badge variant="secondary" className="mt-1 capitalize">{contract.meal_type === 'buffet' ? t('contracts.buffet') : t('contracts.individual')}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wide">{t('contracts.reviewSummary.totalDailyMeals')}</span>
              <span className="font-medium text-base">{contract.total_meals}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wide">{t('contracts.reviewSummary.assignedKitchens')}</span>
                <Badge variant="outline" className="bg-muted/50">{contract.kitchen.name}</Badge>
            </div>
          </div>
        </section>

        {/* Dates & Nested */}
        <section className="space-y-3">
          <h3 className="text-base md:text-lg font-semibold border-b pb-2">{t('contracts.reviewSummary.scheduleMeals')}</h3>
          
          {contractDates.length > 0 ? (
            <div className="space-y-4">
              {contractDates.map((date: any) => {
                const dayWindows = serverTimeWindows.filter(tw => tw.contract_date_id === date.id);
                return (
                  <div key={date.id} className="border rounded-xl p-3 md:p-4 bg-muted/5 shadow-sm">
                    <div className="font-bold text-base md:text-lg mb-2">
                      {date.service_date} <span className="text-sm font-normal text-muted-foreground">{date.notes && `— ${date.notes}`}</span>
                    </div>
                    
                    {/* Time Windows */}
                    {dayWindows.length > 0 ? (
                      <div className="space-y-3 mt-3 pl-4 border-l-2">
                        {dayWindows.map(tw => {
                          const windowMeals = serverMeals.filter(m => m.meal_time_window_id === tw.id);
                          return (
                            <div key={tw.id} className="space-y-2">
                              <div className="text-sm font-bold text-primary uppercase tracking-wider">
                                {tw.label} 
                                <span className="lowercase text-muted-foreground">
                                  ({isRTL ? 
                                    `${t('contracts.timeDisplay.from')} ${tw.start_time} ${t('contracts.timeDisplay.to')} ${tw.end_time}` : 
                                    `${tw.start_time} - ${tw.end_time}`
                                  })
                                </span>
                              </div>
                              
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
                                            <span className="text-primary mb-0.5">{ings.length} {t('contracts.reviewSummary.ingredients')}</span>
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-primary mb-0.5">{specs.length} {t('contracts.reviewSummary.specs')}</span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground italic">{t('contracts.reviewSummary.noMealsAdded')}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic pl-4">{t('contracts.reviewSummary.noTimeWindowsDefined')}</div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
             <div className="text-sm text-muted-foreground italic">{t('contracts.reviewSummary.noDatesScheduled')}</div>
          )}
        </section>
        
        <div className="pt-6">
          <div className="bg-primary/5 p-3 md:p-4 rounded-xl border border-primary/20 text-sm text-primary/80">
            {t('contracts.reviewSummary.publishingNote')}
          </div>
        </div>
      </div>
    </StepLayout>
  );
}
