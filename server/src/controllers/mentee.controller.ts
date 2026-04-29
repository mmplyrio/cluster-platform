import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { MenteeService } from '../services/mentee.service';

export class MenteeController {
    static async getTrilha(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const data = await MenteeService.getTrilha(userId);
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async getPlanoAcao(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const data = await MenteeService.getPlanoAcao(userId);
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
