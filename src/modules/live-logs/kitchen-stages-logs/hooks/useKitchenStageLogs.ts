import type { KitchenStageLog } from "../types";
import { useQueryClient, useQuery } from "@tanstack/react-query";

const MAX_LOGS = 200;

export const useKitchenStageLogs = () => {
  const queryClient = useQueryClient();

  const { data: logs = [] } = useQuery<KitchenStageLog[]>({
    queryKey: ["kitchen-stage-logs"],
    queryFn: () => [],
    initialData: [],
    staleTime: Infinity,
  });

  const addLog = (log: KitchenStageLog) => {
    queryClient.setQueryData<KitchenStageLog[]>(["kitchen-stage-logs"], (old = []) => {
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

  // ✅ Update existing log (for progress updates)
  const updateLog = (id: string, patch: Partial<KitchenStageLog>) => {
    queryClient.setQueryData<KitchenStageLog[]>(["kitchen-stage-logs"], (old = []) => {
      return old.map((log) =>
        log.id === id ? { ...log, ...patch } : log
      );
    });
  };

  const clearLogs = () => {
    queryClient.setQueryData(["kitchen-stage-logs"], []);
  };

  return {
    logs,
    addLog,
    updateLog,
    clearLogs,
  };
};
