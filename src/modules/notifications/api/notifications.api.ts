import { api } from '@/lib/api';
import type { Notification, NotificationFilters } from '../types';
import type { ApiResponse, Pagination } from '@/types/types';

export interface GetNotificationsResponse {
  data: Notification[];
  pagination: Pagination;
  message: string;
}

interface GetNotificationsCountResponse {
  unread_count: number;
}

export interface GetNotificationResponse {
  data: Notification;
  message: string;
  status: number;
}

export interface NotificationActionResponse {
  message: string;
  status: number;
}

export const NotificationAPI = {
  getNotifications: (filters: NotificationFilters = {}) =>
    api.get<GetNotificationsResponse>("/notifications", { params: filters }),

  getNotificationsCount: () =>
    api.get<ApiResponse<GetNotificationsCountResponse>>("/notifications/unread-count"),

  markAllAsRead: () =>
    api.patch<NotificationActionResponse>("/notifications/mark-all-read"),

  deleteAll: () =>
    api.delete<NotificationActionResponse>("/notifications/delete-all"),

  markAsRead: (id: number | string) =>
    api.patch<NotificationActionResponse>(`/notifications/${id}/read`),
};
