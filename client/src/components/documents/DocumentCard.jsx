import React from 'react';
import { FileText, Trash2, RotateCw, CheckSquare, Square, Layers, Calendar, Star } from 'lucide-react';
import { DocumentStatusBadge } from './DocumentStatusBadge.jsx';
import { useDocumentStore } from '../../stores/documentStore.js';

export const DocumentCard = ({ document, onDelete, onRetry, onToggleFavorite }) => {
  const { selectedDocumentIds, toggleDocumentSelection } = useDocumentStore();
  const isSelected = selectedDocumentIds.includes(document._id);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className={`group relative rounded-2xl border p-4 transition-all duration-200 ${
        isSelected
          ? 'bg-brand-500/10 border-brand-500/50 shadow-glow-sm'
          : 'bg-dark-card border-dark-border/80 hover:border-gray-600 hover:bg-dark-surface/60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Selection Checkbox & Icon */}
        <div className="flex items-start gap-3 min-w-0">
          <button
            onClick={() => toggleDocumentSelection(document._id)}
            className="mt-1 text-gray-400 hover:text-brand-400 transition-colors"
            title={isSelected ? 'Deselect from Chat Context' : 'Select for Chat Context'}
          >
            {isSelected ? (
              <CheckSquare className="w-5 h-5 text-brand-400" />
            ) : (
              <Square className="w-5 h-5 text-gray-500 hover:text-gray-300" />
            )}
          </button>

          <div className="p-2.5 rounded-xl bg-dark-surface border border-dark-border shrink-0">
            <FileText className="w-5 h-5 text-brand-400" />
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white truncate group-hover:text-brand-300 transition-colors">
              {document.originalName}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
              <span>{formatFileSize(document.size)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-500" />
                {formatDate(document.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <DocumentStatusBadge status={document.status} />
      </div>

      {/* Metadata Metrics */}
      <div className="mt-4 pt-3 border-t border-dark-border/60 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-gray-500" />
            <strong className="text-gray-200">{document.pageCount || 1}</strong> pages
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            <strong className="text-gray-200">{document.chunkCount || 0}</strong> vector chunks
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleFavorite?.(document._id)}
            className={`p-1.5 rounded-lg transition-colors ${
              document.isFavorite
                ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                : 'text-gray-500 hover:text-amber-400 hover:bg-dark-surface'
            }`}
            title={document.isFavorite ? 'Remove from Starred' : 'Star this file'}
          >
            <Star className={`w-3.5 h-3.5 ${document.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          {document.status === 'FAILED' && (
            <button
              onClick={() => onRetry(document._id)}
              className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors"
              title="Retry Processing"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => onDelete(document._id)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete Document & Vectors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {document.processingError && (
        <p className="mt-2 text-[11px] text-rose-400/90 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
          Error: {document.processingError}
        </p>
      )}
    </div>
  );
};
