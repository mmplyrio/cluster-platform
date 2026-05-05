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

    static async updateModuleStatus(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await MentorService.updateModuleStatus(String(id), status);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async updateTaskStatus(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await MentorService.updateTaskStatus(String(id), status);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async updateDeliverableStatus(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { status, feedback } = req.body;
            const result = await MentorService.updateDeliverableStatus(String(id), status);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async createTask(req: AuthRequest, res: Response) {
        try {
            const { moduleId } = req.params;
            const { journeyId, titulo, descricao } = req.body;
            const result = await MentorService.createTask(String(moduleId), journeyId, { titulo, descricao });
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async updateActionPlanStatus(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await MentorService.updateActionPlanStatus(String(id), status);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async createActionPlanItem(req: AuthRequest, res: Response) {
        try {
            const { companyId, janela, acao, responsavel, prazo } = req.body;
            const result = await MentorService.createActionPlanItem(companyId, { janela, acao, responsavel, prazo });
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async createLogbookEntry(req: AuthRequest, res: Response) {
        try {
            const mentorId = req.user!.userId;
            const { companyId, texto } = req.body;
            const result = await MentorService.createLogbookEntry(mentorId, companyId, texto);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    static async updateCompanyNotes(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { notes } = req.body;
            const result = await MentorService.updateCompanyNotes(String(id), notes);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async updateDiagnosis(req: AuthRequest, res: Response) {
        try {
            const { alunoId } = req.params;
            const data = req.body;
            const result = await MentorService.updateDiagnosis(String(alunoId), data);
            res.json({ success: true, data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
