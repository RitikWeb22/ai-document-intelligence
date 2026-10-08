import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root if available, otherwise server dir
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // Database (MongoDB Atlas)
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-document-intelligence',

  // Auth & JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_key_change_in_production_12345678',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_refresh_key_change_in_production_87654321',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Google Gemini AI & Embeddings
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.LLM_API_KEY || '',
  LLM_MODEL: process.env.LLM_MODEL || 'gemini-3.8-flash',
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || 'gemini-embedding-001',

  // Local Secure Storage
  STORAGE_LOCAL_PATH: process.env.STORAGE_LOCAL_PATH || path.resolve(__dirname, '../../uploads'),
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '25', 10),
  MAX_DOCUMENT_PAGES: parseInt(process.env.MAX_DOCUMENT_PAGES || '500', 10),

  // RAG Configuration
  CHUNK_SIZE: parseInt(process.env.CHUNK_SIZE || '1000', 10),
  CHUNK_OVERLAP: parseInt(process.env.CHUNK_OVERLAP || '150', 10),
  TOP_K_RETRIEVAL: parseInt(process.env.TOP_K_RETRIEVAL || '6', 10),

  // Rate Limiting (In-memory standard limiter)
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
};
