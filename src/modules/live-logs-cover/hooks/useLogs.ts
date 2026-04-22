// hooks/useLogs.ts
import { useQuery } from "@tanstack/react-query";
import { logsApi, QUERY_KEYS } from "../api/logs.api";
import { useLiveLogs } from "./useLiveLogs";

/**
 * Single hook for the logs feature.
 * Handles both initial REST fetch and real-time WebSocket updates.
 *
 * Usage:
 *   const { data, isLoading, error } = useLogs();
 */
export const useLogs = () => {
  // Wire up live updates unconditionally alongside the query
  useLiveLogs();

  return useQuery({
    queryKey: QUERY_KEYS.logs,
    queryFn: logsApi.getLogs,
    staleTime: 1000 * 60 * 5, // 5 minutes — live updates keep data fresh anyway
  });
};
// import { useQuery } from "@tanstack/react-query";
// import { logsApi } from "../api/logs.api";

// export const useLogs = () => {
//   return useQuery({
//     queryKey: ["logs"],
//     queryFn: logsApi.getLogs,
//     staleTime: 1000 * 60 * 5, // 5 minutes
//   });
// };
