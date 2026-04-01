import type { CreatedBy } from "@/modules/users/types";

export interface InspectionStage {
  id: string;
  name: string;
};

export interface Form {
  id: string;
  name: string;
  user_role: 'project_manager' | 'quality_manager' | 'quality_supervisor' | 'quality_inspector';
  inspection_stage?: InspectionStage | null;
  description: string;
  is_active: boolean;
  form_type: 'report' | 'readiness_assessment';
  created_at: string;
  created_by: CreatedBy;
  updated_at: string;
  updated_by: string;
  questions_count: number;
  sections_count: number;
  sections: FormSection[];
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  sequence_order: number;
  questions: FormQuestion[];
}

export interface FormQuestion {
  id: string;
  question: string;
  notes?: string;
  question_type: 'single_select' | 'number' | 'boolean' | 'multi_select' | 'text';
  weight: number;
  is_required: boolean;
  sequence_order: number;
  options: FormQuestionOption[];
}

export interface FormQuestionOption {
  id: string;
  option: string;
  weight: number;
}

// Create/Update payload types
export interface CreateFormPayload {
  name: string;
  user_role: 'project_manager' | 'quality_manager' | 'quality_supervisor' | 'quality_inspector';
  inspection_stage_id: string;
  description: string;
  is_active: boolean;
  form_type: 'report' | 'readiness_assessment';
  sections: CreateFormSectionPayload[];
}

export interface CreateFormSectionPayload {
  title: string;
  description?: string;
  sequence_order: number;
  questions: CreateFormQuestionPayload[];
}

export interface CreateFormQuestionPayload {
  question: string;
  notes?: string;
  question_type: 'single_select' | 'number' | 'boolean' | 'multi_select' | 'text';
  weight: number;
  is_required: boolean;
  sequence_order: number;
  options: CreateFormQuestionOptionPayload[];
}

export interface CreateFormQuestionOptionPayload {
  option: string;
  weight: number;
}

export interface UpdateFormPayload {
  name?: string;
  user_role?: 'project_manager' | 'quality_manager' | 'quality_supervisor' | 'quality_inspector';
  inspection_stage_id?: string;
  description?: string;
  is_active?: boolean;
  form_type?: 'report' | 'readiness_assessment';
}

export interface UpdateFormSectionPayload {
  title?: string;
  description?: string;
  sequence_order?: number;
}

export interface UpdateFormQuestionPayload {
  question?: string;
  notes?: string;
  question_type?: 'single_select' | 'number' | 'boolean' | 'multi_select' | 'text';
  weight?: number;
  is_required?: boolean;
  sequence_order?: number;
}

export interface UpdateFormQuestionOptionPayload {
  option?: string;
  weight?: number;
}
