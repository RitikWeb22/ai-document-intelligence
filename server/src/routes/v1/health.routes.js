import { Router } from 'express';
import mongoose from 'mongoose';
import { env } from '../../config/env.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

router.get('/health/ready', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ready',
    services: {
      database: dbStatus,
      llmProvider: env.LLM_PROVIDER,
      embeddingProvider: env.EMBEDDING_PROVIDER,
      vectorStore: env.VECTOR_STORE_PROVIDER,
      storage: env.STORAGE_PROVIDER
    }
  });
});

export default router;
