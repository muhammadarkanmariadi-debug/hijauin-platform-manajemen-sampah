import { JENIS_SAMPAH_COLORS, JENIS_SAMPAH_LABELS } from '@/lib/constants';
import type { JenisSampah } from '@/lib/types';

interface KategoriIconProps {
  jenis: JenisSampah;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-12 h-12 text-base',
};

/**
 * Color-coded icon for waste material types.
 * Colors from DESIGN.md §3 material palette.
 */
export function KategoriIcon({ jenis, size = 'md' }: KategoriIconProps) {
  const color = JENIS_SAMPAH_COLORS[jenis];
  const label = JENIS_SAMPAH_LABELS[jenis];
  const initial = label.charAt(0).toUpperCase();

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold ${sizeMap[size]}`}
      style={{ backgroundColor: `${color}20`, color }}
      title={label}
    >
      {initial}
    </div>
  );
}
