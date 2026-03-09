import { create } from 'zustand';

export type UserRole =
  | 'SystemManager'
  | 'CateringManager'
  | 'ProjectManager'
  | 'QualityManager'
  | 'QualitySupervisor'
  | 'QualityInspector';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, // Start with null. Change this to a mock user to test authenticated states.
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
