import { DocumentChunk } from '../../models/DocumentChunk.js';
import { embeddingService } from '../embeddings/embedding.service.js';
import { logger } from '../../config/logger.js';
import { env } from '../../config/env.js';

function cosineSimilarity(vecA, vecB) {
  if (!vecA?.length || !vecB?.length || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

class VectorService {
  /**
   * Search for topK relevant chunks strictly scoped to the authenticated userId.
   * NEVER query without userId.
   */
  async search({ userId, query, documentIds = [], topK = env.TOP_K_RETRIEVAL }) {
    if (!userId) {
      throw new Error('Tenant security violation: userId is required for vector search');
    }

    // Generate query embedding
    const queryEmbedding = await embeddingService.embedText(query);

    // Build filter matching tenant and optional document selection
    const filter = { userId };
    if (documentIds && documentIds.length > 0) {
      filter.documentId = { $in: documentIds };
    }

    try {
      // 1. If MongoDB Atlas Vector Search index is configured & active:
      if (env.VECTOR_STORE_PROVIDER === 'mongodb_atlas_search') {
        try {
          const results = await DocumentChunk.aggregate([
            {
              $vectorSearch: {
                index: env.MONGODB_VECTOR_INDEX,
                path: 'embedding',
                queryVector: queryEmbedding,
                numCandidates: topK * 10,
                limit: topK,
                filter: {
                  userId: { $eq: userId },
                  ...(documentIds.length ? { documentId: { $in: documentIds } } : {})
                }
              }
            },
            {
              $project: {
                _id: 1,
                documentId: 1,
                userId: 1,
                chunkIndex: 1,
                pageNumber: 1,
                content: 1,
                metadata: 1,
                score: { $meta: 'vectorSearchScore' }
              }
            }
          ]);

          if (results && results.length) {
            return results;
          }
        } catch (atlasErr) {
          logger.warn(`Atlas VectorSearch query failed (${atlasErr.message}), falling back to direct document-chunk search`);
        }
      }

      // 2. Resilient In-Database / Hybrid Similarity Search (Strictly Tenant-Scoped)
      const candidateChunks = await DocumentChunk.find(filter)
        .select('_id documentId userId chunkIndex pageNumber content embedding metadata')
        .lean()
        .exec();

      if (!candidateChunks.length) {
        return [];
      }

      // Calculate similarities and rank
      const scored = candidateChunks.map((chunk) => {
        const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
        return {
          _id: chunk._id,
          documentId: chunk.documentId,
          userId: chunk.userId,
          chunkIndex: chunk.chunkIndex,
          pageNumber: chunk.pageNumber,
          content: chunk.content,
          metadata: chunk.metadata,
          score: similarity
        };
      });

      // Sort descending by relevance score
      scored.sort((a, b) => b.score - a.score);

      return scored.slice(0, topK);
    } catch (error) {
      logger.error('Vector search failed:', { error: error.message, userId });
      throw error;
    }
  }

  async deleteByDocument(userId, documentId) {
    if (!userId || !documentId) {
      throw new Error('Tenant security violation: userId and documentId required for deletion');
    }
    return await DocumentChunk.deleteMany({ userId, documentId });
  }
}

export const vectorService = new VectorService();
