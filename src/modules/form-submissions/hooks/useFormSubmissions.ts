import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormSubmissionAPI, type FormSubmissionFilters } from "../api/form-submissions.api";
import type {
  UpdateAnswersPayload,
  TransitionPayload,
  BranchApprovalPayload,
} from "../types";
import axios, { AxiosError } from "axios";

// Query Key Factory
export const queryKeys = {
  // Top-level list
  formSubmissions: (filters?: FormSubmissionFilters) => ["form-submissions", filters] as const,
  // Single form submission and all its nested data
  formSubmission: (id: string) => ["form-submission", id] as const,
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
export const useGetFormSubmissions = (filters?: FormSubmissionFilters) =>
  useQuery({
    queryKey: queryKeys.formSubmissions(filters),
    queryFn: () => FormSubmissionAPI.getFormSubmissions(filters),
  });

export const useGetFormSubmissionById = (id: string) =>
  useQuery({
    queryKey: queryKeys.formSubmission(id),
    queryFn: () => FormSubmissionAPI.getFormSubmissionById(id),
    enabled: Boolean(id),
  });

// Mutations
export const useCreateFormSubmission = createMutationHook({
  mutationFn: FormSubmissionAPI.createFormSubmission,
  invalidateKeys: () => [["form-submissions"]],
});

export const useUpdateAnswers = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateAnswersPayload }) =>
    FormSubmissionAPI.updateAnswers(id, payload),
  invalidateKeys: ({ id }) => [["form-submissions"], ["form-submission", id]],
});

export const useTransitionStatus = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: TransitionPayload }) =>
    FormSubmissionAPI.transitionStatus(id, payload),
  invalidateKeys: ({ id }) => [["form-submissions"], ["form-submission", id]],
});

export const useUpdateBranchApproval = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: BranchApprovalPayload }) =>
    FormSubmissionAPI.updateBranchApproval(id, payload),
  invalidateKeys: ({ id }) => [["form-submissions"], ["form-submission", id]],
});
