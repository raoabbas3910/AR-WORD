import React from 'react';
import { X, Sliders, FileText } from 'lucide-react';
import { DocumentStats } from '../types/word';

interface WordCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: DocumentStats;
}

export const WordCountModal: React.FC<WordCountModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col text-xs">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 rounded-t-xl">
          <div className="flex items-center gap-1.5 font-bold">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Word Count Statistics</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Pages</span>
            <span className="font-semibold">{stats.pages}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Words</span>
            <span className="font-semibold">{stats.words.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Characters (no spaces)</span>
            <span className="font-semibold">{stats.charactersNoSpaces.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Characters (with spaces)</span>
            <span className="font-semibold">{stats.characters.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Paragraphs</span>
            <span className="font-semibold">{stats.paragraphs}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Lines</span>
            <span className="font-semibold">{stats.lines}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Estimated Reading Time</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              ~{stats.readingTimeMinutes} minute{stats.readingTimeMinutes > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#185abd] text-white rounded font-medium hover:bg-[#114999]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
