import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.post('/diagnosis', AdminController.submitDiagnosis);

router.use(authMiddleware);

router.get('/kpis', requireRole(['ADMIN', 'COMERCIAL']), AdminController.getKPIs);
router.get('/leads', requireRole(['ADMIN', 'COMERCIAL']), AdminController.getLeads);
router.get('/leads/:id', requireRole(['ADMIN', 'COMERCIAL']), AdminController.getLeadDetails);
router.get('/mentors', requireRole(['ADMIN', 'COMERCIAL']), AdminController.getMentors);
router.post('/leads/:id/convert', requireRole(['ADMIN', 'COMERCIAL']), AdminController.transformToAluno);

router.post('/team', requireRole(['ADMIN']), AdminController.createTeamMember);

export default router;
