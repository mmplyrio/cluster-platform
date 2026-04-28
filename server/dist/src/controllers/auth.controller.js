"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async setup(req, res) {
        try {
            const result = await auth_service_1.AuthService.setup();
            res.json(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Falha no setup' });
        }
    }
    static async checkEmail(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ success: false, error: 'Email é obrigatório' });
                return;
            }
            const data = await auth_service_1.AuthService.checkEmail(email);
            if (!data) {
                res.status(404).json({ success: false, error: 'Usuário não encontrado' });
                return;
            }
            res.json({ success: true, data });
        }
        catch (error) {
            console.error('[AuthController.checkEmail] Erro interno:', error);
            res.status(500).json({ success: false, error: 'Erro interno' });
        }
    }
    static async setPassword(req, res) {
        try {
            const { email, password } = req.body;
            const data = await auth_service_1.AuthService.setPassword(email, password);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const data = await auth_service_1.AuthService.login(email, password);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    }
}
exports.AuthController = AuthController;
