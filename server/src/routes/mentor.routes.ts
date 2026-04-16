import { Router } from 'express';
import { MentorController } from '../controllers/mentor.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/dashboard', requireRole(['MENTOR']), MentorController.getDashboard);

export default router;
