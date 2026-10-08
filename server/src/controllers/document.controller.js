import { documentService } from '../services/documents/document.service.js';
import { documentRepository } from '../repositories/document.repository.js';

export const documentController = {
  async upload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: { code: 'FILE_REQUIRED', message: 'Please provide a PDF file' }
        });
      }

      const document = await documentService.uploadAndProcess({
        userId: req.user.id,
        file: req.file
      });

      res.status(201).json({
        success: true,
        data: document
      });
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
      const search = req.query.search || '';
      const status = req.query.status;
      const favoritesOnly = req.query.favoritesOnly === 'true' || req.query.favoritesOnly === true;

      const result = await documentRepository.listByUser(req.user.id, {
        page,
        limit,
        search,
        status,
        favoritesOnly
      });

      res.status(200).json({
        success: true,
        data: result.documents,
        pagination: result.pagination
      });
    } catch (err) {
      next(err);
    }
  },

  async toggleFavorite(req, res, next) {
    try {
      const document = await documentRepository.toggleFavorite(req.user.id, req.params.id);
      if (!document) {
        return res.status(404).json({
          success: false,
          error: { code: 'DOCUMENT_NOT_FOUND', message: 'Document not found' }
        });
      }
      res.status(200).json({
        success: true,
        data: document
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const document = await documentRepository.findByUserAndId(req.user.id, req.params.id);
      if (!document) {
        return res.status(404).json({
          success: false,
          error: { code: 'DOCUMENT_NOT_FOUND', message: 'Document not found' }
        });
      }

      res.status(200).json({
        success: true,
        data: document
      });
    } catch (err) {
      next(err);
    }
  },

  async getStatus(req, res, next) {
    try {
      const document = await documentRepository.findByUserAndId(req.user.id, req.params.id);
      if (!document) {
        return res.status(404).json({
          success: false,
          error: { code: 'DOCUMENT_NOT_FOUND', message: 'Document not found' }
        });
      }

      res.status(200).json({
        success: true,
        data: {
          id: document._id,
          status: document.status,
          pageCount: document.pageCount,
          chunkCount: document.chunkCount,
          processingError: document.processingError,
          updatedAt: document.updatedAt
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async retry(req, res, next) {
    try {
      const document = await documentService.retryProcessing(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        data: document
      });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await documentService.deleteDocument(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        data: { message: 'Document and vectors deleted successfully' }
      });
    } catch (err) {
      next(err);
    }
  }
};
