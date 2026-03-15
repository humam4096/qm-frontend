import { api } from '@/lib/api';
import type { Location } from '../types';
import type { Pagination } from '@/types/types';

export interface LocationFilters {
  search?: string;
  page?: number;
  per_page?: number;
  is_active?: number;
}

export interface GetLocationsResponse {
  data: Location[];
  pagination: Pagination;
  message: string;
}

export interface GetLocationResponse {
  data: Location;
  message: string;
  status: number;
}

export const LocationAPI = {
  getLocations: (filters: LocationFilters = {}) =>
    api.get<GetLocationsResponse>("/locations", { params: filters }),

  getLocationsList: () =>
    api.get<any>("/locations/list"),

  getLocationById: (id: number | string) =>
    api.get<GetLocationResponse>(`/locations/${id}/show`),

  toggleLocationState: (id: number | string) =>
    api.patch<Location>(`/locations/${id}/toggle-active/`),

  createLocation: (payload: any) =>
    api.post<Location>("/locations/create", payload),

  updateLocation: (id: number | string, payload: Partial<Location>) =>
    api.post<Location>(`/locations/${id}/update`, payload),

  deleteLocation: (id: number | string) =>
    api.delete(`/locations/${id}/delete`)
};
