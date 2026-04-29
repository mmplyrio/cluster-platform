import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    console.log(`[authMiddleware] Request Path: ${req.path}, Has Token: ${!!token}`);

    if (!token) {
        console.warn('[authMiddleware] Token não fornecido');
        res.status(401).json({ success: false, error: 'Token não fornecido' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as NonNullable<AuthRequest['user']>;
        console.log(`[authMiddleware] Token verificado para: ${decoded.email}`);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('[authMiddleware] Erro ao verificar token:', error instanceof Error ? error.message : error);
        res.status(403).json({ success: false, error: 'Token inválido' });
        return;
    }
};

export const requireRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ success: false, error: 'Acesso negado: permissão insuficiente' });
            return;
        }
        next();
    };
};
