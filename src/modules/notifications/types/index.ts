export interface Notification {
  id: number;
  title: string;
  message: string;
  type?: string;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
  url: string;
}

export interface NotificationFilters {
  filter?: "read" | "unread" | "all";
  page?: number;
  limit?: number;
}

export type FilterType = 'all' | 'unread' | 'read';
