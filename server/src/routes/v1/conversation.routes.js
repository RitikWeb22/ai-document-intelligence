import { Router } from 'express';
import { conversationController } from '../../controllers/conversation.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', conversationController.list);
router.post('/', conversationController.create);
router.get('/:id', conversationController.getById);
router.delete('/:id', conversationController.delete);

export default router;
