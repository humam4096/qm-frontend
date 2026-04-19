export type UserRole =
  | 'system_manager'
  | 'quality_manager'
  | 'project_manager'
  | 'quality_supervisor'
  | 'quality_inspector'
  | 'catering_manager'
  // | "";

export interface Scope {
  id: number;
  name: string;
  type: string;
}

export interface CreatedBy {
  id: number;
  name: string;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  is_active: boolean;
  last_login_at: string | null;
  scope?: Scope | null;
  created_by?: CreatedBy | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserPayload {
  email: string;
  role: UserRole;
  name: string;
  phone: string;
  password?: string;
  password_confirmation?: string;
  zone_id?: number | null;
  branch_id?: number | null;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  is_active?: boolean;
}

export interface PaginationMeta {
  count: number;
  current_page: number;
  has_more: boolean;
  next_page_url: string | null;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface UsersResponse {
  data: User[];
  message?: string;
  pagination?: PaginationMeta;
  status?: number;
}

export interface UserResponse {
  data: User;
}

