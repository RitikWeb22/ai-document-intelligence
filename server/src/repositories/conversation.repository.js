import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';

export const conversationRepository = {
  async findByUserAndId(userId, conversationId) {
    return await Conversation.findOne({ _id: conversationId, userId }).exec();
  },

  async listByUser(userId, { page = 1, limit = 30 } = {}) {
    const skip = (page - 1) * limit;
    const [conversations, total] = await Promise.all([
      Conversation.find({ userId })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('documentIds', 'originalName status pageCount')
        .exec(),
      Conversation.countDocuments({ userId })
    ]);

    return {
      conversations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total
      }
    };
  },

  async create(data) {
    return await Conversation.create(data);
  },

  async update(userId, conversationId, updateData) {
    return await Conversation.findOneAndUpdate(
      { _id: conversationId, userId },
      { $set: updateData },
      { new: true }
    ).exec();
  },

  async deleteByUserAndId(userId, conversationId) {
    await Message.deleteMany({ conversationId, userId });
    return await Conversation.findOneAndDelete({ _id: conversationId, userId }).exec();
  }
};
