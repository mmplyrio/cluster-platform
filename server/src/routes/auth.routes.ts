import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/setup', AuthController.setup);
router.post('/check-email', AuthController.checkEmail);
router.post('/set-password', AuthController.setPassword);
router.post('/login', AuthController.login);
router.get('/me', authMiddleware, AuthController.getMe);
router.put('/me', authMiddleware, AuthController.updateMe);

export default router;
