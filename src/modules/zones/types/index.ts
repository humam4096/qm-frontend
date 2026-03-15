export interface Zone {
  id: number;
  location_id: number;
  code: string;
  name: string;
  map_lat: number | null;
  map_lng: number | null;
  is_active: boolean;
  created_at: string;
  location?: {
    id: number;
    name: string;
  };
}
