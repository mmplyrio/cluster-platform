import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de chat requerem autenticação
router.use(authMiddleware);

router.get('/conversations', ChatController.getConversations);
router.get('/conversations/:id/messages', ChatController.getMessages);
router.get('/overview', ChatController.getOverview);
router.get('/radar', ChatController.getRadar);
router.post('/messages', ChatController.sendMessage);
router.post('/conversations', ChatController.createConversation);

export default router;
