'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore, getUserRole } from '@/lib/auth';
import { useRekap } from '@/lib/queries/admin.queries';
import { useOpsUnits } from '@/lib/queries/ops.queries';
import { JENIS_SAMPAH_LABELS } from '@/lib/constants';

import { RekapFilterBar } from '@/components/admin/rekap/RekapFilterBar';
import { RekapKpiCards } from '@/components/admin/rekap/RekapKpiCards';
import { MaterialDistributionChart } from '@/components/admin/rekap/MaterialDistributionChart';
import { MonthlyTonnageTrendChart } from '@/components/admin/rekap/MonthlyTonnageTrendChart';
import { PoinActivityChart } from '@/components/admin/rekap/PoinActivityChart';
import { RekapDataTable } from '@/components/admin/rekap/RekapDataTable';

import { exportToCsv, exportToExcel } from '@/lib/utils/export.utils';
import type { RekapBreakdown } from '@/lib/types';

export default function RekapPage() {
  const { user } = useAuthStore();
  const currentRole = getUserRole(user);
  const isSuperOps = currentRole === 'platform_ops';

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedUnitId, setSelectedUnitId] = useState<number | undefined>(undefined);
  const [allUnits, setAllUnits] = useState<boolean>(isSuperOps);

  // Units list for platform superusers
  const { data: unitsData } = useOpsUnits(isSuperOps);
  const units = useMemo(() => unitsData ?? [], [unitsData]);

  // Query live recap data from backend
  const {
    data: rekap,
    isLoading,
    isFetching,
  } = useRekap(
    selectedMonth,
    selectedYear,
    isSuperOps && !allUnits ? selectedUnitId : undefined,
    isSuperOps ? allUnits : undefined
  );

  const breakdown: RekapBreakdown[] = useMemo(() => {
    const raw = rekap?.breakdown;
    if (Array.isArray(raw)) return raw as RekapBreakdown[];
    if (raw && typeof raw === 'object') return Object.values(raw) as RekapBreakdown[];
    return [];
  }, [rekap?.breakdown]);

  const totals = rekap?.totals;
  const trend = rekap?.trend ?? [];

  const unitName = useMemo(() => {
    if (isSuperOps) {
      if (allUnits) return 'Seluruh Cabang (Nasional)';
      const found = units.find((u) => u.id === selectedUnitId);
      return found ? found.nama : 'Konsol Nasional';
    }
    return user?.user_roles?.[0]?.unit?.nama || 'Bank Sampah Unit';
  }, [isSuperOps, allUnits, selectedUnitId, units, user]);

  const handleUnitChange = (unitId: number | undefined, isAll: boolean) => {
    setAllUnits(isAll);
    setSelectedUnitId(unitId);
  };

  const getExportData = () => {
    const headers = [
      'Kategori Material',
      'Kode Jenis',
      'Tonase Real (kg)',
      'Proporsi (%)',
      'Poin Diberikan',
      'Jumlah Item (Kantong)',
    ];

    const rows = breakdown.map((item) => {
      const percent = totals?.total_kg ? ((item.total_kg / totals.total_kg) * 100).toFixed(2) : '0';
      return [
        JENIS_SAMPAH_LABELS[item.jenis] || item.jenis,
        item.jenis,
        item.total_kg,
        `${percent}%`,
        item.total_poin,
        item.jumlah_item,
      ];
    });

    // Summary row
    rows.push([
      'TOTAL',
      '',
      totals?.total_kg ?? 0,
      '100.00%',
      totals?.total_poin ?? 0,
      breakdown.reduce((s, b) => s + b.jumlah_item, 0),
    ]);

    return { headers, rows };
  };

  // CSV Export utility
  const handleExportCsv = () => {
    if (!rekap) return;
    const { headers, rows } = getExportData();
    exportToCsv(
      `rekap_neraca_${selectedYear}_${String(selectedMonth).padStart(2, '0')}`,
      headers,
      rows
    );
  };

  // Excel Export utility
  const handleExportExcel = () => {
    if (!rekap) return;
    const { headers, rows } = getExportData();
    exportToExcel(
      `rekap_neraca_${selectedYear}_${String(selectedMonth).padStart(2, '0')}`,
      'Neraca Massa',
      headers,
      rows
    );
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ── 1. Hero Overview Header (Editorial Forest Green) ───────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[4px] border border-stone-200 bg-[#0B3D26] p-7 md:p-9 text-white shadow-sm print:hidden"
      >
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#1F6B3F]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-[#D4A373]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-[4px] bg-white/10 px-3 py-1 text-xs text-[#E8EDEA] backdrop-blur-xs border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#4FA65C]" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Modul Audit Neraca Massa & Sirkularitas
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
              Rekap & Neraca Massa
            </h1>

            <p className="text-sm text-stone-300 font-sans leading-relaxed">
              Cakupan: <strong className="text-white font-medium">{unitName}</strong> • Pemantauan komprehensif atas
              tonase sampah terpilah yang berhasil dialihkan dari TPA, distribusi insentif poin nasabah, serta tren
              material sirkular.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isFetching && !isLoading && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] bg-white/10 text-xs text-stone-200 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Memperbarui data...
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── 2. Filter Bar & Period Controller ──────────────────────── */}
      <div className="print:hidden">
        <RekapFilterBar
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          isSuperOps={isSuperOps}
          units={units}
          selectedUnitId={selectedUnitId}
          allUnits={allUnits}
          onUnitChange={handleUnitChange}
          onExportCsv={handleExportCsv}
          onExportExcel={handleExportExcel}
          onPrintPdf={handlePrintPdf}
        />
      </div>

      {/* ── Print Header (Only visible on paper / PDF print) ───────── */}
      <div className="hidden print:block mb-6 border-b border-stone-300 pb-4">
        <h1 className="text-2xl font-bold text-stone-900">
          Laporan Rekapitulasi & Neraca Massa — Bank Sampah Hijauin
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          Unit: {unitName} • Periode: Bulan ke-{selectedMonth} / {selectedYear}
        </p>
      </div>

      {/* ── 3. High-Impact KPI Metrics 4-Grid ─────────────────────── */}
      <RekapKpiCards rekap={rekap} isLoading={isLoading} />

      {/* ── 4. Visualizations: Donut & Historical Trend ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart: Material Composition (5 Cols on LG) */}
        <div className="lg:col-span-5">
          <MaterialDistributionChart
            breakdown={breakdown}
            totalKg={totals?.total_kg ?? 0}
            isLoading={isLoading}
          />
        </div>

        {/* Stacked Bar / Area Chart: 6-Month Tonnage Trend (7 Cols on LG) */}
        <div className="lg:col-span-7">
          <MonthlyTonnageTrendChart trend={trend} isLoading={isLoading} />
        </div>
      </div>

      {/* ── 5. Point Economic Activity & Transaction Intensity ─────── */}
      <div className="w-full">
        <PoinActivityChart trend={trend} isLoading={isLoading} />
      </div>

      {/* ── 6. Detailed Audit & Material Mass Balance Table ────────── */}
      <div className="w-full">
        <RekapDataTable
          breakdown={breakdown}
          totalKg={totals?.total_kg ?? 0}
          totalPoin={totals?.total_poin ?? 0}
          jumlahSetoran={totals?.jumlah_setoran ?? 0}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
