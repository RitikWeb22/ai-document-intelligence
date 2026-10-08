import { env } from '../../config/env.js';

export const chunkerService = {
  chunkDocumentPages({ pages, documentId, userId, filename, uploadedAt, chunkSize = env.CHUNK_SIZE, chunkOverlap = env.CHUNK_OVERLAP }) {
    const chunks = [];
    let globalChunkIndex = 0;

    for (const page of pages) {
      const pageText = page.text.trim();
      if (!pageText) continue;

      let start = 0;
      while (start < pageText.length) {
        let end = start + chunkSize;

        // Try not to split in the middle of a sentence if reasonable
        if (end < pageText.length) {
          const lastPeriod = pageText.lastIndexOf('. ', end);
          const lastNewline = pageText.lastIndexOf('\n', end);
          const naturalBreak = Math.max(lastPeriod, lastNewline);
          if (naturalBreak > start + Math.floor(chunkSize * 0.6)) {
            end = naturalBreak + 1;
          }
        }

        const chunkText = pageText.slice(start, end).trim();
        if (chunkText.length > 20) {
          chunks.push({
            documentId,
            userId,
            chunkIndex: globalChunkIndex++,
            pageNumber: page.pageNumber,
            content: chunkText,
            metadata: {
              filename,
              sourceType: 'pdf',
              uploadedAt: uploadedAt || new Date()
            }
          });
        }

        start = end - chunkOverlap;
        if (start >= pageText.length || end >= pageText.length) break;
      }
    }

    return chunks;
  }
};
