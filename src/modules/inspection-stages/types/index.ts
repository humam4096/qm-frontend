export interface InspectionStageTiming {
  allowed_early_minutes: number;
  allowed_delay_minutes: number;
  requires_notification: boolean;
}

export interface InspectionStage {
  timing: InspectionStageTiming;
  id: number | string;
  name: string;
  description: string;
  sequence_order: number;
  is_active: boolean;
  is_for_hajj: boolean;
}

export interface InspectionStageForm {
  name: string;
  description: string;
  sequence_order: number;

  allowed_early_minutes: number;
  allowed_delay_minutes: number;
  requires_notification: boolean;

  is_active: boolean;
  is_for_hajj: boolean;
}