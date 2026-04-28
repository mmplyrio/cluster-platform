"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("../services/admin.service");
const brevo_service_1 = require("../services/brevo.service");
class AdminController {
    static async getDiagnosisResult(req, res) {
        try {
            const data = await admin_service_1.AdminService.getDiagnosisResult(req.params.id);
            if (!data) {
                res.status(404).json({ success: false, error: 'Diagnosis not found' });
                return;
            }
            res.json({ success: true, data, error: null });
        }
        catch (error) {
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }
    static async getKPIs(req, res) {
        try {
            const data = await admin_service_1.AdminService.getKPIs();
            res.json({ success: true, data, error: null });
        }
        catch (error) {
            res.status(500).json({ success: false, error: 'Falha ao buscar indicadores' });
        }
    }
    static async getLeads(req, res) {
        try {
            const data = await admin_service_1.AdminService.getLeads();
            res.json({ success: true, data, error: null });
        }
        catch (error) {
            res.status(500).json({ success: false, error: 'Falha ao carregar lista' });
        }
    }
    static async getMentors(req, res) {
        try {
            const data = await admin_service_1.AdminService.getMentors();
            res.json({ success: true, data, error: null });
        }
        catch (error) {
            res.status(500).json({ success: false, error: 'Falha ao carregar mentores' });
        }
    }
    static async getLeadDetails(req, res) {
        try {
            const data = await admin_service_1.AdminService.getLeadDetails(req.params.id);
            if (!data) {
                res.status(404).json({ success: false, error: 'Lead not found' });
                return;
            }
            res.json({ success: true, data, error: null });
        }
        catch (error) {
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }
    static async submitDiagnosis(req, res) {
        try {
            const { lead, answers } = req.body;
            const data = await admin_service_1.AdminService.submitDiagnosis(lead, answers);
            const frontendUrls = process.env.FRONTEND_URL || "http://localhost:3000";
            const frontendUrl = frontendUrls.split(',')[0].trim();
            const linkResultado = `${frontendUrl}/diagnostico/resultado?id=${data.leadId}`;
            // Dispara o e-mail em background pelo Brevo
            await brevo_service_1.BrevoService.enviarEmailDiagnostico(lead.nome, lead.email, data.scoreTotal, linkResultado);
            res.json({ success: true, data, error: null });
        }
        catch (error) {
            res.status(500).json({ success: false, error: 'Falha ao processar' });
        }
    }
    static async createTeamMember(req, res) {
        try {
            const { email, fullName, roleName } = req.body;
            const data = await admin_service_1.AdminService.createTeamMember({ email, fullName, roleName });
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    static async transformToAluno(req, res) {
        try {
            const { mentorId } = req.body;
            const data = await admin_service_1.AdminService.transformLeadToAluno(req.params.id, mentorId);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.AdminController = AdminController;
