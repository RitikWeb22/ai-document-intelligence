import { Router } from 'express';
import multer from 'multer';
import { documentController } from '../../controllers/document.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { env } from '../../config/env.js';

const router = Router();

// Configure memory storage for streaming validation
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are permitted'), false);
    }
  }
});

router.use(requireAuth);

router.post('/', upload.single('file'), documentController.upload);
router.get('/', documentController.list);
router.get('/:id', documentController.getById);
router.get('/:id/status', documentController.getStatus);
router.post('/:id/retry', documentController.retry);
router.patch('/:id/favorite', documentController.toggleFavorite);
router.delete('/:id', documentController.delete);

export default router;
