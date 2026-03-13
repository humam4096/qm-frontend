
import { api } from '@/lib/api';
import type { Branch, Company } from '../types';
import type { Pagination } from '@/types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface CompanyFilters {
  search?: string;
  page?: number;
  per_page?: number;
  is_active?: number;
}

export interface GetCompaniesResponse {
  data: Company[];
  pagination: Pagination;
  message: string;
  status: number;
}

export const CompanyAPI = {
  getCompanies: async (filters: CompanyFilters = {}): Promise<GetCompaniesResponse> => {
    const res = await api.get<GetCompaniesResponse>('/companies', {
      params: filters
    });
    return res;
  },

  getCompanyById: async (id: string | number): Promise<Company | null> => {
    if (!id) return null;
    const res = await api.get<Company>(`/companies/${id}`);
    return res ?? null;
  },

  createCompany: async (payload: Partial<Company>): Promise<Company> => {
    return api.post<Company>('/companies/create', payload);
  },

  updateCompany: async (id: string | number, payload: Partial<Company>): Promise<Company> => {
    return api.post<Company>(`/companies/${id}/update`, payload);
  },

  deleteCompany: async (id: string | number): Promise<void> => {
    await api.delete(`/companies/${id}/delete`);
  },

  getBranches: async (companyId: string | number): Promise<Branch[]> => {
    if (!companyId) return [];

    const res = await api.get<Branch[]>(`/companies/${companyId}/branches`);

    return Array.isArray(res) ? res : (res as { data?: Branch[] })?.data ?? [];
  }
};


export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => CompanyAPI.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};


export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Company>) => CompanyAPI.createCompany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<Company> }) =>
      CompanyAPI.updateCompany(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error: any) => {
      console.error(error);
    },
  });
};