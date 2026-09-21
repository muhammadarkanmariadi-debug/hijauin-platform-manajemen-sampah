import { Card } from '@/components/ui/Card';

interface PointBalanceCardProps {
  saldoPoin: number;
}

/**
 * Displays nasabah's current point balance prominently.
 */
export function PointBalanceCard({ saldoPoin }: PointBalanceCardProps) {
  return (
    <Card>
      <p className="text-sm font-medium text-gray-500">Saldo Poin Anda</p>
      <p className="mt-2 text-4xl font-bold text-[#0B3D26]">
        {saldoPoin.toLocaleString('id-ID')}
      </p>
      <p className="mt-1 text-xs text-gray-400">poin tersedia</p>
    </Card>
  );
}
