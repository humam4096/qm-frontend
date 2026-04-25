import type { MealTimeLog } from "../types";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { MealTimeLogsAPI } from "../api/meal-time-logs.api";

const MAX_LOGS = 200;
const LOGS_QUERY_KEY = ["meal-time-logs"];

export const useMealTimeLogs = () => {
  const queryClient = useQueryClient();

  // Fetch initial meal time logs from API
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: LOGS_QUERY_KEY,
    queryFn: () => MealTimeLogsAPI.getMealTimeLogs({ per_page: MAX_LOGS }),
    staleTime: Infinity,
  });


  const logs = apiResponse?.data || [];

  const addLog = (log: MealTimeLog) => {
    queryClient.setQueryData<typeof apiResponse>(LOGS_QUERY_KEY, (old: any) => {
      if (!old) 
          return { 
          data: [log], 
          pagination: { 
            total: 1, 
            per_page: MAX_LOGS, 
            current_page: 1, 
            last_page: 1 
          }, 
          message: "" 
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

  const updateLog = (id: string, patch: Partial<MealTimeLog>) => {
    queryClient.setQueryData<typeof apiResponse>(LOGS_QUERY_KEY, (old) => {
      if (!old) return old;
      
      return {
        ...old,
        data: old.data.map((log) =>
          log.id === id ? { ...log, ...patch } : log
        ),
      };
    });
  };

  const clearLogs = () => {
    queryClient.setQueryData(LOGS_QUERY_KEY, {
      data: [],
      pagination: { 
        total: 0, 
        per_page: MAX_LOGS, 
        current_page: 1, 
        last_page: 1 
      },
      message: ""
    });
  };

  return {
    logs,
    addLog,
    updateLog,
    clearLogs,
    isLoading,
  };
};
