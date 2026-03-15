import { api } from '@/lib/api';
import type { Zone } from '../types';
import type { Pagination } from '@/types/types';

export interface ZoneFilters {
  search?: string;
  page?: number;
  per_page?: number;
  is_active?: number;
  location_id?: number | string;
}

export interface GetZonesResponse {
  data: Zone[];
  pagination: Pagination;
  message: string;
}

export interface GetZoneResponse {
  data: Zone;
  message: string;
  status: number;
}

export const ZoneAPI = {
  getZones: (filters: ZoneFilters = {}) =>
    api.get<GetZonesResponse>("/zones", { params: filters }),

  getZoneById: (id: number | string) =>
    api.get<GetZoneResponse>(`/zones/${id}/show`),

  toggleZoneState: (id: number | string) =>
    api.patch<Zone>(`/zones/${id}/toggle-active/`),

  createZone: (payload: any) =>
    api.post<Zone>("/zones/create", payload),

  updateZone: (id: number | string, payload: Partial<Zone>) =>
    api.post<Zone>(`/zones/${id}/update`, payload),

  deleteZone: (id: number | string) =>
    api.delete(`/zones/${id}/delete`)
};
