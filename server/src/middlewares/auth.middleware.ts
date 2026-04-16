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
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ success: false, error: 'Token não fornecido' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as NonNullable<AuthRequest['user']>;
        req.user = decoded;
        next();
    } catch (error) {
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
