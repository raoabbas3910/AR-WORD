import { ShortcutConfig } from '../types/word';

export const DEFAULT_SHORTCUTS: ShortcutConfig[] = [
  {
    id: 'save',
    label: 'Save Document',
    category: 'File',
    keyCombo: 'Control+s',
    displayCombo: 'Ctrl+S',
  },
  {
    id: 'print',
    label: 'Print / Export PDF',
    category: 'File',
    keyCombo: 'Control+p',
    displayCombo: 'Ctrl+P',
  },
  {
    id: 'bold',
    label: 'Bold',
    category: 'Formatting',
    keyCombo: 'Control+b',
    displayCombo: 'Ctrl+B',
  },
  {
    id: 'italic',
    label: 'Italic',
    category: 'Formatting',
    keyCombo: 'Control+i',
    displayCombo: 'Ctrl+I',
  },
  {
    id: 'underline',
    label: 'Underline',
    category: 'Formatting',
    keyCombo: 'Control+u',
    displayCombo: 'Ctrl+U',
  },
  {
    id: 'strikethrough',
    label: 'Strikethrough',
    category: 'Formatting',
    keyCombo: 'Control+Shift+X',
    displayCombo: 'Ctrl+Shift+X',
  },
  {
    id: 'heading1',
    label: 'Heading 1',
    category: 'Formatting',
    keyCombo: 'Control+Alt+1',
    displayCombo: 'Ctrl+Alt+1',
  },
  {
    id: 'heading2',
    label: 'Heading 2',
    category: 'Formatting',
    keyCombo: 'Control+Alt+2',
    displayCombo: 'Ctrl+Alt+2',
  },
  {
    id: 'heading3',
    label: 'Heading 3',
    category: 'Formatting',
    keyCombo: 'Control+Alt+3',
    displayCombo: 'Ctrl+Alt+3',
  },
  {
    id: 'alignLeft',
    label: 'Align Left',
    category: 'Formatting',
    keyCombo: 'Control+l',
    displayCombo: 'Ctrl+L',
  },
  {
    id: 'alignCenter',
    label: 'Align Center',
    category: 'Formatting',
    keyCombo: 'Control+e',
    displayCombo: 'Ctrl+E',
  },
  {
    id: 'alignRight',
    label: 'Align Right',
    category: 'Formatting',
    keyCombo: 'Control+r',
    displayCombo: 'Ctrl+R',
  },
  {
    id: 'find',
    label: 'Find in Document',
    category: 'Navigation',
    keyCombo: 'Control+f',
    displayCombo: 'Ctrl+F',
  },
  {
    id: 'replace',
    label: 'Find and Replace',
    category: 'Navigation',
    keyCombo: 'Control+h',
    displayCombo: 'Ctrl+H',
  },
  {
    id: 'aiAssistant',
    label: 'Open AI Assistant / Copilot',
    category: 'Tools',
    keyCombo: 'Control+j',
    displayCombo: 'Ctrl+J',
  },
  {
    id: 'addComment',
    label: 'Insert Comment',
    category: 'Tools',
    keyCombo: 'Control+Alt+m',
    displayCombo: 'Ctrl+Alt+M',
  },
  {
    id: 'toggleRibbon',
    label: 'Minimize / Expand Ribbon',
    category: 'Tools',
    keyCombo: 'Control+F1',
    displayCombo: 'Ctrl+F1',
  },
  {
    id: 'wordCount',
    label: 'Document Statistics & Word Count',
    category: 'Tools',
    keyCombo: 'Control+Shift+C',
    displayCombo: 'Ctrl+Shift+C',
  },
];

export function getEventComboString(e: KeyboardEvent): { keyCombo: string; displayCombo: string } {
  const parts: string[] = [];
  const displayParts: string[] = [];

  if (e.ctrlKey || e.metaKey) {
    parts.push('Control');
    displayParts.push('Ctrl');
  }
  if (e.altKey) {
    parts.push('Alt');
    displayParts.push('Alt');
  }
  if (e.shiftKey) {
    parts.push('Shift');
    displayParts.push('Shift');
  }

  // Handle key name
  let key = e.key;
  if (key === 'Control' || key === 'Alt' || key === 'Shift' || key === 'Meta') {
    return { keyCombo: '', displayCombo: '' };
  }

  if (key === ' ') {
    key = 'Space';
  }

  parts.push(key.toLowerCase());
  displayParts.push(key.length === 1 ? key.toUpperCase() : key);

  return {
    keyCombo: parts.join('+'),
    displayCombo: displayParts.join('+'),
  };
}

export function matchesShortcut(e: KeyboardEvent, targetCombo: string): boolean {
  if (!targetCombo) return false;
  const current = getEventComboString(e);
  return current.keyCombo.toLowerCase() === targetCombo.toLowerCase();
}
