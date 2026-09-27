/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RibbonTab,
  ViewMode,
  PageSetup,
  UserPreferences,
  Collaborator,
  Comment,
  ShortcutConfig,
} from './types/word';
import { DEFAULT_SHORTCUTS, matchesShortcut } from './utils/shortcuts';
import { calculateDocumentStats } from './utils/documentStats';
import {
  exportToDocx,
  exportToMarkdown,
  exportToPDF,
  exportToHTML,
  exportToPlainText,
  importFileToHTML,
} from './utils/docxExport';
import { TitleBar } from './components/TitleBar';
import { Ribbon } from './components/Ribbon';
import { DocumentCanvas } from './components/DocumentCanvas';
import { StatusBar } from './components/StatusBar';
import { Backstage } from './components/Backstage';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { CommentsPanel } from './components/CommentsPanel';
import { CustomShortcutsModal } from './components/CustomShortcutsModal';
import { FindReplaceModal } from './components/FindReplaceModal';
import { TableModal } from './components/TableModal';
import { ShareModal } from './components/ShareModal';
import { WordCountModal } from './components/WordCountModal';

const INITIAL_CONTENT = `<h1>Executive Summary: Q3 Strategic Growth Plan</h1>
<p>This document details our cross-functional expansion strategy for Q3 2026. Over the prior fiscal quarters, our team achieved an annualized growth rate of <strong>34.2%</strong> across major enterprise divisions. To maintain this momentum, we are focusing on three foundational vectors: <em>automated intelligence</em>, <em>collaborative workflows</em>, and <em>frictionless infrastructure</em>.</p>
<h2>1. Market Analysis & Target Segments</h2>
<p>The global demand for high-fidelity document collaboration and desktop-grade productivity suites has accelerated significantly. Modern teams require native speed, responsive pagination, uninterrupted offline resilience, and granular revision tracking.</p>
<blockquote>"Excellence is never an accident; it is always the result of high intention, sincere effort, and intelligent execution."</blockquote>
<h2>2. Strategic Deliverables</h2>
<ul>
  <li><strong>Synchronous Co-Authoring:</strong> Low-latency multi-user presence indicators, inline cursor rendering, and comment resolution threads.</li>
  <li><strong>Universal Compatibility:</strong> Ensure high-fidelity export pathways for DOCX, vector PDF, and structured Markdown.</li>
  <li><strong>AI Writing Copilot:</strong> Contextual grammar, tone refinement, and automated executive summary generation.</li>
</ul>
<h2>3. Key Milestones & Timeline</h2>
<table style="width: 100%; border-collapse: collapse; margin-top: 1rem; margin-bottom: 1rem;">
  <thead>
    <tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
      <th style="padding: 8px 12px; text-align: left; font-weight: 600;">Phase</th>
      <th style="padding: 8px 12px; text-align: left; font-weight: 600;">Core Objective</th>
      <th style="padding: 8px 12px; text-align: left; font-weight: 600;">Target Lead</th>
      <th style="padding: 8px 12px; text-align: left; font-weight: 600;">Target Date</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px 12px;">Alpha Rollout</td>
      <td style="padding: 8px 12px;">Ribbon UI & Local Storage Sync</td>
      <td style="padding: 8px 12px;">Sarah Chen</td>
      <td style="padding: 8px 12px;">July 15</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 8px 12px;">Beta Polish</td>
      <td style="padding: 8px 12px;">Live Multi-User Cursors & AI Proofing</td>
      <td style="padding: 8px 12px;">Alex Rivera</td>
      <td style="padding: 8px 12px;">August 04</td>
    </tr>
    <tr>
      <td style="padding: 8px 12px;">Global Launch</td>
      <td style="padding: 8px 12px;">DOCX Export & Custom Keymaps</td>
      <td style="padding: 8px 12px;">Marcus Vance</td>
      <td style="padding: 8px 12px;">September 01</td>
    </tr>
  </tbody>
</table>
<h2>4. Financial Projections & Resource Allocation</h2>
<p>Total allocated budget across engineering, product design, and compliance verification stands at $1.45M. We anticipate reaching full break-even within 5.2 months post general availability.</p>`;

