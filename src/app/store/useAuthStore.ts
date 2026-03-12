import { create } from 'zustand';
import { api } from '../../lib/api';
import { authService, type UserProfile } from '../../services/auth.service';

export type UserRole =
  | 'system_manager'
  | 'catering_manager'
  | 'project_manager'
  | 'quality_manager'
  | 'quality_supervisor'
  | 'quality_inspector';

// Keep the internal UI representation mapped from the Profile
export type User = UserProfile;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,  // isAuthenticated: Tracks whether the user is currently logged in with a valid session. (
  isLoading: false, // isLoading: Tracks whether the app is currently trying to log in or fetch user data.
  isInitialized: false, // isInitialized: Tracks whether the app has finished checking the user's logged-in status.
  error: null,

  initialize: async () => {
    const token = api.getToken();

    if (!token) {
      set({ isInitialized: true, isAuthenticated: false, user: null });
      return;
    }

    try {
      // Validate token by hitting the profile endpoint
      const profile = await authService.getProfile();
      set({
        user: profile as User,
        isAuthenticated: true,
      });
    } catch {
      // Token expired or invalid
      api.removeToken();
      set({
        user: null,
        isAuthenticated: false,
        error: 'Session expired. Please log in again.'
      });
    } finally {
      set({ isInitialized: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.login(email, password);

      const profile = await authService.getProfile();
      set({
        user: profile as User,
        isAuthenticated: true,
        isLoading: false,
      });

    } catch (error: unknown) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed. Please check your credentials.'
      });

      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      if (api.getToken()) {
        await authService.logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Unconditionally wipe state
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      window.location.href = '/login';
    }
  },
}));
