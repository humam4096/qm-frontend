import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ContractAPI, type ContractFilters } from "../api/contracts.api";
import type { UpdateContractDatePayload, UpdateContractPayload, UpdateMealIngredientPayload, UpdateMealPayload, UpdateMealTimeWindowPayload, UpdateMealWeightSpecPayload } from "../types";


// Query Key Factory
export const queryKeys = {
  contracts: (filters?: ContractFilters) => ['contracts', filters],
  contract: (id: string) => ['contract', id],

  contractDates: (contractId: string) => ['contractDates', contractId],
  contractDate: (id: string) => ['contractDate', id],

  mealTimeWindows: (contractDateId: string) => ['mealTimeWindows', contractDateId],
  mealTimeWindow: (id: string) => ['mealTimeWindow', id],

  meals: (mealTimeWindowId: string) => ['meals', mealTimeWindowId],
  meal: (id: string) => ['meal', id],

  mealIngredients: (mealId: string) => ['mealIngredients', mealId],
  mealIngredient: (id: string) => ['mealIngredient', id],

  mealWeightSpecs: (mealId: string) => ['mealWeightSpecs', mealId],
  mealWeightSpec: (id: string) => ['mealWeightSpec', id],
};


// Error Handler
const handleError = (error: unknown) => {
  console.error(error);
};

// Mutation Factory
const createMutationHook = <TVariables>({
  mutationFn,
  invalidateKeys,
}: {
  mutationFn: (vars: TVariables) => Promise<any>;
  invalidateKeys: (vars: TVariables) => unknown[];
}) => {
  return () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn,
      onSuccess: (_, vars) => {
        invalidateKeys(vars).forEach((key: any) => {
          queryClient.invalidateQueries({
            queryKey: key,
            exact: true,
          });
        });
      },
      onError: handleError,
    });
  };
};


// Queries
export const useGetContracts = (filters?: ContractFilters) =>
  useQuery({
    queryKey: queryKeys.contracts(filters),
    queryFn: () => ContractAPI.getContracts(filters),
  });

export const useGetContractById = (id: string) =>
  useQuery({
    queryKey: queryKeys.contract(id),
    queryFn: () => ContractAPI.getContractById(id),
    enabled: Boolean(id),
  });

export const useGetContractDates = (contractId: string) =>
  useQuery({
    queryKey: queryKeys.contractDates(contractId),
    queryFn: () => ContractAPI.getContractDates(contractId),
    enabled: Boolean(contractId),
  });

export const useGetContractDateById = (id: string) =>
  useQuery({
    queryKey: queryKeys.contractDate(id),
    queryFn: () => ContractAPI.getContractDateById(id),
    enabled: Boolean(id),
  });

export const useGetMealTimeWindows = (contractDateId: string) =>
  useQuery({
    queryKey: queryKeys.mealTimeWindows(contractDateId),
    queryFn: () => ContractAPI.getMealTimeWindows(contractDateId),
    enabled: Boolean(contractDateId),
  });

export const useGetMealTimeWindowById = (id: string) =>
  useQuery({
    queryKey: queryKeys.mealTimeWindow(id),
    queryFn: () => ContractAPI.getMealTimeWindowById(id),
    enabled: Boolean(id),
  });

export const useGetMeals = (mealTimeWindowId: string) =>
  useQuery({
    queryKey: queryKeys.meals(mealTimeWindowId),
    queryFn: () => ContractAPI.getMeals(mealTimeWindowId),
    enabled: Boolean(mealTimeWindowId),
  });

export const useGetMealById = (id: string) =>
  useQuery({
    queryKey: queryKeys.meal(id),
    queryFn: () => ContractAPI.getMealById(id),
    enabled: Boolean(id),
  });

export const useGetMealIngredients = (mealId: string) =>
  useQuery({
    queryKey: queryKeys.mealIngredients(mealId),
    queryFn: () => ContractAPI.getMealIngredients(mealId),
    enabled: Boolean(mealId),
  });

