import type { Complaint } from "@/modules/complaints/types";
import { useQueryClient, useQuery } from "@tanstack/react-query";

const MAX_LOGS = 200;

export const useLiveLogs = () => {
  const queryClient = useQueryClient();

  const { data: logs = [] } = useQuery<Complaint[]>({
    queryKey: ["complaints-logs"],
    queryFn: () => [],
    initialData: [],
    staleTime: Infinity,
  });

  const addLog = (log: Complaint) => {
    queryClient.setQueryData<Complaint[]>(["complaints-logs"], (old = []) => {
      const exists = old.findIndex((l) => l.id === log.id) !== -1;
      if (exists) return old;

      const updated = [log, ...old];

      // ⚡ strict memory cap
      if (updated.length > MAX_LOGS) {
        return updated.slice(0, MAX_LOGS);
      }
      return updated;
    });
  };

  // ✅ Update existing log (for status updates etc.)
  const updateLog = (id: string, patch: Partial<Complaint>) => {
    queryClient.setQueryData<Complaint[]>(["complaints-logs"], (old = []) => {
      return old.map((log) =>
        log.id === id ? { ...log, ...patch } : log
      );
    });
  };

  const clearLogs = () => {
    queryClient.setQueryData(["complaints-logs"], []);
  };

  return {
    logs,
    addLog,
    updateLog,
    clearLogs,
  };
};