import React, { useState } from 'react';
import { X, Share2, Copy, Check, Users, Shield, Plus, UserPlus } from 'lucide-react';
import { Collaborator } from '../types/word';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  collaborators: Collaborator[];
  onAddCollaborator: (collaborator: Collaborator) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  collaborators,
  onAddCollaborator,
}) => {
  const [copied, setCopied] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');

  if (!isOpen) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const initials = inviteName
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const colors = ['#2563eb', '#059669', '#d97706', '#9333ea', '#dc2626', '#0891b2'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    onAddCollaborator({
      id: `collab-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      color: randomColor,
      status: 'active',
      avatar: initials || 'TM',
    });

    setInviteName('');
    setInviteEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col text-xs">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#185abd] dark:text-blue-400" />
            <div>
              <h3 className="font-bold text-sm">Real-Time Team Collaboration</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-xs">{documentTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Quick link */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              Shareable Project Link:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="flex-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300 outline-hidden"
              />
              <button
                onClick={copyLink}
                className="px-3 py-1.5 bg-[#185abd] text-white rounded font-medium hover:bg-[#114999] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Invite teammate form */}
          <form onSubmit={handleInvite} className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-blue-600" />
              <span>Invite New Team Member</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Full Name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs"
              />
              <input
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs"
              >
                <option value="editor">Can edit</option>
                <option value="viewer">Can view</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
              >
                Send Invite
              </button>
            </div>
          </form>

          {/* Active collaborators list */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Project Members ({collaborators.length})
            </div>
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden max-h-48 overflow-y-auto">
              {collaborators.map((c) => (
                <div key={c.id} className="p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full text-white font-bold flex items-center justify-center text-[10px] shadow-xs"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{c.name}</span>
                        {c.status === 'active' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active now" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{c.email}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 capitalize bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {c.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#185abd] text-white rounded font-medium hover:bg-[#114999]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