export const useGetMealIngredientById = (id: string) =>
  useQuery({
    queryKey: queryKeys.mealIngredient(id),
    queryFn: () => ContractAPI.getMealIngredientById(id),
    enabled: Boolean(id),
  });

export const useGetMealWeightSpecs = (mealId: string) =>
  useQuery({
    queryKey: queryKeys.mealWeightSpecs(mealId),
    queryFn: () => ContractAPI.getMealWeightSpecs(mealId),
    enabled: Boolean(mealId),
  });

export const useGetMealWeightSpecById = (id: string) =>
  useQuery({
    queryKey: queryKeys.mealWeightSpec(id),
    queryFn: () => ContractAPI.getMealWeightSpecById(id),
    enabled: Boolean(id),
  });


// Contract 
export const useCreateContract = createMutationHook({
  mutationFn: ContractAPI.createContract,
  invalidateKeys: () => [queryKeys.contracts()],
});

export const useUpdateContract = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateContractPayload }) =>
    ContractAPI.updateContract(id, payload),
  invalidateKeys: () => [queryKeys.contracts()],
});

export const useToggleContractStatus = createMutationHook({
  mutationFn: ContractAPI.toggleContractStatus,
  invalidateKeys: () => [queryKeys.contracts()],
});

export const useDeleteContract = createMutationHook({
  mutationFn: ContractAPI.deleteContract,
  invalidateKeys: () => [queryKeys.contracts()],
});

// Contract Date 
export const useCreateContractDate = createMutationHook({
  mutationFn: ContractAPI.createContractDate,
  invalidateKeys: (vars: { contract_id: string }) => [
    queryKeys.contractDates(vars.contract_id),
    queryKeys.contracts(),
  ],
});

export const useUpdateContractDate = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateContractDatePayload }) =>
    ContractAPI.updateContractDate(id, payload),
  invalidateKeys: () => [],
});

export const useDeleteContractDate = createMutationHook({
  mutationFn: ContractAPI.deleteContractDate,
  invalidateKeys: () => [],
});

// Meal Time Windows
export const useCreateMealTimeWindow = createMutationHook({
  mutationFn: ContractAPI.createMealTimeWindow,
  invalidateKeys: (vars: { contract_date_id: string }) => [
    queryKeys.mealTimeWindows(vars.contract_date_id),
  ],
});

export const useUpdateMealTimeWindow = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateMealTimeWindowPayload }) =>
    ContractAPI.updateMealTimeWindow(id, payload),
  invalidateKeys: () => [],
});

export const useDeleteMealTimeWindow = createMutationHook({
  mutationFn: ContractAPI.deleteMealTimeWindow,
  invalidateKeys: () => [],
});

// meals
export const useCreateMeal = createMutationHook({
  mutationFn: ContractAPI.createMeal,
  invalidateKeys: (vars: { meal_time_window_id: string }) => [
    queryKeys.meals(vars.meal_time_window_id),
  ],
});

export const useUpdateMeal = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateMealPayload }) =>
    ContractAPI.updateMeal(id, payload),
  invalidateKeys: () => [],
});

export const useDeleteMeal = createMutationHook({
  mutationFn: ContractAPI.deleteMeal,
  invalidateKeys: () => [],
});

// Ingredients
export const useCreateMealIngredient = createMutationHook({
  mutationFn: ContractAPI.createMealIngredient,
  invalidateKeys: (vars: { meal_id: string }) => [
    queryKeys.mealIngredients(vars.meal_id),
  ],
});

export const useUpdateMealIngredient = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateMealIngredientPayload }) =>
    ContractAPI.updateMealIngredient(id, payload),
  invalidateKeys: () => [],
});

export const useDeleteMealIngredient = createMutationHook({
  mutationFn: ContractAPI.deleteMealIngredient,
  invalidateKeys: () => [],
});


