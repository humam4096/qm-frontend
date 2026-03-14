
import { api } from '@/lib/api';
import type { Branch, Company } from '../types';
import type { Pagination } from '@/types/types';

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
  getCompaniesList: async (): Promise<any> => {
    return await api.get<any>('/companies/list');
  },

  getCompanyById: async (id: string | number): Promise<Company | null> => {
    if (!id) return null;
    const res = await api.get<Company>(`/companies/${id}/show`);
    return res ?? null;
  },

  toggleCompanyStatus: async (id: string | number): Promise<Company | null> => {
    if (!id) return null;
    const res = await api.patch<Company>(`/companies/${id}/toggle-active/`);
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

