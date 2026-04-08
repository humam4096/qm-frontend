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
      // title={t('formSubmissions.contextSelection')}
      description={t('formSubmissions.contextSelectionDesc')}
      isNextDisabled={!isStepValid}
      onNext={nextStep}
    >
      <div>
        <div className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-border/50">
            <p className="text-sm font-medium text-muted-foreground">
              {t('formSubmissions.contextConfiguration')}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* ================= Kitchen ================= */}
            <div className="space-y-2">
              <Label htmlFor="kitchen" className="text-xs text-muted-foreground">
                {t('formSubmissions.kitchen')} *
              </Label>

              <Select 
                value={kitchen_id ?? ''} 
                onValueChange={handleKitchenChange}
                disabled={isLoadingKitchens || kitchensEmpty}
              >
                <SelectTrigger
                  id="kitchen"
                  className="bg-muted/30 border-none focus:ring-1 w-full"
                >
                  <SelectValue>
                    {isLoadingKitchens
                      ? t('common.loading')
                      : selectedKitchen?.name || t('formSubmissions.selectKitchen')}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {isLoadingKitchens && (
                      <SelectItem value="loading" disabled>
                        {t('common.loading')}
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
                <div className="space-y-2">
                  <Label htmlFor="day" className="text-xs text-muted-foreground">
                    {t('formSubmissions.day')} *
                  </Label>

                  <Select
                    value={day ?? ''}
                    disabled={!kitchen_id || isLoadingDays}
                    onValueChange={handleDayChange}
                  >
                    <SelectTrigger
                      id="day"
                      className="bg-muted/30 border-none focus:ring-1 w-full"
                    >
                      <SelectValue>
                        {isLoadingDays
                          ? t('common.loading')
                          : selectedDay?.notes || t('formSubmissions.selectDay')}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {isLoadingDays && (
                          <SelectItem value="loading" disabled>
                            {t('common.loading')}
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
                <div className="space-y-2">
                  <Label htmlFor="meal" className="text-xs text-muted-foreground">
                    {t('formSubmissions.meal')} *
                  </Label>

                  <Select
                    value={meal_id ?? ''}
                    disabled={!day || isLoadingDays}
                    onValueChange={(value) => setMeal(value!)}
                  >
                    <SelectTrigger
                      id="meal"
                      className="bg-muted/30 border-none focus:ring-1 w-full"
                    >
                      <SelectValue>
                        {isLoadingDays
                          ? t('common.loading')
                          : selectedMeal?.label || t('formSubmissions.selectMeal')}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {isLoadingDays && (
                          <SelectItem value="loading" disabled>
                            {t('common.loading')}
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
                <div className="space-y-2">
                  <Label htmlFor="stage" className="text-xs text-muted-foreground">
                    {t('formSubmissions.stage')} *
                  </Label>

                  <Select
                    value={stage_id ?? ''}
                    disabled={!meal_id}
                    onValueChange={(value) => setStage(value!)}
                  >
                    <SelectTrigger
                      id="stage"
                      className="bg-muted/30 border-none focus:ring-1 w-full"
                    >
                      <SelectValue>
                        {isLoadingStages
                          ? t('common.loading')
                          : selectedStage?.name || t('formSubmissions.selectStage')}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {isLoadingStages && (
                          <SelectItem value="loading" disabled>
                            {t('common.loading')}
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
        </div>

      </div>
    </FormSubmissionStepLayout>
  );
}