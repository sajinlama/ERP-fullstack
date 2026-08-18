import React from "react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No records available.",
  keyExtractor,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          {/* Table Header */}
          <thead className="border-b border-slate-800/80 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-6 py-4 font-semibold tracking-wider ${col.headerClassName || ""} ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center text-slate-500">
                  <div className="inline-flex items-center gap-2.5">
                    <svg
                      className="animate-spin h-5 w-5 text-indigo-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-slate-400">Loading dataset...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center text-slate-500 font-medium">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-slate-600">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                    </div>
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const isClickable = Boolean(onRowClick);
                return (
                  <tr
                    key={keyExtractor(row)}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors duration-150 hover:bg-slate-800/30 ${
                      isClickable ? "cursor-pointer" : ""
                    }`}
                  >
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className={`px-6 py-4 ${col.className || ""}`}>
                        {col.cell
                          ? col.cell(row)
                          : col.accessorKey
                          ? String(row[col.accessorKey] ?? "")
                          : null}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;