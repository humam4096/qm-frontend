import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useContractBuilder } from "../context/ContractBuilderContext";
import { StepLayout } from "../StepLayout";
import { 
  useGetContractById, 
  useToggleContractStatus,
  useGetContractDates,
  queryKeys,
} from "../../../hooks/useContracts";
import { useQueries } from "@tanstack/react-query";
import { ContractAPI } from "../../../api/contracts.api";
import { Badge } from "@/components/ui/badge";
import { ClockIcon } from "lucide-react";

export function ReviewSummary() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { contractId, setContractId, setCurrentStep, setHighestStep, setIsOpen, setIsSaving } = useContractBuilder();
  
  const { data: contractResponse, isLoading: isContractLoading } = useGetContractById(contractId || "", {
    enabled: !!contractId,
  });
  const contract = contractResponse?.data;
  
  const toggleStatus = useToggleContractStatus();
  
  const [isPublishing, setIsPublishing] = useState(false);

  // --- RELATION FETCHING (Replicating deep fetchers for accurate local state) ---
  const { data: datesResponse, isLoading: isDatesLoading } = useGetContractDates(contractId || "", {
    enabled: !!contractId,
  });
  const contractDates = (datesResponse as any)?.data || datesResponse || [];

  const windowQueries = useQueries({
    queries: contractDates.map((d: any) => ({
      queryKey: queryKeys.mealTimeWindows(d.id),
      queryFn: () => ContractAPI.getMealTimeWindows(d.id),
      enabled: Boolean(d.id) && Boolean(contractDates && contractDates.length > 0) && !isDatesLoading,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }))
  });
  const serverTimeWindows = useMemo(() => windowQueries.flatMap((q, index) => {
    const d = q.data as any;
    const array = (Array.isArray(d) ? d : d?.data) || [];
    const parentId = contractDates?.[index]?.id;
    return array.map((item: any) => ({ ...item, contract_date_id: item.contract_date_id || parentId }));
  }), [windowQueries, contractDates]);

  const mealQueries = useQueries({
    queries: serverTimeWindows.map((tw: any) => {
      const dateIdx = contractDates.findIndex((d: any) => d.id === tw.contract_date_id);
      const windowsForDate = dateIdx >= 0 ? windowQueries[dateIdx] : undefined;
      return {
        queryKey: queryKeys.meals(tw.id),
        queryFn: () => ContractAPI.getMeals(tw.id),
        enabled:
          Boolean(tw.id) &&
          Boolean(windowsForDate?.isSuccess && !windowsForDate.isFetching),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      };
    }),
  });
  const serverMeals = useMemo(() => mealQueries.flatMap((q, index) => {
    const d = q.data as any;
    const array = (Array.isArray(d) ? d : d?.data) || [];
    const parentId = serverTimeWindows?.[index]?.id;
    return array.map((item: any) => ({ ...item, meal_time_window_id: item.meal_time_window_id || parentId }));
  }), [mealQueries, serverTimeWindows]);

  const ingredientQueries = useQueries({
    queries: serverMeals.map((m: any) => {
      const windowIdx = serverTimeWindows.findIndex((tw: any) => tw.id === m.meal_time_window_id);
      const mealsQ = windowIdx >= 0 ? mealQueries[windowIdx] : undefined;
      return {
        queryKey: queryKeys.mealIngredients(m.id),
        queryFn: () => ContractAPI.getMealIngredients(m.id),
        enabled: Boolean(
          m.id &&
            mealsQ?.isSuccess &&
            !mealsQ.isFetching
        ),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      };
    }),
  });
  const serverIngredients = useMemo(() => ingredientQueries.flatMap((q, index) => {
    const d = q.data as any;
    const array = (Array.isArray(d) ? d : d?.data) || [];
    const parentId = serverMeals?.[index]?.id;
    return array.map((item: any) => ({ ...item, meal_id: item.meal_id || parentId }));
  }), [ingredientQueries, serverMeals]);

  const specQueries = useQueries({
    queries: serverMeals.map((m: any) => {
      const windowIdx = serverTimeWindows.findIndex((tw: any) => tw.id === m.meal_time_window_id);
      const mealsQ = windowIdx >= 0 ? mealQueries[windowIdx] : undefined;
      return {
        queryKey: queryKeys.mealWeightSpecs(m.id),
        queryFn: () => ContractAPI.getMealWeightSpecs(m.id),
        enabled: Boolean(
          m.id &&
            mealsQ?.isSuccess &&
            !mealsQ.isFetching
        ),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      };
    }),
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
      <div className="space-y-8 py-6 max-w-5xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* Basic Info */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            {t('contracts.reviewSummary.basicInformation')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: t('contracts.reviewSummary.contractName'), value: contract.name },
              { label: t('contracts.reviewSummary.mealType'), value: contract.meal_type === 'buffet' ? t('contracts.buffet') : t('contracts.individual'), badge: true },
              { label: t('contracts.reviewSummary.totalDailyMeals'), value: contract.total_meals },
              { label: t('contracts.reviewSummary.assignedKitchens'), value: contract.kitchen.name, badge: true, badgeVariant: 'outline' },
            ].map((item, i) => (
              <div
                key={i}
                className=" p-4 flex flex-col justify-between"
              >
                <span className="text-muted-foreground text-xs uppercase tracking-wide">{item.label}</span>
                {item.badge ? (
                  <Badge
                    variant={item.badgeVariant === 'outline' ? 'outline' : 'secondary'}
                    className={`mt-2 w-max capitalize px-3 py-1 ${item.badgeVariant === 'outline' ? 'bg-card text-muted-foreground' : ''}`}
                  >
                    {item.value}
                  </Badge>
                ) : (
                  <span className="text-gray-900 font-semibold text-base mt-1">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Schedule / Dates */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            {t('contracts.reviewSummary.scheduleMeals')}
          </h3>

          {!contractDates.length ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed bg-muted/20 text-center">
              <ClockIcon className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">{t('contracts.reviewSummary.noDatesScheduled')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {contractDates.map((date: any) => {
                const dayWindows = serverTimeWindows.filter(tw => tw.contract_date_id === date.id);
                return (
                  <div
                    key={date.id}
                    className="rounded-2xl border bg-card/60 backdrop-blur p-5 space-y-5 shadow-sm hover:shadow-md transition"
                  >
                    {/* Date Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <ClockIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{date.service_date}</p>
                          {date.notes && <p className="text-xs text-muted-foreground italic">{date.notes}</p>}
                          <p className="text-xs text-muted-foreground mt-1">
                            {dayWindows.length} {t('contracts.contractBuilderSteps.timeWindows')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Time Windows */}
                    {!dayWindows.length ? (
                      <div className="text-xs text-muted-foreground text-center py-4 border rounded-xl bg-muted/20">
                        {t('contracts.timeWindowList.noTimeWindowsDefined')}
                      </div>
                    ) : (
                      <div className="space-y-4 pl-2">
                        {dayWindows.map((tw) => {
                          const windowMeals = serverMeals.filter(m => m.meal_time_window_id === tw.id);
                          return (
                            <div key={tw.id} className="rounded-xl border bg-muted/20 p-4 hover:border-primary/40 transition flex flex-col gap-4">
                              {/* Window Label */}
                              <div className="text-sm font-semibold text-primary uppercase tracking-wide">
                                {tw.label}
                                <span className="text-muted-foreground lowercase ml-2">
                                  ({isRTL
                                    ? `${t('contracts.timeDisplay.from')} ${tw.start_time} ${t('contracts.timeDisplay.to')} ${tw.end_time}`
                                    : `${tw.start_time} - ${tw.end_time}`
                                  })
                                </span>
                              </div>

                              {/* Meals */}
                              {!windowMeals.length ? (
                                <div className="text-xs text-muted-foreground italic text-center py-2">
                                  {t('contracts.reviewSummary.noMealsAdded')}
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {windowMeals.map((meal) => {
                                    const ings = serverIngredients.filter(i => i.meal_id === meal.id);
                                    const specs = serverSpecs.filter(s => s.meal_id === meal.id);
                                    return (
                                      <div
                                        key={meal.id}
                                        className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                                      >
                                        <div className="text-gray-900 font-semibold text-base">{meal.name}</div>
                                        {meal.description && <div className="text-muted-foreground text-sm mt-1">{meal.description}</div>}
                                        <div className="mt-3 flex gap-6 text-xs uppercase font-semibold text-muted-foreground tracking-wide">
                                          <span className="text-primary">{ings.length} {t('contracts.reviewSummary.ingredients')}</span>
                                          <span className="text-primary">{specs.length} {t('contracts.reviewSummary.specs')}</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Publishing Note */}
        <div>
          <div className="bg-primary/5 p-5 rounded-xl border border-primary/20 text-sm text-primary/80 shadow-sm">
            {t('contracts.reviewSummary.publishingNote')}
          </div>
        </div>
      </div>
    </StepLayout>
  );
}
