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
    static async getMe(req, res) {
        try {
            const userReq = req;
            const userId = userReq.user?.userId;
            console.log(`[AuthController.getMe] Buscando usuário: ${userId}`);
            if (!userId) {
                res.status(401).json({ success: false, error: 'Não autorizado' });
                return;
            }
            const data = await auth_service_1.AuthService.getMe(userId);
            res.json({ success: true, data });
        }
        catch (error) {
            console.error(`[AuthController.getMe] Erro: ${error.message}`);
            res.status(401).json({ success: false, error: error.message });
        }
    }
    static async test(req, res) {
        res.json({
            success: true,
            message: 'Backend is reachable',
            timestamp: new Date().toISOString()
        });
    }
    static async updateMe(req, res) {
        try {
            const userReq = req;
            const userId = userReq.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, error: 'Não autorizado' });
                return;
            }
            const { fullName, email, password } = req.body;
            const result = await auth_service_1.AuthService.updateMe(userId, { fullName, email, password });
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ success: false, error: 'Email é obrigatório' });
                return;
            }
            await auth_service_1.AuthService.forgotPassword(email);
            res.json({ success: true, message: 'E-mail de recuperação enviado' });
        }
        catch (error) {
            // Even if user not found, we might want to return success to avoid email enumeration
            // But here the user specifically asked for "segurança", and usually companies prefer to be explicit or not.
            // I'll return success anyway but log the error if it's not 'user_not_found'.
            if (error.message === 'user_not_found') {
                res.json({ success: true, message: 'E-mail de recuperação enviado' });
            }
            else {
                console.error('[AuthController.forgotPassword] Error:', error);
                res.status(500).json({ success: false, error: 'Erro interno' });
            }
        }
    }
    static async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                res.status(400).json({ success: false, error: 'Token e senha são obrigatórios' });
                return;
            }
            await auth_service_1.AuthService.resetPassword(token, password);
            res.json({ success: true, message: 'Senha atualizada com sucesso' });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.AuthController = AuthController;
