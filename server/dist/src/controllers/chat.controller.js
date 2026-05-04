"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_service_1 = require("../services/chat.service");
class ChatController {
    static async getConversations(req, res) {
        try {
            const userReq = req;
            const userId = userReq.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, error: 'Não autorizado' });
                return;
            }
            const data = await chat_service_1.ChatService.getConversations(userId);
            res.json({ success: true, data });
        }
        catch (error) {
            console.error('[ChatController.getConversations]', error);
            res.status(500).json({ success: false, error: 'Erro ao buscar conversas' });
        }
    }
    static async getMessages(req, res) {
        try {
            const { id } = req.params;
            const data = await chat_service_1.ChatService.getMessages(id);
            res.json({ success: true, data });
        }
        catch (error) {
            console.error('[ChatController.getMessages]', error);
            res.status(500).json({ success: false, error: 'Erro ao buscar mensagens' });
        }
    }
    static async sendMessage(req, res) {
        try {
            const userReq = req;
            const userId = userReq.user?.userId;
            const { conversationId, content } = req.body;
            if (!userId) {
                res.status(401).json({ success: false, error: 'Não autorizado' });
                return;
            }
            const data = await chat_service_1.ChatService.sendMessage(conversationId, userId, content);
            res.json({ success: true, data });
        }
        catch (error) {
            console.error('[ChatController.sendMessage]', error);
            res.status(500).json({ success: false, error: 'Erro ao enviar mensagem' });
        }
    }
    static async createConversation(req, res) {
        try {
            const { participants, titulo, tipo } = req.body;
            const data = await chat_service_1.ChatService.createConversation(participants, titulo, tipo);
            res.json({ success: true, data });
        }
        catch (error) {
            console.error('[ChatController.createConversation]', error);
            res.status(500).json({ success: false, error: 'Erro ao criar conversa' });
        }
    }
    static async getOverview(req, res) {
        try {
            const userReq = req;
            const userId = userReq.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, error: 'Não autorizado' });
                return;
            }
            const data = await chat_service_1.ChatService.getCommunicationOverview(userId);
            res.json({ success: true, data });
        }
        catch (error) {
            console.error('[ChatController.getOverview]', error);
            res.status(500).json({ success: false, error: 'Erro ao buscar overview' });
        }
    }
    static async getRadar(req, res) {
        try {
            const userReq = req;
            const userId = userReq.user?.userId;
            if (!userId) {
                res.status(401).json({ success: false, error: 'Não autorizado' });
                return;
            }
            const data = await chat_service_1.ChatService.getRadarData(userId);
            res.json({ success: true, data });
        }
        catch (error) {
            console.error('[ChatController.getRadar]', error);
            res.status(500).json({ success: false, error: 'Erro ao buscar dados do radar' });
        }
    }
}
exports.ChatController = ChatController;
