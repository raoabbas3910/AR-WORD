import React, { useState } from 'react';
import {
  RibbonTab,
  PageSetup,
  UserPreferences,
  MarginType,
  PageSize,
} from '../types/word';
import {
  Scissors,
  Copy,
  Clipboard,
  Paintbrush,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Table as TableIcon,
  Image as ImageIcon,
  Link,
  MessageSquarePlus,
  FileText,
  FilePlus,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Volume2,
  ChevronDown,
  Palette,
  Highlighter,
  PenTool,
  Eraser,
  HelpCircle,
  Keyboard,
  RotateCcw,
  Search,
  Replace,
  Settings,
  Sun,
  Moon,
  Ruler,
  Maximize,
  Minimize,
  Sliders,
  Type,
  Plus,
  Minus,
} from 'lucide-react';

interface RibbonProps {
  activeTab: RibbonTab;
  onTabChange: (tab: RibbonTab) => void;
  onOpenFileMenu: () => void;
  pageSetup: PageSetup;
  onUpdatePageSetup: (setup: Partial<PageSetup>) => void;
  preferences: UserPreferences;
  onUpdatePreferences: (pref: Partial<UserPreferences>) => void;
  onFormatCommand: (command: string, value?: string) => void;
  onInsertTableModal: () => void;
  onInsertImageModal: () => void;
  onInsertLinkModal: () => void;
  onAddComment: () => void;
  onOpenAiDrawer: (mode?: string) => void;
  onOpenShortcutsModal: () => void;
  onOpenFindReplaceModal: (isReplace?: boolean) => void;
  onOpenWordCountModal: () => void;
  onToggleTrackChanges: () => void;
  trackChangesActive: boolean;
  onReadAloud: () => void;
  isReadingAloud: boolean;
  activeFont: string;
  activeFontSize: string;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  drawTool: 'pen' | 'highlighter' | 'eraser' | null;
  onSetDrawTool: (tool: 'pen' | 'highlighter' | 'eraser' | null) => void;
  drawColor: string;
  onSetDrawColor: (color: string) => void;
}

