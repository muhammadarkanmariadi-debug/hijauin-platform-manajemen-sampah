import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import type { SetorSampah, PaginationMeta } from '../types';
import type { CreateSetoranInput } from '../schemas/setoran.schema';

/**
 * Setoran (waste submission) query hooks.
 */

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ── Queries ─────────────────────────────────────────────

export interface NasabahSetoranQueryParams {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

/** List nasabah's submissions (paginated with status filter, search, and sort). */
export function useSetorans(arg1?: number | NasabahSetoranQueryParams, arg2?: number) {
  let p: NasabahSetoranQueryParams;
  if (typeof arg1 === 'object' && arg1 !== null) {
    p = { page: 1, pageSize: 15, ...arg1 };
  } else {
    p = {
      page: typeof arg1 === 'number' ? arg1 : 1,
      pageSize: typeof arg2 === 'number' ? arg2 : 15,
    };
  }

  return useQuery({
    queryKey: ['setorans', p],
    queryFn: async (): Promise<PaginatedResponse<SetorSampah>> => {
      const { data } = await api.get<PaginatedResponse<SetorSampah>>('/nasabah/setorans', {
        params: {
          page: p.page,
          pageSize: p.pageSize,
          status: p.status || undefined,
          search: p.search || undefined,
          sort_by: p.sortBy || undefined,
          sort_dir: p.sortDir || undefined,
        },
      });
      return data;
    },
  });
}

/** Get a single submission. */
export function useSetoran(id: number) {
  return useQuery({
    queryKey: ['setorans', id],
    queryFn: async (): Promise<SetorSampah> => {
      const { data } = await api.get<{ data: SetorSampah }>(`/nasabah/setorans/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

/** List active waste categories for nasabah's unit. */
export function useKategoris() {
  return useQuery({
    queryKey: ['kategoris'],
    queryFn: async (): Promise<import('../types').KategoriSampah[]> => {
      const res = await api.get('/nasabah/kategoris');
      const payload = res.data;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      return [];
    },
  });
}

// ── Mutations ───────────────────────────────────────────

/** Create a new waste submission. */
export function useCreateSetoran() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSetoranInput): Promise<SetorSampah> => {
      const { data } = await api.post<{ data: SetorSampah }>('/nasabah/setorans', input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setorans'] });
    },
  });
}
