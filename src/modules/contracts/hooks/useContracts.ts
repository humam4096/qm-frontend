import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ContractAPI, type ContractFilters } from "../api/contracts.api";
import type {
  UpdateContractDatePayload,
  UpdateContractPayload,
  UpdateMealIngredientPayload,
  UpdateMealPayload,
  UpdateMealTimeWindowPayload,
  UpdateMealWeightSpecPayload,
} from "../types";
import axios, { AxiosError } from "axios";

// ---------------------------------------------------------------------------
// Query Key Factory
//
// All nested resources are scoped under ['contract', contractId, ...].
// This means a single:
//   invalidateQueries({ queryKey: ['contract', contractId] })
// (without exact:true) busts the entire contract subtree — dates, windows,
// meals, ingredients, and weight specs — with one call.
// ---------------------------------------------------------------------------
export const queryKeys = {
  // Top-level list
  contracts: (filters?: ContractFilters) => ["contracts", filters] as const,

  // Single contract and all its nested data
  contract:        (id: string) => ["contract", id] as const,
  contractDates:   (contractId: string) => ["contract", contractId, "dates"] as const,
  contractDate:    (id: string) => ["contractDate", id] as const,
  mealTimeWindows: (dateId: string) => ["contract", dateId, "timeWindows"] as const,
  mealTimeWindow:  (id: string) => ["mealTimeWindow", id] as const,
  meals:           (windowId: string) => ["contract", windowId, "meals"] as const,
  meal:            (id: string) => ["meal", id] as const,
  mealIngredients: (mealId: string) => ["contract", mealId, "ingredients"] as const,
  mealIngredient:  (id: string) => ["mealIngredient", id] as const,
  mealWeightSpecs: (mealId: string) => ["contract", mealId, "weightSpecs"] as const,
  mealWeightSpec:  (id: string) => ["mealWeightSpec", id] as const,
};

// ---------------------------------------------------------------------------
// Convenience hook — flush everything related to one contract at once.
// Call this in builder steps after all mutations in a step complete.
//
//   const invalidate = useInvalidateContract();
//   await invalidate(contractId);
// ---------------------------------------------------------------------------
export const useInvalidateContract = () => {
  const queryClient = useQueryClient();
  return (contractId: string) => {
    // Busts ['contract', contractId] + every nested key via prefix match
    queryClient.invalidateQueries({ queryKey: queryKeys.contract(contractId) });
    // Also bust the list so status/counts stay fresh
    queryClient.invalidateQueries({ queryKey: ["contracts"] });
  };
};

// ---------------------------------------------------------------------------
// Error Handler
// ---------------------------------------------------------------------------
const handleError = (error: AxiosError) => {
  if (axios.isAxiosError(error)) {
    console.error("Axios error:", error.response?.data);
  } else {
    console.error("Unknown error:", error);
  }
};

// ---------------------------------------------------------------------------
// Mutation Factory
// ---------------------------------------------------------------------------
const createMutationHook = <TVariables>({
  mutationFn,
  invalidateKeys,
}: {
  mutationFn: (vars: TVariables) => Promise<any>;
  // Return an array of query keys to bust (prefix match, not exact)
  invalidateKeys: (vars: TVariables) => readonly unknown[][];
}) => {
  return () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn,
      onSuccess: (_data, vars) => {
        invalidateKeys(vars).forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      },
      onError: handleError,
    });
  };
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Mutations
//
// Strategy:
//  - Mutations that know the contractId invalidate ['contract', id] which
//    cascades to ALL nested data via prefix matching.
//  - Mutations that only know a child ID (e.g. meal_time_window_id) can only
//    bust their immediate key. For full consistency, call useInvalidateContract
//    at the end of a builder step instead of relying solely on per-mutation invalidation.
// ---------------------------------------------------------------------------

// Contract
export const useCreateContract = createMutationHook({
  mutationFn: ContractAPI.createContract,
  invalidateKeys: () => [["contracts"]],
});

export const useUpdateContract = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateContractPayload }) =>
    ContractAPI.updateContract(id, payload),
  invalidateKeys: () => [["contracts"]],
});

export const useToggleContractStatus = createMutationHook({
  mutationFn: (id: string) => ContractAPI.toggleContractStatus(id),
  invalidateKeys: () => [["contracts"]],
});

export const useDeleteContract = createMutationHook({
  mutationFn: ContractAPI.deleteContract,
  invalidateKeys: () => [["contracts"]],
});

// Contract Dates
export const useCreateContractDate = createMutationHook({
  mutationFn: ContractAPI.createContractDate,
  invalidateKeys: () => [["contracts"]],
});

export const useUpdateContractDate = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateContractDatePayload }) =>
    ContractAPI.updateContractDate(id, payload),
  invalidateKeys: () => [["contracts"]],
});

export const useDeleteContractDate = createMutationHook({
  mutationFn: ContractAPI.deleteContractDate,
  invalidateKeys: () => [["contracts"]],
});

// Meal Time Windows
export const useCreateMealTimeWindow = createMutationHook({
  mutationFn: ContractAPI.createMealTimeWindow,
  invalidateKeys: () => [["contracts"]],
});

export const useUpdateMealTimeWindow = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateMealTimeWindowPayload }) =>
    ContractAPI.updateMealTimeWindow(id, payload),
  invalidateKeys: () => [["contracts"]],
});

export const useDeleteMealTimeWindow = createMutationHook({
  mutationFn: ContractAPI.deleteMealTimeWindow,
  invalidateKeys: () => [["contracts"]],
});

// Meals
export const useCreateMeal = createMutationHook({
  mutationFn: ContractAPI.createMeal,
  invalidateKeys: () => [["contracts"]],
});

export const useUpdateMeal = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateMealPayload }) =>
    ContractAPI.updateMeal(id, payload),
  invalidateKeys: () => [["contracts"]],
});

export const useDeleteMeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ContractAPI.deleteMeal,
    onSuccess: (_data, mealId: string) => {
      queryClient.removeQueries({ queryKey: queryKeys.mealIngredients(mealId) });
      queryClient.removeQueries({ queryKey: queryKeys.mealWeightSpecs(mealId) });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: handleError,
  });
};

// Ingredients
export const useCreateMealIngredient = createMutationHook({
  mutationFn: ContractAPI.createMealIngredient,
  invalidateKeys: () => [["contracts"]],
});

export const useUpdateMealIngredient = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateMealIngredientPayload }) =>
    ContractAPI.updateMealIngredient(id, payload),
  invalidateKeys: () => [["contracts"]],
});

export const useDeleteMealIngredient = createMutationHook({
  mutationFn: ContractAPI.deleteMealIngredient,
  invalidateKeys: () => [["contracts"]],
});

// Weight Specs
export const useCreateMealWeightSpec = createMutationHook({
  mutationFn: ContractAPI.createMealWeightSpec,
  invalidateKeys: () => [["contracts"]],
});

export const useUpdateMealWeightSpec = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateMealWeightSpecPayload }) =>
    ContractAPI.updateMealWeightSpec(id, payload),
  invalidateKeys: () => [["contracts"]],
});

export const useDeleteMealWeightSpec = createMutationHook({
  mutationFn: ContractAPI.deleteMealWeightSpec,
  invalidateKeys: () => [["contracts"]],
});
