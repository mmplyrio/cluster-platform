import { Router } from 'express';
import { MentorController } from '../controllers/mentor.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/dashboard', requireRole(['MENTOR']), MentorController.getDashboard);
router.get('/alunos', requireRole(['MENTOR']), MentorController.getAlunosList);
router.get('/alunos/:id', requireRole(['MENTOR']), MentorController.getAlunoDetails);
router.post('/alunos', requireRole(['MENTOR']), MentorController.createMentee);
router.get('/turmas', requireRole(['MENTOR']), MentorController.getTurmas);
router.post('/turmas', requireRole(['MENTOR']), MentorController.createTurma);
router.get('/turmas/:id', requireRole(['MENTOR']), MentorController.getTurmaDetails);
router.post('/turmas/:id/alunos', requireRole(['MENTOR']), MentorController.addAlunoToTurma);
router.get('/mentores', requireRole(['MENTOR']), MentorController.getMentoresDisponiveis);
router.get('/builder', requireRole(['MENTOR']), MentorController.getBuilder);
router.post('/builder', requireRole(['MENTOR']), MentorController.createTemplate);
router.get('/builder/:id', requireRole(['MENTOR']), MentorController.getTemplate);
router.put('/builder/:id', requireRole(['MENTOR']), MentorController.updateTemplate);

export default router;
