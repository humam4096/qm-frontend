import type { StatusHistoryEntry } from "@/modules/form-submissions/types";

// Submission types for live logs
export interface SubmissionLog {
  id: string;
  form_type: string;
  status: SubmissionStatus;
  branch_approval: ApprovalStatus;
  branch_approval_notes: string | null;
  inspection_date: string;
  score: number;
  time: SimpleTimeRef;
  form: Form;
  kitchen: Kitchen;
  submitted_by: User;
  status_history: StatusHistoryEntry[];
  // status_history: StatusHistory[];
  created_at: string;
  updated_at?: string;
}

export type SubmissionStatus =
  | "under_supervisor_review"
  | "under_quality_manager_review"
  | "approved_by_quality_manager"
  | string;

export type ApprovalStatus = "pending" | "accepted" | "rejected" | string;

export interface SimpleTimeRef {
  id: string;
  label: string;
  service_date: string;
}

interface Kitchen {
  id: string;
  name: string;
}

interface Form {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface StatusHistory {
  old_status: string | null;
  new_status: string;
  notes: string | null;
  changed_by: HistoryUser;
  changed_at: string;
  // [key: string]: any;
}


export interface HistoryUser {
  uuid: string;
  name: string;
  role: string;
}


export interface SubmissionLogFilters {
  search?: string;
  page?: number;
  per_page?: number;
  status?: string;
  priority?: string;
}
