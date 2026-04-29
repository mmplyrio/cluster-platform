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
}
exports.MentorController = MentorController;