const DEFAULT_COLLABORATORS: Collaborator[] = [
  {
    id: 'user-you',
    name: 'You (Author)',
    email: 'author@company.org',
    color: '#185abd',
    status: 'active',
    avatar: 'YOU',
    role: 'owner',
  },
  {
    id: 'user-sarah',
    name: 'Sarah Chen',
    email: 'sarah.chen@innovate.co',
    color: '#2563eb',
    status: 'active',
    avatar: 'SC',
    role: 'editor',
  },
  {
    id: 'user-alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@innovate.co',
    color: '#059669',
    status: 'active',
    avatar: 'AR',
    role: 'editor',
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    email: 'marcus.v@innovate.co',
    color: '#d97706',
    status: 'idle',
    avatar: 'MV',
    role: 'viewer',
  },
];

export default function App() {
  // Document Core State
  const [docId, setDocId] = useState<string>('doc-q3-strategy');
  const [title, setTitle] = useState<string>('Enterprise Q3 Strategic Growth Plan.docx');
  const [content, setContent] = useState<string>(() => {
    return localStorage.getItem('word_content_doc-q3-strategy') || INITIAL_CONTENT;
  });
  const [collaborators, setCollaborators] = useState<Collaborator[]>(DEFAULT_COLLABORATORS);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c-1',
      author: 'Sarah Chen',
      avatar: 'SC',
      color: '#2563eb',
      text: 'Should we specify the exact encryption standard for the cloud synchronization layer here?',
      highlightedText: 'collaborative workflows',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      resolved: false,
      replies: [
        {
          id: 'r-1',
          author: 'Alex Rivera',
          text: 'Good point. Let us mention AES-256 for offline storage and TLS 1.3 in transit.',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ],
    },
  ]);
  const [cloudDocuments, setCloudDocuments] = useState<any[]>([]);

  // Sync & Offline State
  const [isSaving, setIsSaving] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  // UI & Formatting State
  const [activeTab, setActiveTab] = useState<RibbonTab>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('print');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeFont, setActiveFont] = useState<string>('Aptos, sans-serif');
  const [activeFontSize, setActiveFontSize] = useState<string>('11');
  const [drawTool, setDrawTool] = useState<'pen' | 'highlighter' | 'eraser' | null>(null);
  const [drawColor, setDrawColor] = useState<string>('#2563eb');
  const [trackChangesActive, setTrackChangesActive] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  // Modals & Panels State
  const [isBackstageOpen, setIsBackstageOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [aiDrawerMode, setAiDrawerMode] = useState('proofread');
  const [isCommentsPanelOpen, setIsCommentsPanelOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isFindReplaceModalOpen, setIsFindReplaceModalOpen] = useState(false);
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isWordCountModalOpen, setIsWordCountModalOpen] = useState(false);

  // User Preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('word_preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      autoSaveIntervalSeconds: 5,
      rulerVisible: true,
      rulerUnit: 'inches',
      darkUI: false,
      darkCanvas: false,
      ribbonCollapsed: false,
      defaultFont: 'Aptos, sans-serif',
      defaultFontSize: 11,
      showWordCountInStatus: true,
      collaboratorSimulation: true,
    };
  });

  // Page Setup
  const [pageSetup, setPageSetup] = useState<PageSetup>({
    size: 'letter',
    orientation: 'portrait',
    margins: 'normal',
    customMargins: { top: 1, bottom: 1, left: 1, right: 1 },
    columns: 1,
  });

  // Shortcuts
  const [shortcuts, setShortcuts] = useState<ShortcutConfig[]>(() => {
    const saved = localStorage.getItem('word_shortcuts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_SHORTCUTS;
  });

  const editorRef = useRef<HTMLDivElement | null>(null);

  // Update HTML body theme based on darkUI preference
  useEffect(() => {
    if (preferences.darkUI) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('word_preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Save shortcuts to storage
  useEffect(() => {
    localStorage.setItem('word_shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  // Online / Offline Detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch Cloud Documents list
  const fetchCloudDocuments = useCallback(async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setCloudDocuments(data);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchCloudDocuments();
  }, [fetchCloudDocuments]);

  // Document Auto-Save Logic (Local + Cloud)
  const saveDocument = useCallback(async () => {
    setIsSaving(true);
    // 1. Save locally in localStorage for 100% offline persistence
    localStorage.setItem(`word_content_${docId}`, content);
    localStorage.setItem(`word_title_${docId}`, title);

    // 2. Sync to cloud server if online
    if (navigator.onLine) {
      try {
        await fetch(`/api/documents/${docId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            content,
            author: 'Current User',
            versionSummary: `Saved at ${new Date().toLocaleTimeString()}`,
          }),
        });
      } catch (err) {
        console.warn('Cloud sync error, kept in local offline storage:', err);
      }
    }

    setLastSaved(new Date());
    setTimeout(() => setIsSaving(false), 300);
  }, [content, title, docId]);

  // Auto-Save interval timer
  useEffect(() => {
    if (preferences.autoSaveIntervalSeconds <= 0) return;
    const interval = setInterval(() => {
      saveDocument();
    }, preferences.autoSaveIntervalSeconds * 1000);
    return () => clearInterval(interval);
  }, [preferences.autoSaveIntervalSeconds, saveDocument]);

  // Simulated Collaborators Presence (Real-time team feel)
  useEffect(() => {
    if (!preferences.collaboratorSimulation) return;
    const interval = setInterval(() => {
      setCollaborators((prev) =>
        prev.map((c) => {
          if (c.id === 'user-you') return c;
          const statuses: Array<'active' | 'idle'> = ['active', 'active', 'idle'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return {
            ...c,
            status: newStatus,
            cursorPosition: Math.floor(Math.random() * 800),
          };
        })
      );
    }, 12000);
    return () => clearInterval(interval);
  }, [preferences.collaboratorSimulation]);

  // Editor Command Dispatcher
  const handleFormatCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }

    if (command === 'insertPageBreak') {
      document.execCommand(
        'insertHTML',
        false,
        `<div style="page-break-after: always; height: 16px; border-bottom: 2px dashed #94a3b8; margin: 32px 0; text-align: center; color: #94a3b8; font-size: 10px; user-select: none;">--- Page Break ---</div><p><br/></p>`
      );
    } else if (command === 'insertCoverPage') {
      const coverHtml = `<div style="text-align: center; padding: 120px 20px 80px; border-bottom: 2px solid #e2e8f0; margin-bottom: 40px;">
        <h1 style="font-size: 36px; font-weight: 800; color: #1e293b; margin-bottom: 16px;">${title.replace(/\.[^/.]+$/, '')}</h1>
        <p style="font-size: 18px; color: #64748b; margin-bottom: 48px;">Comprehensive Project Proposal & Strategic Execution Plan</p>
        <p style="font-size: 14px; font-weight: 600; color: #185abd;">Enterprise Strategy Group</p>
        <p style="font-size: 12px; color: #94a3b8;">${new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
      </div><p><br/></p>`;
      document.execCommand('insertHTML', false, coverHtml);
    } else if (command === 'insertDate') {
      const dateStr = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      document.execCommand('insertText', false, dateStr);
    } else if (command === 'insertCallout') {
      document.execCommand(
        'insertHTML',
        false,
        `<div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 16px 0; border-radius: 4px;"><strong>Note:</strong> Enter important callout details or advisory warnings here.</div><p><br/></p>`
      );
    } else if (command === 'insertTOC') {
      // Generate real Table of Contents by scanning headings
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const headings = Array.from(doc.querySelectorAll('h1, h2, h3'));
      let tocHtml = `<div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 16px 20px; margin: 24px 0;"><h3 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">Table of Contents</h3><ul style="list-style-type: none; padding-left: 0; margin-bottom: 0;">`;
      headings.forEach((h, i) => {
        const tag = h.tagName.toLowerCase();
        const indent = tag === 'h1' ? '0px' : tag === 'h2' ? '16px' : '32px';
        const weight = tag === 'h1' ? '600' : 'normal';
        tocHtml += `<li style="padding-left: ${indent}; font-weight: ${weight}; margin-bottom: 6px; display: flex; justify-content: space-between;"><span style="color: #185abd;">${h.textContent}</span><span style="color: #94a3b8;">${i + 1}</span></li>`;
      });
      tocHtml += `</ul></div><p><br/></p>`;
      document.execCommand('insertHTML', false, tocHtml);
    } else if (command === 'insertFootnote') {
      document.execCommand('insertHTML', false, `<sup>[1]</sup>`);
    } else if (command === 'lineSpacing') {
      if (editorRef.current) {
        editorRef.current.style.lineHeight = value || '1.5';
      }
    } else {
      document.execCommand(command, false, value);
    }

    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Find matching custom shortcut
      for (const sc of shortcuts) {
        if (matchesShortcut(e, sc.keyCombo)) {
          e.preventDefault();
          switch (sc.id) {
            case 'save':
              saveDocument();
              break;
            case 'print':
              exportToPDF();
              break;
            case 'bold':
              handleFormatCommand('bold');
              break;
            case 'italic':
              handleFormatCommand('italic');
              break;
            case 'underline':
              handleFormatCommand('underline');
              break;
            case 'strikethrough':
              handleFormatCommand('strikethrough');
              break;
            case 'heading1':
              handleFormatCommand('formatBlock', '<h1>');
              break;
            case 'heading2':
              handleFormatCommand('formatBlock', '<h2>');
              break;
            case 'heading3':
              handleFormatCommand('formatBlock', '<h3>');
              break;
            case 'alignLeft':
              handleFormatCommand('justifyLeft');
              break;
            case 'alignCenter':
              handleFormatCommand('justifyCenter');
              break;
            case 'alignRight':
              handleFormatCommand('justifyRight');
              break;
            case 'find':
              setIsReplaceMode(false);
              setIsFindReplaceModalOpen(true);
              break;
            case 'replace':
              setIsReplaceMode(true);
              setIsFindReplaceModalOpen(true);
              break;
            case 'aiAssistant':
              setIsAiDrawerOpen(true);
              break;
            case 'addComment':
              setIsCommentsPanelOpen(true);
              break;
            case 'toggleRibbon':
              setPreferences((p) => ({ ...p, ribbonCollapsed: !p.ribbonCollapsed }));
              break;
            case 'wordCount':
              setIsWordCountModalOpen(true);
              break;
          }
          return;
        }
      }

      // Escape key closes modals
      if (e.key === 'Escape') {
        setIsBackstageOpen(false);
        setIsAiDrawerOpen(false);
        setIsCommentsPanelOpen(false);
        setIsShortcutsModalOpen(false);
        setIsFindReplaceModalOpen(false);
        setIsTableModalOpen(false);
        setIsShareModalOpen(false);
        setIsWordCountModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, saveDocument]);

  // Read Aloud (Text to Speech)
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isReadingAloud) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const textToRead = doc.body.textContent || '';
    if (!textToRead.trim()) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.onend = () => setIsReadingAloud(false);
    utterance.onerror = () => setIsReadingAloud(false);

    window.speechSynthesis.speak(utterance);
    setIsReadingAloud(true);
  };

  // Find & Replace Handlers
  const handleFind = (query: string, matchCase: boolean): number => {
    if (!query) return 0;
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    const matches = content.match(regex);
    return matches ? matches.length : 0;
  };

  const handleReplace = (query: string, replacement: string, matchCase: boolean) => {
    if (!query) return;
    const flags = matchCase ? '' : 'i';
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    const updated = content.replace(regex, replacement);
    setContent(updated);
  };

  const handleReplaceAll = (query: string, replacement: string, matchCase: boolean): number => {
    if (!query) return 0;
    const flags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;
    if (count > 0) {
      const updated = content.replace(regex, replacement);
      setContent(updated);
    }
    return count;
  };

  // Table Insertion
  const handleInsertTable = (rows: number, cols: number, hasHeader: boolean) => {
    let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 16px 0;">`;
    if (hasHeader) {
      tableHtml += `<thead><tr style="background-color: #f1f5f9; border-bottom: 2px solid #cbd5e1;">`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<th style="border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-weight: 600;">Header ${c}</th>`;
      }
      tableHtml += `</tr></thead>`;
    }
    tableHtml += `<tbody>`;
    for (let r = 1; r <= rows; r++) {
      tableHtml += `<tr>`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<td style="border: 1px solid #cbd5e1; padding: 8px 12px;">Cell ${r},${c}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table><p><br/></p>`;
    handleFormatCommand('insertHTML', tableHtml);
  };

  // AI Suggestions Handler
  const handleApplyAISuggestion = (original: string, replacement: string) => {
    const updated = content.replace(original, replacement);
    setContent(updated);
  };

  const handleInsertAIContent = (htmlToInsert: string) => {
    handleFormatCommand('insertHTML', htmlToInsert);
  };

  // New Document from template
  const handleNewDocument = (templateType = 'blank') => {
    let newContent = '<h1>Untitled Document</h1><p>Start typing your content here...</p>';
    let newTitle = 'Untitled Document.docx';

    if (templateType === 'proposal') {
      newContent = INITIAL_CONTENT;
      newTitle = 'Business Strategic Proposal.docx';
    } else if (templateType === 'spec') {
      newContent = `<h1>System Architecture Specification</h1><p><strong>Status:</strong> Approved</p><hr/><h2>1. Overview</h2><p>This document specifies technical architecture, distributed data sync, and service pipelines.</p><h2>2. Components</h2><ul><li>Vite React Engine</li><li>Express Server with Gemini API</li><li>Offline-first LocalStorage persistence</li></ul>`;
      newTitle = 'Architecture Specification.docx';
    } else if (templateType === 'minutes') {
      newContent = `<h1>Meeting Minutes & Key Action Items</h1><p><strong>Date:</strong> ${new Date().toLocaleDateString()} | <strong>Attendees:</strong> Sarah Chen, Alex Rivera, Marcus Vance</p><hr/><h2>Agenda</h2><p>Review Q3 deliverables and milestone approvals.</p><h2>Action Items</h2><ul><li>Finalize DOCX and PDF export configurations</li><li>Run comprehensive AI proofreading check</li></ul>`;
      newTitle = 'Team Meeting Minutes.docx';
    } else if (templateType === 'research') {
      newContent = `<h1>Empirical Evaluation of Offline-First Collaborative Editors</h1><p><em>Abstract:</em> This study investigates state synchronization and low-latency cursor rendering across distributed teams.</p><h2>Introduction</h2><p>Document productivity tools must bridge native desktop performance with real-time web capabilities.</p>`;
      newTitle = 'Research Paper Draft.docx';
    }

    setDocId(`doc-${Date.now()}`);
    setTitle(newTitle);
    setContent(newContent);
  };

  // Open Document from Cloud
  const handleOpenDocument = async (selectedDocId: string) => {
    try {
      const res = await fetch(`/api/documents/${selectedDocId}`);
      if (res.ok) {
        const doc = await res.json();
        setDocId(doc.id);
        setTitle(doc.title);
        setContent(doc.content);
        if (doc.collaborators) setCollaborators(doc.collaborators);
        if (doc.comments) setComments(doc.comments);
      }
    } catch (e) {
      console.error('Failed to open document:', e);
    }
  };

  // File Import handler
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { title: importedTitle, html } = await importFileToHTML(file);
      setTitle(importedTitle);
      setContent(html);
    } catch (err) {
      alert('Failed to read uploaded file.');
    }
  };

  // Quick Action Search handler
  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'export-pdf':
        exportToPDF();
        break;
      case 'export-docx':
        exportToDocx(content, title);
        break;
      case 'export-md':
        exportToMarkdown(content, title);
        break;
      case 'proofread':
        setAiDrawerMode('proofread');
        setIsAiDrawerOpen(true);
        break;
      case 'summarize':
        setAiDrawerMode('summarize');
        setIsAiDrawerOpen(true);
        break;
      case 'insert-table':
        setIsTableModalOpen(true);
        break;
      case 'insert-page-break':
        handleFormatCommand('insertPageBreak');
        break;
      case 'shortcuts':
        setIsShortcutsModalOpen(true);
        break;
      case 'dark-canvas':
        setPreferences((p) => ({ ...p, darkCanvas: !p.darkCanvas }));
        break;
    }
  };

  const stats = calculateDocumentStats(content);
  const lastSavedText = lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={`h-screen w-screen flex flex-col overflow-hidden ${
        preferences.darkUI ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
      }`}
    >
      {/* 1. Desktop Title Bar */}
      <TitleBar
        title={title}
        onTitleChange={setTitle}
        isSaving={isSaving}
        isOffline={isOffline}
        lastSavedText={lastSavedText}
        collaborators={collaborators}
        preferences={preferences}
        onUpdatePreferences={(p) => setPreferences((prev) => ({ ...prev, ...p }))}
        onSave={saveDocument}
        onUndo={() => handleFormatCommand('undo')}
        onRedo={() => handleFormatCommand('redo')}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenAiDrawer={() => {
          setAiDrawerMode('proofread');
          setIsAiDrawerOpen(true);
        }}
        onQuickAction={handleQuickAction}
      />

      {/* 2. Ribbon Tabs & Command Bar */}
      <Ribbon
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenFileMenu={() => setIsBackstageOpen(true)}
        pageSetup={pageSetup}
        onUpdatePageSetup={(setup) => setPageSetup((prev) => ({ ...prev, ...setup }))}
        preferences={preferences}
        onUpdatePreferences={(p) => setPreferences((prev) => ({ ...prev, ...p }))}
        onFormatCommand={handleFormatCommand}
        onInsertTableModal={() => setIsTableModalOpen(true)}
        onInsertImageModal={() => {
          const url = prompt('Enter picture URL (or paste image web link):');
          if (url) {
            handleFormatCommand('insertHTML', `<img src="${url}" alt="Document Image" style="max-width: 100%; height: auto; border-radius: 4px; margin: 16px 0;" />`);
          }
        }}
        onInsertLinkModal={() => {
          const url = prompt('Enter link URL (e.g. https://...):');
          if (url) handleFormatCommand('createLink', url);
        }}
        onAddComment={() => setIsCommentsPanelOpen(true)}
        onOpenAiDrawer={(mode) => {
          if (mode) setAiDrawerMode(mode);
          setIsAiDrawerOpen(true);
        }}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        onOpenFindReplaceModal={(isReplace) => {
          setIsReplaceMode(!!isReplace);
          setIsFindReplaceModalOpen(true);
        }}
        onOpenWordCountModal={() => setIsWordCountModalOpen(true)}
        onToggleTrackChanges={() => setTrackChangesActive(!trackChangesActive)}
        trackChangesActive={trackChangesActive}
        onReadAloud={handleReadAloud}
        isReadingAloud={isReadingAloud}
        activeFont={activeFont}
        activeFontSize={activeFontSize}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        drawTool={drawTool}
        onSetDrawTool={setDrawTool}
        drawColor={drawColor}
        onSetDrawColor={setDrawColor}
      />

      {/* 3. Document Canvas Area with Metric Ruler */}
      <DocumentCanvas
        content={content}
        onChange={setContent}
        pageSetup={pageSetup}
        preferences={preferences}
        zoomLevel={zoomLevel}
        collaborators={collaborators}
        comments={comments}
        onSelectComment={() => setIsCommentsPanelOpen(true)}
        editorRef={editorRef}
        drawTool={drawTool}
        drawColor={drawColor}
      />

      {/* 4. Desktop Status Bar */}
      <StatusBar
        stats={stats}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        onOpenWordCountModal={() => setIsWordCountModalOpen(true)}
        hasGrammarIssues={false}
        trackChangesActive={trackChangesActive}
      />

      {/* 5. Fullscreen Backstage Menu */}
      <Backstage
        isOpen={isBackstageOpen}
        onClose={() => setIsBackstageOpen(false)}
        documentTitle={title}
        onDocumentTitleChange={setTitle}
        documentContent={content}
        stats={stats}
        lastSavedText={lastSavedText}
        onSave={saveDocument}
        onNewDocument={handleNewDocument}
        onOpenDocument={handleOpenDocument}
        cloudDocuments={cloudDocuments}
        onExportDocx={() => exportToDocx(content, title)}
        onExportPdf={exportToPDF}
        onExportMarkdown={() => exportToMarkdown(content, title)}
        onExportHtml={() => exportToHTML(content, title)}
        onExportPlainText={() => exportToPlainText(content, title)}
        onImportFile={handleImportFile}
        preferences={preferences}
        onUpdatePreferences={(p) => setPreferences((prev) => ({ ...prev, ...p }))}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        pageSetup={pageSetup}
      />

      {/* 6. AI Assistant Copilot Drawer */}
      <AIAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        documentContent={content}
        onApplySuggestion={handleApplyAISuggestion}
        onInsertContent={handleInsertAIContent}
        initialMode={aiDrawerMode}
      />

      {/* 7. Collaborative Comments Panel */}
      <CommentsPanel
        isOpen={isCommentsPanelOpen}
        onClose={() => setIsCommentsPanelOpen(false)}
        comments={comments}
        onAddComment={(text) => {
          const selection = window.getSelection()?.toString() || '';
          setComments([
            ...comments,
            {
              id: `c-${Date.now()}`,
              author: 'Current User',
              avatar: 'YOU',
              color: '#185abd',
              text,
              highlightedText: selection,
              createdAt: new Date().toISOString(),
              resolved: false,
              replies: [],
            },
          ]);
        }}
        onReplyComment={(commentId, replyText) => {
          setComments(
            comments.map((c) =>
              c.id === commentId
                ? {
                    ...c,
                    replies: [
                      ...c.replies,
                      {
                        id: `r-${Date.now()}`,
                        author: 'Current User',
                        text: replyText,
                        createdAt: new Date().toISOString(),
                      },
                    ],
                  }
                : c
            )
          );
        }}
        onToggleResolve={(commentId) => {
          setComments(
            comments.map((c) =>
              c.id === commentId ? { ...c, resolved: !c.resolved } : c
            )
          );
        }}
      />

      {/* 8. Customizable Keyboard Shortcuts Modal */}
      <CustomShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        shortcuts={shortcuts}
        onUpdateShortcuts={setShortcuts}
      />

      {/* 9. Find & Replace Modal */}
      <FindReplaceModal
        isOpen={isFindReplaceModalOpen}
        onClose={() => setIsFindReplaceModalOpen(false)}
        isReplaceMode={isReplaceMode}
        onFind={handleFind}
        onReplace={handleReplace}
        onReplaceAll={handleReplaceAll}
      />

      {/* 10. Table Insertion Modal */}
      <TableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onInsertTable={handleInsertTable}
      />

      {/* 11. Team Share & Presence Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        documentTitle={title}
        collaborators={collaborators}
        onAddCollaborator={(newCollab) => setCollaborators([...collaborators, newCollab])}
      />

      {/* 12. Word Count Statistics Modal */}
      <WordCountModal
        isOpen={isWordCountModalOpen}
        onClose={() => setIsWordCountModalOpen(false)}
        stats={stats}
      />
    </div>
  );
}
