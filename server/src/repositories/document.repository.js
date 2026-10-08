import { Document } from '../models/Document.js';
import { DocumentChunk } from '../models/DocumentChunk.js';

export const documentRepository = {
  async findByUserAndId(userId, documentId) {
    return await Document.findOne({ _id: documentId, userId }).exec();
  },

  async listByUser(userId, { page = 1, limit = 20, search = '', status, favoritesOnly = false } = {}) {
    const query = { userId };
    if (status) query.status = status;
    if (favoritesOnly) query.isFavorite = true;
    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const [documents, total] = await Promise.all([
      Document.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Document.countDocuments(query)
    ]);

    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total
      }
    };
  },

  async create(data) {
    return await Document.create(data);
  },

  async updateStatus(userId, documentId, status, extra = {}) {
    return await Document.findOneAndUpdate(
      { _id: documentId, userId },
      { $set: { status, ...extra } },
      { new: true }
    ).exec();
  },

  async toggleFavorite(userId, documentId) {
    const doc = await Document.findOne({ _id: documentId, userId });
    if (!doc) return null;
    doc.isFavorite = !doc.isFavorite;
    await doc.save();
    return doc;
  },

  async deleteByUserAndId(userId, documentId) {
    // Delete chunks first (cascading cleanup)
    await DocumentChunk.deleteMany({ userId, documentId });
    return await Document.findOneAndDelete({ _id: documentId, userId }).exec();
  },

  async saveChunks(chunks) {
    if (!chunks.length) return [];
    // Bulk write for performance & idempotency
    const ops = chunks.map((chunk) => ({
      updateOne: {
        filter: { documentId: chunk.documentId, chunkIndex: chunk.chunkIndex },
        update: { $set: chunk },
        upsert: true
      }
    }));
    return await DocumentChunk.bulkWrite(ops);
  },

  async getChunksByDocument(userId, documentId) {
    return await DocumentChunk.find({ userId, documentId })
      .sort({ chunkIndex: 1 })
      .exec();
  }
};
