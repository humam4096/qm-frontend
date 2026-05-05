export interface DashboardData {
  kitchens_count: number;
  active_kitchens_count: number;
  branches_count: number;
  zones_count: number;
  project_managers_count: number;
  quality_supervisors_count: number;
  quality_inspectors_count: number;
  quality_managers_count: number;
  total_reports: number;
  branch_accepted_reports: number;
  pending_supervisor: number;
  pending_quality_manager: number;
  branch_rejected_reports: number;
  inactive_zones_count: number;
  inactive_kitchens_count: number;
  total_complaints: number;
  high_priority_complaints: number;
  medium_priority_complaints: number;
  low_priority_complaints: number;
  unresolved_complaints: number;
  resolved_complaints: number;
  submitted_reports: number;
  approved_by_quality_manager_reports: number;
  approved_by_system_manager_reports: number;
  branch_pending_reports: number;
}

