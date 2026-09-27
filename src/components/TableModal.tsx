import React, { useState } from 'react';
import { X, Table as TableIcon } from 'lucide-react';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTable: (rows: number, cols: number, hasHeader: boolean) => void;
}

export const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  onInsertTable,
}) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [hasHeader, setHasHeader] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col text-xs">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 rounded-t-xl">
          <div className="flex items-center gap-1.5 font-bold">
            <TableIcon className="w-4 h-4 text-emerald-600" />
            <span>Insert Table</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grid Selector */}
        <div className="p-4 space-y-4">
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              Interactive Grid ({hoveredCell ? `${hoveredCell.r} × ${hoveredCell.c}` : `${rows} × ${cols}`})
            </div>
            <div className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg inline-block bg-slate-50 dark:bg-slate-950">
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 6 }).map((_, rIdx) =>
                  Array.from({ length: 6 }).map((_, cIdx) => {
                    const r = rIdx + 1;
                    const c = cIdx + 1;
                    const isSelected =
                      (hoveredCell && r <= hoveredCell.r && c <= hoveredCell.c) ||
                      (!hoveredCell && r <= rows && c <= cols);
                    return (
                      <div
                        key={`${r}-${c}`}
                        onMouseEnter={() => setHoveredCell({ r, c })}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => {
                          setRows(r);
                          setCols(c);
                        }}
                        className={`w-6 h-6 border rounded-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-500 border-blue-600'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                        }`}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Rows:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={rows}
                onChange={(e) => setRows(Math.max(1, Number(e.target.value)))}
                className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Columns:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(Math.max(1, Number(e.target.value)))}
                className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span>Include styled header row</span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 bg-slate-50 dark:bg-slate-950 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onInsertTable(rows, cols, hasHeader);
              onClose();
            }}
            className="px-4 py-1.5 bg-[#185abd] text-white rounded font-medium hover:bg-[#114999]"
          >
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
};
