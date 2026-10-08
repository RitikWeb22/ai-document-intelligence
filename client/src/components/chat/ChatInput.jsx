import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Sparkles, Filter } from 'lucide-react';
import { useDocumentStore } from '../../stores/documentStore.js';

export const ChatInput = ({ onSend, onStop, isStreaming, selectedCount = 0 }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const { selectedDocumentIds } = useDocumentStore();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const suggestions = [
    'Summarize key insights and deliverables',
    'What are the critical risks or financial figures?',
    'Extract main obligations, timelines and dates',
    'Compare the findings across selected documents'
  ];

  return (
    <div className="space-y-3">
      {/* Suggestions Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-[11px] text-gray-500 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-400" /> Prompts:
        </span>
        {suggestions.map((prompt, i) => (
          <button
            key={i}
            onClick={() => setInput(prompt)}
            disabled={isStreaming}
            className="px-2.5 py-1 rounded-full bg-dark-surface/60 hover:bg-dark-surface border border-dark-border/80 hover:border-gray-600 text-gray-300 text-[11px] whitespace-nowrap transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box Container */}
      <div className="relative rounded-2xl bg-dark-card border border-dark-border focus-within:border-brand-500/60 focus-within:ring-1 focus-within:ring-brand-500/30 transition-all p-3 shadow-card-glow">
        <div className="flex items-center justify-between pb-2 mb-1 border-b border-dark-border/40 text-[11px] text-gray-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Filter className="w-3 h-3 text-brand-400" />
            {selectedDocumentIds.length > 0 ? (
              <span className="text-brand-300">
                Searching across <strong>{selectedDocumentIds.length}</strong> selected PDF{selectedDocumentIds.length > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-gray-400">Searching across entire document vault</span>
            )}
          </span>
          <span className="text-gray-500">Press Enter to send, Shift + Enter for new line</span>
        </div>

        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your uploaded documents..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-transparent border-0 resize-none outline-none text-sm text-white placeholder-gray-500 max-h-40 min-h-[44px] py-2"
          />

          {isStreaming ? (
            <button
              onClick={onStop}
              className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 transition-all shadow-sm"
              title="Stop Generation"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:pointer-events-none text-white shadow-glow-sm transition-all hover:scale-105 active:scale-95"
              title="Send Prompt"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
