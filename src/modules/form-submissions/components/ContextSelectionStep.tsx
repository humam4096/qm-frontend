import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useFormRunner } from '../context/FormRunnerContext';
import { FormSubmissionStepLayout } from './FormSubmissionStepLayout';
import {
  useGetKitchenContractTimes,
  useKitchensList,
} from '@/modules/kitchens/hooks/useKitchens';
import { useGetInspectionStagesList } from '@/modules/inspection-stages/hooks/useInspectionStages';
import { useAuthStore } from '@/app/store/useAuthStore';
import { cn } from '@/lib/utils';
import { ChefHat, Calendar, Utensils, ClipboardCheck, CheckCircle2, Loader2 } from 'lucide-react';

export function ContextSelectionStep() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const {
    kitchen_id,
    day,
    meal_id,
    stage_id,
    setKitchen,
    setDay,
    setMeal,
    setStage,
    nextStep,
  } = useFormRunner();

  // Role-based validation: project_manager only needs kitchen_id
  const isProjectManager = user?.role === 'project_manager';
  

  const isStepValid = isProjectManager 
    ? Boolean(kitchen_id)
    : Boolean(kitchen_id && day && meal_id && stage_id);

  const { data: kitchensList, isLoading: isLoadingKitchens } =
    useKitchensList();

  const { data: timeWindows, isLoading: isLoadingDays } =
    useGetKitchenContractTimes(kitchen_id ?? '', !isProjectManager);

  const { data: stagesList, isLoading: isLoadingStages } =
    useGetInspectionStagesList(!isProjectManager);

  // Derived data
  const kitchens = kitchensList?.data ?? [];
  const days = timeWindows?.data ?? [];
  const stages = stagesList?.data ?? [];

  const selectedKitchen = kitchens.find(k => k.id === kitchen_id);
  const selectedDay = days.find(d => d.id === day);
  const meals = selectedDay?.time_windows ?? [];
  const selectedMeal = meals.find(m => m.id === meal_id);
  const selectedStage = stages.find(s => s.id === stage_id);
  
  // Reset cascading selections (important UX fix)
  const handleKitchenChange = (value: any) => {
    setKitchen(value);
    setDay('');
    setMeal('');
    setStage('');
  };

  const handleDayChange = (value: any) => {
    setDay(value);
    setMeal('');
    setStage('');
  };

  // check if the arrays are empty
  const isEmpty = (arr?: unknown[]) => !arr || arr.length === 0;
  const daysEmpty = isEmpty(days);
  const kitchensEmpty = isEmpty(kitchens);
  const stagesEmpty = isEmpty(stages);
  const mealsEmpty = isEmpty(meals);

  return (
    <FormSubmissionStepLayout
      description={t('formSubmissions.contextSelectionDesc')}
      isNextDisabled={!isStepValid}
      onNext={nextStep}
    >
      <div className="max-w-4xl mx-auto">
        {/* Main Card with Enhanced Design */}
        <div className="rounded-xl bg-linear-to-br from-card via-card to-card/95 border border-border/50 shadow-lg shadow-black/5 dark:shadow-black/20 overflow-hidden">
          
          {/* Header with Icon */}
          <div className="px-5 py-4 border-b border-border/50 bg-muted/20 dark:bg-muted/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <ClipboardCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t('formSubmissions.contextConfiguration')}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isProjectManager 
                    ? t('formSubmissions.selectKitchenOnly') 
                    : t('formSubmissions.fillAllRequiredFields')}
                </p>
              </div>
            </div>
          </div>

          {/* Body with Grid Layout */}
          <div className="p-6">
            <div className={cn(
              "grid gap-5",
              isProjectManager ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            )}>

              {/* ================= Kitchen ================= */}
              <div className={cn(
                "space-y-3 p-4 rounded-lg border transition-all duration-200",
                kitchen_id 
                  ? "bg-primary/5 border-primary/30 shadow-sm" 
                  : "bg-background/50 dark:bg-background/30 border-border/50 hover:border-border"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-1.5 rounded-md transition-colors",
                      kitchen_id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <ChefHat className="h-4 w-4" />
                    </div>
                    <Label htmlFor="kitchen" className="text-sm font-semibold text-foreground">
                      {t('formSubmissions.kitchen')}
                    </Label>
                  </div>
                  {kitchen_id && (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  )}
                </div>

                <Select 
                  value={kitchen_id ?? ''} 
                  onValueChange={handleKitchenChange}
                  disabled={isLoadingKitchens || kitchensEmpty}
                >
                  <SelectTrigger
                    id="kitchen"
                    className={cn(
                      "w-full h-10 bg-background/80 dark:bg-background/50 border-border/50",
                      "focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
                      "transition-all duration-200",
                      kitchen_id && "border-primary/30"
                    )}
                  >
                    <SelectValue>
                      {isLoadingKitchens ? (
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          {t('common.loading')}
                        </span>
                      ) : (
                        selectedKitchen?.name || (
                          <span className="text-muted-foreground">
                            {t('formSubmissions.selectKitchen')}
                          </span>
                        )
                      )}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {isLoadingKitchens && (
                        <SelectItem value="loading" disabled>
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            {t('common.loading')}
                          </span>
                        </SelectItem>
                      )}

                      {!isLoadingKitchens && kitchensEmpty && (
                        <SelectItem value="empty" disabled>
                          {t('formSubmissions.noKitchensAvailable')}
                        </SelectItem>
                      )}

                      {kitchens.map((k) => (
                        <SelectItem key={k.id} value={k.id}>
                          {k.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditionally render remaining fields based on role */}
              {!isProjectManager && (
                <>
                  {/* ================= Day ================= */}
                  <div className={cn(
                    "space-y-3 p-4 rounded-lg border transition-all duration-200",
                    day 
                      ? "bg-primary/5 border-primary/30 shadow-sm" 
                      : "bg-background/50 dark:bg-background/30 border-border/50 hover:border-border",
                    !kitchen_id && "opacity-60"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1.5 rounded-md transition-colors",
                          day ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          <Calendar className="h-4 w-4" />
                        </div>
                        <Label htmlFor="day" className="text-sm font-semibold text-foreground">
                          {t('formSubmissions.day')}
                        </Label>
                      </div>
                      {day && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>

                    <Select
                      value={day ?? ''}
                      disabled={!kitchen_id || isLoadingDays}
                      onValueChange={handleDayChange}
                    >
                      <SelectTrigger
                        id="day"
                        className={cn(
                          "w-full h-10 bg-background/80 dark:bg-background/50 border-border/50",
                          "focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
                          "transition-all duration-200",
                          day && "border-primary/30"
                        )}
                      >
                        <SelectValue>
                          {isLoadingDays ? (
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              {t('common.loading')}
                            </span>
                          ) : (
                            selectedDay?.notes || (
                              <span className="text-muted-foreground">
                                {t('formSubmissions.selectDay')}
                              </span>
                            )
                          )}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {isLoadingDays && (
                            <SelectItem value="loading" disabled>
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                {t('common.loading')}
                              </span>
                            </SelectItem>
                          )}

                          {!isLoadingDays && daysEmpty && (
                            <SelectItem value="empty" disabled>
                              {t('formSubmissions.noDaysAvailable')}
                            </SelectItem>
                          )}

                          {days.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.notes}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ================= Meal ================= */}
                  <div className={cn(
                    "space-y-3 p-4 rounded-lg border transition-all duration-200",
                    meal_id 
                      ? "bg-primary/5 border-primary/30 shadow-sm" 
                      : "bg-background/50 dark:bg-background/30 border-border/50 hover:border-border",
                    !day && "opacity-60"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1.5 rounded-md transition-colors",
                          meal_id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          <Utensils className="h-4 w-4" />
                        </div>
                        <Label htmlFor="meal" className="text-sm font-semibold text-foreground">
                          {t('formSubmissions.meal')}
                        </Label>
                      </div>
                      {meal_id && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>

                    <Select
                      value={meal_id ?? ''}
                      disabled={!day || isLoadingDays}
                      onValueChange={(value) => setMeal(value!)}
                    >
                      <SelectTrigger
                        id="meal"
                        className={cn(
                          "w-full h-10 bg-background/80 dark:bg-background/50 border-border/50",
                          "focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
                          "transition-all duration-200",
                          meal_id && "border-primary/30"
                        )}
                      >
                        <SelectValue>
                          {isLoadingDays ? (
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              {t('common.loading')}
                            </span>
                          ) : (
                            selectedMeal?.label || (
                              <span className="text-muted-foreground">
                                {t('formSubmissions.selectMeal')}
                              </span>
                            )
                          )}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {isLoadingDays && (
                            <SelectItem value="loading" disabled>
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                {t('common.loading')}
                              </span>
                            </SelectItem>
                          )}

                          {!isLoadingDays && mealsEmpty && (
                            <SelectItem value="empty" disabled>
                              {t('formSubmissions.noMealsAvailable')}
                            </SelectItem>
                          )}

                          {meals.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ================= Stage ================= */}
                  <div className={cn(
                    "space-y-3 p-4 rounded-lg border transition-all duration-200",
                    stage_id 
                      ? "bg-primary/5 border-primary/30 shadow-sm" 
                      : "bg-background/50 dark:bg-background/30 border-border/50 hover:border-border",
                    !meal_id && "opacity-60"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "p-1.5 rounded-md transition-colors",
                          stage_id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          <ClipboardCheck className="h-4 w-4" />
                        </div>
                        <Label htmlFor="stage" className="text-sm font-semibold text-foreground">
                          {t('formSubmissions.stage')}
                        </Label>
                      </div>
                      {stage_id && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </div>

                    <Select
                      value={stage_id ?? ''}
                      disabled={!meal_id}
                      onValueChange={(value) => setStage(value!)}
                    >
                      <SelectTrigger
                        id="stage"
                        className={cn(
                          "w-full h-10 bg-background/80 dark:bg-background/50 border-border/50",
                          "focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
                          "transition-all duration-200",
                          stage_id && "border-primary/30"
                        )}
                      >
                        <SelectValue>
                          {isLoadingStages ? (
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              {t('common.loading')}
                            </span>
                          ) : (
                            selectedStage?.name || (
                              <span className="text-muted-foreground">
                                {t('formSubmissions.selectStage')}
                              </span>
                            )
                          )}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {isLoadingStages && (
                            <SelectItem value="loading" disabled>
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                {t('common.loading')}
                              </span>
                            </SelectItem>
                          )}

                          {!isLoadingStages && stagesEmpty && (
                            <SelectItem value="empty" disabled>
                              {t('formSubmissions.noStagesAvailable')}
                            </SelectItem>
                          )}

                          {stages.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            {/* Progress Indicator */}
            {!isProjectManager && (
              <div className="mt-6 pt-5 border-t border-border/50">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="font-medium">
                    {t('formSubmissions.progress')}
                  </span>
                  <span className="font-semibold">
                    {[kitchen_id, day, meal_id, stage_id].filter(Boolean).length} / 4
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-primary to-primary/80 transition-all duration-500 ease-out rounded-full"
                    style={{ 
                      width: `${([kitchen_id, day, meal_id, stage_id].filter(Boolean).length / 4) * 100}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormSubmissionStepLayout>
  );
}