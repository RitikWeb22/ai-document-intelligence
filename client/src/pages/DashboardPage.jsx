import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { DocumentCard } from '../components/documents/DocumentCard.jsx';
import { DocumentUploadModal } from '../components/documents/DocumentUploadModal.jsx';
import { CitationPreviewModal } from '../components/chat/CitationPreviewModal.jsx';
import { useDocumentStore } from '../stores/documentStore.js';
import { documentsApi } from '../services/index.js';
import {
  Search,
  UploadCloud,
  FileText,
  Filter,
  MessageSquare,
  CheckSquare,
  Square,
  RefreshCw,
  FolderOpen,
  Star,
  Settings,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  HardDrive
} from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    selectedDocumentIds,
    selectAllDocuments,
    clearDocumentSelection,
    setUploadModalOpen
  } = useDocumentStore();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Tab state: 'all' | 'favorites' | 'settings'
  const initialTab = location.hash ? location.hash.replace('#', '') : 'all';
  const [activeTab, setActiveTab] = useState(['all', 'favorites', 'settings'].includes(initialTab) ? initialTab : 'all');

  useEffect(() => {
    const hash = location.hash ? location.hash.replace('#', '') : 'all';
    if (['all', 'favorites', 'settings'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    navigate(`/dashboard${tabKey === 'all' ? '' : `#${tabKey}`}`);
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentsApi.list({ search, status: statusFilter });
      if (res?.data) {
        setDocuments(res.data);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter]);

  // Auto-poll every 2 seconds while any document is in progress
  useEffect(() => {
    const hasPending = documents.some((d) =>
      ['UPLOADING', 'PROCESSING', 'EMBEDDING'].includes(d.status)
    );
    if (!hasPending) return;

    const interval = setInterval(async () => {
      try {
        const res = await documentsApi.list({ search, status: statusFilter });
        if (res?.data) {
          setDocuments(res.data);
        }
      } catch (err) {
        // silent polling catch
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [documents, search, statusFilter]);

  const handleDelete = async (id) => {
    try {
      await documentsApi.delete(id);
    } catch (err) {
      // Handled
    }
    setDocuments((prev) => prev.filter((d) => d._id !== id));
  };

  const handleRetry = async (id) => {
    try {
      await documentsApi.retry(id);
      fetchDocuments();
    } catch (err) {
      // Handled
    }
  };

  const handleToggleFavorite = async (id) => {
    // Optimistic UI update
    setDocuments((prev) =>
      prev.map((d) => (d._id === id ? { ...d, isFavorite: !d.isFavorite } : d))
    );
    try {
      await documentsApi.toggleFavorite(id);
    } catch (err) {
      // Revert if failed
      fetchDocuments();
    }
  };

  // Filter based on active tab and search
  const visibleDocs = documents.filter((doc) => {
    const matchesSearch = doc.originalName.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'favorites') {
      return matchesSearch && doc.isFavorite;
    }
    return matchesSearch;
  });

  const starredCount = documents.filter((d) => d.isFavorite).length;
  const allSelected = visibleDocs.length > 0 && visibleDocs.every((d) => selectedDocumentIds.includes(d._id));

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          documentCount={documents.length}
          starredCount={starredCount}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* TAB 1 & 2: ALL DOCUMENTS & FAVORITES */}
          {activeTab !== 'settings' && (
            <>
              {/* Header & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-border">
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    {activeTab === 'favorites' ? (
                      <>
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        Starred Files
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 text-brand-400" />
                        Document Library
                      </>
                    )}
                  </h1>
                  <p className="text-xs text-dark-muted">
                    {activeTab === 'favorites'
                      ? 'Quick access to your prioritized and bookmarked documents'
                      : 'Manage, inspect, and select documents for multi-source RAG chat'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-glow-sm transition-all hover:scale-105 active:scale-95"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Upload PDF
                  </button>

                  {selectedDocumentIds.length > 0 && (
                    <button
                      onClick={() => navigate('/chat')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-sm transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat with Selected ({selectedDocumentIds.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-dark-card border border-dark-border/80 p-3 rounded-2xl">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={
                      activeTab === 'favorites'
                        ? 'Search starred documents...'
                        : 'Search documents by filename...'
                    }
                    className="w-full bg-dark-surface border border-dark-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/60"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {/* Select All Toggle */}
                  <button
                    onClick={() => {
                      if (allSelected) {
                        clearDocumentSelection();
                      } else {
                        selectAllDocuments(visibleDocs.map((d) => d._id));
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-surface border border-dark-border text-xs text-gray-300 hover:text-white"
                  >
                    {allSelected ? (
                      <CheckSquare className="w-3.5 h-3.5 text-brand-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-gray-400" />
                    )}
                    <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
                  </button>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-dark-surface border border-dark-border rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="READY">Ready</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="EMBEDDING">Embedding</option>
                    <option value="FAILED">Failed</option>
                  </select>

                  <button
                    onClick={fetchDocuments}
                    className="p-1.5 rounded-lg bg-dark-surface border border-dark-border text-gray-400 hover:text-white"
                    title="Refresh list"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Document Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-44 rounded-2xl bg-dark-card/50 border border-dark-border/40 animate-pulse"
                    />
                  ))}
                </div>
              ) : visibleDocs.length === 0 ? (
                activeTab === 'favorites' ? (
                  /* Empty Starred State */
                  <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-dark-border bg-dark-card/30 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                      <Star className="w-6 h-6 fill-amber-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-white">No Starred Files Yet</h3>
                      <p className="text-xs text-dark-muted max-w-sm mx-auto">
                        Click the star icon on any document in your vault to bookmark it here for fast access.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTabChange('all')}
                      className="px-4 py-2 rounded-xl bg-dark-surface border border-dark-border text-white text-xs font-semibold hover:border-brand-500"
                    >
                      Browse All Documents
                    </button>
                  </div>
                ) : (
                  /* Empty Vault State */
                  <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-dark-border bg-dark-card/30 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-center mx-auto text-gray-400">
                      <FolderOpen className="w-6 h-6 text-brand-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-white">No documents found</h3>
                      <p className="text-xs text-dark-muted max-w-sm mx-auto">
                        Upload your first PDF document to parse text, chunk vectors, and chat with AI.
                      </p>
                    </div>
                    <button
                      onClick={() => setUploadModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-glow-sm"
                    >
                      <UploadCloud className="w-4 h-4" />
                      Upload PDF
                    </button>
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleDocs.map((doc) => (
                    <DocumentCard
                      key={doc._id}
                      document={doc}
                      onDelete={handleDelete}
                      onRetry={handleRetry}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* TAB 3: SETTINGS & API KEYS VIEW */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-dark-border">
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Settings className="w-5 h-5 text-brand-400" />
                  Settings & Engine Configuration
                </h1>
                <p className="text-xs text-dark-muted">
                  View and manage AI models, vector stores, and tenant security parameters
                </p>
              </div>

              {/* Grid of settings cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Model Card */}
                <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">LLM Provider</h3>
                      <p className="text-xs text-gray-400">Google Gemini Generation Engine</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface/60 border border-dark-border">
                      <span className="text-gray-400">Active Model</span>
                      <span className="font-mono text-brand-400 font-semibold">gemini-3.8-flash</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface/60 border border-dark-border">
                      <span className="text-gray-400">Streaming Protocol</span>
                      <span className="text-gray-200">Server-Sent Events (SSE)</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface/60 border border-dark-border">
                      <span className="text-gray-400">Temperature</span>
                      <span className="font-mono text-gray-200">0.1 (Strict Grounding)</span>
                    </div>
                  </div>
                </div>

                {/* Embeddings & Vector Card */}
                <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Vector & Embeddings</h3>
                      <p className="text-xs text-gray-400">Dense Semantic Search Layer</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface/60 border border-dark-border">
                      <span className="text-gray-400">Embedding Model</span>
                      <span className="font-mono text-cyan-400 font-semibold">gemini-embedding-001</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface/60 border border-dark-border">
                      <span className="text-gray-400">Vector Dimensions</span>
                      <span className="font-mono text-gray-200">3072 dims</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface/60 border border-dark-border">
                      <span className="text-gray-400">Batch Ingestion</span>
                      <span className="text-emerald-400 font-semibold">Ultra-Fast 50x Batching</span>
                    </div>
                  </div>
                </div>

                {/* Tenant Security Card */}
                <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Tenant Data Isolation</h3>
                      <p className="text-xs text-gray-400">Cryptographic isolation status</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-300">
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                      All vectors in your MongoDB collection are strictly bound to your authenticated User ID. No cross-tenant similarity queries are permitted.
                    </div>
                  </div>
                </div>

                {/* Chunking & Storage Limits */}
                <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Storage & RAG Limits</h3>
                      <p className="text-xs text-gray-400">Configurable chunk and upload limits</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface/60 border border-dark-border">
                      <span className="text-gray-400">Max File Size</span>
                      <span className="font-mono text-gray-200">25 MB per PDF</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface/60 border border-dark-border">
                      <span className="text-gray-400">Semantic Chunk Size</span>
                      <span className="font-mono text-gray-200">1000 characters</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-surface/60 border border-dark-border">
                      <span className="text-gray-400">Chunk Overlap</span>
                      <span className="font-mono text-gray-200">150 characters</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <DocumentUploadModal
        onUploadSuccess={(newDoc) => setDocuments((prev) => [newDoc, ...prev])}
      />
      <CitationPreviewModal />
    </div>
  );
};
