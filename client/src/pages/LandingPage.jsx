import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import {
  FileText,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  Database,
  Cpu,
  CheckCircle,
  Layers,
  Lock,
  Search,
  BookOpen
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold shadow-glow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Multi-Tenant RAG & LangGraph Architecture</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Chat with documents with <span className="text-gradient-emerald">zero hallucinations</span>.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
            The enterprise AI document intelligence platform that combines the speed of <strong>Perplexity</strong> with the deep synthesis of <strong>NotebookLM</strong>. Grounded token streaming, strict vector isolation, and verifiable citations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-600 hover:to-emerald-700 text-white font-semibold text-sm shadow-glow-lg transition-all hover:scale-105 active:scale-95"
            >
              <span>Open Document Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-dark-card hover:bg-dark-surface border border-dark-border text-gray-200 font-medium text-sm transition-all"
            >
              Create Free Account
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-400" /> Multi-Tenant Vector Isolation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-400" /> SSE Token Streaming
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-400" /> 100% Traceable Source Citations
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Architecture Walkthrough */}
      <section id="architecture" className="py-20 border-y border-dark-border/60 bg-dark-card/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-brand-400">Under the Hood</h2>
            <h3 className="text-3xl font-extrabold text-white">Production RAG Pipeline Architecture</h3>
            <p className="text-sm text-gray-400 max-w-xl mx-auto">
              Every turn is mediated through LangGraph state graphs with query rewriting and relevance evaluations.
            </p>
          </div>

          {/* Workflow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/40 transition-all space-y-3">
              <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-sm">1. Chunking & Embeddings</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                PDF text is extracted per page, cleaned, and split into 1000-char semantic chunks with page metadata before vector ingestion.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/40 transition-all space-y-3">
              <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-sm">2. Isolated Vector Search</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Queries are matched against MongoDB Atlas Vector Search strictly partitioned by authenticated userId to prevent tenant leakage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/40 transition-all space-y-3">
              <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-sm">3. LangGraph Workflow</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Analyzes intent, rewrites queries, evaluates retrieved context sufficiency, and suppresses hallucinated claims.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/40 transition-all space-y-3">
              <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white text-sm">4. Streaming & Citations</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Streams response tokens over SSE while dispatching verifiable citations linked to exact page numbers and chunk excerpts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Enterprise Multi-Tenant Security</span>
              </div>
              <h3 className="text-3xl font-extrabold text-white">Your documents never cross tenant boundaries.</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Unlike generic LLM wrappers, DocuMind enforces cryptographic user-level isolation in both SQL/NoSQL storage and vector index filters.
              </p>
              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mandatory userId filter on all similarity and aggregate vector queries</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Prompt injection shields treating document content as unexecutable evidence</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Atomic cascade cleanup: deleting a document purges all vector embeddings</span>
                </li>
              </ul>
            </div>

            {/* Visual Code/Architecture Preview */}
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-dark-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-xs text-gray-400">vectorService.search()</span>
              </div>
              <pre className="font-mono text-xs text-emerald-400/90 leading-relaxed overflow-x-auto">
{`// Strict Multi-Tenant Vector Query
const results = await DocumentChunk.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: queryEmbedding,
      filter: {
        userId: { $eq: authenticatedUserId } // Guaranteed Isolation
      }
    }
  }
]);`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 border-t border-dark-border/60 bg-gradient-to-b from-dark-bg to-dark-card text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to experience document intelligence?
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Upload your first research paper, financial report, or legal agreement and get citation-backed answers in seconds.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-glow-lg transition-all"
            >
              <span>Launch DocuMind Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
