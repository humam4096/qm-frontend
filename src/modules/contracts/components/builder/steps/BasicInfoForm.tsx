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
import { Field, FieldLabel, FieldError, FieldContent } from "@/components/ui/field";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";
import type { CreateContractPayload } from "../../../types";

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
  const { data: existingContract, isLoading: isFetching } = useGetContractById(contractId || "");
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
        // Update existing draft
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
    return <div className="py-10 text-center">{t('contracts.basicInfoForm.loadingForm')}</div>;
  }

  return (
    <StepLayout
      title={t('contracts.basicInfoForm.title')}
      description={t('contracts.basicInfoForm.description')}
      onNext={form.handleSubmit(onSubmit)}
      isNextLoading={isSubmitLoading}
      isNextDisabled={hasErrors && form.formState.isSubmitted}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 w-full py-4" dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* Basic Fields */}
        <div className="space-y-4 md:space-y-6">
          <Field className="mx-0" orientation="vertical" data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="name">{t('contracts.basicInfoForm.contractName')}</FieldLabel>
            <FieldContent>
              <Input id="name" placeholder={t('contracts.basicInfoForm.contractNamePlaceholder')} {...form.register("name")} />
            </FieldContent>
            {form.formState.errors.name && (
              <FieldError>{form.formState.errors.name.message}</FieldError>
            )}
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field data-invalid={!!form.formState.errors.meal_type}>
            <FieldLabel htmlFor="meal_type">{t('contracts.basicInfoForm.mealType')}</FieldLabel>
            <FieldContent>
              <Controller
                control={form.control}
                name="meal_type"
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full" id="meal_type">
                      <SelectValue placeholder={t('contracts.basicInfoForm.selectType')} />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectGroup>
                        <SelectItem value="buffet">{t('contracts.buffet')}</SelectItem>
                        <SelectItem value="individual">{t('contracts.individual')}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldContent>

            <FieldError>
              {form.formState.errors.meal_type?.message}
            </FieldError>
          </Field>
            <Field className="mx-0" orientation="vertical" data-invalid={!!form.formState.errors.total_meals}>
              <FieldLabel htmlFor="total_meals">{t('contracts.basicInfoForm.totalDailyMeals')}</FieldLabel>
              <FieldContent>
                <Input 
                  id="total_meals" 
                  type="number" 
                  min={1} 
                  {...form.register("total_meals", { valueAsNumber: true })} 
                />
              </FieldContent>
              {form.formState.errors.total_meals && (
                <FieldError>{form.formState.errors.total_meals.message}</FieldError>
              )}
            </Field>
          </div>
        </div>

        {/* Kitchens Assignment */}
        <div className="pt-4 border-t">
          <div className="mb-4">
            <h3 className="text-base md:text-lg font-semibold">{t('contracts.basicInfoForm.assignKitchens')}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">{t('contracts.basicInfoForm.assignKitchensDesc')}</p>
          </div>

          <Field
            className="mx-0"
            orientation="vertical"
            data-invalid={!!form.formState.errors.kitchen_id}
          >
            <FieldLabel htmlFor="kitchen_id">{t('contracts.kitchen')}</FieldLabel>
            <FieldContent>
              <Controller
                control={form.control}
                name="kitchen_id"
                render={({ field }) => {
                  const selectedKitchen = kitchens.find((k) => String(k.id) === String(field.value));
                  return (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full" id="kitchen_id">
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
            </FieldContent>

            <FieldError>
              {form.formState.errors.kitchen_id?.message}
            </FieldError>
          </Field>
          {form.formState.errors.kitchen_id && (
            <p className="text-sm font-medium text-destructive mt-2">
              {form.formState.errors.kitchen_id.message}
            </p>
          )}
        </div>
      </form>
    </StepLayout>
  );
}
