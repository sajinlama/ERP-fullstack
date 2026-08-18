import React from "react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No records available.",
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-slate-200/80 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} scope="col" className={`px-6 py-3.5 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                  <div className="inline-flex items-center gap-2 font-medium">
                    <svg className="animate-spin h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading dataset...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 font-medium">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={keyExtractor(row)} className="hover:bg-slate-50/80 transition-colors">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={`px-6 py-4 ${col.className || ""}`}>
                      {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? "") : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}