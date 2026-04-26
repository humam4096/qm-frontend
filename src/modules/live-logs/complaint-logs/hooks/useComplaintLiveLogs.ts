import type { Complaint } from "@/modules/complaints/types";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { ComplaintAPI } from "@/modules/complaints/api/complaints.api";
import type { ComplaintLogFilters } from "../types";

const MAX_LOGS = 100;
const LOGS_QUERY_KEY = (filters?: ComplaintLogFilters) => ["complaints-logs", filters];

export const useComplaintLiveLogs = (filters: ComplaintLogFilters) => {
  const queryClient = useQueryClient();

  const { data: apiResponse, isLoading, refetch, isFetching } = useQuery({
    queryKey: LOGS_QUERY_KEY(filters),
    queryFn: () => ComplaintAPI.getComplaints({ per_page: MAX_LOGS, ...filters }),
    staleTime: Infinity,
  });

  const logs = apiResponse?.data || [];

  const addLog = (log: Complaint) => {
    queryClient.setQueryData<typeof apiResponse>(LOGS_QUERY_KEY(filters), (old: any) => {
      if (!old) return { 
        data: [log], 
        pagination: { 
          total: 1, 
          per_page: MAX_LOGS, 
          current_page: 1, 
          last_page: 1 
        }, 
        message: "" 
      };
      
      // const exists = old.data.findIndex((l: any) => l.id === log.id) !== -1;
      const exists = old.data.some((l: any) => l.id === log.id);
      if (exists) return old;

      const updated = [log, ...old.data].slice(0, MAX_LOGS);
      
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

  const updateLog = (id: string, patch: Partial<Complaint>) => {
    queryClient.setQueryData<typeof apiResponse>(LOGS_QUERY_KEY(filters), (old) => {
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
    queryClient.setQueryData(LOGS_QUERY_KEY(filters), {
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

  const refreshLogs = async () => {
    clearLogs();
    await refetch();
  }

  return {
    logs,
    addLog,
    updateLog,
    clearLogs,
    isLoading: isLoading || isFetching,
    refreshLogs
  };
};