'use client';

import { useState } from 'react';
import type { BankSampahUnit } from '@/lib/types';

interface RekapFilterBarProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  isSuperOps: boolean;
  units?: BankSampahUnit[];
  selectedUnitId?: number;
  allUnits: boolean;
  onUnitChange: (unitId: number | undefined, allUnits: boolean) => void;
  onExportCsv: () => void;
  onExportExcel?: () => void;
  onPrintPdf: () => void;
}

const MONTHS = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
];

const YEARS = [2024, 2025, 2026, 2027];

export function RekapFilterBar({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  isSuperOps,
  units = [],
  selectedUnitId,
  allUnits,
  onUnitChange,
  onExportCsv,
  onExportExcel,
  onPrintPdf,
}: RekapFilterBarProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    try {
      onExportCsv();
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  const handleExportXlsx = () => {
    if (onExportExcel) {
      onExportExcel();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-[4px] border border-stone-200 bg-white p-4 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-center gap-3">
        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter-month" className="text-xs font-semibold text-stone-600 uppercase tracking-wider text-[11px]">
            Bulan:
          </label>
          <select
            id="filter-month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            aria-label="Pilih Bulan"
            className="rounded-[4px] border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-900 shadow-xs focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] cursor-pointer"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter-year" className="text-xs font-semibold text-stone-600 uppercase tracking-wider text-[11px]">
            Tahun:
          </label>
          <select
            id="filter-year"
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            aria-label="Pilih Tahun"
            className="rounded-[4px] border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-900 shadow-xs focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] cursor-pointer"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Unit Selector (only for Platform Ops) */}
        {isSuperOps && (
          <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
            <label htmlFor="filter-unit" className="text-xs font-semibold text-stone-600 uppercase tracking-wider text-[11px]">
              Cakupan Unit:
            </label>
            <select
              id="filter-unit"
              value={allUnits ? 'all' : (selectedUnitId ?? 'all')}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'all') {
                  onUnitChange(undefined, true);
                } else {
                  onUnitChange(Number(val), false);
                }
              }}
              aria-label="Pilih Cakupan Unit"
              className="rounded-[4px] border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-900 shadow-xs focus:border-[#0B3D26] focus:outline-none focus:ring-1 focus:ring-[#0B3D26] cursor-pointer max-w-[220px] truncate"
            >
              <option value="all">Semua Cabang (Nasional)</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
        <button
          type="button"
          onClick={onPrintPdf}
          className="inline-flex items-center gap-1.5 rounded-[4px] border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:border-stone-400 active:translate-y-0.5 transition-all shadow-xs cursor-pointer"
          title="Cetak atau simpan ringkasan PDF"
        >
          <svg className="w-4 h-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Cetak Ringkasan</span>
        </button>

        <div className="flex items-center rounded-[4px] border border-stone-300 bg-white overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 border-r border-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Ekspor ke format CSV"
          >
            <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{isExporting ? 'Mengekspor...' : 'Ekspor CSV'}</span>
          </button>
          {onExportExcel && (
            <button
              type="button"
              onClick={handleExportXlsx}
              className="px-3 py-1.5 text-xs font-medium text-[#1F6B3F] hover:bg-[#1F6B3F]/5 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Ekspor ke format Excel (.xlsx)"
            >
              <svg className="w-3.5 h-3.5 text-[#1F6B3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Excel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
