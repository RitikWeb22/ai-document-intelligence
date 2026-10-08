# DocuMind AI — Enterprise Document Intelligence Platform
### Production-Ready RAG + LangGraph Orchestration + Grounded Vector Search

DocuMind AI is a full-stack, enterprise-grade AI document intelligence platform built with **React**, **Node.js Express**, **LangChain**, **LangGraph**, and **MongoDB Atlas Vector Search**.

It combines the fast research synthesis of **NotebookLM** and **Perplexity** with rigorous multi-tenant vector isolation, traceable page-level source citations, and real-time SSE streaming.

---

## 🚀 Key Features

- **Document Processing Pipeline**:
  - Validates and uploads multi-page PDFs up to 25MB.
  - Page-by-page text extraction with formatting normalization.
  - Semantic chunking with configurable overlap (1000 characters / 150 overlap).
  - Dense embedding generation (Google Gemini / OpenAI abstraction).
  - Bulk upsert into vector database with idempotency safeguards.
- **Conversational RAG (LangGraph Orchestration)**:
  - Graph-based workflow: conversation loader, query analysis, query rewriting, vector retrieval, and context evaluation.
  - Strict grounding system prompts with anti-prompt-injection boundaries (`<document_context>`).
- **Verifiable Citation System**:
  - Answers include clickable citation chips `[1]` linked to exact document names, page numbers, relevance score percentages, and chunk excerpts.
- **Enterprise Multi-Tenant Security**:
  - Cryptographic tenant filtering on all database and vector similarity searches (`userId: req.user.id`).
  - Cascading cleanup: deleting a document removes file storage, document records, and vector embeddings atomically.
- **Streaming UI**:
  - Server-Sent Events (SSE) streaming answers token-by-token with stop-generation capabilities.
  - Sleek dark theme, subtle obsidian glassmorphism, responsive split-pane chat, and drag-and-drop document vault.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Zustand, React Router, Lucide Icons |
| **Backend** | Node.js (Modern ES Modules), Express.js, Multer, Helmet, Rate Limiter |
| **AI Orchestration** | LangGraph (`@langchain/langgraph`), LangChain (`@langchain/core`, `@langchain/google-genai`) |
| **Data & Vectors** | MongoDB Atlas, Atlas Vector Search / Cosine Similarity Engine |
| **Streaming** | Server-Sent Events (SSE) over HTTP |

---

## 📂 Architecture Overview

```text
root/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Layout, Document Vault, Chat, Citations
│   │   ├── pages/              # LandingPage, LoginPage, RegisterPage, DashboardPage, ChatPage
│   │   ├── services/           # Centralized API client & SSE streaming parser
│   │   ├── stores/             # Zustand authStore and documentStore
│   │   └── App.jsx
│   └── package.json
│
├── server/                     # Node.js + Express backend
│   ├── src/
│   │   ├── config/             # env.js, database.js, logger.js
│   │   ├── controllers/        # Thin HTTP controllers (auth, document, chat, health)
│   │   ├── graph/              # LangGraph state machine & RAG nodes
│   │   ├── middleware/         # requireAuth, errorHandler, rateLimiter
│   │   ├── models/             # Mongoose schemas (User, Document, DocumentChunk, Conversation, Message)
│   │   ├── repositories/       # Tenant-isolated database repositories
│   │   ├── routes/v1/          # Versioned REST & SSE routes
│   │   ├── services/           # RAG, Vector Search, AI LLM, PDF parser, Chunker, Storage
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── shared/constants/           # Shared status codes, events, endpoints
├── docker-compose.yml
└── .env.example
```

---

## 🚦 Quick Start Guide

### 1. Environment Configuration

Copy `.env.example` to `.env` in the root:

```bash
cp .env.example .env
```

Configure your environment variables:

```ini
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai-pdfreader
JWT_SECRET=super_secret_jwt_key_at_least_32_characters
GEMINI_API_KEY=your_gemini_api_key_here
LLM_MODEL=gemini-1.5-flash
```

### 2. Start the Backend Server

```bash
cd server
npm install --legacy-peer-deps
npm run dev
```

The server will boot on `http://localhost:5000`.

### 3. Start the Frontend Client

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

The client will start at `http://localhost:5173`.

---

## 🔌 API Endpoints Reference

### Authentication
- `POST /api/v1/auth/register` — Create new account
- `POST /api/v1/auth/login` — Sign in and receive JWT token
- `GET  /api/v1/auth/me` — Get authenticated profile
- `POST /api/v1/auth/logout` — End session

### Documents & Ingestion
- `POST   /api/v1/documents` — Upload and trigger asynchronous PDF RAG ingestion
- `GET    /api/v1/documents` — List user's documents with pagination & search
- `GET    /api/v1/documents/:id` — Get document details
- `GET    /api/v1/documents/:id/status` — Poll document processing lifecycle
- `POST   /api/v1/documents/:id/retry` — Retry failed document ingestion
- `DELETE /api/v1/documents/:id` — Delete document and associated vectors

### AI Chat & RAG
- `POST /api/v1/chat/stream` — SSE token-by-token answer stream with citations
- `POST /api/v1/chat` — Synchronous direct question endpoint
- `GET  /api/v1/conversations` — List conversation threads
- `GET  /api/v1/conversations/:id` — Retrieve thread message history
- `DELETE /api/v1/conversations/:id` — Remove thread

### Health
- `GET /api/v1/health` — System status
- `GET /api/v1/health/ready` — Subsystem readiness (database, vector search, LLM)
