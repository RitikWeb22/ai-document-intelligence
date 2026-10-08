import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Copy, Check, Bookmark, Sparkles } from 'lucide-react';
import { useDocumentStore } from '../../stores/documentStore.js';

export const ChatMessage = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);
  const { setActiveCitation } = useDocumentStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 p-4 rounded-2xl transition-all ${
      isAssistant
        ? 'bg-dark-card/90 border border-dark-border/70 shadow-sm'
        : 'bg-dark-surface/40 border border-dark-border/40'
    }`}>
      {/* Avatar Icon */}
      <div className="shrink-0">
        {isAssistant ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 p-[1px] shadow-glow-sm">
            <div className="w-full h-full bg-dark-bg rounded-[11px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-brand-400" />
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center text-gray-300">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white flex items-center gap-1.5">
            {isAssistant ? (
              <>
                <span>DocuMind Intelligence</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-400 font-mono border border-brand-500/20">
                  Grounded
                </span>
              </>
            ) : (
              'You'
            )}
          </span>

          {isAssistant && message.content && (
            <button
              onClick={handleCopy}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-dark-surface transition-colors"
              title="Copy answer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-brand-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Content (Markdown) */}
        <div className="prose-dark text-sm text-gray-200 break-words leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Citations Footer */}
        {isAssistant && message.citations && message.citations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-dark-border/60">
            <div className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5 mb-2">
              <Bookmark className="w-3 h-3 text-brand-400" />
              Verified Citations ({message.citations.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {message.citations.map((citation, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCitation(citation)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-surface/80 hover:bg-brand-500/15 border border-dark-border hover:border-brand-500/30 text-[11px] text-gray-300 hover:text-brand-300 transition-all cursor-pointer"
                  title="Click to view verified chunk and page"
                >
                  <span className="font-mono text-brand-400 font-bold">[{idx + 1}]</span>
                  <span className="truncate max-w-[150px]">{citation.documentName}</span>
                  <span className="text-gray-400 text-[10px]">• p.{citation.pageNumber}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
