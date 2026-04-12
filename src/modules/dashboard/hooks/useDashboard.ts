import { useQuery } from "@tanstack/react-query";
import { DashboardAPI } from "../api/dashboard.api";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => DashboardAPI.getDashboardData(),
    staleTime: 1000 * 60 * 5, // 5 minutes - dashboard data doesn't change frequently
    refetchOnWindowFocus: true, // Refetch when user returns to the tab
  });
};
