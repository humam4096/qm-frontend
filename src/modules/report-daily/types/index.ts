import type { Submission } from "@/modules/reports-time-window/types";

export interface DailySlot {
  id: string;
  contract: Contract;
  is_report_visible: boolean;
  meal_time_windows: MealTimeWindow[];
  notes: string;
  service_date: string;
}

export interface Contract {
  id: string;
  name: string;
  meal_type: string;
  kitchen: Kitchen;
  zone: Zone;
}

export interface Kitchen {
  id: string;
  name: string;
}

export interface Zone {
  id: string;
  name: string;
}

export interface MealTimeWindow {
  id: string;
  label: string;
  start_time: string;
  end_time: string;
  service_date: string;
  notes: string;

  contract_date: {
    id: string;
    service_date: string;
    notes: string;
  };

  submissions: Submission[];
}