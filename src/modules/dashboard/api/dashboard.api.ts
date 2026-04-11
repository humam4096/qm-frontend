import { api } from '@/lib/api';
import type { DashboardData } from '../types';
import type { ApiResponse } from '@/types/types';

export const DashboardAPI = {
  getDashboardData: () =>
    api.get<ApiResponse<DashboardData>>("/dashboard"),
};
