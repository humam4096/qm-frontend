// types/api.ts
export interface Pagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  pagination?: Pagination;
  status: number;
}
