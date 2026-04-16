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
}
