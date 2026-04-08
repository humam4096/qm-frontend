import { api } from '@/lib/api';
import type { Pagination } from '@/types/types';
import type {
  FormSubmission,
  CreateFormSubmissionPayload,
  UpdateAnswersPayload,
  TransitionPayload,
  BranchApprovalPayload,
} from '../types';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface FormSubmissionFilters {
  search?: string;
  page?: number;
  per_page?: number;
  status?: string;
  form_id?: string;
  inspection_stage_id?: string;
  kitchen_id?: string;
  form_type?: string;
  date_from?: string;
  date_to?: string;
}

export interface GetFormSubmissionsResponse {
  data: FormSubmission[];
  pagination: Pagination;
  message: string;
  status: number;
}

export const FormSubmissionAPI = {
  // Get list of form submissions with filters
  getFormSubmissions: (filters: FormSubmissionFilters = {}) =>
    api.get<GetFormSubmissionsResponse>('/form-submissions', { params: filters }),

  // Get single form submission by ID
  getFormSubmissionById: (id: string) =>
    id ? api.get<ApiResponse<FormSubmission>>(`/form-submissions/${id}/show`) : Promise.resolve(null),

  // Create new form submission
  createFormSubmission: (payload: CreateFormSubmissionPayload) =>
    api.post<FormSubmission>('/form-submissions/create', payload),

  // Update answers for a form submission
  updateAnswers: (id: string, payload: UpdateAnswersPayload) =>
    api.post<FormSubmission>(`/form-submissions/${id}/answers/update`, payload),

  // Transition form submission status
  transitionStatus: (id: string, payload: TransitionPayload) =>
    api.post<FormSubmission>(`/form-submissions/${id}/transition`, payload),

  // Update branch approval status
  updateBranchApproval: (id: string, payload: BranchApprovalPayload) =>
    api.post<FormSubmission>(`/form-submissions/${id}/branch-approval`, payload),
};
