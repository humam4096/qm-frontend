import type { Form } from "@/modules/forms/types";


export interface RootResponse {
  data: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  label: string;
  start_time: string;
  end_time: string;
  contract_date: ContractDate;
  submissions_count: number;
  kitchen: Kitchen;
  zone: Zone;
  can_change_status: boolean;
  approved_by_branch: boolean;
  submissions: Submission[];
}

export interface ContractDate {
  id: string;
  service_date: string;
  notes: string;
}

export interface Submission {
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
  status_history: StatusHistory[];
  created_at: string;
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

interface Zone {
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
}

export interface HistoryUser {
  uuid: string;
  name: string;
  role: string;
}

export interface InspectionStage {
  id: string;
  name: string;
}

export interface CreatedBy {
  id: string;
  name: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  sequence_order: number;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  notes: string;
  question_type: QuestionType;
  weight: number;
  is_required: boolean;
  sequence_order: number;
  options: Option[];
  score_earned: number;
  answer_notes: string | null;
  answer_text: string | null;
  answer_number: number | null;
  answer_boolean: boolean | null;
}

export type QuestionType =
  | "single_select"
  | "multi_select"
  | "text"
  | "number"
  | "boolean"
  | string;

export interface Option {
  id: string;
  option: string;
  weight: number;
  is_selected: boolean;
}

export interface AdminApprovalPayload {
  notes?: string;
}
export interface BranchApprovalPayload {
  status: ApprovalStatus;
  notes?: string;
}
