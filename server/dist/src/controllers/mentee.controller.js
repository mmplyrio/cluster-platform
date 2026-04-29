"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenteeController = void 0;
const mentee_service_1 = require("../services/mentee.service");
class MenteeController {
    static async getTrilha(req, res) {
        try {
            const userId = req.user.userId;
            const data = await mentee_service_1.MenteeService.getTrilha(userId);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getPlanoAcao(req, res) {
        try {
            const userId = req.user.userId;
            const data = await mentee_service_1.MenteeService.getPlanoAcao(userId);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
exports.MenteeController = MenteeController;
