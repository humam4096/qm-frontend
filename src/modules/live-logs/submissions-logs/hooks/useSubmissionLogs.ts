import type { SubmissionLog, SubmissionLogFilters } from "../types";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { FormSubmissionAPI } from "@/modules/form-submissions/api/form-submissions.api";

const MAX_LOGS = 100;
const LOGS_QUERY_KEY = (filters?: SubmissionLogFilters) => ["submission-logs", filters];

export const useSubmissionLogs = (apiFilters?: SubmissionLogFilters) => {
  const queryClient = useQueryClient();

  // Fetch initial submissions from API
  const { data: apiResponse, isLoading, isFetching } = useQuery({
    queryKey: LOGS_QUERY_KEY(apiFilters),
    queryFn: () => FormSubmissionAPI.getFormSubmissions({ per_page: MAX_LOGS, ...apiFilters }),
    staleTime: Infinity,
  });

  // Extract submissions from API response
  const logs = apiResponse?.data || [];

  const addLog = (log: SubmissionLog) => {
    queryClient.setQueryData<typeof apiResponse>(LOGS_QUERY_KEY(apiFilters), (old: any) => {
      if (!old) return { 
        data: [log], 
        pagination: { 
          total: 1, 
          per_page: MAX_LOGS, 
          current_page: 1, 
          last_page: 1 
        }, 
        message: "", 
      };
      
      const exists = old.data.some((l: any) => l.id === log.id);
      if (exists) return old;

      const updated = [log, ...old.data];
      
      return {
        ...old,
        data: updated,
        pagination: {
          ...old.pagination,
          total: old.pagination.total + 1,
        }
      };
    });
  };

  // ✅ Update existing log (for status updates)
  const updateLog = (id: string, patch: Partial<SubmissionLog>) => {
    queryClient.setQueryData<typeof apiResponse>(LOGS_QUERY_KEY(apiFilters), (old: any) => {
      if (!old) return old;
      
      return {
        ...old,
        data: old.data.map((log: any) =>
          log.id === id ? { ...log, ...patch } : log
        ),
      };
    });
  };

  const clearLogs = () => {
    queryClient.setQueryData(LOGS_QUERY_KEY(apiFilters), {
      data: [],
      pagination: { 
        total: 0, 
        per_page: MAX_LOGS, 
        current_page: 1, 
        last_page: 1 
      },
      message: "",
    });
  };

  return {
    logs,
    addLog,
    updateLog,
    clearLogs,
    isLoading: isLoading || isFetching,
  };
};
