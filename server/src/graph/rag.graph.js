import { StateGraph, START, END } from '@langchain/langgraph';
import { RAGStateAnnotation } from './rag.state.js';
import { vectorService } from '../services/vector/vector.service.js';
import { contextBuilderService } from '../services/rag/context-builder.service.js';
import { citationService } from '../services/rag/citation.service.js';
import { messageRepository } from '../repositories/message.repository.js';
import { logger } from '../config/logger.js';

// Node 1: Load Conversation history
async function loadConversationNode(state) {
  if (state.conversationId && state.userId) {
    try {
      const history = await messageRepository.getRecentTurns(state.userId, state.conversationId, 6);
      return { messages: history };
    } catch (err) {
      logger.warn(`Could not load conversation history: ${err.message}`);
    }
  }
  return { messages: [] };
}

// Node 2: Analyze question intent
async function analyzeQuestionNode(state) {
  const q = (state.question || '').trim();
  return { question: q };
}

// Node 3: Query Rewriting (normalize & extract keywords)
async function rewriteQueryNode(state) {
  // Normalize punctuation and whitespace for better vector embedding lookup
  const clean = state.question.replace(/[?.,!]/g, ' ').replace(/\s+/g, ' ').trim();
  return { rewrittenQuery: clean || state.question };
}

// Node 4: Retrieve Documents from Vector Service
async function retrieveNode(state) {
  try {
    const results = await vectorService.search({
      userId: state.userId,
      query: state.rewrittenQuery || state.question,
      documentIds: state.documentIds || [],
      topK: 6
    });
    return { retrievedDocuments: results };
  } catch (err) {
    logger.error('Error in retrieveNode:', { error: err.message });
    return { retrievedDocuments: [] };
  }
}

// Node 5: Evaluate Context Sufficiency
async function evaluateContextNode(state) {
  const docs = state.retrievedDocuments || [];
  if (docs.length === 0) {
    return { confidence: 'insufficient' };
  }
  // Check if top relevance score is reasonable
  const topScore = docs[0]?.score || 0;
  if (topScore < 0.1) {
    return { confidence: 'low' };
  }
  return { confidence: 'sufficient' };
}

// Node 6: Context Builder & Citations
async function generateCitationsNode(state) {
  const docs = state.retrievedDocuments || [];
  const context = contextBuilderService.buildContext(docs);
  const citations = citationService.buildCitations(docs);
  return { context, citations };
}

// Build the Graph Workflow
const workflow = new StateGraph(RAGStateAnnotation)
  .addNode('loadConversation', loadConversationNode)
  .addNode('analyzeQuestion', analyzeQuestionNode)
  .addNode('rewriteQuery', rewriteQueryNode)
  .addNode('retrieveDocuments', retrieveNode)
  .addNode('evaluateContext', evaluateContextNode)
  .addNode('generateCitations', generateCitationsNode)
  // Edges
  .addEdge(START, 'loadConversation')
  .addEdge('loadConversation', 'analyzeQuestion')
  .addEdge('analyzeQuestion', 'rewriteQuery')
  .addEdge('rewriteQuery', 'retrieveDocuments')
  .addEdge('retrieveDocuments', 'evaluateContext')
  .addEdge('evaluateContext', 'generateCitations')
  .addEdge('generateCitations', END);

export const ragGraph = workflow.compile();
