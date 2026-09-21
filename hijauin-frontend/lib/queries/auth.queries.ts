import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { useAuthStore, type RegisterData, type GoogleAuthData } from '../auth';
import type { User, BankSampahUnit } from '../types';

/**
 * Auth query hooks.
 */

// ── Queries ─────────────────────────────────────────────

/** Fetch current user — runs on mount in protected layouts. */
export function useMe() {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async (): Promise<User> => {
      const { data } = await api.get<{ data: User }>('/auth/me');
      return data.data;
    },
    enabled: !!token,
    staleTime: 10 * 60 * 1000, // 10 min — user data doesn't change often
  });
}

/** Fetch list of active bank sampah units for registration. */
export function useUnits() {
  return useQuery({
    queryKey: ['units'],
    queryFn: async (): Promise<BankSampahUnit[]> => {
      const { data } = await api.get<{ data: BankSampahUnit[] }>('/units');
      return data.data;
    },
    staleTime: 30 * 60 * 1000,
  });
}

// ── Mutations ───────────────────────────────────────────

export function useLogin() {
  const queryClient = useQueryClient();
  const { login } = useAuthStore.getState();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      await login(credentials.email, credentials.password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      await useAuthStore.getState().register(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

export function useGoogleAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GoogleAuthData) => {
      await useAuthStore.getState().googleAuth(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await useAuthStore.getState().logout();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      full_name?: string;
      phone?: string;
      alamat?: string;
      photo_url?: string | null;
    }) => {
      const { data } = await api.put<{ data: User }>('/nasabah/profil', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      useAuthStore.getState().refreshUser();
    },
  });
}
