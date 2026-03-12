import { api } from "../../../lib/api";
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  UsersResponse,
  UserResponse,
} from "../types";

/**
 * Fetch users list
 */
export const getUsers = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<UsersResponse> => {
  const queryParams = new URLSearchParams();

  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search) queryParams.append("search", search);

  const response = await api.get<UsersResponse | User[]>(
    `/users?${queryParams.toString()}`
  );

  // Normalize response (handles paginated + flat array)
  if (Array.isArray(response)) {
    return {
      data: response,
      pagination: {
        total: response.length,
        current_page: 1,
        total_pages: 1,
        per_page: response.length,
        count: response.length,
        has_more: false,
        next_page_url: null,
      },
    };
  }

  return response as UsersResponse;
};

/**
 * Fetch single user
 */
export const getUser = async (id: string | number): Promise<User> => {
  const response = await api.get<UserResponse | User>(`/users/${id}/show`);

  if ("data" in response && response.data) {
    return response.data as User;
  }

  return response as User;
};

/**
 * Create user
 */
export const createUser = async (
  payload: CreateUserPayload
): Promise<UserResponse> => {
  return api.post<UserResponse>("/users/create", payload);
};

/**
 * Update user
 */
export const updateUser = async ({
  id,
  payload,
}: {
  id: string | number;
  payload: UpdateUserPayload;
}): Promise<UserResponse> => {
  return api.post<UserResponse>(`/users/${id}/update`, payload);
};

/**
 * Toggle user active status
 */

export const toggleUserStatus = async (
  id: string | number
): Promise<UserResponse> => {
  return api.patch<UserResponse>(`/users/${id}/toggle-active`);
};

/**
 * Delete user
 */
export const deleteUser = async (id: string | number): Promise<void> => {
  await api.delete(`/users/${id}/delete`); // api.delete maps to api.del under the hood
};
