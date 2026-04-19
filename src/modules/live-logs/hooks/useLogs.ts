// hooks/useLogs.ts

import { useQuery } from "@tanstack/react-query";
import { logsApi } from "../api/logs.api";

export const useLogs = () => {
  return useQuery({
    queryKey: ["logs"],
    queryFn: logsApi.getLogs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
