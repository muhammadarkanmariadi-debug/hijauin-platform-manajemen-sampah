'use client';

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { RekapMonthlyTrend } from '@/lib/types';

interface PoinActivityChartProps {
  trend?: RekapMonthlyTrend[];
  isLoading: boolean;
}

interface CustomPoinTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

function CustomPoinTooltip({ active, payload, label }: CustomPoinTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-[4px] border border-stone-200 bg-white p-3 shadow-lg text-xs min-w-[180px]">
        <div className="font-bold text-stone-900 border-b border-stone-100 pb-1 mb-1.5">
          {label}
        </div>
        <div className="space-y-1 text-stone-600">
          {payload.map((item) => (
            <div key={item.dataKey} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}:</span>
              </span>
              <span className="font-semibold text-stone-900">
                {item.dataKey === 'total_poin'
                  ? `${Number(item.value).toLocaleString('id-ID')} poin`
                  : `${item.value} setoran`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function PoinActivityChart({
  trend = [],
  isLoading,
}: PoinActivityChartProps) {
  const data = trend.map((t) => ({
    label: t.label,
    total_poin: t.total_poin,
    jumlah_setoran: t.jumlah_setoran,
  }));

  const hasData = data.some((d) => d.total_poin > 0 || d.jumlah_setoran > 0);

  return (
    <div className="flex flex-col h-full rounded-[4px] border border-stone-200 bg-white p-5 sm:p-6 shadow-xs">
      <div>
        <h3 className="font-display text-lg font-bold text-[#0B3D26]">
          Perputaran Poin & Intensitas Setoran
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Korelasi antara insentif poin yang dikreditkan dan frekuensi transaksi nasabah
        </p>
      </div>

      <div className="mt-4 flex-1 min-h-[260px] w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-xs text-stone-400">
            Memuat statistik perputaran poin...
          </div>
        ) : !hasData ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-2">
            <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-xs font-medium text-stone-600">Belum ada aktivitas transaksi poin</p>
            <p className="text-[11px] text-stone-400">Poin dikreditkan otomatis saat setoran berhasil diverifikasi.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1ECDF" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#7C8574"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E7E5E4' }}
              />
              <YAxis
                yAxisId="left"
                stroke="#1F6B3F"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E7E5E4' }}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#B8873A"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E7E5E4' }}
              />
              <Tooltip content={<CustomPoinTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
              />
              <Bar
                yAxisId="left"
                dataKey="total_poin"
                name="Poin Dikreditkan"
                fill="#1F6B3F"
                radius={[3, 3, 0, 0]}
                barSize={24}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="jumlah_setoran"
                name="Jumlah Setoran"
                stroke="#B8873A"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#B8873A', strokeWidth: 1, stroke: '#FFFFFF' }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
