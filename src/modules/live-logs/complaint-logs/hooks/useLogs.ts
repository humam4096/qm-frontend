// hooks/useLogs.ts
import { useQuery } from "@tanstack/react-query";
import { logsApi, QUERY_KEYS } from "../api/logs.api";

export const useLogs = () => {

  return useQuery({
    queryKey: QUERY_KEYS.logs,
    queryFn: logsApi.getLogs,
    staleTime: 1000 * 60 * 5,
  });
};
