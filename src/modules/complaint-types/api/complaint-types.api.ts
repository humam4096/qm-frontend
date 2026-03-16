import { api } from '@/lib/api';
import type { ComplaintType } from '../types';
import type { Pagination } from '@/types/types';

export interface ComplaintTypeFilters {
  search?: string;
  page?: number;
  per_page?: number;
  is_active?: number;
}

export interface GetComplaintTypesResponse {
  data: ComplaintType[];
  pagination: Pagination;
  message: string;
  status: number;
}
export interface GetComplaintTypesListResponse {
  data: ComplaintType[];
  message: string;
  status: number;
}

export const ComplaintTypeAPI = {
  getComplaintTypes: async (filters: ComplaintTypeFilters = {}): Promise<GetComplaintTypesResponse> => {
    const res = await api.get<GetComplaintTypesResponse>('/complaint-types', {
      params: filters
    });
    return res;
  },

  getComplaintTypesList: async (): Promise<GetComplaintTypesListResponse> => {
    return await api.get<GetComplaintTypesListResponse>('/complaint-types/list');
  },

  getComplaintTypeById: async (id: string | number): Promise<ComplaintType | null> => {
    if (!id) return null;
    const res = await api.get<ComplaintType>(`/complaint-types/${id}/show`);
    return res ?? null;
  },

  toggleComplaintTypeStatus: async (id: string | number): Promise<ComplaintType | null> => {
    if (!id) return null;
    const res = await api.patch<ComplaintType>(`/complaint-types/${id}/toggle-active/`);
    return res ?? null;
  },

  createComplaintType: async (payload: Partial<ComplaintType>): Promise<ComplaintType> => {
    return api.post<ComplaintType>('/complaint-types/create', payload);
  },

  updateComplaintType: async (id: string | number, payload: Partial<ComplaintType>): Promise<ComplaintType> => {
    return api.post<ComplaintType>(`/complaint-types/${id}/update`, payload);
  },

  deleteComplaintType: async (id: string | number): Promise<void> => {
    await api.delete(`/complaint-types/${id}/delete`);
  }
};
