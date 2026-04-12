import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useContractBuilder } from "../context/ContractBuilderContext";
import { StepLayout } from "../StepLayout";
import { useCreateContract, useUpdateContract, useGetContractById } from "../../../hooks/useContracts";
import { useKitchens } from "@/modules/kitchens/hooks/useKitchens";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";
import type { CreateContractPayload } from "../../../types";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export function BasicInfoForm() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { contractId, setContractId, nextStep, setIsSaving } = useContractBuilder();

  const schema = z.object({
    name: z.string().min(1, t('contracts.basicInfoForm.nameRequired')),
    meal_type: z.enum(["buffet", "individual"]),
    total_meals: z.number().min(1, t('contracts.basicInfoForm.mealsMinimum')),
    kitchen_id: z.string().min(1, t('contracts.basicInfoForm.kitchenRequired')),
  });

  type FormValues = z.infer<typeof schema>;
  
  const createContract = useCreateContract();
  const updateContract = useUpdateContract();

  // If a draft exists, populate it
  const { data: existingContract, isLoading: isFetching } = useGetContractById(contractId || "", {
    enabled: !!contractId,
  });
  const { data: kitchensRes, isLoading: isKitchensLoading } = useKitchens({ per_page: 100 });
  const kitchens = kitchensRes?.data || [];
  const contract = existingContract?.data;

  // console.log(contract?.meal_type)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      meal_type: undefined,
      total_meals: 1,
      kitchen_id: "",
    },
  });

  useEffect(() => {
    if (!contract) return;

    const kitchenId = contract.kitchen?.id || "";

    form.reset({
      name: contract.name,
      meal_type: contract.meal_type as "buffet" | "individual",
      total_meals: contract.total_meals,
      kitchen_id: kitchenId ? String(kitchenId) : "",
    });
  }, [contract, kitchens, form]);


  const [isSubmitLoading, setSubmitLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setSubmitLoading(true);
    setIsSaving(true);
    
    try {
      if (contractId) {
        // Check if data has actually changed
        const hasChanged = 
          contract?.name !== values.name ||
          contract?.meal_type !== values.meal_type ||
          contract?.total_meals !== values.total_meals ||
          String(contract?.kitchen?.id || "") !== String(values.kitchen_id);

        if (hasChanged) {
          // Update existing draft only if data changed
          await updateContract.mutateAsync({
            id: contractId,
            payload: {
              name: values.name,
              meal_type: values.meal_type,
              total_meals: values.total_meals,
              kitchen_id: values.kitchen_id,
            },
          });
          toast.success(t('contracts.basicInfoForm.contractInfoUpdated'));
        }
        // Always proceed to next step (whether updated or not)
        nextStep();
      } else {
        // Create new draft
        const payload: CreateContractPayload = {
          name: values.name,
          meal_type: values.meal_type,
          total_meals: values.total_meals,
          is_active: false, // draft
          kitchen_id: values.kitchen_id,
          dates: [],
        };
        const res = await createContract.mutateAsync(payload);
        const newId = res?.data?.id || res?.id; 
        if (newId) {
          setContractId(newId);
          toast.success(t('contracts.basicInfoForm.contractDraftCreated'));
          nextStep();
        } else {
          console.error("No ID returned from create contract API", res);
          toast.error(t('contracts.basicInfoForm.failedToRetrieveId'));
        }
      }
    } catch (error) {
      console.error("Failed to save Basic Info", error);
      toast.error(t('contracts.basicInfoForm.errorSaving'));
    } finally {
      setSubmitLoading(false);
      setIsSaving(false);
    }
  };


  const hasErrors = Object.keys(form.formState.errors).length > 0;

  if (isFetching || isKitchensLoading) {
    return (
      <div className="mx-auto space-y-8 py-4">
        {/* Section: Basic Info */}
        <div className="space-y-5 p-6 rounded-2xl border bg-muted/30 backdrop-blur-sm animate-pulse">
          <Skeleton className="h-5 w-1/3 mb-2" /> {/* Label */}
          <Skeleton className="h-10 w-full rounded-lg" /> {/* Input */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/2" /> {/* Label */}
              <Skeleton className="h-10 w-full rounded-lg" /> {/* Select */}
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-1/2" /> {/* Label */}
              <Skeleton className="h-10 w-full rounded-lg" /> {/* Input */}
            </div>
          </div>
        </div>

        {/* Section: Kitchen Assignment */}
        <div className="space-y-5 p-6 rounded-2xl border bg-muted/30 backdrop-blur-sm animate-pulse">
          <Skeleton className="h-5 w-1/3 mb-1" /> {/* Section Title */}
          <Skeleton className="h-4 w-2/3 mb-3" /> {/* Description */}
          <Skeleton className="h-10 w-full rounded-lg" /> {/* Kitchen Select */}
        </div>
      </div>
    );
  }

  return (
    <StepLayout
      title={t('contracts.basicInfoForm.title')}
      description={t('contracts.basicInfoForm.description')}
      onNext={form.handleSubmit(onSubmit)}
      isNextLoading={isSubmitLoading}
      isNextDisabled={hasErrors && form.formState.isSubmitted}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-3xlx mx-auto space-y-8 py-4"
        dir={isRTL ? 'rtl' : 'ltr'}
      >

        {/* Section: Basic Info */}
        <div className="space-y-5 p-6 rounded-2xl border bg-muted/30 backdrop-blur-sm">

          {/* Contract Name */}
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">
              {t('contracts.basicInfoForm.contractName')}
            </Label>
            <Input
              id="name"
              placeholder={t('contracts.basicInfoForm.contractNamePlaceholder')}
              {...form.register("name")}
              className="text-base"
            />
            {form.formState.errors.name && (
              <p className="text-destructive text-xs">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Meal Type + Total Meals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Meal Type */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                {t('contracts.basicInfoForm.mealType')}
              </Label>

              <Controller
                control={form.control}
                name="meal_type"
                render={({ field }) => (
                  <Select value={field.value || ""} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('contracts.basicInfoForm.selectType')} />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="buffet">{t('contracts.buffet')}</SelectItem>
                        <SelectItem value="individual">{t('contracts.individual')}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {form.formState.errors.meal_type && (
                <p className="text-destructive text-xs">
                  {form.formState.errors.meal_type.message}
                </p>
              )}
            </div>

            {/* Total Meals */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                {t('contracts.basicInfoForm.totalDailyMeals')}
              </Label>

              <Input
                id="total_meals"
                type="number"
                min={1}
                {...form.register("total_meals", { valueAsNumber: true })}
              />

              {form.formState.errors.total_meals && (
                <p className="text-destructive text-xs">
                  {form.formState.errors.total_meals.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section: Kitchen Assignment */}
        <div className="space-y-5 p-6 rounded-2xl border bg-muted/30 backdrop-blur-sm">

          <div className="space-y-1">
            <p className="text-sm font-medium">
              {t('contracts.basicInfoForm.assignKitchens')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('contracts.basicInfoForm.assignKitchensDesc')}
            </p>
          </div>

          {/* Kitchen Select */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              {t('contracts.kitchen')}
            </Label>

            <Controller
              control={form.control}
              name="kitchen_id"
              render={({ field }) => {
                const selectedKitchen = kitchens.find(
                  (k) => String(k.id) === String(field.value)
                );

                return (
                  <Select value={field.value || ""} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('contracts.basicInfoForm.selectKitchen')}>
                        {selectedKitchen?.name}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {kitchens.map((k) => (
                          <SelectItem key={k.id} value={String(k.id)}>
                            {k.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                );
              }}
            />

            {form.formState.errors.kitchen_id && (
              <p className="text-destructive text-xs">
                {form.formState.errors.kitchen_id.message}
              </p>
            )}
          </div>
        </div>

      </form>
    </StepLayout>
  );
}
