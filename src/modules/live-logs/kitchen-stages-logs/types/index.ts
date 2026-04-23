// Kitchen Stage Progress types for live logs
export interface KitchenStageLog {
  id: string;
  kitchen_id: string;
  kitchen_name: string;
  stage_id: string;
  stage_name: string;
  progress: number;
  status: StageStatus;
  started_at: string;
  completed_at: string | null;
  updated_at: string;
  updated_by?: User;
  notes?: string;
}

export type StageStatus = 
  | "not_started"
  | "in_progress"
  | "completed"
  | "paused"
  | string;

export interface User {
  id: string;
  name: string;
  role: string;
}
