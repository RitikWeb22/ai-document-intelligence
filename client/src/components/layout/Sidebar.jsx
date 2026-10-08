import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Files, MessageSquare, Star, Settings, HardDrive, PlusCircle, ShieldCheck } from 'lucide-react';
import { useDocumentStore } from '../../stores/documentStore.js';

export const Sidebar = ({ documentCount = 0, starredCount = 0, activeTab = 'all', onTabChange }) => {
  const { setUploadModalOpen } = useDocumentStore();
  const location = useLocation();

  const isCurrent = (tabKey) => {
    if (tabKey === 'chat') return location.pathname === '/chat';
    return location.pathname === '/dashboard' && activeTab === tabKey;
  };

  return (
    <aside className="w-64 border-r border-dark-border/80 bg-dark-bg/60 flex flex-col justify-between p-4 shrink-0 h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Upload Trigger Button */}
        <button
          onClick={() => setUploadModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-medium text-xs shadow-glow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          Upload New PDF
        </button>

        {/* Navigation List */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-2">Workspace</p>

          <button
            onClick={() => onTabChange?.('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isCurrent('all')
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-dark-surface/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Files className="w-4 h-4 text-brand-500/80" />
              <span>All Documents</span>
            </div>
            {documentCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-dark-surface border border-dark-border text-gray-400">
                {documentCount}
              </span>
            )}
          </button>

          <Link
            to="/chat"
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isCurrent('chat')
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-dark-surface/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-brand-500/80" />
              <span>Chat Assistant</span>
            </div>
          </Link>

          <button
            onClick={() => onTabChange?.('favorites')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isCurrent('favorites')
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-dark-surface/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className={`w-4 h-4 ${isCurrent('favorites') ? 'text-amber-400 fill-amber-400' : 'text-gray-400'}`} />
              <span>Starred Files</span>
            </div>
            {starredCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                {starredCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange?.('settings')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isCurrent('settings')
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-dark-surface/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-gray-400" />
              <span>Settings & API Keys</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Storage and Security Footprint */}
      <div className="space-y-3 pt-4 border-t border-dark-border/60">
        <div className="p-3 rounded-xl bg-dark-surface/40 border border-dark-border/60">
          <div className="flex items-center justify-between text-xs text-gray-300 mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-brand-400" />
              Document Vault
            </span>
            <span className="text-[11px] text-gray-400">{documentCount} / 50</span>
          </div>
          <div className="w-full bg-dark-border/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((documentCount / 50) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Isolated tenant storage
          </p>
        </div>
      </div>
    </aside>
  );
};
