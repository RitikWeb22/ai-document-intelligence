import { conversationService } from '../services/conversation.service.js';

export const conversationController = {
  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '20', 10);
      const result = await conversationService.listUserConversations(req.user.id, { page, limit });
      res.status(200).json({
        success: true,
        data: result.conversations,
        pagination: result.pagination
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const { title, documentIds } = req.body;
      const conversation = await conversationService.createConversation(req.user.id, {
        title,
        documentIds: documentIds || []
      });
      res.status(201).json({
        success: true,
        data: conversation
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const result = await conversationService.getConversation(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await conversationService.deleteConversation(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        data: { message: 'Conversation deleted successfully' }
      });
    } catch (err) {
      next(err);
    }
  }
};
