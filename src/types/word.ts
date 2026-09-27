export type RibbonTab =
  | 'file'
  | 'home'
  | 'insert'
  | 'draw'
  | 'layout'
  | 'references'
  | 'review'
  | 'view'
  | 'ai'
  | 'help';

export type ViewMode = 'print' | 'web' | 'focus';

export type PageSize = 'letter' | 'a4' | 'legal' | 'executive';

export type MarginType = 'normal' | 'narrow' | 'moderate' | 'wide' | 'custom';

export interface PageSetup {
  size: PageSize;
  orientation: 'portrait' | 'landscape';
  margins: MarginType;
  customMargins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  columns: 1 | 2 | 3;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  color: string;
  status: 'active' | 'idle' | 'away';
  cursorPosition?: number;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
}

export interface CommentReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  color: string;
  text: string;
  highlightedText: string;
  createdAt: string;
  resolved: boolean;
  replies: CommentReply[];
}

export interface DocumentVersion {
  id: string;
  timestamp: string;
  author: string;
  summary: string;
  content: string;
}

export interface AISuggestion {
  original: string;
  suggestion: string;
  reason: string;
  type: 'grammar' | 'spelling' | 'style' | 'conciseness';
}

export interface UserPreferences {
  autoSaveIntervalSeconds: number; // 5, 15, 30, 60
  rulerVisible: boolean;
  rulerUnit: 'inches' | 'cm';
  darkUI: boolean;
  darkCanvas: boolean;
  ribbonCollapsed: boolean;
  defaultFont: string;
  defaultFontSize: number;
  showWordCountInStatus: boolean;
  collaboratorSimulation: boolean;
}

export interface ShortcutConfig {
  id: string;
  label: string;
  category: 'Formatting' | 'File' | 'Navigation' | 'Tools';
  keyCombo: string; // e.g. "Control+b", "Control+s"
  displayCombo: string; // e.g. "Ctrl+B", "Ctrl+S"
}

export interface DocumentStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  lines: number;
  pages: number;
  readingTimeMinutes: number;
}
