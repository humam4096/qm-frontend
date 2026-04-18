import { api } from '@/lib/api';
import type { ApiResponse, Pagination } from '@/types/types';
import type {
  DailySlot,
} from '../types';

export interface ReportFilters {
  search?: string;
  page?: number;
  per_page?: number;
  status?: string;
  form_id?: string;
  kitchen_id?: string;
  form_type?: string;
  date_from?: string;
  date_to?: string;
}

export interface GetReportsResponse {
  data: Report[];
  pagination: Pagination;
  message: string;
  status: number;
}

export const ReportsAPI = {
  // Get list of reports with filters
  getReports: (filters: ReportFilters = {}) =>
    api.get<ApiResponse<DailySlot[]>>('/contract-dates/reports', { params: filters }),

  // Get single report by ID
  updateReportVisibility: (id: string) =>
    api.get<ApiResponse<DailySlot>>(`/contract-dates/${id}/toggle-report-visibility`),

};