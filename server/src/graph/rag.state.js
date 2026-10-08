import { Annotation } from '@langchain/langgraph';

export const RAGStateAnnotation = Annotation.Root({
  userId: Annotation({ reducer: (_, b) => b, default: () => '' }),
  conversationId: Annotation({ reducer: (_, b) => b, default: () => '' }),
  question: Annotation({ reducer: (_, b) => b, default: () => '' }),
  documentIds: Annotation({ reducer: (_, b) => b, default: () => [] }),
  rewrittenQuery: Annotation({ reducer: (_, b) => b, default: () => '' }),
  retrievedDocuments: Annotation({ reducer: (_, b) => b, default: () => [] }),
  context: Annotation({ reducer: (_, b) => b, default: () => '' }),
  answer: Annotation({ reducer: (_, b) => b, default: () => '' }),
  citations: Annotation({ reducer: (_, b) => b, default: () => [] }),
  messages: Annotation({ reducer: (_, b) => b, default: () => [] }),
  confidence: Annotation({ reducer: (_, b) => b, default: () => 'high' }),
  metadata: Annotation({ reducer: (_, b) => b, default: () => ({}) })
});
