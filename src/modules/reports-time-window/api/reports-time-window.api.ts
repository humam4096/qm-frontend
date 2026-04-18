import { api } from '@/lib/api';
import type { ApiResponse, Pagination } from '@/types/types';
import type {
  AdminApprovalPayload,
  BranchApprovalPayload,
  TimeSlot,
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
    api.get<ApiResponse<TimeSlot[]>>('/meal-time-windows/submissions', { params: filters }),

  // Get single report by ID
  getReportById: (id: string) =>
    api.get<ApiResponse<TimeSlot>>(`/form-submissions/${id}/show`),

  // Update branch approval status
  updateBranchApproval: (id: string, payload: BranchApprovalPayload) =>
    api.post<Report>(`/form-submissions/${id}/branch-approval`, payload),

  // Update admin approval status
  updateAdminApproval: (id: string, payload: AdminApprovalPayload) =>
    api.post<Report>(`/form-submissions/${id}/admin-approval`, payload),
};
