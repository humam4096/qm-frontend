import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReportsAPI, type ReportFilters } from "../api/reports-daily.api";
import axios, { AxiosError } from "axios";

// Query Key Factory
export const queryKeys = {
  // Top-level list with filters
  reports: (filters?: ReportFilters) => ["daily_reports", filters] as const,
  // Single report and all its nested data
  report: (id: string) => ["daily_report", id] as const,
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
export const useGetReportsDaily = (filters?: ReportFilters) =>
  useQuery({
    queryKey: queryKeys.reports(filters),
    queryFn: () => ReportsAPI.getReports(filters),
  });

// Mutations
export const useUpdateReportVisibility = createMutationHook({
  mutationFn: ({ id }: { id: string }) =>
    ReportsAPI.updateReportVisibility(id),
  invalidateKeys: ({ id }) => [["daily_reports"], ["daily_report", id]],
});
