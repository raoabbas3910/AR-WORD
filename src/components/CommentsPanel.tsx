import React, { useState } from 'react';
import { X, MessageSquare, Check, Reply, Send, CheckCircle2 } from 'lucide-react';
import { Comment } from '../types/word';

interface CommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onReplyComment: (commentId: string, replyText: string) => void;
  onToggleResolve: (commentId: string) => void;
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onReplyComment,
  onToggleResolve,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  if (!isOpen) return null;

  const filteredComments = comments.filter((c) => {
    if (filter === 'open') return !c.resolved;
    if (filter === 'resolved') return c.resolved;
    return true;
  });

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(newCommentText);
    setNewCommentText('');
  };

  const handleSendReply = (commentId: string) => {
    const text = replyInputs[commentId];
    if (!text || !text.trim()) return;
    onReplyComment(commentId, text.trim());
    setReplyInputs({ ...replyInputs, [commentId]: '' });
  };

  return (
    <aside className="no-print fixed top-10 right-0 bottom-6 w-88 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-40 flex flex-col text-xs text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="h-12 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#185abd] dark:text-blue-400" />
          <h3 className="font-bold text-xs">Collaborative Comments</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950 px-2 py-1 gap-1 text-[11px]">
        {(['all', 'open', 'resolved'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setFilter(mode)}
            className={`flex-1 py-1 rounded font-medium capitalize transition-colors text-center ${
              filter === mode
                ? 'bg-white dark:bg-slate-800 text-[#185abd] dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {mode} ({mode === 'all' ? comments.length : comments.filter((c) => mode === 'resolved' ? c.resolved : !c.resolved).length})
          </button>
        ))}
      </div>

      {/* New Comment Input */}
      <form onSubmit={handleCreateComment} className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2">
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Add a comment to selection..."
          className="w-full h-16 p-2 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs outline-hidden focus:border-blue-500 resize-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="px-3 py-1 bg-[#185abd] text-white rounded font-medium hover:bg-[#114999] disabled:opacity-50 transition-colors shadow-xs"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredComments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No comments in this view.
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 border rounded-lg space-y-2 transition-all ${
                comment.resolved
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-75'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xs'
              }`}
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full text-white font-bold flex items-center justify-center text-[9px]"
                    style={{ backgroundColor: comment.color }}
                  >
                    {comment.avatar}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {comment.author}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1.5">
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleResolve(comment.id)}
                  className={`p-1 rounded transition-colors ${
                    comment.resolved
                      ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                      : 'text-slate-400 hover:text-emerald-600'
                  }`}
                  title={comment.resolved ? 'Mark unresolved' : 'Resolve thread'}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Highlighted text preview */}
              {comment.highlightedText && (
                <div className="border-l-2 border-amber-400 pl-2 text-[11px] text-slate-500 italic bg-amber-50/50 dark:bg-amber-950/20 py-0.5 rounded-r">
                  "{comment.highlightedText}"
                </div>
              )}

              {/* Comment body */}
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-normal">
                {comment.text}
              </p>

              {/* Replies */}
              {comment.replies?.length > 0 && (
                <div className="pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-2 mt-2 pt-1">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="space-y-0.5 text-[11px]">
                      <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                        <span>{reply.author}</span>
                        <span className="text-[9px] text-slate-400 font-normal">
                          {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              <div className="flex gap-1 pt-1">
                <input
                  type="text"
                  placeholder="Reply..."
                  value={replyInputs[comment.id] || ''}
                  onChange={(e) =>
                    setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply(comment.id)}
                  className="flex-1 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-[11px] outline-hidden focus:border-blue-500"
                />
                <button
                  onClick={() => handleSendReply(comment.id)}
                  className="p-1.5 bg-[#185abd] text-white rounded hover:bg-[#114999]"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
