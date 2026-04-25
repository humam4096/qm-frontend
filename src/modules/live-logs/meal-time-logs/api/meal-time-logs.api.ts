import { api } from '@/lib/api';
import type { MealTimeLog } from '../types';
import type { Pagination } from '@/types/types';

export interface MealTimeLogsFilters {
  search?: string;
  page?: number;
  per_page?: number;
  date?: string;
  kitchen_id?: string;
}

export interface GetMealTimeLogsResponse {
  data: MealTimeLog[];
  pagination: Pagination;
  message: string;
}

export const MealTimeLogsAPI = {
  getMealTimeLogs: (filters: MealTimeLogsFilters = {}) =>
    api.get<GetMealTimeLogsResponse>("/meal-time-window-tracker", { params: filters }),
};
