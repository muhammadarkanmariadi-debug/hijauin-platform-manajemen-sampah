'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { JENIS_SAMPAH_COLORS, JENIS_SAMPAH_LABELS } from '@/lib/constants';
import type { RekapMonthlyTrend } from '@/lib/types';

interface MonthlyTonnageTrendChartProps {
  trend?: RekapMonthlyTrend[];
  isLoading: boolean;
}

interface TrendTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

function TrendTooltip({ active, payload, label }: TrendTooltipProps) {
  if (active && payload && payload.length) {
    const totalMonthKg = payload.reduce((sum, p) => sum + (Number(p.value) || 0), 0);

    return (
      <div className="rounded-[4px] border border-stone-200 bg-white p-3 shadow-lg text-xs min-w-[190px]">
        <div className="flex items-center justify-between border-b border-stone-100 pb-1.5 mb-2">
          <span className="font-bold text-stone-900">{label}</span>
          <span className="font-semibold text-[#0B3D26]">{totalMonthKg.toFixed(1)} kg total</span>
        </div>
        <div className="space-y-1 text-stone-600">
          {payload.map((item) => (
            <div key={item.dataKey} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}:</span>
              </div>
              <span className="font-semibold text-stone-900">
                {Number(item.value).toFixed(1)} kg
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function MonthlyTonnageTrendChart({
  trend = [],
  isLoading,
}: MonthlyTonnageTrendChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');

  // Format trend data for Recharts
  const data = trend.map((t) => ({
    label: t.label,
    plastik: t.breakdown?.plastik ?? 0,
    kertas: t.breakdown?.kertas ?? 0,
    logam: t.breakdown?.logam ?? 0,
    kaca: t.breakdown?.kaca ?? 0,
    total: t.total_kg,
  }));

  const hasData = data.some((d) => d.total > 0);

  return (
    <div className="flex flex-col h-full rounded-[4px] border border-stone-200 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-[#0B3D26]">
            Tren Neraca Massa 6-Bulan
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Dinamika volume sampah terpilah masuk per kategori
          </p>
        </div>

        {/* Toggle Chart Type */}
        <div className="inline-flex rounded-[4px] border border-stone-200 bg-[#FAF8F5] p-0.5 text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`px-2.5 py-1 rounded-[3px] transition-all cursor-pointer ${
              chartType === 'bar'
                ? 'bg-white text-stone-900 font-semibold shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Batang Bertumpuk
          </button>
          <button
            type="button"
            onClick={() => setChartType('area')}
            className={`px-2.5 py-1 rounded-[3px] transition-all cursor-pointer ${
              chartType === 'area'
                ? 'bg-white text-stone-900 font-semibold shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Area Kumulatif
          </button>
        </div>
      </div>

      <div className="mt-4 flex-1 min-h-[300px] w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-xs text-stone-400">
            Memuat grafik tren historis...
          </div>
        ) : !hasData ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-2">
            <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <p className="text-xs font-medium text-stone-600">Belum ada riwayat tonase 6-bulan terakhir</p>
            <p className="text-[11px] text-stone-400">Data otomatis terbentuk saat setoran ditimbang dan diverifikasi.</p>
          </div>
        ) : chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1ECDF" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#7C8574"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E7E5E4' }}
              />
              <YAxis
                stroke="#7C8574"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E7E5E4' }}
                unit="kg"
              />
              <Tooltip content={<TrendTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingBottom: 12, fontSize: 11 }}
              />
              <Bar
                dataKey="plastik"
                name={JENIS_SAMPAH_LABELS.plastik}
                stackId="a"
                fill={JENIS_SAMPAH_COLORS.plastik}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="kertas"
                name={JENIS_SAMPAH_LABELS.kertas}
                stackId="a"
                fill={JENIS_SAMPAH_COLORS.kertas}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="logam"
                name={JENIS_SAMPAH_LABELS.logam}
                stackId="a"
                fill={JENIS_SAMPAH_COLORS.logam}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="kaca"
                name={JENIS_SAMPAH_LABELS.kaca}
                stackId="a"
                fill={JENIS_SAMPAH_COLORS.kaca}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1ECDF" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#7C8574"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E7E5E4' }}
              />
              <YAxis
                stroke="#7C8574"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E7E5E4' }}
                unit="kg"
              />
              <Tooltip content={<TrendTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingBottom: 12, fontSize: 11 }}
              />
              <Area
                type="monotone"
                dataKey="plastik"
                name={JENIS_SAMPAH_LABELS.plastik}
                stackId="1"
                stroke={JENIS_SAMPAH_COLORS.plastik}
                fill={JENIS_SAMPAH_COLORS.plastik}
                fillOpacity={0.7}
              />
              <Area
                type="monotone"
                dataKey="kertas"
                name={JENIS_SAMPAH_LABELS.kertas}
                stackId="1"
                stroke={JENIS_SAMPAH_COLORS.kertas}
                fill={JENIS_SAMPAH_COLORS.kertas}
                fillOpacity={0.7}
              />
              <Area
                type="monotone"
                dataKey="logam"
                name={JENIS_SAMPAH_LABELS.logam}
                stackId="1"
                stroke={JENIS_SAMPAH_COLORS.logam}
                fill={JENIS_SAMPAH_COLORS.logam}
                fillOpacity={0.7}
              />
              <Area
                type="monotone"
                dataKey="kaca"
                name={JENIS_SAMPAH_LABELS.kaca}
                stackId="1"
                stroke={JENIS_SAMPAH_COLORS.kaca}
                fill={JENIS_SAMPAH_COLORS.kaca}
                fillOpacity={0.7}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
