import type { PaginationMeta } from '@/lib/types';

interface PaginationProps {
  meta?: PaginationMeta;
  onPageChange: (page: number) => void;
}

/**
 * Editorial Pagination controls matching DESIGN.md and TRD §3 meta envelope.
 */
export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (!meta) return null;

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.pageSize));

  if (totalPages <= 1 && meta.total <= meta.pageSize) return null;

  const currentPage = meta.page;

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const startItem = meta.total === 0 ? 0 : (meta.page - 1) * meta.pageSize + 1;
  const endItem = Math.min(meta.page * meta.pageSize, meta.total);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-200 bg-white px-4 py-3 text-xs text-stone-500">
      <p className="text-stone-600">
        Menampilkan <strong className="font-semibold text-stone-900">{startItem}</strong>–
        <strong className="font-semibold text-stone-900">{endItem}</strong> dari{' '}
        <strong className="font-semibold text-stone-900">{meta.total}</strong> data
      </p>

      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-[4px] border border-stone-300 bg-white px-2.5 py-1 font-medium text-stone-700 shadow-xs hover:bg-stone-50 active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          ‹ Sebelumnya
        </button>

        {/* Numeric Page Buttons */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === 'number' ? (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-[28px] h-7 rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === p
                    ? 'bg-[#0B3D26] text-white shadow-xs'
                    : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={`ellipsis-${idx}`} className="px-1.5 text-stone-400">
                ...
              </span>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-[4px] border border-stone-300 bg-white px-2.5 py-1 font-medium text-stone-700 shadow-xs hover:bg-stone-50 active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Selanjutnya ›
        </button>
      </div>
    </div>
  );
}

