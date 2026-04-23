import type { Form } from "@/modules/forms/types";
import type { UserRole } from "@/modules/users/types";

export type FormSubmissionStatus =
  | "under_supervisor_review"
  | "under_manager_review"
  | "under_quality_manager_review"
  | "approved"
  | "rejected";

export type BranchApprovalStatus = "pending" | "accepted" | "rejected";

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
  time_id?: string | null; // Optional for project_manager
  answers: Answer[];
}

export interface UpdateAnswersPayload {
  answers: Answer[];
}

export interface TransitionPayload {
  notes?: string;
}

export interface BranchApprovalPayload {
  branch_approval: BranchApprovalStatus;
  branch_approval_notes?: string;
}

export interface FormSubmissionResponse {

  id: string;
  form_type: string;
  inspection_date: string;
  time: Time | null;
  score: number;
  status: string;

  branch_approval: string
  branch_approval_notes: string
  created_at: string;
  
  kitchen: {
    id: string;
    name: string;
  };

  submitted_by: {
    id: string;
    name: string;
    role: string;
  };

  status_history: {
    status: string;
    changed_at: string;
    notes?: string;
    changed_by: {
      id: string;
      name: string;
      role?: string;
    };
  }[];

  form: {
      id: string;
      name: string;
      description: string | null;
      form_type: string;
      is_active: boolean;
      created_at: string;
      time: string;

      questions_count: number;
      sections_count: number;

      inspection_stage: any | null;
      user_role: string;

      created_by: {
        id: string;
        name: string;
      };

      sections: {
        id: string;
        title: string;
        description: string | null;
        sequence_order: number;

        questions: {
          id: string;
          question: string;
          question_type: 'text' | 'boolean' | 'single_select' | 'multi_select' | 'number';

          is_required: boolean;
          notes: string | null;

          sequence_order: number;
          weight: number;
          score_earned: number;

          options: any[];

          // Answers (flexible based on type)
          answer_text: string | null;
          answer_number: number | null;
          answer_boolean: boolean | null;
          answer_notes: string | null;
        }[];
      }[];
  };
}