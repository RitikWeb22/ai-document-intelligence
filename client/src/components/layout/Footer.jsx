import React from 'react';
import { FileText, Shield, Cpu, Database, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-dark-border/60 bg-dark-bg/95 py-12 text-sm text-dark-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-500" />
              <span className="font-bold text-white tracking-tight">DocuMind AI</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Production-grade AI document intelligence platform built with LangGraph, LangChain, and MongoDB Atlas Vector Search.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Core Engine</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-brand-400" /> LangGraph Workflows</li>
              <li className="flex items-center gap-2"><Database className="w-3.5 h-3.5 text-emerald-400" /> Vector Similarity Ranking</li>
              <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-amber-400" /> Token-by-Token SSE Stream</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Security & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Multi-Tenant Vector Isolation</li>
              <li>Encrypted At Rest & In Transit</li>
              <li>Strict Zero-Prompt-Injection Boundaries</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Compliance</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">
              All documents are strictly partitioned per authenticated session. Vector embeddings are never shared or trained upon.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Atlas Vector Shield Active
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-dark-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 DocuMind AI. Enterprise Document Intelligence. All rights reserved.</p>
          <div className="flex gap-6">
            <span>JavaScript ES Modules</span>
            <span>LangChain + LangGraph</span>
            <span>MongoDB Atlas</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
