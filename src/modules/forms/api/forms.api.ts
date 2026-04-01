import { api } from '@/lib/api';
import type { Pagination } from '@/types/types';
import type {
  CreateFormPayload,
  Form,
  UpdateFormPayload,
} from '../types';


export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface FormFilters {
  search?: string;
  page?: number;
  per_page?: number;
  inspection_stage_id?: string;
  is_active?: number;
  form_type?: 'report' | 'readiness_assessment';
  user_role?: 'project_manager' | 'quality_manager' | 'quality_supervisor' | 'quality_inspector';
}

export interface GetFormsResponse {
  data: Form[];
  pagination: Pagination;
  message: string;
  status: number;
}


export const FormAPI = {

  // Forms
  getForms: (filters: FormFilters = {}) =>
    api.get<GetFormsResponse>('/forms', { params: filters }),

  getFormById: (id: string) =>
    id ? api.get<ApiResponse<Form>>(`/forms/${id}/show`) : Promise.resolve(null),

  createForm: (payload: CreateFormPayload) =>
    api.post<Form>('/forms/create', payload),

  updateForm: (id: string, payload: UpdateFormPayload) =>
    api.post<Form>(`/forms/${id}/update`, payload),

  toggleFormStatus: (id: string) =>
    id ? api.patch<Form>(`/forms/${id}/toggle-active`) : Promise.resolve(null),

  deleteForm: (id: string) =>
    api.delete(`/forms/${id}/delete`),

}
