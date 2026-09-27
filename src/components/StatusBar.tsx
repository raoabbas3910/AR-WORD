import React from 'react';
import { ViewMode, DocumentStats } from '../types/word';
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Globe,
  Sliders,
  Minus,
  Plus,
  Maximize2,
  Columns,
  Eye,
} from 'lucide-react';

interface StatusBarProps {
  stats: DocumentStats;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  onOpenWordCountModal: () => void;
  hasGrammarIssues: boolean;
  trackChangesActive: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  stats,
  viewMode,
  onViewModeChange,
  zoomLevel,
  onZoomChange,
  onOpenWordCountModal,
  hasGrammarIssues,
  trackChangesActive,
}) => {
  return (
    <footer className="no-print h-6 bg-[#185abd] text-white flex items-center justify-between px-3 select-none text-[11px] font-normal border-t border-[#124b9e] relative z-30">
      {/* Left section: Page info, Word count, Proofing check, Language */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 hover:bg-blue-700/60 px-1.5 py-0.5 rounded cursor-pointer transition-colors">
          Page 1 of {stats.pages}
        </span>

        {/* Word count clickable */}
        <button
          onClick={onOpenWordCountModal}
          className="flex items-center gap-1 hover:bg-blue-700/60 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
          title="Click to view detailed word and character statistics"
        >
          <span>{stats.words.toLocaleString()} words</span>
        </button>

        {/* Proofing check */}
        <span
          className="hidden sm:flex items-center gap-1 hover:bg-blue-700/60 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
          title={hasGrammarIssues ? 'AI detected grammar or style suggestions' : 'No proofing issues found'}
        >
          {hasGrammarIssues ? (
            <>
              <AlertCircle className="w-3 h-3 text-amber-300" />
              <span>Issues Found</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3 h-3 text-emerald-300" />
              <span>Proofing OK</span>
            </>
          )}
        </span>

        {/* Language */}
        <span className="hidden md:flex items-center gap-1 text-blue-200">
          <Globe className="w-3 h-3" />
          <span>English (US)</span>
        </span>

        {/* Track changes indicator */}
        {trackChangesActive && (
          <span className="hidden lg:inline bg-amber-400 text-amber-950 font-semibold px-1.5 py-0.2 rounded text-[10px]">
            Track Changes: On
          </span>
        )}
      </div>

      {/* Right section: Views & Zoom Slider */}
      <div className="flex items-center gap-3">
        {/* Layout View Modes */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onViewModeChange('print')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'print' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700/60'
            }`}
            title="Print Layout"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('web')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'web' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700/60'
            }`}
            title="Web Layout"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('focus')}
            className={`p-1 rounded transition-colors ${
              viewMode === 'focus' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700/60'
            }`}
            title="Focus Mode"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Slider */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-blue-400/30">
          <button
            onClick={() => onZoomChange(Math.max(50, zoomLevel - 10))}
            className="hover:bg-blue-700 p-0.5 rounded text-blue-200 hover:text-white"
            title="Zoom Out"
          >
            <Minus className="w-3 h-3" />
          </button>

          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={zoomLevel}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-20 h-1 bg-blue-400/50 rounded-lg appearance-none cursor-pointer accent-white"
          />

          <button
            onClick={() => onZoomChange(Math.min(200, zoomLevel + 10))}
            className="hover:bg-blue-700 p-0.5 rounded text-blue-200 hover:text-white"
            title="Zoom In"
          >
            <Plus className="w-3 h-3" />
          </button>

          <button
            onClick={() => onZoomChange(100)}
            className="w-9 text-right font-medium hover:underline text-blue-100"
            title="Click to reset zoom to 100%"
          >
            {zoomLevel}%
          </button>
        </div>
      </div>
    </footer>
  );
};
