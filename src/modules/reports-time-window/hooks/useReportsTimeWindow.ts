import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReportsAPI, type ReportFilters } from "../api/reports-time-window.api";
import type { AdminApprovalPayload, BranchApprovalPayload } from "../types";
import axios, { AxiosError } from "axios";

// Query Key Factory
export const queryKeys = {
  // Top-level list with filters
  reports: (filters?: ReportFilters) => ["reports", filters] as const,
  // Single report and all its nested data
  report: (id: string) => ["report", id] as const,
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
export const useGetReports = (filters?: ReportFilters) =>
  useQuery({
    queryKey: queryKeys.reports(filters),
    queryFn: () => ReportsAPI.getReports(filters),
  });

export const useGetReportById = (id: string) =>
  useQuery({
    queryKey: queryKeys.report(id),
    queryFn: () => ReportsAPI.getReportById(id),
    enabled: Boolean(id),
  });

// Mutations
export const useReportAdminApproval = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: AdminApprovalPayload }) =>
    ReportsAPI.updateAdminApproval(id, payload),
  invalidateKeys: ({ id }) => [["reports"], ["report", id]],
});

export const useReportBranchApproval = createMutationHook({
  mutationFn: ({ id, payload }: { id: string; payload: BranchApprovalPayload }) =>
    ReportsAPI.updateBranchApproval(id, payload),
  invalidateKeys: ({ id }) => [["reports"], ["report", id]],
});
