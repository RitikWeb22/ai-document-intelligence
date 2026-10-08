import { documentRepository } from '../../repositories/document.repository.js';
import { storageService } from '../storage/storage.service.js';
import { pdfParserService } from './pdf-parser.service.js';
import { textCleanerService } from './text-cleaner.service.js';
import { chunkerService } from './chunker.service.js';
import { embeddingService } from '../embeddings/embedding.service.js';
import { logger } from '../../config/logger.js';

export const documentService = {
  async uploadAndProcess({ userId, file }) {
    if (!file) {
      throw new Error('No file provided');
    }

    // 1. File Validation
    const allowedMimeTypes = ['application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Only PDF files are supported');
    }

    // 2. Secure Storage
    const { storageKey } = await storageService.saveFile(file.buffer, file.originalname);

    // 3. Document Record Creation with Status = UPLOADING
    const document = await documentRepository.create({
      userId,
      filename: storageKey,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      storageKey,
      status: 'PROCESSING'
    });

    // 4. Trigger asynchronous background pipeline
    setImmediate(() => {
      this.processDocument(userId, document._id, file.buffer).catch((err) => {
        logger.error(`Error processing document ${document._id}:`, { error: err.message });
      });
    });

    return document;
  },

  async processDocument(userId, documentId, optionalBuffer = null) {
    try {
      const document = await documentRepository.findByUserAndId(userId, documentId);
      if (!document) return;

      await documentRepository.updateStatus(userId, documentId, 'PROCESSING');

      // Get buffer
      const buffer = optionalBuffer || (await storageService.getFileBuffer(document.storageKey));

      // 5. Text Extraction
      const { text, pageCount, pages } = await pdfParserService.extractText(buffer);

      // 6. Text Cleaning & Validation
      const cleanedText = textCleanerService.clean(text);
      if (!textCleanerService.hasMeaningfulText(cleanedText)) {
        throw new Error('Document contains no extractable text or is a scanned image requiring OCR');
      }

      const cleanedPages = pages.map((p) => ({
        pageNumber: p.pageNumber,
        text: textCleanerService.clean(p.text)
      }));

      // 7. Chunking
      await documentRepository.updateStatus(userId, documentId, 'EMBEDDING', { pageCount });

      const chunks = chunkerService.chunkDocumentPages({
        pages: cleanedPages,
        documentId: document._id,
        userId,
        filename: document.originalName,
        uploadedAt: document.createdAt
      });

      if (!chunks.length) {
        throw new Error('Unable to extract meaningful semantic chunks from document');
      }

      // 8. Embedding Generation in batches
      const textsToEmbed = chunks.map((c) => c.content);
      const embeddings = await embeddingService.embedDocuments(textsToEmbed);

      for (let i = 0; i < chunks.length; i++) {
        chunks[i].embedding = embeddings[i];
      }

      // 9. Vector Storage & idempotent bulk upsert
      await documentRepository.saveChunks(chunks);

      // 10. Status = READY
      await documentRepository.updateStatus(userId, documentId, 'READY', {
        pageCount,
        chunkCount: chunks.length,
        processingError: null
      });

      logger.info(`Document ${documentId} processed successfully with ${chunks.length} chunks`);
    } catch (error) {
      logger.error(`Failed to process document ${documentId}:`, { error: error.message });
      await documentRepository.updateStatus(userId, documentId, 'FAILED', {
        processingError: error.message
      });
    }
  },

  async retryProcessing(userId, documentId) {
    const document = await documentRepository.findByUserAndId(userId, documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    // Re-trigger background process
    setImmediate(() => {
      this.processDocument(userId, documentId).catch((err) => {
        logger.error(`Retry failed for document ${documentId}:`, { error: err.message });
      });
    });
    return await documentRepository.updateStatus(userId, documentId, 'PROCESSING', { processingError: null });
  },

  async deleteDocument(userId, documentId) {
    const document = await documentRepository.findByUserAndId(userId, documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    // Set DELETING status
    await documentRepository.updateStatus(userId, documentId, 'DELETING');

    // 1. Remove storage file
    await storageService.deleteFile(document.storageKey);

    // 2. Cascade delete document record and chunks
    await documentRepository.deleteByUserAndId(userId, documentId);

    return { success: true };
  }
};