export const Ribbon: React.FC<RibbonProps> = ({
  activeTab,
  onTabChange,
  onOpenFileMenu,
  pageSetup,
  onUpdatePageSetup,
  preferences,
  onUpdatePreferences,
  onFormatCommand,
  onInsertTableModal,
  onInsertImageModal,
  onInsertLinkModal,
  onAddComment,
  onOpenAiDrawer,
  onOpenShortcutsModal,
  onOpenFindReplaceModal,
  onOpenWordCountModal,
  onToggleTrackChanges,
  trackChangesActive,
  onReadAloud,
  isReadingAloud,
  activeFont,
  activeFontSize,
  zoomLevel,
  onZoomChange,
  drawTool,
  onSetDrawTool,
  drawColor,
  onSetDrawColor,
}) => {
  const [fontColor, setFontColor] = useState('#1e293b');
  const [highlightColor, setHighlightColor] = useState('#fef08a');
  const [activeStyle, setActiveStyle] = useState('normal');

  const fonts = [
    { label: 'Aptos (Default)', value: 'Aptos, sans-serif' },
    { label: 'Calibri', value: 'Calibri, sans-serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'EB Garamond', value: '"EB Garamond", serif' },
    { label: 'Inter', value: 'Inter, sans-serif' },
    { label: 'Merriweather', value: 'Merriweather, serif' },
    { label: 'Fira Code (Mono)', value: '"Fira Code", monospace' },
    { label: 'Roboto', value: 'Roboto, sans-serif' },
  ];

  const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '36', '48', '72'];

  const stylesGallery = [
    { id: 'normal', name: 'Normal', tag: 'p', className: 'text-sm' },
    { id: 'h1', name: 'Heading 1', tag: 'h1', className: 'text-xl font-bold' },
    { id: 'h2', name: 'Heading 2', tag: 'h2', className: 'text-lg font-semibold' },
    { id: 'h3', name: 'Heading 3', tag: 'h3', className: 'text-base font-semibold' },
    { id: 'title', name: 'Title', tag: 'h1', className: 'text-2xl font-black' },
    { id: 'subtitle', name: 'Subtitle', tag: 'p', className: 'text-base text-slate-500 italic' },
    { id: 'quote', name: 'Quote', tag: 'blockquote', className: 'italic border-l-2' },
  ];

  const applyStyle = (style: (typeof stylesGallery)[0]) => {
    setActiveStyle(style.id);
    if (style.tag === 'p') {
      onFormatCommand('formatBlock', '<p>');
    } else if (style.tag === 'h1') {
      onFormatCommand('formatBlock', '<h1>');
    } else if (style.tag === 'h2') {
      onFormatCommand('formatBlock', '<h2>');
    } else if (style.tag === 'h3') {
      onFormatCommand('formatBlock', '<h3>');
    } else if (style.tag === 'blockquote') {
      onFormatCommand('formatBlock', '<blockquote>');
    }
  };

  return (
    <div className="no-print bg-[#f3f4f6] dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 select-none text-xs">
      {/* Ribbon Tab Bar */}
      <div className="flex items-center px-2 pt-0.5 border-b border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-950 overflow-x-auto no-scrollbar">
        {/* File Tab (Special Blue Backstage button) */}
        <button
          onClick={onOpenFileMenu}
          className="px-3 py-1 font-semibold text-white bg-[#185abd] hover:bg-[#114999] rounded-t transition-colors mr-1 cursor-pointer flex items-center gap-1 shadow-xs"
        >
          File
        </button>

        {/* Regular Tabs */}
        {[
          { id: 'home', label: 'Home' },
          { id: 'insert', label: 'Insert' },
          { id: 'draw', label: 'Draw' },
          { id: 'layout', label: 'Layout' },
          { id: 'references', label: 'References' },
          { id: 'review', label: 'Review' },
          { id: 'view', label: 'View' },
          { id: 'ai', label: 'AI Copilot' },
          { id: 'help', label: 'Help' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as RibbonTab)}
              className={`px-3 py-1 font-medium transition-colors relative cursor-pointer ${
                isActive
                  ? 'text-[#185abd] dark:text-blue-400 bg-[#f3f4f6] dark:bg-slate-900 border-t-2 border-[#185abd] dark:border-blue-500 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
              {tab.id === 'ai' && (
                <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          );
        })}

        {/* Collapse Ribbon Toggle */}
        <div className="ml-auto flex items-center pr-2">
          <button
            onClick={() => onUpdatePreferences({ ribbonCollapsed: !preferences.ribbonCollapsed })}
            title={preferences.ribbonCollapsed ? 'Expand Ribbon (Ctrl+F1)' : 'Collapse Ribbon (Ctrl+F1)'}
            className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                preferences.ribbonCollapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Ribbon Command Container (Height collapsible) */}
      {!preferences.ribbonCollapsed && (
        <div className="h-24 px-3 py-1.5 flex items-stretch gap-2 overflow-x-auto text-slate-700 dark:text-slate-200 text-xs">
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <>
              {/* Clipboard Group */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.readText().then((clipText) => {
                        onFormatCommand('insertText', clipText);
                      }).catch(() => {
                        onFormatCommand('paste');
                      });
                    }}
                    className="flex flex-col items-center justify-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                    title="Paste (Ctrl+V)"
                  >
                    <Clipboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] mt-0.5">Paste</span>
                  </button>
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => onFormatCommand('cut')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded flex items-center gap-1"
                      title="Cut (Ctrl+X)"
                    >
                      <Scissors className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                      <span className="text-[10px]">Cut</span>
                    </button>
                    <button
                      onClick={() => onFormatCommand('copy')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded flex items-center gap-1"
                      title="Copy (Ctrl+C)"
                    >
                      <Copy className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                      <span className="text-[10px]">Copy</span>
                    </button>
                    <button
                      onClick={() => {}}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded flex items-center gap-1"
                      title="Format Painter"
                    >
                      <Paintbrush className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                      <span className="text-[10px]">Format</span>
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Clipboard</div>
              </div>

              {/* Font Group */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex flex-col gap-1">
                  {/* Top row: Font family, size, growth buttons */}
                  <div className="flex items-center gap-1">
                    <select
                      value={activeFont}
                      onChange={(e) => onFormatCommand('fontName', e.target.value)}
                      className="h-6 px-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 outline-hidden w-28"
                    >
                      {fonts.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={activeFontSize}
                      onChange={(e) => onFormatCommand('fontSize', e.target.value)}
                      className="h-6 px-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 outline-hidden w-12"
                    >
                      {fontSizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => onFormatCommand('fontSize', '4')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 font-bold"
                      title="Increase Font Size"
                    >
                      A+
                    </button>
                    <button
                      onClick={() => onFormatCommand('fontSize', '2')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-200 text-[10px] font-bold"
                      title="Decrease Font Size"
                    >
                      A-
                    </button>
                    <button
                      onClick={() => onFormatCommand('removeFormat')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-rose-500 text-[10px]"
                      title="Clear All Formatting"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Bottom row: Bold, Italic, Underline, Strike, Colors */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => onFormatCommand('bold')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded font-bold"
                      title="Bold (Ctrl+B)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onFormatCommand('italic')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded italic"
                      title="Italic (Ctrl+I)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onFormatCommand('underline')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded underline"
                      title="Underline (Ctrl+U)"
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onFormatCommand('strikethrough')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                      title="Strikethrough"
                    >
                      <Strikethrough className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onFormatCommand('subscript')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                      title="Subscript"
                    >
                      <Subscript className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onFormatCommand('superscript')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                      title="Superscript"
                    >
                      <Superscript className="w-3.5 h-3.5" />
                    </button>

                    {/* Font Color */}
                    <div className="relative flex items-center ml-1">
                      <label className="cursor-pointer p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded flex flex-col items-center">
                        <span className="font-bold text-xs" style={{ color: fontColor }}>
                          A
                        </span>
                        <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: fontColor }} />
                        <input
                          type="color"
                          value={fontColor}
                          onChange={(e) => {
                            setFontColor(e.target.value);
                            onFormatCommand('foreColor', e.target.value);
                          }}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    {/* Highlight Color */}
                    <div className="relative flex items-center">
                      <label className="cursor-pointer p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded flex flex-col items-center">
                        <Highlighter className="w-3 h-3 text-slate-700 dark:text-slate-200" />
                        <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: highlightColor }} />
                        <input
                          type="color"
                          value={highlightColor}
                          onChange={(e) => {
                            setHighlightColor(e.target.value);
                            onFormatCommand('hiliteColor', e.target.value);
                          }}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Font</div>
              </div>

              {/* Paragraph Group */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex flex-col gap-1">
                  {/* Lists & Indents */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => onFormatCommand('insertUnorderedList')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                      title="Bullets"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onFormatCommand('insertOrderedList')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                      title="Numbering"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onFormatCommand('outdent')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                      title="Decrease Indent"
                    >
                      <Outdent className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onFormatCommand('indent')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                      title="Increase Indent"
                    >
                      <Indent className="w-3.5 h-3.5" />
                    </button>
                    <select
                      onChange={(e) => onFormatCommand('lineSpacing', e.target.value)}
                      defaultValue="1.5"
                      className="h-6 px-1 text-[11px] border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 outline-hidden"
                      title="Line & Paragraph Spacing"
                    >
                      <option value="1.0">1.0</option>
                      <option value="1.15">1.15</option>
                      <option value="1.5">1.5</option>
                      <option value="2.0">2.0</option>
                      <option value="2.5">2.5</option>
                    </select>
                  </div>

                  {/* Alignment buttons */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => onFormatCommand('justifyLeft')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                      title="Align Left (Ctrl+L)"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onFormatCommand('justifyCenter')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                      title="Align Center (Ctrl+E)"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onFormatCommand('justifyRight')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                      title="Align Right (Ctrl+R)"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onFormatCommand('justifyFull')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                      title="Justify (Ctrl+J)"
                    >
                      <AlignJustify className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onFormatCommand('insertHorizontalRule')}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-[10px]"
                      title="Insert Divider"
                    >
                      Divider
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Paragraph</div>
              </div>

              {/* Styles Gallery */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-sm pb-1">
                  {stylesGallery.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => applyStyle(style)}
                      className={`h-12 w-20 p-1 flex flex-col justify-center items-center border rounded transition-all text-center truncate ${
                        activeStyle === style.id
                          ? 'border-[#185abd] bg-blue-50 dark:bg-blue-950/40 text-[#185abd] dark:text-blue-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-400'
                      }`}
                    >
                      <span className={`truncate w-full ${style.className}`}>Aa</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full">
                        {style.name}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Styles</div>
              </div>

              {/* Editing & Search */}
              <div className="flex flex-col justify-between shrink-0">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => onOpenFindReplaceModal(false)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded flex items-center gap-1.5"
                    title="Find (Ctrl+F)"
                  >
                    <Search className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-[11px]">Find</span>
                  </button>
                  <button
                    onClick={() => onOpenFindReplaceModal(true)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded flex items-center gap-1.5"
                    title="Replace (Ctrl+H)"
                  >
                    <Replace className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[11px]">Replace</span>
                  </button>
                  <button
                    onClick={() => onFormatCommand('selectAll')}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded flex items-center gap-1.5"
                    title="Select All (Ctrl+A)"
                  >
                    <Type className="w-3 h-3 text-slate-500" />
                    <span className="text-[11px]">Select All</span>
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Editing</div>
              </div>
            </>
          )}

          {/* INSERT TAB */}
          {activeTab === 'insert' && (
            <>
              {/* Pages */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onFormatCommand('insertPageBreak')}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Insert Page Break (Ctrl+Enter)"
                  >
                    <FilePlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] mt-0.5">Page Break</span>
                  </button>
                  <button
                    onClick={() => onFormatCommand('insertCoverPage')}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Insert Title / Cover Page"
                  >
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[10px] mt-0.5">Cover Page</span>
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Pages</div>
              </div>

              {/* Tables */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={onInsertTableModal}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Insert Table Grid"
                  >
                    <TableIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[10px] mt-0.5">Table</span>
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Tables</div>
              </div>

              {/* Illustrations */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={onInsertImageModal}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Insert Picture from URL or Device"
                  >
                    <ImageIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-[10px] mt-0.5">Pictures</span>
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Illustrations</div>
              </div>

              {/* Links & Comments */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={onInsertLinkModal}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Insert Hyperlink"
                  >
                    <Link className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span className="text-[10px] mt-0.5">Link</span>
                  </button>
                  <button
                    onClick={onAddComment}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="New Comment (Ctrl+Alt+M)"
                  >
                    <MessageSquarePlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-[10px] mt-0.5">Comment</span>
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Collaboration</div>
              </div>

              {/* Header, Footer & Date */}
              <div className="flex flex-col justify-between shrink-0">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => onFormatCommand('insertDate')}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-left"
                    title="Insert Today's Date"
                  >
                    <span className="text-[11px]">Insert Date & Time</span>
                  </button>
                  <button
                    onClick={() => onFormatCommand('insertCallout')}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-left"
                    title="Insert Callout Note Box"
                  >
                    <span className="text-[11px]">Insert Callout Box</span>
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Text Elements</div>
              </div>
            </>
          )}

          {/* DRAW TAB */}
          {activeTab === 'draw' && (
            <>
              {/* Drawing Tools */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSetDrawTool(drawTool === 'pen' ? null : 'pen')}
                    className={`flex flex-col items-center p-1.5 rounded transition-colors ${
                      drawTool === 'pen'
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 font-semibold'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                    title="Freehand Ink Pen"
                  >
                    <PenTool className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] mt-0.5">Pen</span>
                  </button>
                  <button
                    onClick={() => onSetDrawTool(drawTool === 'highlighter' ? null : 'highlighter')}
                    className={`flex flex-col items-center p-1.5 rounded transition-colors ${
                      drawTool === 'highlighter'
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 font-semibold'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                    title="Ink Highlighter"
                  >
                    <Highlighter className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] mt-0.5">Highlighter</span>
                  </button>
                  <button
                    onClick={() => onSetDrawTool(drawTool === 'eraser' ? null : 'eraser')}
                    className={`flex flex-col items-center p-1.5 rounded transition-colors ${
                      drawTool === 'eraser'
                        ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 font-semibold'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                    title="Clear / Erase Inking"
                  >
                    <Eraser className="w-4 h-4 text-rose-500" />
                    <span className="text-[10px] mt-0.5">Eraser</span>
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Tools</div>
              </div>

              {/* Ink Colors */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1.5 pt-1">
                  {['#000000', '#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea'].map((c) => (
                    <button
                      key={c}
                      onClick={() => onSetDrawColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        drawColor === c ? 'scale-110 border-blue-500 shadow-xs' : 'border-white dark:border-slate-800'
                      }`}
                      style={{ backgroundColor: c }}
                      title={`Color: ${c}`}
                    />
                  ))}
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Color Palette</div>
              </div>
            </>
          )}

          {/* LAYOUT TAB */}
          {activeTab === 'layout' && (
            <>
              {/* Margins */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-slate-500">Margins:</span>
                    <select
                      value={pageSetup.margins}
                      onChange={(e) => onUpdatePageSetup({ margins: e.target.value as MarginType })}
                      className="h-6 px-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 outline-hidden"
                    >
                      <option value="normal">Normal (1 in / 2.54 cm)</option>
                      <option value="narrow">Narrow (0.5 in / 1.27 cm)</option>
                      <option value="moderate">Moderate</option>
                      <option value="wide">Wide</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-slate-500">Columns:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((cols) => (
                        <button
                          key={cols}
                          onClick={() => onUpdatePageSetup({ columns: cols as 1 | 2 | 3 })}
                          className={`px-2 py-0.5 rounded text-xs transition-colors ${
                            pageSetup.columns === cols
                              ? 'bg-[#185abd] text-white font-medium'
                              : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {cols === 1 ? 'One' : cols === 2 ? 'Two' : 'Three'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Page Margins</div>
              </div>

              {/* Orientation & Size */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-slate-500">Orientation:</span>
                    <button
                      onClick={() => onUpdatePageSetup({ orientation: 'portrait' })}
                      className={`px-2 py-0.5 rounded text-xs ${
                        pageSetup.orientation === 'portrait'
                          ? 'bg-[#185abd] text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      onClick={() => onUpdatePageSetup({ orientation: 'landscape' })}
                      className={`px-2 py-0.5 rounded text-xs ${
                        pageSetup.orientation === 'landscape'
                          ? 'bg-[#185abd] text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-slate-500">Size:</span>
                    <select
                      value={pageSetup.size}
                      onChange={(e) => onUpdatePageSetup({ size: e.target.value as PageSize })}
                      className="h-6 px-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 outline-hidden"
                    >
                      <option value="letter">Letter (8.5 × 11 in)</option>
                      <option value="a4">A4 (210 × 297 mm)</option>
                      <option value="legal">Legal (8.5 × 14 in)</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Paper Setup</div>
              </div>
            </>
          )}

          {/* REFERENCES TAB */}
          {activeTab === 'references' && (
            <>
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onFormatCommand('insertTOC')}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Generate Table of Contents from Headings"
                  >
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] mt-0.5">Table of Contents</span>
                  </button>
                  <button
                    onClick={() => onFormatCommand('insertFootnote')}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Insert Footnote at Bottom of Page"
                  >
                    <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-[10px] mt-0.5">Insert Footnote</span>
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Citations & Notes</div>
              </div>
            </>
          )}

          {/* REVIEW TAB */}
          {activeTab === 'review' && (
            <>
              {/* Proofing */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenAiDrawer('proofread')}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Run AI Proofreader & Grammar Checker"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[10px] mt-0.5">Spelling & Grammar</span>
                  </button>
                  <button
                    onClick={onOpenWordCountModal}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Word Count & Statistics (Ctrl+Shift+C)"
                  >
                    <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] mt-0.5">Word Count</span>
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Proofing</div>
              </div>

              {/* Speech */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={onReadAloud}
                    className={`flex flex-col items-center p-1.5 rounded transition-colors ${
                      isReadingAloud
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 animate-pulse'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                    title="Listen to Document Speech"
                  >
                    <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] mt-0.5">{isReadingAloud ? 'Reading...' : 'Read Aloud'}</span>
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Speech</div>
              </div>

              {/* Tracking */}
              <div className="flex flex-col justify-between shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={onToggleTrackChanges}
                    className={`flex flex-col items-center p-1.5 rounded transition-colors ${
                      trackChangesActive
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 font-semibold border border-amber-300'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                    title="Track additions and deletions"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] mt-0.5">
                      {trackChangesActive ? 'Tracking: ON' : 'Track Changes'}
                    </span>
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Tracking</div>
              </div>
            </>
          )}

          {/* VIEW TAB */}
          {activeTab === 'view' && (
            <>
              {/* Show / Hide */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.rulerVisible}
                      onChange={(e) => onUpdatePreferences({ rulerVisible: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span className="text-xs">Ruler</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.darkCanvas}
                      onChange={(e) => onUpdatePreferences({ darkCanvas: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span className="text-xs">Dark Canvas Mode</span>
                  </label>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Show</div>
              </div>

              {/* Zoom */}
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onZoomChange(100)}
                    className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs"
                    title="Reset Zoom to 100%"
                  >
                    100%
                  </button>
                  <button
                    onClick={() => onZoomChange(Math.max(50, zoomLevel - 10))}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Zoom Out"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-medium w-9 text-center">{zoomLevel}%</span>
                  <button
                    onClick={() => onZoomChange(Math.min(200, zoomLevel + 10))}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Zoom In"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Zoom</div>
              </div>
            </>
          )}

          {/* AI COPILOT TAB */}
          {activeTab === 'ai' && (
            <>
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenAiDrawer('proofread')}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Analyze and fix grammar & style"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[10px] mt-0.5">Proofread & Polish</span>
                  </button>
                  <button
                    onClick={() => onOpenAiDrawer('rewrite')}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Change tone to Executive, Academic, or Casual"
                  >
                    <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] mt-0.5">Rewrite Tone</span>
                  </button>
                  <button
                    onClick={() => onOpenAiDrawer('summarize')}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Summarize document into executive points"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] mt-0.5">Auto-Summarize</span>
                  </button>
                  <button
                    onClick={() => onOpenAiDrawer('draft')}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Draft new section from a prompt"
                  >
                    <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-[10px] mt-0.5">Draft Section</span>
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Gemini Copilot Writing Suite</div>
              </div>
            </>
          )}

          {/* HELP TAB */}
          {activeTab === 'help' && (
            <>
              <div className="flex flex-col justify-between pr-2 border-r border-slate-300 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={onOpenShortcutsModal}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="Customize Keyboard Shortcuts"
                  >
                    <Keyboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] mt-0.5">Keyboard Shortcuts</span>
                  </button>
                  <button
                    onClick={() => {
                      alert('Word Desktop v2.4\nFull-featured desktop Word processor built with offline-first sync, real-time collaboration, and Gemini AI writing assistant.');
                    }}
                    className="flex flex-col items-center p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
                    title="About Word Desktop"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] mt-0.5">About</span>
                  </button>
                </div>
                <div className="text-[10px] text-center text-slate-400 tracking-tight">Assistance</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
