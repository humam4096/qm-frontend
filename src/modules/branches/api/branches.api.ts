import { api } from '@/lib/api';
import type { Branch } from '../types';
import type { Pagination } from '@/types/types';

export interface BranchFilters {
  search?: string;
  page?: number;
  per_page?: number;
  is_active?: number;
}

export interface GetBranchesResponse {
  data: Branch[];
  pagination: Pagination;
  message: string;
}

export interface GetBranchResponse {
  data: Branch;
  message: string;
  status: number;
}

export const BranchAPI = {
  getBranches: (filters: BranchFilters = {}) =>
    api.get<GetBranchesResponse>("/branches", { params: filters }),

  getBranchById: (id: number | string) => 
    api.get<GetBranchResponse>(`/branches/${id}/show`),

  toggleBranchState: (id: number | string) =>
    api.patch<Branch>(`/branches/${id}/toggle-active/`),

  createBranch: (payload: any) =>
    api.post<Branch>("/branches/create", payload),

  updateBranch: (id: number | string, payload: Partial<Branch>) =>
    api.post<Branch>(`/branches/${id}/update`, payload),

  deleteBranch: (id: number | string) =>
    api.delete(`/branches/${id}/delete`)
};
