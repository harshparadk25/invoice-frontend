import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { IPagination } from '../../types';

interface PaginationProps {
  pagination: IPagination;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
      <p className="text-[13px] text-dark-400">
        Page <span className="font-medium text-dark-600">{page}</span> of{' '}
        <span className="font-medium text-dark-600">{totalPages}</span>
        <span className="hidden sm:inline"> &middot; {total} results</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-md border border-dark-200 hover:bg-dark-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-md text-[13px] font-medium transition-colors ${
                pageNum === page
                  ? 'bg-primary-600 text-white'
                  : 'hover:bg-dark-50 text-dark-500'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-md border border-dark-200 hover:bg-dark-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
