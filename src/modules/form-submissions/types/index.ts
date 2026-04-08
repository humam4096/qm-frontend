import type { UserRole } from "@/app/store/useAuthStore";
import type { Form } from "@/modules/forms/types";

export type FormSubmissionStatus =
  | "under_supervisor_review"
  | "under_manager_review"
  | "approved"
  | "rejected";

export type BranchApprovalStatus = "pending" | "approved" | "rejected";

export interface Time {
  id: string;
  label: string;
  service_date: string;
}

export interface Kitchen {
  id: string;
  name: string;
}

export interface SubmittedBy {
  id: string;
  name: string;
  role: UserRole;
}

export interface StatusHistoryEntry {
  status: FormSubmissionStatus;
  changed_at: string;
  changed_by: SubmittedBy;
}

export interface FormSubmission {
  id: string;
  form_type: string;
  status: FormSubmissionStatus;
  branch_approval: BranchApprovalStatus;
  branch_approval_notes: string | null;
  inspection_date: string;
  score: number;
  time: Time;
  form: Form;
  kitchen: Kitchen;
  submitted_by: SubmittedBy;
  status_history: StatusHistoryEntry[];
  created_at: string;
}

export interface Answer {
  question_id: string;
  answer_text?: string;
  answer_number?: number;
  answer_boolean?: boolean;
  selected_options?: string[];
  notes?: string;
}

export interface CreateFormSubmissionPayload {
  form_id: string;
  kitchen_id: string;
  time_id: string;
  answers: Answer[];
}

export interface UpdateAnswersPayload {
  answers: Answer[];
}

export interface TransitionPayload {
  status: FormSubmissionStatus;
  notes?: string;
}

export interface BranchApprovalPayload {
  branch_approval: BranchApprovalStatus;
  branch_approval_notes?: string;
}
