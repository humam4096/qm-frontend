import { api } from '@/lib/api';
import type { Complaint } from '../types';
import type { Pagination } from '@/types/types';

export interface ComplaintFilters {
  search?: string;
  page?: number;
  per_page?: number;
  status?: string;
  priority?: string;
  complaint_type_id?: string;
}

export interface GetComplaintsResponse {
  data: Complaint[];
  pagination: Pagination;
  message: string;
}

export interface GetComplaintResponse {
  data: Complaint;
  message: string;
  status: number;
}

export const ComplaintAPI = {
  getComplaints: (filters: ComplaintFilters = {}) =>
    api.get<GetComplaintsResponse>("/complaints", { params: filters }),

  getComplaintById: (id: string) => 
    api.get<GetComplaintResponse>(`/complaints/${id}/show`),

  createComplaint: (payload: FormData) =>
    api.post<Complaint>("/complaints/create", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateComplaint: (id: string, payload: Partial<Complaint>) =>
    api.post<Complaint>(`/complaints/${id}/update`, payload),

  deleteComplaint: (id: string) =>
    api.delete(`/complaints/${id}/delete`)
};
