import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from './api';
import type { User, AuthResponse } from './types';

/**
 * Auth store — Zustand replaces React Context.
 *
 * Token persisted to localStorage via Zustand's persist middleware.
 * No Provider wrapper needed — just import useAuthStore() anywhere.
 */

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  googleAuth: (data: GoogleAuthData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export interface GoogleAuthData {
  email: string;
  full_name: string;
  photo_url?: string;
  unit_id?: number;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  unit_id: number;
  phone?: string;
  alamat?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data } = await api.post<{ data: AuthResponse }>('/auth/login', {
          email,
          password,
        });
        const { user, token } = data.data;

        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true });
      },

      register: async (registerData) => {
        const { data } = await api.post<{ data: AuthResponse }>('/auth/register', registerData);
        const { user, token } = data.data;

        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true });
      },

      googleAuth: async (payload) => {
        const { data } = await api.post<{ data: AuthResponse }>('/auth/google', payload);
        const { user, token } = data.data;

        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true });
        return data.data;
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          // Ignore logout errors — just clear local state
        }
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      refreshUser: async () => {
        const token = get().token;
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        try {
          const { data } = await api.get<{ data: User }>('/auth/me');
          set({ user: data.data, isAuthenticated: true, isLoading: false });
        } catch {
          localStorage.removeItem('auth_token');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'hijauin-auth',
      // Only persist token — user is refreshed from API on mount
      partialize: (state) => ({ token: state.token }),
    },
  ),
);

/**
 * Helper to get the user's primary role code.
 * Prioritizes administrative roles (platform_ops, admin_unit) if assigned.
 */
export function getUserRole(user: User | null): string | null {
  if (!user?.user_roles?.length) return null;
  const hasOps = user.user_roles.some((ur) => ur.role?.code === 'platform_ops');
  if (hasOps) return 'platform_ops';
  const hasAdmin = user.user_roles.some((ur) => ur.role?.code === 'admin_unit');
  if (hasAdmin) return 'admin_unit';
  return user.user_roles[0].role?.code ?? null;
}

/**
 * Check whether the user is an admin unit staff or platform ops superuser.
 */
export function isAdminOrOps(user: User | null): boolean {
  const role = getUserRole(user);
  return role === 'admin_unit' || role === 'platform_ops';
}

/**
 * Return default dashboard destination according to user role:
 * - Admin Unit / Platform Ops -> /admin/dashboard
 * - Nasabah / Default -> /dashboard
 */
export function getDefaultDashboard(user: User | null): string {
  return isAdminOrOps(user) ? '/admin/dashboard' : '/dashboard';
}

/**
 * Backward-compatible alias for useAuthStore.
 */
export const useAuth = useAuthStore;

