import React, { useState } from 'react';
import {
  ArrowLeft,
  Info,
  FilePlus,
  FolderOpen,
  Save,
  Download,
  Printer,
  Share2,
  Settings,
  X,
  FileText,
  FileCode,
  FileCheck,
  Clock,
  User,
  HardDrive,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';
import { DocumentStats, UserPreferences, PageSetup } from '../types/word';

interface BackstageProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  onDocumentTitleChange: (newTitle: string) => void;
  documentContent: string;
  stats: DocumentStats;
  lastSavedText: string;
  onSave: () => void;
  onNewDocument: (templateType?: string) => void;
  onOpenDocument: (docId: string) => void;
  cloudDocuments: Array<{
    id: string;
    title: string;
    lastModified: string;
    version: number;
    collaboratorCount: number;
  }>;
  onExportDocx: () => void;
  onExportPdf: () => void;
  onExportMarkdown: () => void;
  onExportHtml: () => void;
  onExportPlainText: () => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preferences: UserPreferences;
  onUpdatePreferences: (pref: Partial<UserPreferences>) => void;
  onOpenShortcutsModal: () => void;
  pageSetup: PageSetup;
}

export const Backstage: React.FC<BackstageProps> = ({
  isOpen,
  onClose,
  documentTitle,
  onDocumentTitleChange,
  documentContent,
  stats,
  lastSavedText,
  onSave,
  onNewDocument,
  onOpenDocument,
  cloudDocuments,
  onExportDocx,
  onExportPdf,
  onExportMarkdown,
  onExportHtml,
  onExportPlainText,
  onImportFile,
  preferences,
  onUpdatePreferences,
  onOpenShortcutsModal,
  pageSetup,
}) => {
  const [activeBackstageTab, setActiveBackstageTab] = useState<
    'info' | 'new' | 'open' | 'save' | 'saveas' | 'export' | 'print' | 'share' | 'options'
  >('info');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const templates = [
    {
      id: 'blank',
      name: 'Blank Document',
      description: 'Start from a pristine blank canvas with default Aptos typography.',
    },
    {
      id: 'proposal',
      name: 'Executive Business Proposal',
      description: 'Polished proposal with executive summary, deliverables, and timeline table.',
    },
    {
      id: 'spec',
      name: 'Technical Architecture Spec',
      description: 'Engineering design specification with system diagrams and code blocks.',
    },
    {
      id: 'minutes',
      name: 'Meeting Minutes & Action Items',
      description: 'Structured agenda, attendee list, key decisions, and assigned tasks.',
    },
    {
      id: 'research',
      name: 'Academic Research Article',
      description: 'Formal manuscript with abstract, citations, bibliography, and footnotes.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
      {/* Left Navigation Bar (Word Blue) */}
      <div className="w-56 bg-[#185abd] text-white flex flex-col justify-between py-4 shadow-2xl shrink-0 select-none">
        <div>
          {/* Back button */}
          <div className="px-4 pb-4 mb-2 border-b border-blue-400/30 flex items-center justify-between">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-blue-700/80 hover:bg-white hover:text-[#185abd] flex items-center justify-center transition-colors shadow-sm"
              title="Return to Document (Esc)"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-sm tracking-wide">File Menu</span>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-0.5 px-2 text-xs font-medium">
            <button
              onClick={() => setActiveBackstageTab('info')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeBackstageTab === 'info' ? 'bg-white text-[#185abd] font-semibold shadow-xs' : 'hover:bg-blue-700/60'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Info</span>
            </button>
            <button
              onClick={() => setActiveBackstageTab('new')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeBackstageTab === 'new' ? 'bg-white text-[#185abd] font-semibold shadow-xs' : 'hover:bg-blue-700/60'
              }`}
            >
              <FilePlus className="w-4 h-4" />
              <span>New</span>
            </button>
            <button
              onClick={() => setActiveBackstageTab('open')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeBackstageTab === 'open' ? 'bg-white text-[#185abd] font-semibold shadow-xs' : 'hover:bg-blue-700/60'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Open</span>
            </button>
            <button
              onClick={() => {
                onSave();
                onClose();
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded hover:bg-blue-700/60 transition-colors text-left"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => setActiveBackstageTab('saveas')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeBackstageTab === 'saveas' ? 'bg-white text-[#185abd] font-semibold shadow-xs' : 'hover:bg-blue-700/60'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Save As</span>
            </button>
            <button
              onClick={() => setActiveBackstageTab('print')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeBackstageTab === 'print' ? 'bg-white text-[#185abd] font-semibold shadow-xs' : 'hover:bg-blue-700/60'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={() => setActiveBackstageTab('share')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeBackstageTab === 'share' ? 'bg-white text-[#185abd] font-semibold shadow-xs' : 'hover:bg-blue-700/60'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={() => setActiveBackstageTab('export')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                activeBackstageTab === 'export' ? 'bg-white text-[#185abd] font-semibold shadow-xs' : 'hover:bg-blue-700/60'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </nav>
        </div>

        {/* Bottom Options & Close */}
        <div className="px-2 pt-4 border-t border-blue-400/30 flex flex-col gap-1 text-xs">
          <button
            onClick={() => setActiveBackstageTab('options')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
              activeBackstageTab === 'options' ? 'bg-white text-[#185abd] font-semibold shadow-xs' : 'hover:bg-blue-700/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Options & Shortcuts</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2.5 px-3 py-2 rounded hover:bg-blue-700/60 transition-colors text-left"
          >
            <X className="w-4 h-4" />
            <span>Close File Menu</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 overflow-y-auto p-8">
        {/* INFO TAB */}
        {activeBackstageTab === 'info' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Document Information</h2>
              <p className="text-xs text-slate-500 mt-1">
                Metadata, properties, revision history, and cloud synchronization status.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Properties Card */}
              <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 border-b pb-2">
                  Document Properties
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">File Name:</span>
                    <span className="font-medium">{documentTitle}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Words:</span>
                    <span className="font-medium">{stats.words.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Characters:</span>
                    <span className="font-medium">{stats.characters.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Estimated Pages:</span>
                    <span className="font-medium">{stats.pages}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Reading Time:</span>
                    <span className="font-medium">~{stats.readingTimeMinutes} min</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Last Synchronized:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {lastSavedText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Versioning & Authors */}
              <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 border-b pb-2">
                  Related People & Collaboration
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      YOU
                    </div>
                    <div>
                      <div className="font-medium">Current User (You)</div>
                      <div className="text-slate-500 text-[11px]">Primary Author & Editor</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      SC
                    </div>
                    <div>
                      <div className="font-medium">Sarah Chen</div>
                      <div className="text-slate-500 text-[11px]">Co-author (Online)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                      AR
                    </div>
                    <div>
                      <div className="font-medium">Alex Rivera</div>
                      <div className="text-slate-500 text-[11px]">Reviewer (Online)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NEW TAB */}
        {activeBackstageTab === 'new' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Document</h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose a pre-configured template or start with a blank document.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => {
                    onNewDocument(tpl.id);
                    onClose();
                  }}
                  className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-800 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-12 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-400 transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {tpl.name}
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">{tpl.description}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-700 text-right">
                    <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                      Create Document →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OPEN TAB */}
        {activeBackstageTab === 'open' && (
          <div className="max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Open Document</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Access your cloud synchronization storage or open files from your local device.
                </p>
              </div>

              {/* Local File Upload Button */}
              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[#185abd] text-white text-xs font-medium rounded hover:bg-[#114999] cursor-pointer shadow-xs transition-colors">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Upload From Computer</span>
                <input
                  type="file"
                  accept=".docx,.html,.htm,.md,.txt"
                  onChange={(e) => {
                    onImportFile(e);
                    onClose();
                  }}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-500 flex justify-between">
                <span>DOCUMENT TITLE</span>
                <span>LAST MODIFIED / TEAM</span>
              </div>

              {cloudDocuments.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No cloud documents found.
                </div>
              ) : (
                cloudDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      onOpenDocument(doc.id);
                      onClose();
                    }}
                    className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center justify-between transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100">
                          {doc.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Version {doc.version} · Cloud Synced
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-slate-500 text-[11px]">
                      <div>{new Date(doc.lastModified).toLocaleDateString()}</div>
                      <div className="text-blue-600 dark:text-blue-400 font-medium">
                        {doc.collaboratorCount} collaborators
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SAVE AS TAB */}
        {activeBackstageTab === 'saveas' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Save As</h2>
              <p className="text-xs text-slate-500 mt-1">
                Save a copy of this document with a new name or download directly.
              </p>
            </div>

            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-lg space-y-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Document File Name:
              </label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => onDocumentTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800 outline-hidden focus:border-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onSave();
                    onClose();
                  }}
                  className="px-4 py-2 bg-[#185abd] text-white text-xs font-medium rounded hover:bg-[#114999] transition-colors"
                >
                  Save to Cloud
                </button>
                <button
                  onClick={onExportDocx}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-medium rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Download .docx to Computer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EXPORT TAB */}
        {activeBackstageTab === 'export' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Export Document</h2>
              <p className="text-xs text-slate-500 mt-1">
                Generate production-ready exports across PDF, Microsoft Word DOCX, and Markdown formats.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PDF Export */}
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-800 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
                    <Printer className="w-5 h-5" />
                    <span>Create PDF Document</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Preserves exact layouts, fonts, margins, and vector pagination for professional publishing or printing.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onExportPdf();
                  }}
                  className="mt-4 w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded transition-colors"
                >
                  Export to PDF (Print Dialog)
                </button>
              </div>

              {/* DOCX Export */}
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-800 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                    <FileCheck className="w-5 h-5" />
                    <span>Microsoft Word (.docx)</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Generates authentic .docx binary package compatible with Microsoft 365, Word Desktop, and Google Docs.
                  </p>
                </div>
                <button
                  onClick={onExportDocx}
                  className="mt-4 w-full py-1.5 bg-[#185abd] hover:bg-[#114999] text-white font-medium text-xs rounded transition-colors"
                >
                  Download DOCX Document
                </button>
              </div>

              {/* Markdown Export */}
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-800 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                    <FileCode className="w-5 h-5" />
                    <span>Markdown Format (.md)</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Clean, structured markdown with headings, bold/italics, tables, and bullet lists for developers and documentation.
                  </p>
                </div>
                <button
                  onClick={onExportMarkdown}
                  className="mt-4 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded transition-colors"
                >
                  Download Markdown (.md)
                </button>
              </div>

              {/* Web Page HTML Export */}
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-800 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                    <HardDrive className="w-5 h-5" />
                    <span>Web Page (.html)</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Self-contained HTML package viewable in any modern web browser.
                  </p>
                </div>
                <button
                  onClick={onExportHtml}
                  className="mt-4 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded transition-colors"
                >
                  Download Web Page (.html)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRINT TAB */}
        {activeBackstageTab === 'print' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Print Document</h2>
              <p className="text-xs text-slate-500 mt-1">
                Preview your document before sending to printer or saving as PDF.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <button
                  onClick={() => {
                    onClose();
                    onExportPdf();
                  }}
                  className="w-full py-2.5 bg-[#185abd] text-white font-semibold text-sm rounded shadow-xs hover:bg-[#114999] transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>

                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3 text-xs">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Settings</h4>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Orientation:</span>
                    <span className="capitalize font-medium">{pageSetup.orientation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Paper Size:</span>
                    <span className="uppercase font-medium">{pageSetup.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Margins:</span>
                    <span className="capitalize font-medium">{pageSetup.margins}</span>
                  </div>
                </div>
              </div>

              {/* Visual preview */}
              <div className="md:col-span-2 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-center items-center">
                <div className="w-64 h-80 bg-white dark:bg-slate-800 shadow-md p-4 text-[7px] text-slate-400 overflow-hidden leading-tight border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-[9px] text-slate-700 dark:text-slate-200 mb-2 truncate">
                    {documentTitle}
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: documentContent.slice(0, 400) }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SHARE TAB */}
        {activeBackstageTab === 'share' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Share & Collaborate</h2>
              <p className="text-xs text-slate-500 mt-1">
                Invite team members to co-author in real time with synchronized presence and comments.
              </p>
            </div>

            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-lg space-y-4">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Shareable Link for Team Project:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="flex-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 outline-hidden font-mono"
                />
                <button
                  onClick={copyShareLink}
                  className="px-3 py-1.5 bg-[#185abd] text-white text-xs font-medium rounded hover:bg-[#114999] transition-colors flex items-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                Anyone with this link can view and edit with real-time cursor presence, comments, and revisions.
              </div>
            </div>
          </div>
        )}

        {/* OPTIONS TAB */}
        {activeBackstageTab === 'options' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Word Preferences & Customization</h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure auto-save intervals, display preferences, and keyboard hotkeys.
              </p>
            </div>

            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-lg space-y-4 text-xs">
              <h3 className="font-semibold text-sm border-b pb-2">Save & Synchronization Options</h3>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    Auto-Save Interval
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    How frequently documents automatically sync changes offline and to the cloud
                  </div>
                </div>
                <select
                  value={preferences.autoSaveIntervalSeconds}
                  onChange={(e) =>
                    onUpdatePreferences({ autoSaveIntervalSeconds: Number(e.target.value) })
                  }
                  className="px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                >
                  <option value={5}>Every 5 seconds</option>
                  <option value={15}>Every 15 seconds</option>
                  <option value={30}>Every 30 seconds</option>
                  <option value={60}>Every 1 minute</option>
                  <option value={0}>Manual Save Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    Team Collaborator Simulation
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Simulate real-time teammate cursor presence for testing co-authoring
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.collaboratorSimulation}
                  onChange={(e) =>
                    onUpdatePreferences({ collaboratorSimulation: e.target.checked })
                  }
                  className="rounded text-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    Customizable Keyboard Shortcuts
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Remap formatting, navigation, and editing hotkeys to your liking
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenShortcutsModal();
                  }}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-medium rounded hover:bg-blue-100 transition-colors border border-blue-200 dark:border-blue-800"
                >
                  Configure Shortcuts
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
