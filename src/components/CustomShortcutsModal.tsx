import React, { useState, useEffect } from 'react';
import { X, Keyboard, RotateCcw, Check } from 'lucide-react';
import { ShortcutConfig } from '../types/word';
import { DEFAULT_SHORTCUTS, getEventComboString } from '../utils/shortcuts';

interface CustomShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutConfig[];
  onUpdateShortcuts: (newShortcuts: ShortcutConfig[]) => void;
}

export const CustomShortcutsModal: React.FC<CustomShortcutsModalProps> = ({
  isOpen,
  onClose,
  shortcuts,
  onUpdateShortcuts,
}) => {
  const [recordingId, setRecordingId] = useState<string | null>(null);

  useEffect(() => {
    if (!recordingId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const { keyCombo, displayCombo } = getEventComboString(e);
      if (!keyCombo) return; // Modifier key alone pressed

      const updated = shortcuts.map((s) => {
        if (s.id === recordingId) {
          return { ...s, keyCombo, displayCombo };
        }
        return s;
      });

      onUpdateShortcuts(updated);
      setRecordingId(null);
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [recordingId, shortcuts, onUpdateShortcuts]);

  if (!isOpen) return null;

  const categories: Array<'Formatting' | 'File' | 'Navigation' | 'Tools'> = [
    'Formatting',
    'File',
    'Navigation',
    'Tools',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] text-xs">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#185abd] dark:text-blue-400" />
            <div>
              <h3 className="font-bold text-sm">Customizable Keyboard Shortcuts</h3>
              <p className="text-[11px] text-slate-500">
                Click any shortcut button to record a custom hotkey combination.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List by Category */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {categories.map((cat) => {
            const catShortcuts = shortcuts.filter((s) => s.category === cat);
            if (catShortcuts.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                  {cat} Commands
                </h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  {catShortcuts.map((sc) => {
                    const isRecording = recordingId === sc.id;
                    return (
                      <div
                        key={sc.id}
                        className="px-4 py-2.5 flex items-center justify-between hover:bg-white dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {sc.label}
                        </span>

                        <button
                          onClick={() => setRecordingId(isRecording ? null : sc.id)}
                          className={`px-3 py-1.5 rounded font-mono text-[11px] font-semibold border transition-all ${
                            isRecording
                              ? 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-500'
                          }`}
                        >
                          {isRecording ? 'Press key combination...' : sc.displayCombo}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 rounded-b-xl">
          <button
            onClick={() => onUpdateShortcuts(DEFAULT_SHORTCUTS)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#185abd] text-white rounded font-medium hover:bg-[#114999] transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
