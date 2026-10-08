export const citationService = {
  buildCitations(retrievedChunks) {
    if (!retrievedChunks || !retrievedChunks.length) return [];

    return retrievedChunks.map((chunk, index) => {
      const excerpt = chunk.content
        ? chunk.content.slice(0, 180).trim() + (chunk.content.length > 180 ? '...' : '')
        : '';

      return {
        documentId: chunk.documentId,
        documentName: chunk.metadata?.filename || 'Document',
        pageNumber: chunk.pageNumber || 1,
        chunkId: chunk._id?.toString() || `chunk-${chunk.chunkIndex}`,
        relevanceScore: Math.round((chunk.score || 0.85) * 100) / 100,
        excerpt
      };
    });
  }
};
