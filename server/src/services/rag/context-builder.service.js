export const contextBuilderService = {
  buildContext(retrievedChunks) {
    if (!retrievedChunks || !retrievedChunks.length) {
      return '';
    }

    return retrievedChunks
      .map((chunk, index) => {
        const sourceName = chunk.metadata?.filename || 'Document';
        const page = chunk.pageNumber ? `Page ${chunk.pageNumber}` : 'Page 1';
        return `[Source ${index + 1}: ${sourceName} (${page})]\n${chunk.content}`;
      })
      .join('\n\n---\n\n');
  }
};
