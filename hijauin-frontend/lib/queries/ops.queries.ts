import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import type { User, BankSampahUnit, Role, PaginationMeta } from '../types';

export interface OpsDashboardData {
  total_units: number;
  total_nasabahs: number;
  total_users: number;
  total_setorans: number;
  pending_setorans: number;
  total_kg: number;
  total_poin: number;
  units: (BankSampahUnit & { nasabah_profiles_count?: number })[];
}

export interface OpsUserPayload {
  full_name: string;
  email: string;
  password?: string;
  phone?: string;
  role_code: string;
  unit_id?: number | null;
}

export interface OpsUnitPayload {
  nama: string;
  alamat?: string;
  telepon?: string;
  deskripsi?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Platform Ops query hooks.
 */

export function useOpsDashboard() {
  return useQuery({
    queryKey: ['ops', 'dashboard'],
    queryFn: async (): Promise<OpsDashboardData> => {
      const { data } = await api.get<{ data: OpsDashboardData }>('/ops/dashboard');
      return data.data;
    },
  });
}

export interface OpsUserQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  unitId?: number | '';
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export function useOpsUsers(
  arg1?: number | OpsUserQueryParams,
  pageSize = 15,
  search = '',
  role = ''
) {
  let p: OpsUserQueryParams;
  if (typeof arg1 === 'object' && arg1 !== null) {
    p = { page: 1, pageSize: 15, ...arg1 };
  } else {
    p = {
      page: typeof arg1 === 'number' ? arg1 : 1,
      pageSize,
      search,
      role,
    };
  }

  return useQuery({
    queryKey: ['ops', 'users', p],
    queryFn: async (): Promise<PaginatedResponse<User>> => {
      const { data } = await api.get<PaginatedResponse<User>>('/ops/users', {
        params: {
          page: p.page,
          pageSize: p.pageSize,
          search: p.search || undefined,
          role: p.role || undefined,
          unit_id: p.unitId || undefined,
          sort_by: p.sortBy || undefined,
          sort_dir: p.sortDir || undefined,
        },
      });
      return data;
    },
  });
}

export function useCreateOpsUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: OpsUserPayload) => {
      const { data } = await api.post('/ops/users', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ops', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['ops', 'dashboard'] });
    },
  });
}

export function useUpdateOpsUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<OpsUserPayload> }) => {
      const { data } = await api.put(`/ops/users/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ops', 'users'] });
    },
  });
}

export function useDeleteOpsUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/ops/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ops', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['ops', 'dashboard'] });
    },
  });
}

export function useOpsRoles() {
  return useQuery({
    queryKey: ['ops', 'roles'],
    queryFn: async (): Promise<(Role & { permissions?: import('../types').Permission[]; user_roles_count?: number })[]> => {
      const { data } = await api.get<{ data: (Role & { permissions?: import('../types').Permission[]; user_roles_count?: number })[] }>('/ops/roles');
      return data.data;
    },
  });
}

export function useOpsUnits(enabled = true) {
  return useQuery({
    queryKey: ['ops', 'units'],
    queryFn: async (): Promise<(BankSampahUnit & { nasabah_profiles_count?: number; kategoris_count?: number })[]> => {
      const { data } = await api.get<{ data: (BankSampahUnit & { nasabah_profiles_count?: number; kategoris_count?: number })[] }>('/ops/units');
      return data.data;
    },
    enabled,
  });
}

export interface OpsUnitQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export function useOpsUnitsPaginated(params: OpsUnitQueryParams = { page: 1, pageSize: 12 }) {
  return useQuery({
    queryKey: ['ops', 'units', 'paginated', params],
    queryFn: async (): Promise<PaginatedResponse<BankSampahUnit & { nasabah_profiles_count?: number; kategoris_count?: number }>> => {
      const { data } = await api.get<PaginatedResponse<BankSampahUnit & { nasabah_profiles_count?: number; kategoris_count?: number }>>('/ops/units', {
        params: {
          paginate: 1,
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 12,
          search: params.search || undefined,
          sort_by: params.sortBy || undefined,
          sort_dir: params.sortDir || undefined,
        },
      });
      return data;
    },
  });
}

export function useCreateOpsUnit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: OpsUnitPayload) => {
      const { data } = await api.post('/ops/units', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ops', 'units'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['ops', 'dashboard'] });
    },
  });
}
