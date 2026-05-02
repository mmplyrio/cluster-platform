import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';

export class ChatController {
    static async getConversations(req: Request, res: Response) {
        try {
            const userReq = req as any;
            const userId = userReq.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, error: 'Não autorizado' });
                return;
            }

            const data = await ChatService.getConversations(userId);
            res.json({ success: true, data });
        } catch (error: any) {
            console.error('[ChatController.getConversations]', error);
            res.status(500).json({ success: false, error: 'Erro ao buscar conversas' });
        }
    }

    static async getMessages(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = await ChatService.getMessages(id as string);
            res.json({ success: true, data });
        } catch (error: any) {
            console.error('[ChatController.getMessages]', error);
            res.status(500).json({ success: false, error: 'Erro ao buscar mensagens' });
        }
    }

    static async sendMessage(req: Request, res: Response) {
        try {
            const userReq = req as any;
            const userId = userReq.user?.userId;
            const { conversationId, content } = req.body;

            if (!userId) {
                res.status(401).json({ success: false, error: 'Não autorizado' });
                return;
            }

            const data = await ChatService.sendMessage(conversationId, userId, content);
            res.json({ success: true, data });
        } catch (error: any) {
            console.error('[ChatController.sendMessage]', error);
            res.status(500).json({ success: false, error: 'Erro ao enviar mensagem' });
        }
    }

    static async createConversation(req: Request, res: Response) {
        try {
            const { participants, titulo, tipo } = req.body;
            const data = await ChatService.createConversation(participants, titulo, tipo);
            res.json({ success: true, data });
        } catch (error: any) {
            console.error('[ChatController.createConversation]', error);
            res.status(500).json({ success: false, error: 'Erro ao criar conversa' });
        }
    }

    static async getOverview(req: Request, res: Response) {
        try {
            const userReq = req as any;
            const userId = userReq.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, error: 'Não autorizado' });
                return;
            }

            const data = await ChatService.getCommunicationOverview(userId);
            res.json({ success: true, data });
        } catch (error: any) {
            console.error('[ChatController.getOverview]', error);
            res.status(500).json({ success: false, error: 'Erro ao buscar overview' });
        }
    }

    static async getRadar(req: Request, res: Response) {
        try {
            const userReq = req as any;
            const userId = userReq.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, error: 'Não autorizado' });
                return;
            }

            const data = await ChatService.getRadarData(userId);
            res.json({ success: true, data });
        } catch (error: any) {
            console.error('[ChatController.getRadar]', error);
            res.status(500).json({ success: false, error: 'Erro ao buscar dados do radar' });
        }
    }
}
