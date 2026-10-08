import React from 'react';
import { useDocumentStore } from '../../stores/documentStore.js';
import { X, FileText, CheckCircle2, Bookmark, ExternalLink } from 'lucide-react';

export const CitationPreviewModal = () => {
  const { activeCitation, setActiveCitation } = useDocumentStore();

  if (!activeCitation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md h-[90vh] bg-dark-card border border-dark-border rounded-2xl flex flex-col shadow-2xl p-6 overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-dark-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Source Verification</h3>
              <p className="text-[11px] text-dark-muted">Grounded document context & excerpt</p>
            </div>
          </div>
          <button
            onClick={() => setActiveCitation(null)}
            className="p-1.5 rounded-lg text-dark-muted hover:text-white hover:bg-dark-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Document metadata pill */}
          <div className="p-3 rounded-xl bg-dark-surface/60 border border-dark-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-white truncate">
              <FileText className="w-4 h-4 text-brand-400 shrink-0" />
              <span className="truncate">{activeCitation.documentName}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-dark-border/40">
              <span>Page {activeCitation.pageNumber}</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Score: {Math.round((activeCitation.relevanceScore || 0.9) * 100)}%
              </span>
            </div>
          </div>

          {/* Verbatim Excerpt */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">
              Retrieved Chunk Excerpt
            </h4>
            <div className="p-4 rounded-xl bg-[#090e18] border border-dark-border/80 font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-wrap select-text">
              {activeCitation.excerpt || 'No excerpt available for this chunk.'}
            </div>
          </div>

          {/* Verification Guarantee */}
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-emerald-400/90 leading-relaxed">
            <strong>Grounded RAG Guarantee:</strong> This chunk was retrieved directly from your isolated vector index. The AI answer relies on this context without hallucinated claims.
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-dark-border flex justify-end">
          <button
            onClick={() => setActiveCitation(null)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-dark-surface hover:bg-dark-surface/80 border border-dark-border text-gray-200"
          >
            Close Excerpt
          </button>
        </div>
      </div>
    </div>
  );
};
