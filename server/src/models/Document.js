import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    storageKey: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['UPLOADING', 'PROCESSING', 'EMBEDDING', 'READY', 'FAILED', 'DELETING', 'DELETED'],
      default: 'UPLOADING',
      index: true
    },
    pageCount: {
      type: Number,
      default: 0
    },
    chunkCount: {
      type: Number,
      default: 0
    },
    processingError: {
      type: String,
      default: null
    },
    isFavorite: {
      type: Boolean,
      default: false,
      index: true
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

documentSchema.index({ userId: 1, createdAt: -1 });
documentSchema.index({ userId: 1, status: 1 });

export const Document = mongoose.model('Document', documentSchema);
