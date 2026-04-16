import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/setup', AuthController.setup);
router.post('/check-email', AuthController.checkEmail);
router.post('/set-password', AuthController.setPassword);
router.post('/login', AuthController.login);

export default router;
