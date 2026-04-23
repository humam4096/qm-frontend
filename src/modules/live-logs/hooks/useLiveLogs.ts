import type { Complaint } from "@/modules/complaints/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const MAX_LOGS = 50;

export const useLiveLogs = () => {
  const queryClient = useQueryClient();

  const { data = [] } = useQuery({
    queryKey: ["live-logs"],
    queryFn: async () => [],
    staleTime: Infinity,
    initialData: [],
  });

  const addLog = (log: Complaint) => {
    queryClient.setQueryData<Complaint[]>(["live-logs"], (old = []) => {
      const exists = old.some((l) => l.id === log.id);
      if (exists) return old;

      return [log, ...old].slice(0, MAX_LOGS);
    });
  };

  const clearLogs = () => {
    queryClient.setQueryData(["live-logs"], []);
  };

  return {
    logs: data,
    addLog,
    clearLogs,
  };
};