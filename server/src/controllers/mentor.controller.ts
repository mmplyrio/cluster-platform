import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { MentorService } from '../services/mentor.service';

export class MentorController {
    static async getDashboard(req: AuthRequest, res: Response) {
        try {
            const mentorId = req.user!.userId;
            const data = await MentorService.getDashboard(mentorId);
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async getAlunosList(req: AuthRequest, res: Response) {
        try {
            const mentorId = req.user!.userId;
            const data = await MentorService.getAlunosList(mentorId);
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async getTurmas(req: AuthRequest, res: Response) {
        try {
            const mentorId = req.user!.userId;
            const data = await MentorService.getTurmas(mentorId);
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async getBuilder(req: AuthRequest, res: Response) {
        try {
            const mentorId = req.user!.userId;
            const data = await MentorService.getBuilder(mentorId);
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
