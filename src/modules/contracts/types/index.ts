export interface Contract {
  id: string;
  name: string;
  meal_type: "buffet" | "individual";
  total_meals: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  kitchen: Kitchen;
  contract_dates: ContractDate[];
}

export interface Kitchen {
  id: string;
  name: string;
}

export interface ContractDate {
  id: string;
  contract_id: string;
  service_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  meal_time_windows: MealTimeWindow[];
}

export interface MealTimeWindow {
  id: string;
  contract_date_id: string;
  start_time: string;
  end_time: string;
  label: string;
  created_at: string;
  updated_at: string;
  meals: Meal[];
}

export interface Meal {
  id: string;
  meal_time_window_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  ingredients: MealIngredient[];
  weight_specs: MealWeightSpec[];
}

export interface MealIngredient {
  id: string;
  meal_id: string;
  name: string;
  quantity_required: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MealWeightSpec {
  id: string;
  meal_id: string;
  title: string;
  value: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

// Create/Update payload types
export interface CreateContractPayload {
  kitchen_id: string;
  name: string;
  meal_type: "buffet" | "individual";
  total_meals: number;
  is_active: boolean;
  dates: CreateContractDatePayload[];
}

export interface CreateContractDatePayload {
  service_date: string;
  notes?: string;
  time_windows: CreateMealTimeWindowPayload[];
}

export interface CreateMealTimeWindowPayload {
  start_time: string;
  end_time: string;
  label: string;
  meals: CreateMealPayload[];
}

export interface CreateMealPayload {
  name: string;
  description?: string;
  ingredients: CreateMealIngredientPayload[];
  weight_specs: CreateMealWeightSpecPayload[];
}

export interface CreateMealIngredientPayload {
  name: string;
  quantity_required: string;
  notes?: string;
}

export interface CreateMealWeightSpecPayload {
  title: string;
  value: number;
  unit: string;
}

export interface UpdateContractPayload {
  name?: string;
  meal_type?: "buffet" | "individual";
  total_meals?: number;
  kitchen_id?: string;
}

export interface UpdateContractDatePayload {
  service_date?: string;
  notes?: string;
}

export interface UpdateMealTimeWindowPayload {
  start_time?: string;
  end_time?: string;
  label?: string;
}

export interface UpdateMealPayload {
  name?: string;
  description?: string;
}

export interface UpdateMealIngredientPayload {
  name?: string;
  quantity_required?: string;
  notes?: string;
}

export interface UpdateMealWeightSpecPayload {
  title?: string;
  value?: number;
  unit?: string;
}