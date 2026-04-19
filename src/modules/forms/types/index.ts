import type { CreatedBy, UserRole } from "@/modules/users/types";

export type QuestionType =
  | "text"
  | "number"
  | "boolean"
  | "single_select"
  | "multi_select";

export type FormType =
  | "report"
  | "readiness_assessment";

export interface InspectionStage {
  id: string;
  name: string;
};

export interface Form {
  id: string;
  name: string;
  user_role: UserRole;
  inspection_stage?: InspectionStage | null;
  description: string;
  is_active: boolean;
  form_type: FormType;
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
  question_type: string;
  weight: number;
  is_required: boolean;
  sequence_order: number;
  options: FormQuestionOption[];
  score_earned?: number;
}

export interface FormQuestionOption {
  id: string;
  option: string;
  weight: number;
}

export interface FormBuilderState {
  [x: string]: any;
  name: string;
  description?: string;
  inspection_stage_id?: string;
  user_role: UserRole;
  form_type: FormType;
  is_active: boolean;
  sections: FormSection[];
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
  question_type: QuestionType;
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
  user_role?: UserRole;
  inspection_stage_id?: string;
  description?: string;
  is_active?: boolean;
  form_type?: FormType;
}

export interface UpdateFormSectionPayload {
  title?: string;
  description?: string;
  sequence_order?: number;
}

export interface UpdateFormQuestionPayload {
  question?: string;
  notes?: string;
  question_type?: QuestionType;
  weight?: number;
  is_required?: boolean;
  sequence_order?: number;
}

export interface UpdateFormQuestionOptionPayload {
  option?: string;
  weight?: number;
}

