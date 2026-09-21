import type { ReactNode } from 'react';

interface BadgeProps {
  color?: string;
  children: ReactNode;
}

/**
 * Small pill badge for status indicators and labels.
 * Pass a hex color to set the badge color dynamically.
 */
export function Badge({ color = '#6B7280', children }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      {children}
    </span>
  );
}
