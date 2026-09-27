import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  RotateCw,
  Cloud,
  CloudOff,
  RefreshCw,
  Search,
  Share2,
  Moon,
  Sun,
  Maximize2,
  Minus,
  Square,
  X,
  Sparkles,
  Users,
} from 'lucide-react';
import { Collaborator, UserPreferences } from '../types/word';

interface TitleBarProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  isSaving: boolean;
  isOffline: boolean;
  lastSavedText: string;
  collaborators: Collaborator[];
  preferences: UserPreferences;
  onUpdatePreferences: (pref: Partial<UserPreferences>) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onOpenShareModal: () => void;
  onOpenAiDrawer: () => void;
  onQuickAction: (actionId: string) => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  onTitleChange,
  isSaving,
  isOffline,
  lastSavedText,
  collaborators,
  preferences,
  onUpdatePreferences,
  onSave,
  onUndo,
  onRedo,
  onOpenShareModal,
  onOpenAiDrawer,
  onQuickAction,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const quickActionsList = [
    { id: 'export-pdf', label: 'Export to PDF Document' },
    { id: 'export-docx', label: 'Export as Microsoft Word (.docx)' },
    { id: 'export-md', label: 'Export as Markdown (.md)' },
    { id: 'proofread', label: 'Run AI Grammar & Style Check' },
    { id: 'summarize', label: 'Generate Executive Summary' },
    { id: 'insert-table', label: 'Insert Table' },
    { id: 'insert-page-break', label: 'Insert Page Break' },
    { id: 'shortcuts', label: 'Customizable Keyboard Shortcuts' },
    { id: 'dark-canvas', label: 'Toggle Dark / Light Page Canvas' },
  ];

  const filteredActions = quickActionsList.filter((a) =>
    a.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="no-print h-10 bg-[#185abd] text-white flex items-center justify-between px-3 select-none text-xs font-normal border-b border-[#124b9e] relative z-40">
      {/* Left section: App Icon, AutoSave & Quick Access Toolbar */}
      <div className="flex items-center gap-2">
        {/* Word Logo Badge */}
        <div className="flex items-center gap-1.5 font-bold tracking-tight text-white pr-2 border-r border-blue-400/40">
          <div className="w-5 h-5 bg-white text-[#185abd] rounded flex items-center justify-center font-black text-xs shadow-sm">
            W
          </div>
          <span className="hidden sm:inline font-semibold">Word</span>
        </div>

        {/* AutoSave toggle */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-700/50 hover:bg-blue-700/70 transition-colors">
          <span className="text-[11px] text-blue-100 hidden md:inline">AutoSave</span>
          <button
            onClick={() =>
              onUpdatePreferences({
                autoSaveIntervalSeconds: preferences.autoSaveIntervalSeconds > 0 ? 0 : 5,
              })
            }
            title={preferences.autoSaveIntervalSeconds > 0 ? 'AutoSave is On' : 'AutoSave is Off'}
            className={`w-7 h-3.5 rounded-full p-0.5 transition-colors flex items-center ${
              preferences.autoSaveIntervalSeconds > 0 ? 'bg-emerald-400 justify-end' : 'bg-slate-400 justify-start'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Quick Access Icons */}
        <div className="flex items-center gap-0.5 text-blue-100">
          <button
            onClick={onSave}
            title="Save (Ctrl+S)"
            className="p-1.5 rounded hover:bg-blue-700 hover:text-white transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded hover:bg-blue-700 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded hover:bg-blue-700 hover:text-white transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Middle section: Document Title & "Tell me what you want to do" search */}
      <div className="flex items-center gap-3 max-w-xl flex-1 justify-center px-4">
        {/* Document Title (Editable) */}
        <div className="relative group max-w-xs md:max-w-sm">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              autoFocus
              className="bg-white text-slate-800 px-2 py-0.5 rounded text-xs font-medium outline-hidden w-full"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-white hover:bg-blue-700/60 px-2 py-0.5 rounded font-medium truncate max-w-xs transition-colors flex items-center gap-1.5"
              title="Click to rename document"
            >
              <span className="truncate">{title || 'Untitled Document.docx'}</span>
              <span className="text-[10px] text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity">
                (rename)
              </span>
            </button>
          )}
        </div>

        {/* Global Action / Search Bar */}
        <div className="relative hidden lg:block w-56">
          <div className="flex items-center bg-blue-700/60 text-blue-100 rounded px-2 py-1 text-xs focus-within:bg-white focus-within:text-slate-800 transition-all">
            <Search className="w-3 h-3 mr-1.5 shrink-0 opacity-70" />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="bg-transparent border-none outline-hidden w-full text-xs placeholder:text-blue-200 focus:placeholder:text-slate-400"
            />
          </div>

          {/* Quick Actions Dropdown */}
          {isSearchOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsSearchOpen(false)}
              />
              <div className="absolute top-8 left-0 w-64 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-xl rounded-md border border-slate-200 dark:border-slate-700 py-1 z-40 text-xs">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Actions
                </div>
                {filteredActions.length === 0 ? (
                  <div className="px-3 py-2 text-slate-500">No matching commands</div>
                ) : (
                  filteredActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => {
                        onQuickAction(action.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-between transition-colors"
                    >
                      <span>{action.label}</span>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right section: Sync status, Collaborators, Share, Dark mode, Controls */}
      <div className="flex items-center gap-2">
        {/* Cloud Sync State */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-blue-100 px-2 py-0.5 rounded bg-blue-700/30">
          {isOffline ? (
            <span className="flex items-center gap-1 text-amber-200" title="Working offline. Changes saved locally.">
              <CloudOff className="w-3 h-3" />
              <span className="hidden md:inline">Offline (Saved)</span>
            </span>
          ) : isSaving ? (
            <span className="flex items-center gap-1 text-blue-200 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="hidden md:inline">Syncing...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-200" title={`Cloud Synced · ${lastSavedText}`}>
              <Cloud className="w-3 h-3" />
              <span className="hidden md:inline">Saved</span>
            </span>
          )}
        </div>

        {/* Live Collaborators Presence Cluster */}
        <div
          onClick={onOpenShareModal}
          className="flex items-center -space-x-1.5 cursor-pointer hover:opacity-90 transition-opacity"
          title="Team Co-authoring Active (Click to manage)"
        >
          {collaborators.map((c) => (
            <div
              key={c.id}
              className="w-6 h-6 rounded-full border-2 border-[#185abd] flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
              style={{ backgroundColor: c.color }}
              title={`${c.name} (${c.role}) - ${c.status}`}
            >
              {c.avatar}
            </div>
          ))}
          <div className="w-6 h-6 rounded-full bg-blue-900 border-2 border-[#185abd] flex items-center justify-center text-[9px] font-medium text-blue-200">
            +{collaborators.length}
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={onOpenShareModal}
          className="flex items-center gap-1 bg-white text-[#185abd] hover:bg-blue-50 px-2.5 py-1 rounded font-medium transition-colors shadow-xs"
        >
          <Share2 className="w-3 h-3" />
          <span className="hidden md:inline">Share</span>
        </button>

        {/* AI Copilot Fast Trigger */}
        <button
          onClick={onOpenAiDrawer}
          className="flex items-center gap-1 bg-blue-700/80 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
          title="Open AI Writing Assistant (Ctrl+J)"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span className="hidden lg:inline text-[11px]">Copilot</span>
        </button>

        {/* Dark UI Toggle */}
        <button
          onClick={() => onUpdatePreferences({ darkUI: !preferences.darkUI })}
          title={preferences.darkUI ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-1.5 rounded hover:bg-blue-700 transition-colors text-blue-100 hover:text-white"
        >
          {preferences.darkUI ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Window controls */}
        <div className="flex items-center pl-1 border-l border-blue-400/30 text-blue-200">
          <button
            onClick={() => onUpdatePreferences({ ribbonCollapsed: !preferences.ribbonCollapsed })}
            title="Minimize Ribbon"
            className="p-1 hover:bg-blue-700 hover:text-white rounded"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }}
            title="Toggle Fullscreen (F11)"
            className="p-1 hover:bg-blue-700 hover:text-white rounded"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
