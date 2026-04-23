// hooks/useLiveLogs.ts
import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/app/store/useAuthStore";
import { realtimeManager } from "../services/realtimeManager";
import { logsChannelResolver } from "../utils/logsChannelResolver";
import type { Log } from "../types";
import { QUERY_KEYS } from "../api/logs.api";

const MAX_CACHED_LOGS = 100;

/**
 * Wires up Reverb WebSocket listeners for real-time log updates.
 * Handles both public (no-auth) and private (Bearer token) channels
 * based on the config returned by logsChannelResolver.
 *
 * Not intended to be used directly — consumed by useLogs().
 */


export const useLiveLogs = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const handler = useCallback(
    (event: unknown) => {
      const log = (event as { log?: Log })?.log;
      if (!log?.id) return;

      queryClient.setQueryData<Log[]>(QUERY_KEYS.logs, (prev = []) => {
        if (prev.some((l) => l.id === log.id)) return prev;
        return [log, ...prev].slice(0, MAX_CACHED_LOGS);
      });
    },
    [queryClient]
  );

  useEffect(() => {
    if (!user) return;

    const channelConfigs = logsChannelResolver(user);

    // Subscribe to every event on every channel
    channelConfigs.forEach(({ channel, channelType, events }) => {
      events.forEach((event) => {
        realtimeManager.subscribe(channel, event, handler, { channelType });
      });
    });

    return () => {
      channelConfigs.forEach(({ channel, events }) => {
        events.forEach((event) => {
          realtimeManager.unsubscribe(channel, event, handler);
        });
      });
    };
  }, [user, handler]);
};


// import { useCallback, useEffect } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import { useAuthStore } from "@/app/store/useAuthStore";
// import { realtimeManager } from "../services/realtimeManager";
// import { logsChannelResolver } from "../utils/logsChannelResolver";
// import type { Log } from "../types";
// import { QUERY_KEYS } from "../api/logs.api";

// const LOG_EVENT = "LogCreated";
// const MAX_CACHED_LOGS = 100;

// /**
//  * Wires up Reverb WebSocket listeners for real-time log updates.
//  * Not intended to be used directly — consumed by useLogs().
//  */
// export const useLiveLogs = () => {
//   const { user } = useAuthStore();
//   const queryClient = useQueryClient();

//   const handler = useCallback(
//     (event: unknown) => {
//       const log = (event as { log?: Log })?.log;
//       if (!log?.id) return;

//       queryClient.setQueryData<Log[]>(QUERY_KEYS.logs, (prev = []) => {
//         // Prevent duplicates
//         if (prev.some((l) => l.id === log.id)) return prev;

//         // Prepend and cap list size
//         return [log, ...prev].slice(0, MAX_CACHED_LOGS);
//       });
//     },
//     [queryClient]
//   );

//   useEffect(() => {
//     if (!user) return;

//     const channels = logsChannelResolver(user);

//     channels.forEach((channel) => {
//       realtimeManager.subscribe(channel, LOG_EVENT, handler);
//     });

//     return () => {
//       channels.forEach((channel) => {
//         realtimeManager.unsubscribe(channel, LOG_EVENT, handler);
//       });
//     };
//   }, [user, handler]);
// };


// import { useCallback, useEffect } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import { useAuthStore } from "@/app/store/useAuthStore";
// import { realtimeManager } from "../services/realtimeManager";
// import { logsChannelResolver } from "../utils/logsChannelResolver";
// import type { Log } from "../types";

// export const useLiveLogs = () => {
//   const { user } = useAuthStore();
//   const queryClient = useQueryClient();

//   const handler = useCallback(
//     (event: any) => {
//       const log = event?.log;
//       if (!log?.id) return;

//       queryClient.setQueryData(["logs"], (old: Log[] = []) => {
//         // Prevent duplicates
//         const exists = old.some((l) => l.id === log.id);
//         if (exists) return old;

//         // Add new log at the beginning and limit to 100
//         return [log, ...old].slice(0, 100);
//       });
//     },
//     [queryClient]
//   );

//   useEffect(() => {
//     if (!user) return;

//     const channels = logsChannelResolver(user);

//     channels.forEach((channel) => {
//       realtimeManager.subscribe(channel, "LogCreated", handler);
//     });

//     return () => {
//       channels.forEach((channel) => {
//         realtimeManager.unsubscribe(channel, handler);
//       });
//     };
//   }, [user, handler]);
// };
