import { Badge } from '@/components/ui/Badge';
import { STATUS_SETORAN_LABELS, STATUS_SETORAN_COLORS } from '@/lib/constants';
import type { StatusSetoran } from '@/lib/types';

interface SetoranStatusBadgeProps {
  status: StatusSetoran;
}

/**
 * Domain-specific badge for submission status.
 * Color and label derived from the canonical status enum.
 */
export function SetoranStatusBadge({ status }: SetoranStatusBadgeProps) {
  return (
    <Badge color={STATUS_SETORAN_COLORS[status]}>
      {STATUS_SETORAN_LABELS[status]}
    </Badge>
  );
}
