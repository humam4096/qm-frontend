import { api } from '@/lib/api';
import type { Kitchen, KitchenTimeWindow } from '../types';
import type { ApiResponse, Pagination } from '@/types/types';
import type { Contract } from '@/modules/contracts/types';

export interface KitchenFilters {
  search?: string;
  page?: number;
  per_page?: number;
  is_active?: number;
  branch_id?: number | string;
  zone_id?: number | string;
  is_hajj?: number;
}

export interface GetKitchensResponse {
  data: Kitchen[];
  pagination: Pagination;
  message: string;
}
export interface GetKitchensListResponse {
  data: Kitchen[];
  message: string;
}

export interface GetKitchenResponse {
  data: Kitchen;
  message: string;
  status: number;
}

export const KitchenAPI = {
  getKitchens: (filters: KitchenFilters = {}) =>
    api.get<GetKitchensResponse>("/kitchens", { params: filters }),

  getKitchensList: () =>
    api.get<GetKitchensListResponse>("/kitchens/list"),

  getKitchenById: (id: number | string) =>
    api.get<GetKitchenResponse>(`/kitchens/${id}/show`),

  getKitchenContracts: (id: number | string) =>
    api.get<ApiResponse<Contract[]>>(`/kitchens/${id}/contracts`),

  getKitchenContractTimes: (id: number | string) =>
    api.get<ApiResponse<KitchenTimeWindow[]>>(`/kitchens/${id}/contract-dates-with-time-windows`),

  toggleKitchenState: (id: number | string) =>
    api.patch<Kitchen>(`/kitchens/${id}/toggle-active/`),

  createKitchen: (payload: any) =>
    api.post<Kitchen>("/kitchens/create", payload),

  updateKitchen: (id: number | string, payload: Partial<Kitchen>) =>
    api.post<Kitchen>(`/kitchens/${id}/update`, payload),

  deleteKitchen: (id: number | string) =>
    api.delete(`/kitchens/${id}/delete`)
};
