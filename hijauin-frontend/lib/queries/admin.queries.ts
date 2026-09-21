import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import type {
  NasabahProfile,
  KategoriSampah,
  Hadiah,
  SetorSampah,
  RekapResponse,
  PaginationMeta,
} from '../types';
import type { CreateNasabahInput, KategoriInput, HadiahInput } from '../schemas/admin.schema';
import type { VerifySetoranInput } from '../schemas/setoran.schema';

/**
 * Admin query hooks — all data is scoped to the admin's unit
 * via ResolveUnitScope middleware on the backend.
 */

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface AdminQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  [key: string]: unknown;
}

function normalizeParams(arg1?: number | AdminQueryParams, arg2?: number): AdminQueryParams {
  if (typeof arg1 === 'object' && arg1 !== null) {
    return { page: 1, pageSize: 15, ...arg1 };
  }
  return {
    page: typeof arg1 === 'number' ? arg1 : 1,
    pageSize: typeof arg2 === 'number' ? arg2 : 15,
  };
}

// ── Nasabah ─────────────────────────────────────────────

export interface NasabahQueryParams extends AdminQueryParams {
  balanceFilter?: string;
}

export function useAdminNasabahs(arg1?: number | NasabahQueryParams, arg2?: number) {
  const p = normalizeParams(arg1, arg2) as NasabahQueryParams;
  return useQuery({
    queryKey: ['admin', 'nasabahs', p],
    queryFn: async (): Promise<PaginatedResponse<NasabahProfile>> => {
      const { data } = await api.get<PaginatedResponse<NasabahProfile>>('/admin/nasabahs', {
        params: {
          page: p.page,
          pageSize: p.pageSize,
          search: p.search || undefined,
          sort_by: p.sortBy || undefined,
          sort_dir: p.sortDir || undefined,
          balance_filter: p.balanceFilter || undefined,
        },
      });
      return data;
    },
  });
}

export function useCreateNasabah() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateNasabahInput) => {
      const { data } = await api.post('/admin/nasabahs', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'nasabahs'] }),
  });
}

export function useDeleteNasabah() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/nasabahs/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'nasabahs'] }),
  });
}

// ── Kategori Sampah ─────────────────────────────────────

export interface KategoriQueryParams extends AdminQueryParams {
  jenis?: string;
}

export function useAdminKategoris(arg1?: number | KategoriQueryParams, arg2?: number) {
  const p = normalizeParams(arg1, arg2) as KategoriQueryParams;
  return useQuery({
    queryKey: ['admin', 'kategoris', p],
    queryFn: async (): Promise<PaginatedResponse<KategoriSampah>> => {
      const { data } = await api.get<PaginatedResponse<KategoriSampah>>('/admin/kategoris', {
        params: {
          page: p.page,
          pageSize: p.pageSize,
          search: p.search || undefined,
          jenis: p.jenis || undefined,
          sort_by: p.sortBy || undefined,
          sort_dir: p.sortDir || undefined,
        },
      });
      return data;
    },
  });
}

export function useCreateKategori() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: KategoriInput) => {
      const { data } = await api.post('/admin/kategoris', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'kategoris'] }),
  });
}

export function useDeleteKategori() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/kategoris/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'kategoris'] }),
  });
}

// ── Hadiah ──────────────────────────────────────────────

export interface HadiahQueryParams extends AdminQueryParams {
  stockStatus?: string;
}

export function useAdminHadiahs(arg1?: number | HadiahQueryParams, arg2?: number) {
  const p = normalizeParams(arg1, arg2) as HadiahQueryParams;
  return useQuery({
    queryKey: ['admin', 'hadiahs', p],
    queryFn: async (): Promise<PaginatedResponse<Hadiah>> => {
      const { data } = await api.get<PaginatedResponse<Hadiah>>('/admin/hadiahs', {
        params: {
          page: p.page,
          pageSize: p.pageSize,
          search: p.search || undefined,
          stock_status: p.stockStatus || undefined,
          sort_by: p.sortBy || undefined,
          sort_dir: p.sortDir || undefined,
        },
      });
      return data;
    },
  });
}

export function useCreateHadiah() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: HadiahInput) => {
      const { data } = await api.post('/admin/hadiahs', input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'hadiahs'] }),
  });
}

export function useDeleteHadiah() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/hadiahs/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'hadiahs'] }),
  });
}

// ── Setoran Verification ────────────────────────────────

export interface SetoranQueryParams extends AdminQueryParams {
  status?: string;
}

export function useAdminSetorans(arg1?: number | SetoranQueryParams, arg2?: number) {
  const p = normalizeParams(arg1, arg2) as SetoranQueryParams;
  return useQuery({
    queryKey: ['admin', 'setorans', p],
    queryFn: async (): Promise<PaginatedResponse<SetorSampah>> => {
      const { data } = await api.get<PaginatedResponse<SetorSampah>>('/admin/setorans', {
        params: {
          page: p.page,
          pageSize: p.pageSize,
          search: p.search || undefined,
          status: p.status || undefined,
          sort_by: p.sortBy || undefined,
          sort_dir: p.sortDir || undefined,
        },
      });
      return data;
    },
  });
}

export function useAdminSetoran(id: number) {
  return useQuery({
    queryKey: ['admin', 'setorans', id],
    queryFn: async (): Promise<SetorSampah> => {
      const { data } = await api.get<{ data: SetorSampah }>(`/admin/setorans/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useVerifySetoran() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: number; input: VerifySetoranInput }) => {
      const { data } = await api.post(`/admin/setorans/${id}/verify`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'setorans'] });
    },
  });
}

// ── Rekap ───────────────────────────────────────────────

export function useRekap(month?: number, year?: number, unitId?: number, allUnits?: boolean) {
  return useQuery({
    queryKey: ['admin', 'rekap', { month, year, unitId, allUnits }],
    queryFn: async (): Promise<RekapResponse> => {
      const { data } = await api.get<{ data: RekapResponse }>('/admin/rekap', {
        params: {
          month,
          year,
          unit_id: unitId,
          all_units: allUnits ? 1 : undefined,
        },
      });
      return data.data;
    },
  });
}

