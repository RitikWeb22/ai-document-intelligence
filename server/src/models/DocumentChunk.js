import mongoose from 'mongoose';

const documentChunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    chunkIndex: {
      type: Number,
      required: true
    },
    pageNumber: {
      type: Number,
      default: 1
    },
    content: {
      type: String,
      required: true
    },
    embedding: {
      type: [Number],
      default: []
    },
    metadata: {
      filename: String,
      sourceType: {
        type: String,
        default: 'pdf'
      },
      uploadedAt: Date
    }
  },
  {
    timestamps: true
  }
);

// Deterministic chunk identity for idempotency
documentChunkSchema.index({ documentId: 1, chunkIndex: 1 }, { unique: true });
documentChunkSchema.index({ userId: 1, documentId: 1 });

export const DocumentChunk = mongoose.model('DocumentChunk', documentChunkSchema);
