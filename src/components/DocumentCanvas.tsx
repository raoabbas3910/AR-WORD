import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PageSetup, UserPreferences, Collaborator, Comment } from '../types/word';

interface DocumentCanvasProps {
  content: string;
  onChange: (newContent: string) => void;
  pageSetup: PageSetup;
  preferences: UserPreferences;
  zoomLevel: number;
  collaborators: Collaborator[];
  comments: Comment[];
  onSelectComment: (commentId: string) => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
  drawTool: 'pen' | 'highlighter' | 'eraser' | null;
  drawColor: string;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  content,
  onChange,
  pageSetup,
  preferences,
  zoomLevel,
  collaborators,
  comments,
  onSelectComment,
  editorRef,
  drawTool,
  drawColor,
}) => {
  const canvasDrawRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  // Sync initial content safely to prevent cursor jump
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      // Only update if different and not currently actively typing
      const activeEl = document.activeElement;
      if (activeEl !== editorRef.current && !editorRef.current.contains(activeEl)) {
        editorRef.current.innerHTML = content;
      }
    }
  }, [content, editorRef]);

  // Handle inking / drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawTool || drawTool === 'eraser') return;
    const canvas = canvasDrawRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoomLevel / 100);
    const y = (e.clientY - rect.top) / (zoomLevel / 100);
    setIsDrawing(true);
    setLastPoint({ x, y });
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint || !drawTool) return;
    const canvas = canvasDrawRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoomLevel / 100);
    const y = (e.clientY - rect.top) / (zoomLevel / 100);

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = drawColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (drawTool === 'pen') {
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 1.0;
    } else if (drawTool === 'highlighter') {
      ctx.lineWidth = 16;
      ctx.globalAlpha = 0.35;
    }

    ctx.stroke();
    setLastPoint({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasDrawRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (drawTool === 'eraser') {
      clearCanvas();
    }
  }, [drawTool]);

  // Margin CSS classes
  const getMarginClass = () => {
    switch (pageSetup.margins) {
      case 'narrow':
        return 'px-8 py-8';
      case 'wide':
        return 'px-20 py-16';
      case 'moderate':
        return 'px-12 py-12';
      case 'normal':
      default:
        return 'px-16 py-14';
    }
  };

  // Dimensions
  const isLandscape = pageSetup.orientation === 'landscape';
  const pageWidth = isLandscape ? 1056 : 816; // Standard 96 DPI 8.5" x 11"
  const pageMinHeight = isLandscape ? 816 : 1056;

  return (
    <div className="flex-1 overflow-auto bg-[#e5e7eb] dark:bg-[#0f172a] relative flex flex-col items-center select-text">
      {/* Horizontal Ruler */}
      {preferences.rulerVisible && (
        <div
          className="no-print sticky top-0 z-20 h-6 bg-[#f8fafc] dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 flex items-center shadow-xs select-none"
          style={{ width: `${pageWidth * (zoomLevel / 100)}px` }}
        >
          <div className="relative w-full h-full flex items-end px-4 text-[9px] text-slate-400 font-mono">
            {/* Inch / CM tick marks */}
            {Array.from({ length: isLandscape ? 11 : 8 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col justify-end items-start border-l border-slate-300 dark:border-slate-700 h-3"
              >
                <span className="pl-1 mb-0.5">{i + 1}</span>
              </div>
            ))}
            {/* Draggable Indent Markers */}
            <div
              className="absolute left-14 bottom-0 w-2.5 h-3 bg-blue-600 rounded-t-xs cursor-ew-resize"
              title="Left Margin Indent"
            />
            <div
              className="absolute right-14 bottom-0 w-2.5 h-3 bg-blue-600 rounded-t-xs cursor-ew-resize"
              title="Right Margin Indent"
            />
          </div>
        </div>
      )}

      {/* Main Document Canvas Viewport */}
      <div
        className="py-8 px-4 flex justify-center w-full min-h-full transition-transform duration-100 ease-out"
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center',
        }}
      >
        <div
          className={`word-page relative transition-colors duration-150 rounded-xs ${
            preferences.darkCanvas
              ? 'bg-[#1e293b] text-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.5)]'
              : 'bg-white text-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.12)]'
          }`}
          style={{
            width: `${pageWidth}px`,
            minHeight: `${pageMinHeight}px`,
          }}
        >
          {/* Header Zone */}
          <div className="px-16 pt-6 pb-2 text-[11px] text-slate-400 flex justify-between items-center select-none border-b border-transparent hover:border-dashed hover:border-slate-300 transition-colors">
            <span>Enterprise Word Workspace · Confidential</span>
            <span>Draft v4.2</span>
          </div>

          {/* Active Collaborators Virtual Cursor Badges */}
          <div className="absolute top-24 right-8 flex flex-col gap-2 z-10 pointer-events-none select-none">
            {collaborators
              .filter((c) => c.status === 'active')
              .map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white shadow-md animate-bounce"
                  style={{ backgroundColor: c.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>{c.name} is editing</span>
                </div>
              ))}
          </div>

          {/* Inking Overlay Canvas */}
          <canvas
            ref={canvasDrawRef}
            width={pageWidth}
            height={pageMinHeight}
            onMouseDown={startDrawing}
            onMouseMove={drawMove}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className={`absolute inset-0 z-10 ${
              drawTool ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
            }`}
          />

          {/* Editable Document Body */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              const target = e.currentTarget;
              onChange(target.innerHTML);
            }}
            className={`document-content print-area outline-hidden min-h-[800px] leading-relaxed text-[15px] font-[Aptos,Calibri,sans-serif] ${getMarginClass()} ${
              preferences.darkCanvas ? 'dark-canvas' : ''
            }`}
            style={{
              columnCount: pageSetup.columns,
              columnGap: '2.5rem',
            }}
          />

          {/* Footer Zone */}
          <div className="px-16 pt-8 pb-8 text-[11px] text-slate-400 flex justify-between items-center select-none border-t border-transparent hover:border-dashed hover:border-slate-300 transition-colors">
            <span>Page 1 of 1</span>
            <span>Microsoft Word Format</span>
          </div>
        </div>
      </div>
    </div>
  );
};
