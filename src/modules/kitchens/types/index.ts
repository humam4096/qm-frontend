
interface Location {
  id: string;
  name: string;
}

interface ReadinessAssessment {
  id: string;
  score: string;
  inspection_date: string;
}

interface Zone {
  id: string;
  code: string;
  name: string;
  location: Location;
}

interface Company {
  id: string;
  name: string;
}

interface Branch {
  id: string;
  name: string;
  company: Company;
}

interface Capacity {
  hajj_makkah: number;
  hajj_mashaer: number;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface Operations {
  cooking_platforms: number;
  food_transport_cabinets: number;
  vehicles: number;
}

interface Storage {
  area_sqm: number;
  cold: number;
  dry: number;
  frozen: number;
}

export interface Kitchen {
  id: string;
  name: string;
  license_number: string;
  owner_name: string;
  responsible_phone: string;
  center_name: string;
  center_number: string;
  contact_email: string;
  logo_url: string | null;
  is_active: boolean;
  is_hajj: boolean;
  created_at: string; // ISO 8601
  branch: Branch;
  readiness_assessment?: ReadinessAssessment;
  zone: Zone;
  capacity: Capacity;
  coordinates: Coordinates;
  operations: Operations;
  storage: Storage;
}

export type KitchenTimeWindow = {
  id: string;
  notes: string;
  service_date: string; // or Date if already parsed
  time_windows: {id: string; label: string}[];
};