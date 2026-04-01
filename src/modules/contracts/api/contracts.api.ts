import { api } from '@/lib/api';
import type { Pagination } from '@/types/types';
import type {
  Contract,
  ContractDate,
  MealTimeWindow,
  Meal,
  MealIngredient,
  MealWeightSpec,
  CreateContractPayload,
  UpdateContractPayload,
  UpdateContractDatePayload,
  UpdateMealTimeWindowPayload,
  UpdateMealPayload,
  UpdateMealIngredientPayload,
  UpdateMealWeightSpecPayload
} from '../types';


export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface ContractFilters {
  search?: string;
  page?: number;
  per_page?: number;
  kitchen_id?: string;
  is_active?: number;
  meal_type?: 'buffet' | 'individual';
}

export interface GetContractsResponse {
  data: Contract[];
  pagination: Pagination;
  message: string;
  status: number;
}

// Filters & Response
export interface ContractFilters {
  search?: string;
  page?: number;
  per_page?: number;
  kitchen_id?: string;
  is_active?: number;
  meal_type?: 'buffet' | 'individual';
}

export interface GetContractsResponse {
  data: Contract[];
  pagination: Pagination;
  message: string;
  status: number;
}


export const ContractAPI = {

  // Contracts
  getContracts: (filters: ContractFilters = {}) =>
    api.get<GetContractsResponse>('/contracts', { params: filters }),

  getContractById: (id: string) =>
    id ? api.get<ApiResponse<Contract>>(`/contracts/${id}/show`) : Promise.resolve(null),

  createContract: (payload: CreateContractPayload) =>
    api.post<Contract>('/contracts/create', payload),

  updateContract: (id: string, payload: UpdateContractPayload) =>
    api.post<Contract>(`/contracts/${id}/update`, payload),

  toggleContractStatus: (id: string) =>
    id ? api.patch<Contract>(`/contracts/${id}/toggle-active`) : Promise.resolve(null),

  deleteContract: (id: string) =>
    api.delete(`/contracts/${id}/delete`),


  // Contract Dates
  getContractDates: (contractId: string) =>
    contractId
      ? api.get<ApiResponse<ContractDate[]>>(`/contract-dates/${contractId}`)
      : Promise.resolve({ data: [] }),

  getContractDateById: (id: string) =>
    id ? api.get<ContractDate>(`/contract-dates/${id}/show`) : Promise.resolve(null),

  createContractDate: (payload: {
    contract_id: string;
    service_date: string;
    notes?: string;
  }) =>
    api.post<ContractDate>('/contract-dates/create', payload),

  updateContractDate: (id: string, payload: UpdateContractDatePayload) =>
    api.post<ContractDate>(`/contract-dates/${id}/update`, payload),

  deleteContractDate: (id: string) =>
    api.delete(`/contract-dates/${id}/delete`),

  // Meal Time Windows
  getMealTimeWindows: (contractDateId: string) =>
    contractDateId
      ? api.get<ApiResponse<MealTimeWindow[]>>(`/meal-time-windows/${contractDateId}`)
      : Promise.resolve({ data: [] }),

  getMealTimeWindowById: (id: string) =>
    id ? api.get<MealTimeWindow>(`/meal-time-windows/${id}/show`) : Promise.resolve(null),

  createMealTimeWindow: (payload: {
    contract_date_id: string;
    start_time: string;
    end_time: string;
    label: string;
  }) =>
    api.post<MealTimeWindow>('/meal-time-windows/create', payload),

  updateMealTimeWindow: (id: string, payload: UpdateMealTimeWindowPayload) =>
    api.post<MealTimeWindow>(`/meal-time-windows/${id}/update`, payload),

  deleteMealTimeWindow: (id: string) =>
    api.delete(`/meal-time-windows/${id}/delete`),

  // Meals
  getMeals: (mealTimeWindowId: string) =>
    mealTimeWindowId
      ? api.get<ApiResponse<Meal[]>>(`/meals/${mealTimeWindowId}`)
      : Promise.resolve({ data: [] }),

  getMealById: (id: string) =>
    id ? api.get<Meal>(`/meals/${id}/show`) : Promise.resolve(null),

  createMeal: (payload: {
    meal_time_window_id: string;
    name: string;
    description?: string;
  }) =>
    api.post<Meal>('/meals/create', payload),

  updateMeal: (id: string, payload: UpdateMealPayload) =>
    api.post<Meal>(`/meals/${id}/update`, payload),

  deleteMeal: (id: string) =>
    api.delete(`/meals/${id}/delete`),

  // --------------------
  // Ingredients
  // --------------------
  getMealIngredients: (mealId: string) =>
    mealId
      ? api.get<ApiResponse<MealIngredient[]>>(`/meal-ingredients/${mealId}`)
      : Promise.resolve({ data: [] }),

  getMealIngredientById: (id: string) =>
    id ? api.get<MealIngredient>(`/meal-ingredients/${id}/show`) : Promise.resolve(null),

  createMealIngredient: (payload: {
    meal_id: string;
    name: string;
    quantity_required: string;
    notes?: string;
  }) =>
    api.post<MealIngredient>('/meal-ingredients/create', payload),

  updateMealIngredient: (id: string, payload: UpdateMealIngredientPayload) =>
    api.post<MealIngredient>(`/meal-ingredients/${id}/update`, payload),

  deleteMealIngredient: (id: string) =>
    api.delete(`/meal-ingredients/${id}/delete`),

  // --------------------
  // Weight Specs
  // --------------------
  getMealWeightSpecs: (mealId: string) =>
    mealId
      ? api.get<ApiResponse<MealWeightSpec[]>>(`/meal-weight-specs/${mealId}`)
      : Promise.resolve({ data: [] }),

  getMealWeightSpecById: (id: string) =>
    id ? api.get<MealWeightSpec>(`/meal-weight-specs/${id}/show`) : Promise.resolve(null),

  createMealWeightSpec: (payload: {
    meal_id: string;
    title: string;
    value: number;
    unit: string;
  }) =>
    api.post<MealWeightSpec>('/meal-weight-specs/create', payload),

  updateMealWeightSpec: (id: string, payload: UpdateMealWeightSpecPayload) =>
    api.post<MealWeightSpec>(`/meal-weight-specs/${id}/update`, payload),

  deleteMealWeightSpec: (id: string) =>
    api.delete(`/meal-weight-specs/${id}/delete`),
};

