import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Sparkles, Layers } from 'lucide-react';

export const DocumentStatusBadge = ({ status }) => {
  switch (status) {
    case 'READY':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Ready
        </span>
      );
    case 'PROCESSING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
          Processing
        </span>
      );
    case 'EMBEDDING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Sparkles className="w-3 h-3 animate-pulse text-cyan-400" />
          Embedding
        </span>
      );
    case 'UPLOADING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Layers className="w-3 h-3 animate-bounce text-blue-400" />
          Uploading
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle className="w-3 h-3 text-rose-400" />
          Failed
        </span>
      );
    case 'DELETING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
          <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
          Deleting
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-dark-surface text-gray-400">
          {status}
        </span>
      );
  }
};
