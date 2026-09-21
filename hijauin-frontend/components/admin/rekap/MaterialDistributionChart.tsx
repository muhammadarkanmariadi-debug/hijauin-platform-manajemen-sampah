'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { JENIS_SAMPAH_COLORS, JENIS_SAMPAH_LABELS } from '@/lib/constants';
import type { RekapBreakdown, JenisSampah } from '@/lib/types';

interface MaterialDistributionChartProps {
  breakdown: RekapBreakdown[];
  totalKg: number;
  isLoading: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
      jenis: JenisSampah;
      percent: number;
      poin: number;
    };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = JENIS_SAMPAH_COLORS[data.jenis] || '#0B3D26';

    return (
      <div className="rounded-[4px] border border-stone-200 bg-white p-3 shadow-lg text-xs min-w-[170px]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-bold text-stone-900">{data.name}</span>
        </div>
        <div className="space-y-1 text-stone-600">
          <div className="flex justify-between">
            <span>Tonase:</span>
            <span className="font-semibold text-stone-900">{data.value.toLocaleString('id-ID')} kg</span>
          </div>
          <div className="flex justify-between">
            <span>Proporsi:</span>
            <span className="font-semibold text-stone-900">{data.percent.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Perputaran Poin:</span>
            <span className="font-semibold text-[#1F6B3F]">{data.poin.toLocaleString('id-ID')} poin</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function MaterialDistributionChart({
  breakdown,
  totalKg,
  isLoading,
}: MaterialDistributionChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = breakdown.map((item) => ({
    name: JENIS_SAMPAH_LABELS[item.jenis] || item.jenis,
    value: item.total_kg,
    jenis: item.jenis,
    percent: totalKg > 0 ? (item.total_kg / totalKg) * 100 : 0,
    poin: item.total_poin,
  }));

  const hasData = chartData.some((d) => d.value > 0);

  return (
    <div className="flex flex-col h-full rounded-[4px] border border-stone-200 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-[#0B3D26]">
            Komposisi Material Terpilah
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Proporsi tonase sampah berdasarkan jenis material
          </p>
        </div>
      </div>

      <div className="mt-4 relative flex-1 flex items-center justify-center min-h-[260px]">
        {isLoading ? (
          <div className="text-xs text-stone-400">Memuat visualisasi komposisi...</div>
        ) : !hasData ? (
          <div className="text-center py-8 space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <p className="text-xs font-medium text-stone-600">Belum ada data penimbangan terverifikasi</p>
            <p className="text-[11px] text-stone-400">Pilih periode bulan lain yang memiliki setoran selesai.</p>
          </div>
        ) : (
          <>
            <div className="w-full h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.jenis}`}
                        fill={JENIS_SAMPAH_COLORS[entry.jenis] || '#8A94A0'}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                        className="transition-all duration-200 cursor-pointer"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Centered Total Callout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Total Massa
              </span>
              <span className="font-display text-2xl font-bold text-stone-900 tracking-tight">
                {totalKg.toLocaleString('id-ID', { maximumFractionDigits: 1 })}
              </span>
              <span className="text-[11px] font-medium text-stone-500">kg</span>
            </div>
          </>
        )}
      </div>

      {/* Legend & Breakdown List */}
      {hasData && (
        <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-2 gap-2.5">
          {chartData.map((item) => {
            const color = JENIS_SAMPAH_COLORS[item.jenis];
            return (
              <div
                key={item.jenis}
                className="flex items-center justify-between p-2 rounded-[4px] bg-[#FAF8F5] border border-stone-200/60 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="font-medium text-stone-800 truncate">{item.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-stone-900">{item.percent.toFixed(0)}%</span>
                  <span className="text-[10px] text-stone-400 ml-1">({item.value.toFixed(1)} kg)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
