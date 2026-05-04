"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorController = void 0;
const mentor_service_1 = require("../services/mentor.service");
class MentorController {
    static async getDashboard(req, res) {
        try {
            const mentorId = req.user.userId;
            const data = await mentor_service_1.MentorService.getDashboard(mentorId);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getAlunosList(req, res) {
        try {
            const mentorId = req.user.userId;
            const data = await mentor_service_1.MentorService.getAlunosList(mentorId);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getTurmas(req, res) {
        try {
            const mentorId = req.user.userId;
            const data = await mentor_service_1.MentorService.getTurmas(mentorId);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getBuilder(req, res) {
        try {
            const mentorId = req.user.userId;
            const data = await mentor_service_1.MentorService.getBuilder(mentorId);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getTemplate(req, res) {
        try {
            const mentorId = req.user.userId;
            const { id } = req.params;
            const data = await mentor_service_1.MentorService.getMentorshipTemplate(id, mentorId);
            if (!data)
                return res.status(404).json({ success: false, error: 'template_not_found' });
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async updateTemplate(req, res) {
        try {
            const mentorId = req.user.userId;
            const { id } = req.params;
            const data = await mentor_service_1.MentorService.updateMentorshipTemplate(id, mentorId, req.body);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getTurmaDetails(req, res) {
        try {
            const mentorId = req.user.userId;
            const { id } = req.params;
            const data = await mentor_service_1.MentorService.getTurmaDetails(mentorId, id);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async createMentee(req, res) {
        try {
            const mentorId = req.user.userId;
            const result = await mentor_service_1.MentorService.createMentee(mentorId, req.body);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    static async getAlunoDetails(req, res) {
        try {
            const mentorId = req.user.userId;
            const { id } = req.params;
            const data = await mentor_service_1.MentorService.getAlunoDetails(mentorId, id);
            res.json({ success: true, data });
        }
        catch (error) {
            if (error.message === 'aluno_not_found') {
                res.status(404).json({ success: false, error: 'aluno_not_found' });
            }
            else {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    }
    static async getMentoresDisponiveis(req, res) {
        try {
            const data = await mentor_service_1.MentorService.getMentoresDisponiveis();
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async createTurma(req, res) {
        try {
            const mentorId = req.user.userId;
            const result = await mentor_service_1.MentorService.createTurma(mentorId, req.body);
            res.json(result);
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.MentorController = MentorController;
