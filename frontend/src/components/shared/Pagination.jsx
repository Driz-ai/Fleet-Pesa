import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" /> Previous
      </button>
      <span className="text-xs font-medium text-slate-500">
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
