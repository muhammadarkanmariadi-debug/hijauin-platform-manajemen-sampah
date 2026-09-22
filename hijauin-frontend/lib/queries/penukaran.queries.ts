import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import type { PenukaranPoin, PaginationMeta } from '../types';
import type { CreatePenukaranInput } from '../schemas/penukaran.schema';

/**
 * Penukaran (point redemption) query hooks.
 */

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ── Queries ─────────────────────────────────────────────

export interface NasabahPenukaranQueryParams {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

/** List nasabah's redemptions (paginated with status filter, search, and sort). */
export function usePenukarans(arg1?: number | NasabahPenukaranQueryParams, arg2?: number) {
  let p: NasabahPenukaranQueryParams;
  if (typeof arg1 === 'object' && arg1 !== null) {
    p = { page: 1, pageSize: 15, ...arg1 };
  } else {
    p = {
      page: typeof arg1 === 'number' ? arg1 : 1,
      pageSize: typeof arg2 === 'number' ? arg2 : 15,
    };
  }

  return useQuery({
    queryKey: ['penukarans', p],
    queryFn: async (): Promise<PaginatedResponse<PenukaranPoin>> => {
      const { data } = await api.get<PaginatedResponse<PenukaranPoin>>('/nasabah/penukarans', {
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

/** List available rewards for nasabah's unit. */
export function useHadiahs() {
  return useQuery({
    queryKey: ['hadiahs'],
    queryFn: async (): Promise<import('../types').Hadiah[]> => {
      const res = await api.get('/nasabah/hadiahs');
      const payload = res.data;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      return [];
    },
  });
}

// ── Mutations ───────────────────────────────────────────

/**
 * Redeem points — generates an Idempotency-Key automatically (TRD §3).
 */
export function useCreatePenukaran() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePenukaranInput): Promise<PenukaranPoin> => {
      const idempotencyKey = crypto.randomUUID();
      const { data } = await api.post<{ data: PenukaranPoin }>('/nasabah/penukarans', input, {
        headers: { 'Idempotency-Key': idempotencyKey },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penukarans'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }); // Balance changed
    },
  });
}
