import { ragGraph } from '../graph/rag.graph.js';
import { aiService } from '../services/ai/ai.service.js';
import { messageRepository } from '../repositories/message.repository.js';
import { conversationRepository } from '../repositories/conversation.repository.js';
import { logger } from '../config/logger.js';

export const chatController = {
  /**
   * SSE Streaming Chat Endpoint
   * POST /api/v1/chat/stream
   */
  async streamChat(req, res) {
    const { question, conversationId, documentIds } = req.body;
    const userId = req.user.id;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_QUESTION', message: 'A valid question string is required' }
      });
    }

    // Set Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Helper to send SSE event
    const sendEvent = (event, data) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      sendEvent('message:start', { status: 'analyzing_question' });

      // Ensure conversation exists or create one
      let convId = conversationId;
      if (!convId) {
        const conv = await conversationRepository.create({
          userId,
          title: question.slice(0, 45),
          documentIds: documentIds || []
        });
        convId = conv._id.toString();
      }

      // Save user question to message history
      await messageRepository.create({
        conversationId: convId,
        userId,
        role: 'user',
        content: question
      });

      // 1. Run LangGraph workflow for retrieval, query rewriting & citation extraction
      const graphState = await ragGraph.invoke({
        userId,
        conversationId: convId,
        question,
        documentIds: documentIds || []
      });

      const citations = graphState.citations || [];
      const context = graphState.context || '';
      const messages = graphState.messages || [];

      // Send citations to client
      if (citations.length > 0) {
        sendEvent('citation', { citations });
      }

      // 2. Stream answer tokens from AI service
      let fullAnswer = '';
      const stream = aiService.streamResponse({
        messages,
        contextText: context,
        userQuestion: question
      });

      for await (const token of stream) {
        fullAnswer += token;
        sendEvent('message:token', { text: token });
      }

      // 3. Save assistant response with structured citations
      const savedMessage = await messageRepository.create({
        conversationId: convId,
        userId,
        role: 'assistant',
        content: fullAnswer,
        citations
      });

      // Update conversation lastMessageAt
      await conversationRepository.update(userId, convId, {
        lastMessageAt: new Date()
      });

      sendEvent('message:complete', {
        messageId: savedMessage._id,
        conversationId: convId,
        citations
      });

      res.end();
    } catch (err) {
      logger.error('Chat streaming failed:', { error: err.message, userId });
      sendEvent('message:error', {
        message: 'Something went wrong while generating the response. Please try again.'
      });
      res.end();
    }
  },

  /**
   * Non-streaming direct Chat Endpoint
   * POST /api/v1/chat
   */
  async directChat(req, res, next) {
    try {
      const { question, conversationId, documentIds } = req.body;
      const userId = req.user.id;

      if (!question) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_QUESTION', message: 'Question is required' }
        });
      }

      let convId = conversationId;
      if (!convId) {
        const conv = await conversationRepository.create({
          userId,
          title: question.slice(0, 45),
          documentIds: documentIds || []
        });
        convId = conv._id.toString();
      }

      await messageRepository.create({
        conversationId: convId,
        userId,
        role: 'user',
        content: question
      });

      const graphState = await ragGraph.invoke({
        userId,
        conversationId: convId,
        question,
        documentIds: documentIds || []
      });

      const citations = graphState.citations || [];
      const context = graphState.context || '';
      const messages = graphState.messages || [];

      let fullAnswer = '';
      const stream = aiService.streamResponse({
        messages,
        contextText: context,
        userQuestion: question
      });

      for await (const token of stream) {
        fullAnswer += token;
      }

      const savedMessage = await messageRepository.create({
        conversationId: convId,
        userId,
        role: 'assistant',
        content: fullAnswer,
        citations
      });

      res.status(200).json({
        success: true,
        data: {
          messageId: savedMessage._id,
          conversationId: convId,
          content: fullAnswer,
          citations
        }
      });
    } catch (err) {
      next(err);
    }
  }
};
