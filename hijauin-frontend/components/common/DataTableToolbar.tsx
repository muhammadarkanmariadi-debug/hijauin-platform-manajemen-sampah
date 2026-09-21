'use client';

import { useState, useEffect } from 'react';

export interface FilterConfig {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
}

export interface SortOption {
  value: string;
  label: string;
}

interface DataTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  sortOptions?: SortOption[];
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  onSortChange?: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  totalCount?: number;
  onReset?: () => void;
  hasActiveFilters?: boolean;
  children?: React.ReactNode;
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Cari data...',
  filters = [],
  sortOptions = [],
  sortBy,
  sortDir = 'desc',
  onSortChange,
  pageSize = 15,
  onPageSizeChange,
  totalCount,
  onReset,
  hasActiveFilters = false,
  children,
}: DataTableToolbarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);

  // Sync if parent clears or changes searchValue externally
  const [prevSearchValue, setPrevSearchValue] = useState(searchValue);
  if (searchValue !== prevSearchValue) {
    setPrevSearchValue(searchValue);
    setLocalSearch(searchValue);
  }

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchValue) {
        onSearchChange(localSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchValue]);

  const toggleSortDir = () => {
    if (sortBy && onSortChange) {
      onSortChange(sortBy, sortDir === 'asc' ? 'desc' : 'asc');
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-[4px] border border-stone-200 bg-white p-4 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Side: Search Bar & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          {/* Search Input */}
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Pencarian"
              className="w-full rounded-[4px] border border-stone-300 bg-white py-1.5 pl-9 pr-8 text-xs text-stone-900 placeholder-stone-400 shadow-xs focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26]"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  onSearchChange('');
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          {filters.map((f) => (
            <div key={f.id} className="flex items-center gap-1.5">
              <label htmlFor={`filter-${f.id}`} className="sr-only">
                {f.label}
              </label>
              <select
                id={`filter-${f.id}`}
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                aria-label={f.label}
                className="rounded-[4px] border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-800 shadow-xs focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] cursor-pointer"
              >
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Sort Selector */}
          {sortOptions.length > 0 && onSortChange && (
            <div className="flex items-center gap-1">
              <label htmlFor="sort-select" className="sr-only">
                Urutkan berdasarkan
              </label>
              <select
                id="sort-select"
                value={sortBy || sortOptions[0].value}
                onChange={(e) => onSortChange(e.target.value, sortDir)}
                aria-label="Urutkan data"
                className="rounded-[4px] border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-800 shadow-xs focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] cursor-pointer"
              >
                {sortOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    Urut: {s.label}
                  </option>
                ))}
              </select>

              {/* Sort Direction Toggle Button */}
              <button
                type="button"
                onClick={toggleSortDir}
                className="rounded-[4px] border border-stone-300 bg-white px-2 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 active:translate-y-0.5 transition-all shadow-xs cursor-pointer"
                title={sortDir === 'asc' ? 'Urut Menaik (A-Z / Terendah)' : 'Urut Menurun (Z-A / Tertinggi)'}
              >
                {sortDir === 'asc' ? '↑ ASC' : '↓ DESC'}
              </button>
            </div>
          )}

          {/* Reset Filters CTA */}
          {hasActiveFilters && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-[4px] border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <span>Reset Filter</span>
              <span>✕</span>
            </button>
          )}
        </div>

        {/* Right Side: Page Size Selector & Extra Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-auto">
          {onPageSizeChange && (
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <label htmlFor="page-size-select" className="text-[11px]">
                Baris:
              </label>
              <select
                id="page-size-select"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                aria-label="Pilih jumlah baris per halaman"
                className="rounded-[4px] border border-stone-300 bg-white px-2 py-1.5 text-xs font-medium text-stone-800 shadow-xs focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          )}

          {totalCount !== undefined && (
            <span className="text-[11px] font-semibold text-stone-500 px-2 py-1 rounded bg-[#FAF8F5] border border-stone-200">
              {totalCount} total data
            </span>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
