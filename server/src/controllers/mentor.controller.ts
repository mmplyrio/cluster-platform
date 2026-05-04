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

    static async createTemplate(req: AuthRequest, res: Response) {
        try {
            const mentorId = req.user!.userId;
            const data = await MentorService.createMentorshipTemplate(mentorId, req.body);
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async getTemplate(req: AuthRequest, res: Response) {
        try {
            const mentorId = req.user!.userId;
            const { id } = req.params;
            const data = await MentorService.getMentorshipTemplate(id as string, mentorId);
            if (!data) return res.status(404).json({ success: false, error: 'template_not_found' });
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async updateTemplate(req: AuthRequest, res: Response) {
        try {
            const mentorId = req.user!.userId;
            const { id } = req.params;
            const data = await MentorService.updateMentorshipTemplate(id as string, mentorId, req.body);
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async getTurmaDetails(req: AuthRequest, res: Response) {
        try {
            const mentorId = req.user!.userId;
            const { id } = req.params;
            const data = await MentorService.getTurmaDetails(mentorId, id as string);
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async createMentee(req: AuthRequest, res: Response) {
        try {
            const mentorId = req.user!.userId;
            const result = await MentorService.createMentee(mentorId, req.body);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async getAlunoDetails(req: AuthRequest, res: Response) {
        try {
            const mentorId = req.user!.userId;
            const { id } = req.params;
            const data = await MentorService.getAlunoDetails(mentorId, id as string);
            res.json({ success: true, data });
        } catch (error: any) {
            if (error.message === 'aluno_not_found') {
                res.status(404).json({ success: false, error: 'aluno_not_found' });
            } else {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    }

    static async getMentoresDisponiveis(req: AuthRequest, res: Response) {
        try {
            const data = await MentorService.getMentoresDisponiveis();
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async createTurma(req: AuthRequest, res: Response) {
        try {
            const mentorId = req.user!.userId;
            const result = await MentorService.createTurma(mentorId, req.body);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async addAlunoToTurma(req: AuthRequest, res: Response) {
        try {
            const turmaId = req.params.id as string;
            const companyId = req.body.companyId as string;
            if (!companyId) throw new Error("companyId is required");
            const result = await MentorService.addAlunoToTurma(turmaId, companyId, req.body);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
