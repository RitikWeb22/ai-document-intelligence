import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/layout/Navbar.jsx';
import { ChatMessage } from '../components/chat/ChatMessage.jsx';
import { ChatInput } from '../components/chat/ChatInput.jsx';
import { CitationPreviewModal } from '../components/chat/CitationPreviewModal.jsx';
import { DocumentUploadModal } from '../components/documents/DocumentUploadModal.jsx';
import { useDocumentStore } from '../stores/documentStore.js';
import { documentsApi, chatApi, conversationsApi } from '../services/index.js';
import {
  FileText,
  CheckSquare,
  Square,
  PlusCircle,
  MessageSquare,
  Trash2,
  Clock,
  Plus,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';

const WELCOME_MESSAGE = {
  _id: 'initial-welcome',
  role: 'assistant',
  content: `Hello! I am your **DocuMind AI** document intelligence assistant.

I answer questions **strictly using facts retrieved from your uploaded documents**, and accompany claims with verified page citations.

Select documents on the left panel or ask across your entire vault!`,
  citations: []
};

export const ChatPage = () => {
  const {
    selectedDocumentIds,
    toggleDocumentSelection,
    selectAllDocuments,
    clearDocumentSelection,
    setUploadModalOpen
  } = useDocumentStore();

  const [documents, setDocuments] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(() => localStorage.getItem('documind_active_conv') || null);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [sidebarTab, setSidebarTab] = useState('documents'); // 'documents' | 'history'
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const abortControllerRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Load documents
  const loadDocs = async () => {
    try {
      const res = await documentsApi.list();
      if (res?.data) {
        setDocuments(res.data);
      } else {
        setDocuments([]);
      }
    } catch (e) {
      setDocuments([]);
    }
  };

  // Load list of past conversations
  const loadConversations = async () => {
    try {
      const res = await conversationsApi.list();
      if (res?.data) {
        setConversations(res.data);
      }
    } catch (e) {
      setConversations([]);
    }
  };

  // Load specific conversation's history
  const loadConversationHistory = async (convId) => {
    if (!convId) return;
    try {
      const res = await conversationsApi.getById(convId);
      if (res?.data?.messages && res.data.messages.length > 0) {
        setMessages(res.data.messages);
        setActiveConvId(convId);
        localStorage.setItem('documind_active_conv', convId);
      }
    } catch (e) {
      // Fallback to welcome message if thread not found
      setActiveConvId(null);
      localStorage.removeItem('documind_active_conv');
      setMessages([WELCOME_MESSAGE]);
    }
  };

  useEffect(() => {
    loadDocs();
    loadConversations();
    if (activeConvId) {
      loadConversationHistory(activeConvId);
    }
  }, []);

  // Auto scroll to bottom on message updates
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const handleNewChat = () => {
    setActiveConvId(null);
    localStorage.removeItem('documind_active_conv');
    setMessages([WELCOME_MESSAGE]);
    setStreamingMessage(null);
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    try {
      await conversationsApi.delete(convId);
      setConversations((prev) => prev.filter((c) => c._id !== convId));
      if (activeConvId === convId) {
        handleNewChat();
      }
    } catch (err) {
      // Handled
    }
  };

  const handleSend = async (question) => {
    const userMsg = {
      _id: 'usr-' + Date.now(),
      role: 'user',
      content: question
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    const activeStreamMsg = {
      _id: 'ast-' + Date.now(),
      role: 'assistant',
      content: '',
      citations: []
    };
    setStreamingMessage(activeStreamMsg);

    abortControllerRef.current = new AbortController();

    await chatApi.streamChat({
      question,
      conversationId: activeConvId,
      documentIds: selectedDocumentIds,
      signal: abortControllerRef.current.signal,
      onToken: (token) => {
        setStreamingMessage((prev) => (prev ? { ...prev, content: prev.content + token } : prev));
      },
      onCitation: (citations) => {
        setStreamingMessage((prev) => (prev ? { ...prev, citations } : prev));
      },
      onComplete: (data) => {
        setStreamingMessage((current) => {
          if (current) {
            setMessages((prev) => [...prev, current]);
          }
          return null;
        });
        if (data?.conversationId) {
          setActiveConvId(data.conversationId);
          localStorage.setItem('documind_active_conv', data.conversationId);
          loadConversations();
        }
        setIsStreaming(false);
      },
      onError: (errMsg) => {
        setStreamingMessage((current) => {
          if (current) {
            setMessages((prev) => [
              ...prev,
              {
                ...current,
                content:
                  current.content ||
                  'Something went wrong while generating the response. Please check your document selection or try again.'
              }
            ]);
          }
          return null;
        });
        setIsStreaming(false);
      }
    });
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (streamingMessage) {
      setMessages((prev) => [...prev, streamingMessage]);
      setStreamingMessage(null);
    }
    setIsStreaming(false);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex flex-col">
      <Navbar />

      {/* Main Split-Pane Assistant Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto overflow-hidden h-[calc(100vh-4rem)]">
        {/* Left Sidebar Pane: Scope & History */}
        <aside className="w-80 border-r border-dark-border/80 bg-dark-card/50 flex flex-col justify-between shrink-0 p-4 overflow-hidden">
          <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-glow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              New Conversation
            </button>

            {/* Tab Switcher: Documents vs History */}
            <div className="flex rounded-xl bg-dark-surface/60 p-1 border border-dark-border/60 text-xs font-medium">
              <button
                onClick={() => setSidebarTab('documents')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  sidebarTab === 'documents'
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Documents ({documents.length})</span>
              </button>

              <button
                onClick={() => setSidebarTab('history')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  sidebarTab === 'history'
                    ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>History ({conversations.length})</span>
              </button>
            </div>

            {/* TAB A: DOCUMENTS SELECTION */}
            {sidebarTab === 'documents' && (
              <div className="flex-1 flex flex-col overflow-hidden space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400 pb-1">
                  <span>{selectedDocumentIds.length} of {documents.length} Selected</span>
                  <button
                    onClick={() => {
                      if (selectedDocumentIds.length === documents.length) {
                        clearDocumentSelection();
                      } else {
                        selectAllDocuments(documents.map((d) => d._id));
                      }
                    }}
                    className="text-brand-400 hover:underline"
                  >
                    {selectedDocumentIds.length === documents.length ? 'Clear all' : 'Select all'}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {documents.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-dark-border text-center space-y-2 bg-dark-surface/30">
                      <FileText className="w-6 h-6 text-gray-500 mx-auto" />
                      <p className="text-[11px] text-gray-400">No documents in vault yet.</p>
                      <button
                        onClick={() => setUploadModalOpen(true)}
                        className="text-[11px] text-brand-400 hover:underline font-semibold"
                      >
                        + Upload PDF
                      </button>
                    </div>
                  ) : (
                    documents.map((doc) => {
                      const isSelected = selectedDocumentIds.includes(doc._id);
                      return (
                        <div
                          key={doc._id}
                          onClick={() => toggleDocumentSelection(doc._id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-brand-500/15 border-brand-500/40 text-white shadow-glow-sm'
                              : 'bg-dark-surface/50 border-dark-border/70 text-gray-300 hover:bg-dark-surface hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 text-brand-400 shrink-0">
                              {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-gray-500" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold truncate">{doc.originalName}</p>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                                <span>{doc.pageCount || 1} pages</span>
                                <span>•</span>
                                <span>{doc.chunkCount || 0} chunks</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB B: PAST CHATS HISTORY */}
            {sidebarTab === 'history' && (
              <div className="flex-1 flex flex-col overflow-hidden space-y-2">
                <p className="text-[11px] text-gray-400">Your saved conversations</p>
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  {conversations.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-dark-border text-center space-y-2 bg-dark-surface/30">
                      <MessageSquare className="w-6 h-6 text-gray-500 mx-auto" />
                      <p className="text-[11px] text-gray-400">No chat history yet.</p>
                      <p className="text-[10px] text-gray-500">Ask a question to start your first saved session.</p>
                    </div>
                  ) : (
                    conversations.map((conv) => {
                      const isCurrent = activeConvId === conv._id;
                      return (
                        <div
                          key={conv._id}
                          onClick={() => loadConversationHistory(conv._id)}
                          className={`group flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-brand-500/15 border-brand-500/40 text-white shadow-glow-sm'
                              : 'bg-dark-surface/50 border-dark-border/60 text-gray-300 hover:bg-dark-surface hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-brand-400' : 'text-gray-500'}`} />
                            <span className="truncate font-medium">{conv.title || 'Conversation'}</span>
                          </div>

                          <button
                            onClick={(e) => handleDeleteConversation(e, conv._id)}
                            className="p-1 rounded-md text-gray-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Chat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-dark-border/60 text-[11px] text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Strict tenant isolation enforced</span>
          </div>
        </aside>

        {/* Center / Right Chat View */}
        <section className="flex-1 flex flex-col justify-between overflow-hidden bg-dark-bg/60">
          {/* Chat Messages Scrollable Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <ChatMessage key={msg._id || i} message={msg} />
            ))}

            {/* In-flight streaming response token render */}
            {streamingMessage && (
              <ChatMessage message={streamingMessage} />
            )}

            {isStreaming && !streamingMessage?.content && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-dark-card border border-dark-border text-xs text-gray-300">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-ping" />
                <span>DocuMind is retrieving isolated chunks and synthesizing answer...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Sticky Bottom Prompt Input Area */}
          <div className="p-4 border-t border-dark-border/80 bg-dark-bg/95">
            <div className="max-w-4xl mx-auto">
              <ChatInput
                onSend={handleSend}
                onStop={handleStop}
                isStreaming={isStreaming}
                selectedCount={selectedDocumentIds.length}
              />
            </div>
          </div>
        </section>
      </div>

      <CitationPreviewModal />
      <DocumentUploadModal onUploadSuccess={(doc) => setDocuments((prev) => [doc, ...prev])} />
    </div>
  );
};
