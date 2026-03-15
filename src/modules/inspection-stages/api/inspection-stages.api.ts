import { api } from '@/lib/api';
import type { InspectionStage } from '../types';
import type { Pagination } from '@/types/types';

export interface InspectionStageFilters {
  search?: string;
  page?: number;
  per_page?: number;
  is_active?: number;
}

export interface GetInspectionStagesResponse {
  data: InspectionStage[];
  pagination: Pagination;
  message: string;
  status: number;
}

export const InspectionStageAPI = {
  getInspectionStages: async (filters: InspectionStageFilters = {}): Promise<GetInspectionStagesResponse> => {
    const res = await api.get<GetInspectionStagesResponse>('/inspection-stages', {
      params: filters
    });
    return res;
  },

  getInspectionStageById: async (id: string | number): Promise<InspectionStage | null> => {
    if (!id) return null;
    const res = await api.get<InspectionStage>(`/inspection-stages/${id}/show`);
    return res ?? null;
  },

  toggleInspectionStageStatus: async (id: string | number): Promise<InspectionStage | null> => {
    if (!id) return null;
    const res = await api.patch<InspectionStage>(`/inspection-stages/${id}/toggle-active/`);
    return res ?? null;
  },

  createInspectionStage: async (payload: Partial<InspectionStage>): Promise<InspectionStage> => {
    return api.post<InspectionStage>('/inspection-stages/create', payload);
  },

  updateInspectionStage: async (id: string | number, payload: Partial<InspectionStage>): Promise<InspectionStage> => {
    return api.post<InspectionStage>(`/inspection-stages/${id}/update`, payload);
  },

  deleteInspectionStage: async (id: string | number): Promise<void> => {
    await api.delete(`/inspection-stages/${id}/delete`);
  }
};
