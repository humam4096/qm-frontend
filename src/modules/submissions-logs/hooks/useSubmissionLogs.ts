import type { SubmissionLog } from "@/modules/live-logs/submissions-logs/types";
import { useQueryClient, useQuery } from "@tanstack/react-query";

const MAX_LOGS = 200;

export const useSubmissionLogs = () => {
  const queryClient = useQueryClient();

  const { data: logs = [] } = useQuery<SubmissionLog[]>({
    queryKey: ["submission-logs"],
    initialData: [],
    staleTime: Infinity,
  });

  const addLog = (log: SubmissionLog) => {
    queryClient.setQueryData<SubmissionLog[]>(["submission-logs"], (old = []) => {
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

  // ✅ Update existing log (for status updates)
  const updateLog = (id: string, patch: Partial<SubmissionLog>) => {
    queryClient.setQueryData<SubmissionLog[]>(["submission-logs"], (old = []) => {
      return old.map((log) =>
        log.id === id ? { ...log, ...patch } : log
      );
    });
  };

  const clearLogs = () => {
    queryClient.setQueryData(["submission-logs"], []);
  };

  return {
    logs,
    addLog,
    updateLog,
    clearLogs,
  };
};
