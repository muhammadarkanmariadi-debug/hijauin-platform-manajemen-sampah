'use client';

import { motion } from 'framer-motion';
import type { RekapResponse } from '@/lib/types';

interface RekapKpiCardsProps {
  rekap?: RekapResponse;
  isLoading: boolean;
}

export function RekapKpiCards({ rekap, isLoading }: RekapKpiCardsProps) {
  const totals = rekap?.totals;
  const growth = rekap?.growth;

  const totalKg = totals?.total_kg ?? 0;
  const totalPoin = totals?.total_poin ?? 0;
  const jumlahSetoran = totals?.jumlah_setoran ?? 0;
  const avgKg = totals?.avg_kg_per_setoran ?? 0;

  const kgGrowth = growth?.kg_growth_percent;
  const poinGrowth = growth?.poin_growth_percent;

  const formatNumber = (num: number, decimals = 0) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const cards = [
    {
      title: 'Total Tonase Terkumpul',
      value: isLoading ? '...' : `${formatNumber(totalKg, 1)}`,
      unit: 'kg material',
      subtext: 'Akumulasi sampah terpilah masuk',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      growth: kgGrowth,
      iconColor: 'text-[#1F6B3F] bg-[#1F6B3F]/10',
    },
    {
      title: 'Poin Terdistribusi',
      value: isLoading ? '...' : `${formatNumber(totalPoin)}`,
      unit: 'poin',
      subtext: `± Rp ${formatNumber(totalPoin)} nilai ekonomi`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      growth: poinGrowth,
      iconColor: 'text-[#B8873A] bg-[#B8873A]/10',
    },
    {
      title: 'Aktivitas Setoran',
      value: isLoading ? '...' : `${formatNumber(jumlahSetoran)}`,
      unit: 'transaksi',
      subtext: 'Penimbangan fisik terverifikasi',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      growth: null,
      iconColor: 'text-[#0B3D26] bg-[#0B3D26]/5',
    },
    {
      title: 'Rata-rata per Setoran',
      value: isLoading ? '...' : `${formatNumber(avgKg, 1)}`,
      unit: 'kg / transaksi',
      subtext: 'Efisiensi muatan kantong nasabah',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      growth: null,
      iconColor: 'text-[#2F7DB8] bg-[#2F7DB8]/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: idx * 0.05 }}
          className="rounded-[4px] border border-stone-200 bg-white p-5 shadow-xs hover:border-stone-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider text-[11px]">
              {card.title}
            </span>
            <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center ${card.iconColor}`}>
              {card.icon}
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-display text-3xl font-bold text-stone-900 tracking-tight">
              {card.value}
            </p>
            <span className="text-xs font-medium text-stone-500">
              {card.unit}
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-[#7C8574] truncate">
              {card.subtext}
            </span>

            {card.growth !== null && card.growth !== undefined && (
              <span
                className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-[3px] text-[10px] shrink-0 ${
                  card.growth >= 0
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-rose-50 text-rose-800'
                }`}
              >
                {card.growth >= 0 ? '↑' : '↓'} {Math.abs(card.growth)}% MoM
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
