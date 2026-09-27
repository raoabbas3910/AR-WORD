import React, { useState } from 'react';
import { X, Search, Replace, Check } from 'lucide-react';

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReplaceMode: boolean;
  onFind: (query: string, matchCase: boolean) => number;
  onReplace: (query: string, replacement: string, matchCase: boolean) => void;
  onReplaceAll: (query: string, replacement: string, matchCase: boolean) => number;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  isOpen,
  onClose,
  isReplaceMode: initialReplaceMode,
  onFind,
  onReplace,
  onReplaceAll,
}) => {
  const [isReplace, setIsReplace] = useState(initialReplaceMode);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleFind = () => {
    if (!findText) return;
    const count = onFind(findText, matchCase);
    setMatchCount(count);
  };

  const handleReplace = () => {
    if (!findText) return;
    onReplace(findText, replaceText, matchCase);
    handleFind();
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    const count = onReplaceAll(findText, replaceText, matchCase);
    setMatchCount(count);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col text-xs">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 rounded-t-xl">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            {isReplace ? <Replace className="w-4 h-4 text-emerald-600" /> : <Search className="w-4 h-4 text-blue-600" />}
            <span>{isReplace ? 'Find and Replace' : 'Find in Document'}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950 px-4 pt-1 gap-2">
          <button
            onClick={() => setIsReplace(false)}
            className={`pb-1.5 font-medium border-b-2 transition-colors ${
              !isReplace ? 'border-[#185abd] text-[#185abd] dark:text-blue-400 font-semibold' : 'border-transparent text-slate-500'
            }`}
          >
            Find
          </button>
          <button
            onClick={() => setIsReplace(true)}
            className={`pb-1.5 font-medium border-b-2 transition-colors ${
              isReplace ? 'border-[#185abd] text-[#185abd] dark:text-blue-400 font-semibold' : 'border-transparent text-slate-500'
            }`}
          >
            Replace
          </button>
        </div>

        {/* Inputs */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              Find What:
            </label>
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFind()}
              placeholder="Search text..."
              className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs outline-hidden focus:border-blue-500"
              autoFocus
            />
          </div>

          {isReplace && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Replace With:
              </label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replacement text..."
                className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs outline-hidden focus:border-blue-500"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={matchCase}
                onChange={(e) => setMatchCase(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Match case</span>
            </label>

            {matchCount !== null && (
              <span className="text-[11px] text-slate-500 font-medium">
                {matchCount === 0 ? 'No matches found' : `${matchCount} occurrence${matchCount > 1 ? 's' : ''} found`}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 bg-slate-50 dark:bg-slate-950 rounded-b-xl">
          <button
            onClick={handleFind}
            className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Find Next
          </button>
          {isReplace && (
            <>
              <button
                onClick={handleReplace}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Replace
              </button>
              <button
                onClick={handleReplaceAll}
                className="px-3 py-1.5 bg-[#185abd] text-white rounded font-medium hover:bg-[#114999] transition-colors"
              >
                Replace All
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
