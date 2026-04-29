import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    static async setup(req: Request, res: Response) {
        try {
            const result = await AuthService.setup();
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Falha no setup' });
        }
    }

    static async checkEmail(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ success: false, error: 'Email é obrigatório' });
                return;
            }
            
            const data = await AuthService.checkEmail(email);
            if (!data) {
                res.status(404).json({ success: false, error: 'Usuário não encontrado' });
                return;
            }

            res.json({ success: true, data });
        } catch (error) {
            console.error('[AuthController.checkEmail] Erro interno:', error);
            res.status(500).json({ success: false, error: 'Erro interno' });
        }
    }

    static async setPassword(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const data = await AuthService.setPassword(email, password);
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const data = await AuthService.login(email, password);
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(401).json({ success: false, error: error.message });
        }
    }

    static async getMe(req: Request, res: Response) {
        try {
            // This endpoint requires authentication middleware, so req.user will be populated
            // Since AuthController currently receives basic Request, we need to cast or access it securely.
            const userReq = req as any; 
            const userId = userReq.user?.userId;
            
            if (!userId) {
                 res.status(401).json({ success: false, error: 'Não autorizado' });
                 return;
            }

            const data = await AuthService.getMe(userId);
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    static async updateMe(req: Request, res: Response) {
        try {
            const userReq = req as any;
            const userId = userReq.user?.userId;

            if (!userId) {
                res.status(401).json({ success: false, error: 'Não autorizado' });
                return;
            }

            const { fullName, email, password } = req.body;
            const result = await AuthService.updateMe(userId, { fullName, email, password });
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ success: false, error: 'Email é obrigatório' });
                return;
            }
            await AuthService.forgotPassword(email);
            res.json({ success: true, message: 'E-mail de recuperação enviado' });
        } catch (error: any) {
            // Even if user not found, we might want to return success to avoid email enumeration
            // But here the user specifically asked for "segurança", and usually companies prefer to be explicit or not.
            // I'll return success anyway but log the error if it's not 'user_not_found'.
            if (error.message === 'user_not_found') {
                res.json({ success: true, message: 'E-mail de recuperação enviado' });
            } else {
                console.error('[AuthController.forgotPassword] Error:', error);
                res.status(500).json({ success: false, error: 'Erro interno' });
            }
        }
    }

    static async resetPassword(req: Request, res: Response) {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                res.status(400).json({ success: false, error: 'Token e senha são obrigatórios' });
                return;
            }
            await AuthService.resetPassword(token, password);
            res.json({ success: true, message: 'Senha atualizada com sucesso' });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

