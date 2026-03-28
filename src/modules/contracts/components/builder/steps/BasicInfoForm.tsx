import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useContractBuilder } from "../context/ContractBuilderContext";
import { StepLayout } from "../StepLayout";
import { useCreateContract, useUpdateContract, useGetContractById } from "../../../hooks/useContracts";
import { useKitchens } from "@/modules/kitchens/hooks/useKitchens";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldContent } from "@/components/ui/field";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";
import type { CreateContractPayload } from "../../../types";
import { useTranslation } from "react-i18next";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  meal_type: z.enum(["buffet", "individual"]),
  total_meals: z.number().min(1, "Must be at least 1"),
  kitchen_id: z.string().min(1, "Please select a kitchen"),
});

type FormValues = z.infer<typeof schema>;

export function BasicInfoForm() {
    const { t } = useTranslation();
  const { contractId, setContractId, nextStep, setIsSaving } = useContractBuilder();
  
  const createContract = useCreateContract();
  const updateContract = useUpdateContract();

  const [selectedKitchenName, setSelectedKitchenName] = useState("");

  // If a draft exists, populate it
  const { data: existingContract, isLoading: isFetching } = useGetContractById(contractId || "");
  const { data: kitchensRes, isLoading: isKitchensLoading } = useKitchens({ per_page: 100 });
  const kitchens = kitchensRes?.data || [];

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
    if (existingContract) {
      form.reset({
        name: existingContract.name,
        meal_type: existingContract.meal_type,
        total_meals: existingContract.total_meals,
        kitchen_id: existingContract.kitchens?.[0]?.id || "",
      });
    }
  }, [existingContract, form]);

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
          nextStep();
        } else {
          console.error("No ID returned from create contract API", res);
          toast.error("Failed to retrieve contract ID from server.");
        }
      }
    } catch (error) {
      console.error("Failed to save Basic Info", error);
      toast.error("An error occurred while saving the contract basic info.");
    } finally {
      setSubmitLoading(false);
      setIsSaving(false);
    }
  };



  const hasErrors = Object.keys(form.formState.errors).length > 0;

  if (isFetching || isKitchensLoading) {
    return <div className="py-10 text-center">Loading form data...</div>;
  }

  return (
    <StepLayout
      title="Basic Contract Info"
      description="Start your contract draft by filling out the core details and assigning kitchens."
      onNext={form.handleSubmit(onSubmit)}
      isNextLoading={isSubmitLoading}
      isNextDisabled={hasErrors && form.formState.isSubmitted}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl py-4 pb-20">
        
        {/* Basic Fields */}
        <div className="space-y-6">
          <Field className="mx-0" orientation="vertical" data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="name">Contract Name</FieldLabel>
            <FieldContent>
              <Input id="name" placeholder="e.g. Hajj Season 1446..." {...form.register("name")} />
            </FieldContent>
            {form.formState.errors.name && (
              <FieldError>{form.formState.errors.name.message}</FieldError>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4 flex-wrap">
            <Field className="mx-0" orientation="vertical" data-invalid={!!form.formState.errors.meal_type}>
              <FieldLabel htmlFor="meal_type">Meal Type</FieldLabel>
              <FieldContent>
                <Select
                  name="meal_type" 
                  value={form.watch("meal_type")} 
                  onValueChange={(val) => form.setValue("meal_type", val as any, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full" id="meal_type">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                    <SelectContent className="w-full">
                  <SelectGroup>
                      <SelectItem value="buffet">Buffet</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                  </SelectGroup>
                    </SelectContent>
                </Select>
              </FieldContent>
              {form.formState.errors.meal_type && (
                <FieldError>{form.formState.errors.meal_type.message}</FieldError>
              )}
            </Field>

            <Field className="mx-0" orientation="vertical" data-invalid={!!form.formState.errors.total_meals}>
              <FieldLabel htmlFor="total_meals">Total Daily Meals</FieldLabel>
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
            <h3 className="text-lg font-semibold">Assign Kitchens</h3>
            <p className="text-sm text-muted-foreground">Select one or more kitchens responsible for supplying this contract.</p>
          </div>

          <Field className="mx-0" orientation="vertical" data-invalid={!!form.formState.errors.kitchen_id}>
            <FieldLabel htmlFor="kitchen_id">Kitchen</FieldLabel>
            <FieldContent>
              <Select 
                value={form.watch("kitchen_id")}
                onValueChange={(v) => {
                  form.setValue("kitchen_id", v || "", { shouldValidate: true });
                  const zone = kitchens.find((z: any) => String(z.id) === v);
                  setSelectedKitchenName(zone?.name ?? "");
                }}
              >
                <SelectTrigger className="w-full" id="kitchen_id">
                  <SelectValue placeholder={t("kitchens.selectZone")}>
                    {isKitchensLoading ? t("common.loading") : selectedKitchenName || t("kitchens.selectZone")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {kitchens.map((zone: any) => (
                      <SelectItem key={zone.id} value={String(zone.id)}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FieldContent>
            {form.formState.errors.kitchen_id && (
              <FieldError>{form.formState.errors.kitchen_id.message}</FieldError>
            )}
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