// weight space 
export const useCreateMealWeightSpec = createMutationHook({
  mutationFn: ContractAPI.createMealWeightSpec,
  invalidateKeys: (vars: { meal_id: string }) => [
    queryKeys.mealWeightSpecs(vars.meal_id),
  ],
});

export const useUpdateMealWeightSpec = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateMealWeightSpecPayload }) =>
    ContractAPI.updateMealWeightSpec(id, payload),
  invalidateKeys: () => [],
});

export const useDeleteMealWeightSpec = createMutationHook({
  mutationFn: ContractAPI.deleteMealWeightSpec,
  invalidateKeys: () => [],
});


// // Contract hooks
// export const useGetContracts = (filters?: ContractFilters) => {
//   return useQuery({
//     queryKey: ["contracts", filters],
//     queryFn: () => ContractAPI.getContracts(filters),
//   });
// };

// export const useGetContractById = (id: string) => {
//   return useQuery({
//     queryKey: ["contract", id],
//     queryFn: () => ContractAPI.getContractById(id),
//     enabled: !!id,
//   });
// };

// export const useCreateContract = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: CreateContractPayload) => ContractAPI.createContract(payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['contracts'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// export const useUpdateContract = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: UpdateContractPayload }) =>
//       ContractAPI.updateContract(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['contracts'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// export const useToggleContractStatus = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => ContractAPI.toggleContractStatus(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['contracts'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// export const useDeleteContract = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => ContractAPI.deleteContract(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['contracts'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// // Contract Dates hooks
// export const useGetContractDates = (contractId: string) => {
//   return useQuery({
//     queryKey: ["contractDates", contractId],
//     queryFn: () => ContractAPI.getContractDates(contractId),
//     enabled: !!contractId,
//   });
// };

// export const useGetContractDateById = (id: string) => {
//   return useQuery({
//     queryKey: ["contractDate", id],
//     queryFn: () => ContractAPI.getContractDateById(id),
//     enabled: !!id,
//   });
// };

// export const useCreateContractDate = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: { contract_id: string; service_date: string; notes?: string }) => 
//       ContractAPI.createContractDate(payload),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['contractDates', variables.contract_id] });
//       queryClient.invalidateQueries({ queryKey: ['contracts'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// export const useUpdateContractDate = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: UpdateContractDatePayload }) =>
//       ContractAPI.updateContractDate(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['contractDates'] });
//       queryClient.invalidateQueries({ queryKey: ['contracts'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// export const useDeleteContractDate = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => ContractAPI.deleteContractDate(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['contractDates'] });
//       queryClient.invalidateQueries({ queryKey: ['contracts'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// // Meal Time Windows hooks
// export const useGetMealTimeWindows = (contractDateId: string) => {
//   return useQuery({
//     queryKey: ["mealTimeWindows", contractDateId],
//     queryFn: () => ContractAPI.getMealTimeWindows(contractDateId),
//     enabled: !!contractDateId,
//   });
// };

// export const useGetMealTimeWindowById = (id: string) => {
//   return useQuery({
//     queryKey: ["mealTimeWindow", id],
//     queryFn: () => ContractAPI.getMealTimeWindowById(id),
//     enabled: !!id,
//   });
// };

// export const useCreateMealTimeWindow = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: { contract_date_id: string; start_time: string; end_time: string; label: string }) => 
//       ContractAPI.createMealTimeWindow(payload),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['mealTimeWindows', variables.contract_date_id] });
//       queryClient.invalidateQueries({ queryKey: ['contractDates'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// export const useUpdateMealTimeWindow = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: UpdateMealTimeWindowPayload }) =>
//       ContractAPI.updateMealTimeWindow(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['mealTimeWindows'] });
//       queryClient.invalidateQueries({ queryKey: ['contractDates'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// export const useDeleteMealTimeWindow = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => ContractAPI.deleteMealTimeWindow(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['mealTimeWindows'] });
//       queryClient.invalidateQueries({ queryKey: ['contractDates'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// // Meals hooks
// export const useGetMeals = (mealTimeWindowId: string) => {
//   return useQuery({
//     queryKey: ["meals", mealTimeWindowId],
//     queryFn: () => ContractAPI.getMeals(mealTimeWindowId),
//     enabled: !!mealTimeWindowId,
//   });
// };

