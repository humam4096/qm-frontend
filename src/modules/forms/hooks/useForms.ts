import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormAPI, type FormFilters } from "../api/forms.api";
import type {
  UpdateFormPayload,
} from "../types";
import axios, { AxiosError } from "axios";

// Query Key Factory

export const queryKeys = {
  // Top-level list
  forms: (filters?: FormFilters) => ["forms", filters] as const,
  // Single form and all its nested data
  form: (id: string) => ["form", id] as const,
};


// Error Handler
const handleError = (error: AxiosError) => {
  if (axios.isAxiosError(error)) {
    console.error("Axios error:", error.response?.data);
  } else {
    console.error("Unknown error:", error);
  }
};

// Mutation Factory
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


// Queries
export const useGetForms = (filters?: FormFilters) =>
  useQuery({
    queryKey: queryKeys.forms(filters),
    queryFn: () => FormAPI.getForms(filters),
  });

export const useGetFormById = (id: string) =>
  useQuery({
    queryKey: queryKeys.form(id),
    queryFn: () => FormAPI.getFormById(id),
    enabled: Boolean(id),
  });


// Mutations

// Form
export const useCreateForm = createMutationHook({
  mutationFn: FormAPI.createForm,
  invalidateKeys: () => [["forms"]],
});

export const useUpdateForm = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateFormPayload }) =>
    FormAPI.updateForm(id, payload),
  invalidateKeys: () => [["forms"]],
});

export const useToggleFormStatus = createMutationHook({
  mutationFn: (id: string) => FormAPI.toggleFormStatus(id),
  invalidateKeys: () => [["forms"]],
});

export const useDeleteForm = createMutationHook({
  mutationFn: FormAPI.deleteForm,
  invalidateKeys: () => [["forms"]],
});
