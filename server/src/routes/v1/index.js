import { Router } from 'express';
import authRoutes from './auth.routes.js';
import documentRoutes from './document.routes.js';
import conversationRoutes from './conversation.routes.js';
import chatRoutes from './chat.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);
router.use('/conversations', conversationRoutes);
router.use('/chat', chatRoutes);
router.use('/', healthRoutes);

export default router;