// export const useGetMealById = (id: string) => {
//   return useQuery({
//     queryKey: ["meal", id],
//     queryFn: () => ContractAPI.getMealById(id),
//     enabled: !!id,
//   });
// };

// export const useCreateMeal = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: { meal_time_window_id: string; name: string; description?: string }) => 
//       ContractAPI.createMeal(payload),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['meals', variables.meal_time_window_id] });
//       queryClient.invalidateQueries({ queryKey: ['mealTimeWindows'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// export const useUpdateMeal = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: UpdateMealPayload }) =>
//       ContractAPI.updateMeal(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['meals'] });
//       queryClient.invalidateQueries({ queryKey: ['mealTimeWindows'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// export const useDeleteMeal = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => ContractAPI.deleteMeal(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['meals'] });
//       queryClient.invalidateQueries({ queryKey: ['mealTimeWindows'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// // Meal Ingredients hooks
// export const useGetMealIngredients = (mealId: string) => {
//   return useQuery({
//     queryKey: ["mealIngredients", mealId],
//     queryFn: () => ContractAPI.getMealIngredients(mealId),
//     enabled: !!mealId,
//   });
// };

// export const useGetMealIngredientById = (id: string) => {
//   return useQuery({
//     queryKey: ["mealIngredient", id],
//     queryFn: () => ContractAPI.getMealIngredientById(id),
//     enabled: !!id,
//   });
// };

// export const useCreateMealIngredient = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: { meal_id: string; name: string; quantity_required: string; notes?: string }) => 
//       ContractAPI.createMealIngredient(payload),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['mealIngredients', variables.meal_id] });
//       queryClient.invalidateQueries({ queryKey: ['meals'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// export const useUpdateMealIngredient = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: UpdateMealIngredientPayload }) =>
//       ContractAPI.updateMealIngredient(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['mealIngredients'] });
//       queryClient.invalidateQueries({ queryKey: ['meals'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// export const useDeleteMealIngredient = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => ContractAPI.deleteMealIngredient(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['mealIngredients'] });
//       queryClient.invalidateQueries({ queryKey: ['meals'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// // Meal Weight Specs hooks
// export const useGetMealWeightSpecs = (mealId: string) => {
//   return useQuery({
//     queryKey: ["mealWeightSpecs", mealId],
//     queryFn: () => ContractAPI.getMealWeightSpecs(mealId),
//     enabled: !!mealId,
//   });
// };

// export const useGetMealWeightSpecById = (id: string) => {
//   return useQuery({
//     queryKey: ["mealWeightSpec", id],
//     queryFn: () => ContractAPI.getMealWeightSpecById(id),
//     enabled: !!id,
//   });
// };

// export const useCreateMealWeightSpec = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: { meal_id: string; title: string; value: number; unit: string }) => 
//       ContractAPI.createMealWeightSpec(payload),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: ['mealWeightSpecs', variables.meal_id] });
//       queryClient.invalidateQueries({ queryKey: ['meals'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// export const useUpdateMealWeightSpec = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: UpdateMealWeightSpecPayload }) =>
//       ContractAPI.updateMealWeightSpec(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['mealWeightSpecs'] });
//       queryClient.invalidateQueries({ queryKey: ['meals'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };

// export const useDeleteMealWeightSpec = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => ContractAPI.deleteMealWeightSpec(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['mealWeightSpecs'] });
//       queryClient.invalidateQueries({ queryKey: ['meals'] });
//     },
//     onError: (error: any) => {
//       console.error(error);
//     },
//   });
// };