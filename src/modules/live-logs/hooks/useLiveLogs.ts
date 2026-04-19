// hooks/useLiveLogs.ts

import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/useAuthStore";
import { realtimeManager } from "../services/realtimeManager";
import { logsChannelResolver } from "../utils/logsChannelResolver";
import type { Log } from "../types";

export const useLiveLogs = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const handler = useCallback(
    (event: any) => {
      const log = event?.log;
      if (!log?.id) return;

      queryClient.setQueryData(["logs"], (old: Log[] = []) => {
        // Prevent duplicates
        const exists = old.some((l) => l.id === log.id);
        if (exists) return old;

        // Add new log at the beginning and limit to 100
        return [log, ...old].slice(0, 100);
      });
    },
    [queryClient]
  );

  useEffect(() => {
    if (!user) return;

    const channels = logsChannelResolver(user);

    channels.forEach((channel) => {
      realtimeManager.subscribe(channel, "LogCreated", handler);
    });

    return () => {
      channels.forEach((channel) => {
        realtimeManager.unsubscribe(channel, handler);
      });
    };
  }, [user, handler]);
};
