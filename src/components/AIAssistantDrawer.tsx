import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  BookOpen,
  Send,
  FileCheck,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { AISuggestion } from '../types/word';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documentContent: string;
  onApplySuggestion: (original: string, replacement: string) => void;
  onInsertContent: (htmlToInsert: string) => void;
  initialMode?: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  documentContent,
  onApplySuggestion,
  onInsertContent,
  initialMode = 'proofread',
}) => {
  const [activeMode, setActiveMode] = useState<string>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [appliedIndices, setAppliedIndices] = useState<number[]>([]);
  const [rewriteTone, setRewriteTone] = useState('executive');
  const [rewrittenResult, setRewrittenResult] = useState('');
  const [summaryData, setSummaryData] = useState<{ summary: string; keyPoints: string[] } | null>(null);
  const [draftPrompt, setDraftPrompt] = useState('');
  const [draftedContent, setDraftedContent] = useState('');

  if (!isOpen) return null;

  // Run Proofreading
  const runProofreading = async () => {
    setIsLoading(true);
    setAppliedIndices([]);
    try {
      const res = await fetch('/api/ai/proofread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: documentContent }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Proofreading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run Tone Rewrite
  const runRewrite = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: documentContent, tone: rewriteTone }),
      });
      const data = await res.json();
      setRewrittenResult(data.rewrittenText || '');
    } catch (err) {
      console.error('Rewrite error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run Summarizer
  const runSummarize = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: documentContent }),
      });
      const data = await res.json();
      setSummaryData(data);
    } catch (err) {
      console.error('Summarize error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run Draft Section
  const runDraft = async () => {
    if (!draftPrompt.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: draftPrompt, context: documentContent.slice(0, 1000) }),
      });
      const data = await res.json();
      setDraftedContent(data.html || '');
    } catch (err) {
      console.error('Draft error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="no-print fixed top-10 right-0 bottom-6 w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-40 flex flex-col text-xs text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="h-12 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          </div>
          <div>
            <h3 className="font-semibold text-xs leading-none">Word Copilot</h3>
            <span className="text-[10px] text-slate-400">Gemini 3.8 Intelligence</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 p-1 gap-1 text-[11px]">
        {[
          { id: 'proofread', label: 'Grammar & Style' },
          { id: 'rewrite', label: 'Tone' },
          { id: 'summarize', label: 'Summary' },
          { id: 'draft', label: 'Draft' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMode(tab.id)}
            className={`flex-1 py-1 px-1.5 rounded font-medium transition-colors text-center truncate ${
              activeMode === tab.id
                ? 'bg-white dark:bg-slate-800 text-[#185abd] dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* PROOFREAD MODE */}
        {activeMode === 'proofread' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                  Grammar & Clarity Check
                </h4>
                <p className="text-[11px] text-slate-500">
                  Analyzes wordiness, spelling, punctuation, and stylistic precision.
                </p>
              </div>
              <button
                onClick={runProofreading}
                disabled={isLoading}
                className="px-3 py-1.5 bg-[#185abd] text-white rounded font-medium hover:bg-[#114999] disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-amber-300" />}
                <span>{isLoading ? 'Checking...' : 'Run Check'}</span>
              </button>
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-500 font-medium">
                  {suggestions.length} Recommendation{suggestions.length > 1 ? 's' : ''} found:
                </div>

                {suggestions.map((item, idx) => {
                  const isApplied = appliedIndices.includes(idx);
                  return (
                    <div
                      key={idx}
                      className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`uppercase text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.type === 'grammar'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : item.type === 'spelling'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {item.type}
                        </span>
                        {isApplied && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Applied
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="line-through text-slate-400">{item.original}</div>
                        <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {item.suggestion}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-normal">{item.reason}</p>

                      {!isApplied && (
                        <div className="flex justify-end gap-1.5 pt-1">
                          <button
                            onClick={() => {
                              onApplySuggestion(item.original, item.suggestion);
                              setAppliedIndices([...appliedIndices, idx]);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition-colors"
                          >
                            Apply Fix
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TONE REWRITE MODE */}
        {activeMode === 'rewrite' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                Rewrite & Polish Tone
              </h4>
              <p className="text-[11px] text-slate-500">
                Elevate your draft to align with corporate or academic standards.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-slate-600 dark:text-slate-400 font-medium">Target Tone:</label>
              <select
                value={rewriteTone}
                onChange={(e) => setRewriteTone(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs"
              >
                <option value="executive">Executive & Leadership</option>
                <option value="academic">Academic & Formal</option>
                <option value="professional">Professional & Direct</option>
                <option value="casual">Casual & Conversational</option>
                <option value="concise">Ultra Concise</option>
              </select>
            </div>

            <button
              onClick={runRewrite}
              disabled={isLoading}
              className="w-full py-2 bg-[#185abd] text-white rounded font-medium hover:bg-[#114999] disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              <span>{isLoading ? 'Rewriting with Gemini...' : 'Rewrite Document'}</span>
            </button>

            {rewrittenResult && (
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="font-semibold text-[11px] text-slate-500 uppercase">
                  Rewritten Version
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {rewrittenResult}
                </div>
                <button
                  onClick={() => onInsertContent(`<p>${rewrittenResult}</p>`)}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs transition-colors"
                >
                  Insert at Cursor
                </button>
              </div>
            )}
          </div>
        )}

        {/* SUMMARIZE MODE */}
        {activeMode === 'summarize' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                Executive Auto-Summarizer
              </h4>
              <p className="text-[11px] text-slate-500">
                Generates high-level summaries and key takeaway points.
              </p>
            </div>

            <button
              onClick={runSummarize}
              disabled={isLoading}
              className="w-full py-2 bg-[#185abd] text-white rounded font-medium hover:bg-[#114999] disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <BookOpen className="w-3.5 h-3.5 text-amber-300" />}
              <span>{isLoading ? 'Generating Summary...' : 'Generate Summary'}</span>
            </button>

            {summaryData && (
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <div>
                  <div className="font-semibold text-[11px] text-slate-500 uppercase mb-1">
                    Executive Summary
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {summaryData.summary}
                  </p>
                </div>

                {summaryData.keyPoints?.length > 0 && (
                  <div>
                    <div className="font-semibold text-[11px] text-slate-500 uppercase mb-1">
                      Key Takeaways
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300 text-xs">
                      {summaryData.keyPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => {
                    const html = `<h2>Executive Summary</h2><p>${summaryData.summary}</p><ul>${summaryData.keyPoints
                      .map((p) => `<li>${p}</li>`)
                      .join('')}</ul>`;
                    onInsertContent(html);
                  }}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs transition-colors"
                >
                  Insert Summary Into Document
                </button>
              </div>
            )}
          </div>
        )}

        {/* DRAFT MODE */}
        {activeMode === 'draft' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                Draft New Section
              </h4>
              <p className="text-[11px] text-slate-500">
                Provide instructions and Copilot will draft structured paragraphs and tables.
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                value={draftPrompt}
                onChange={(e) => setDraftPrompt(e.target.value)}
                placeholder="e.g. Draft a 3-paragraph section explaining data security standards and compliance protocols..."
                className="w-full h-24 p-2.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs outline-hidden focus:border-blue-500 leading-normal resize-none"
              />
              <button
                onClick={runDraft}
                disabled={isLoading || !draftPrompt.trim()}
                className="w-full py-2 bg-[#185abd] text-white rounded font-medium hover:bg-[#114999] disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isLoading ? 'Drafting...' : 'Draft Section'}</span>
              </button>
            </div>

            {draftedContent && (
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="font-semibold text-[11px] text-slate-500 uppercase">
                  Drafted Content Preview
                </div>
                <div
                  className="text-xs text-slate-700 dark:text-slate-300 max-h-48 overflow-y-auto border p-2 rounded bg-white dark:bg-slate-800"
                  dangerouslySetInnerHTML={{ __html: draftedContent }}
                />
                <button
                  onClick={() => onInsertContent(draftedContent)}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs transition-colors"
                >
                  Insert Draft Into Document
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
