/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../lib/api';
import type { User, UserRole } from '@/modules/users/types';

// Note: The UserRole type represents our frontend roles.
// Once logged in, the `/auth/my-profile` endpoint should return the user with their role.
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  [key: string]: unknown; // Generic field mapping
}

export interface LoginResponse {
  token: string;
}


export const authService = {

  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {

      const response = await api.post<any>('/auth/login', {
        email,
        password,
      });

      // The API wraps the token inside a `data` object: { status: 200, data: { token: "..." } }
      const token = response?.data?.token || response?.token;

      if (token) {
        api.setToken(token);
      }

      return { token };

    } catch (error: any) {
      // Re-throw the error as a standard Error object
      const errorMessage = error.data?.message || error.data?.error || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  },


  async getProfile(): Promise<User> {
    const response = await api.get<any>('/auth/my-profile');
    const profile = response?.data || response;
    return profile as User;
  },


  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      // Ensure the token is always wiped locally, even if the backend call fails.
      api.removeToken();
    }
  },
};
