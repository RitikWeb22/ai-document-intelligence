import { conversationRepository } from '../repositories/conversation.repository.js';
import { messageRepository } from '../repositories/message.repository.js';

export const conversationService = {
  async listUserConversations(userId, params) {
    return await conversationRepository.listByUser(userId, params);
  },

  async getConversation(userId, conversationId) {
    const conversation = await conversationRepository.findByUserAndId(userId, conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    const messages = await messageRepository.listByConversation(userId, conversationId);
    return { conversation, messages };
  },

  async createConversation(userId, { title, documentIds = [] }) {
    return await conversationRepository.create({
      userId,
      title: title || 'New Document Chat',
      documentIds
    });
  },

  async deleteConversation(userId, conversationId) {
    const deleted = await conversationRepository.deleteByUserAndId(userId, conversationId);
    if (!deleted) {
      throw new Error('Conversation not found');
    }
    return { success: true };
  }
};
