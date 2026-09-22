'use client';

import { KategoriIcon } from '@/components/domain/KategoriIcon';
import { JENIS_SAMPAH_LABELS, JENIS_SAMPAH_COLORS } from '@/lib/constants';
import type { RekapBreakdown } from '@/lib/types';

interface RekapDataTableProps {
  breakdown: RekapBreakdown[];
  totalKg: number;
  totalPoin: number;
  jumlahSetoran: number;
  isLoading: boolean;
}

export function RekapDataTable({
  breakdown,
  totalKg,
  totalPoin,
  jumlahSetoran,
  isLoading,
}: RekapDataTableProps) {
  const formatNumber = (num: number, decimals = 0) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const safeBreakdown: RekapBreakdown[] = (
    Array.isArray(breakdown)
      ? breakdown
      : breakdown && typeof breakdown === 'object'
        ? Object.values(breakdown)
        : []
  ) as RekapBreakdown[];

  return (
    <div className="rounded-[4px] border border-stone-200 bg-white shadow-xs overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold text-[#0B3D26]">
            Rincian Neraca Massa & Poin Material
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Audit rincian timbangan fisik dan perolehan insentif per kategori sampah
          </p>
        </div>
        <div className="text-xs text-stone-500 bg-[#FAF8F5] px-3 py-1.5 rounded-[4px] border border-stone-200 self-start sm:self-auto">
          {jumlahSetoran} Transaksi Terverifikasi
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3">Kategori Material</th>
              <th className="px-5 py-3">Tonase Real (kg)</th>
              <th className="px-5 py-3 w-40">Proporsi</th>
              <th className="px-5 py-3 text-right">Poin Dihasilkan</th>
              <th className="px-5 py-3 text-right">Jumlah Item</th>
              <th className="px-5 py-3 text-right">Nilai Efektif / kg</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-stone-400">
                  Memuat data rincian material...
                </td>
              </tr>
            ) : safeBreakdown.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-stone-500">
                  Tidak ada data material untuk periode yang dipilih.
                </td>
              </tr>
            ) : (
              safeBreakdown.map((item) => {
                const percent = totalKg > 0 ? (item.total_kg / totalKg) * 100 : 0;
                const color = JENIS_SAMPAH_COLORS[item.jenis] || '#0B3D26';
                const label = JENIS_SAMPAH_LABELS[item.jenis] || item.jenis;
                const poinPerKg = item.total_kg > 0 ? Math.round(item.total_poin / item.total_kg) : 0;

                return (
                  <tr key={item.jenis} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <KategoriIcon jenis={item.jenis} size="sm" />
                        <div>
                          <p className="font-bold text-stone-900">{label}</p>
                          <p className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">
                            {item.jenis}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-stone-900 font-mono">
                      {formatNumber(item.total_kg, 1)} kg
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-stone-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${percent}%`, backgroundColor: color }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-stone-600 font-mono">
                          {percent.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-[#1F6B3F] font-mono">
                      +{formatNumber(item.total_poin)} poin
                    </td>
                    <td className="px-5 py-3.5 text-right text-stone-600 font-mono">
                      {formatNumber(item.jumlah_item)} kantong
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-stone-700 font-mono">
                      ± {formatNumber(poinPerKg)} poin/kg
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {breakdown.length > 0 && (
            <tfoot className="bg-[#FAF8F5]/80 border-t-2 border-stone-200 font-semibold text-stone-900">
              <tr>
                <td className="px-5 py-3.5 uppercase tracking-wider text-[11px]">
                  Total Neraca
                </td>
                <td className="px-5 py-3.5 font-bold font-mono text-sm">
                  {formatNumber(totalKg, 1)} kg
                </td>
                <td className="px-5 py-3.5 font-mono text-[11px] text-stone-500">
                  100% Terpilah
                </td>
                <td className="px-5 py-3.5 text-right font-bold text-[#0B3D26] font-mono text-sm">
                  +{formatNumber(totalPoin)} poin
                </td>
                <td className="px-5 py-3.5 text-right font-mono">
                  {formatNumber(breakdown.reduce((sum, b) => sum + b.jumlah_item, 0))} kantong
                </td>
                <td className="px-5 py-3.5 text-right text-stone-500 font-mono text-[11px]">
                  {totalKg > 0 ? `± ${formatNumber(Math.round(totalPoin / totalKg))} poin/kg` : '—'}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
