import { Router } from 'express';
import { MentorController } from '../controllers/mentor.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/dashboard', requireRole(['MENTOR']), MentorController.getDashboard);
router.get('/alunos', requireRole(['MENTOR']), MentorController.getAlunosList);
router.post('/alunos', requireRole(['MENTOR']), MentorController.createMentee);
router.get('/turmas', requireRole(['MENTOR']), MentorController.getTurmas);
router.get('/builder', requireRole(['MENTOR']), MentorController.getBuilder);

export default router;
