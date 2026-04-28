import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { BrevoService } from '../services/brevo.service';

export class AdminController {
    static async getDiagnosisResult(req: Request, res: Response) {
        try {
            const data = await AdminService.getDiagnosisResult(req.params.id as string);
            if (!data) {
                res.status(404).json({ success: false, error: 'Diagnosis not found' });
                return;
            }
            res.json({ success: true, data, error: null });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }

    static async getKPIs(req: Request, res: Response) {
        try {
            const data = await AdminService.getKPIs();
            res.json({ success: true, data, error: null });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Falha ao buscar indicadores' });
        }
    }

    static async getLeads(req: Request, res: Response) {
        try {
            const data = await AdminService.getLeads();
            res.json({ success: true, data, error: null });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Falha ao carregar lista' });
        }
    }

    static async getMentors(req: Request, res: Response) {
        try {
            const data = await AdminService.getMentors();
            res.json({ success: true, data, error: null });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Falha ao carregar mentores' });
        }
    }

    static async getLeadDetails(req: Request, res: Response) {
        try {
            const data = await AdminService.getLeadDetails(req.params.id as string);
            if (!data) {
                res.status(404).json({ success: false, error: 'Lead not found' });
                return;
            }
            res.json({ success: true, data, error: null });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }

    static async submitDiagnosis(req: Request, res: Response) {
        try {
            const { lead, answers } = req.body;
            const data = await AdminService.submitDiagnosis(lead, answers);

            const frontendUrls = process.env.FRONTEND_URL || "http://localhost:3000";
            const frontendUrl = frontendUrls.split(',')[0].trim();
            const linkResultado = `${frontendUrl}/diagnostico/resultado?id=${data.leadId}`;

            // Dispara o e-mail em background pelo Brevo
            await BrevoService.enviarEmailDiagnostico(
                lead.nome, 
                lead.email, 
                data.scoreTotal,
                linkResultado
            );

            res.json({ success: true, data, error: null });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Falha ao processar' });
        }
    }

    static async createTeamMember(req: Request, res: Response) {
        try {
            const { email, fullName, roleName } = req.body;
            const data = await AdminService.createTeamMember({ email, fullName, roleName });
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async transformToAluno(req: Request, res: Response) {
        try {
            const { mentorId } = req.body;
            const data = await AdminService.transformLeadToAluno(req.params.id as string, mentorId);
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
