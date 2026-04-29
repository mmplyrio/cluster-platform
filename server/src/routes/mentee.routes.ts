import { Router } from 'express';
import { MenteeController } from '../controllers/mentee.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/trilha', requireRole(['ALUNO']), MenteeController.getTrilha);
router.get('/plano-de-acao', requireRole(['ALUNO']), MenteeController.getPlanoAcao);

export default router;
