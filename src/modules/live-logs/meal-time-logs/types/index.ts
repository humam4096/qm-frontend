// Meal Time Window Tracker types for live logs
export type MealTimeLog = TimeSlot;

export type TimeSlot = {
  id: string;
  label: string;
  date: string;        // "2026-04-24"
  start_time: string;  // "19:53"
  end_time: string;    // "20:53"
  contract_date: ContractDate;
  kitchen: Kitchen;
  stages: Stage[];
};

export type ContractDate = {
  id: string;
  notes: string;
  service_date: string; // ISO date
};

export type Kitchen = {
  id: string;
  name: string;
};

export type Stage = {
  id: string;
  name: string;
  sequence_order: number;
  submitted: boolean;
};
