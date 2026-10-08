import { Router } from 'express';
import { chatController } from '../../controllers/chat.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/stream', chatController.streamChat);
router.post('/', chatController.directChat);

export default router;
