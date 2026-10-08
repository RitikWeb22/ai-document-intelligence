import { Message } from '../models/Message.js';

export const messageRepository = {
  async listByConversation(userId, conversationId, { limit = 50 } = {}) {
    return await Message.find({ userId, conversationId })
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean()
      .exec();
  },

  async create(data) {
    return await Message.create(data);
  },

  async getRecentTurns(userId, conversationId, count = 10) {
    const messages = await Message.find({ userId, conversationId })
      .sort({ createdAt: -1 })
      .limit(count)
      .lean()
      .exec();
    return messages.reverse();
  }
};
