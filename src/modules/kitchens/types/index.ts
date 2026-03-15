export interface Kitchen {
  id: number;
  branch_id: number;
  zone_id: number;
  name: string;
  owner_name: string;
  responsible_phone: string;
  contact_email: string;
  license_number: string;
  hajj_makkah_capacity: number;
  hajj_mashaer_capacity: number;
  area_sqm: number;
  dry_storage_volume: number;
  cold_storage_volume: number;
  frozen_storage_volume: number;
  cooking_platforms_count: number;
  food_transport_cabinets_count: number;
  vehicles_count: number;
  map_lat: number | null;
  map_lng: number | null;
  is_hajj: boolean;
  is_active: boolean;
  logo: string | null;
  created_at: string;
  "branch.name"?: string;
  "zone.name"?: string;
  branch?: {
    id: number;
    name: string;
  };
  zone?: {
    id: number;
    name: string;
  };
}
