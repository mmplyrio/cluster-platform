"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    console.log(`[authMiddleware] Request Path: ${req.path}, Has Token: ${!!token}`);
    if (!token) {
        console.warn('[authMiddleware] Token não fornecido');
        res.status(401).json({ success: false, error: 'Token não fornecido' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log(`[authMiddleware] Token verificado para: ${decoded.email}`);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('[authMiddleware] Erro ao verificar token:', error instanceof Error ? error.message : error);
        res.status(403).json({ success: false, error: 'Token inválido' });
        return;
    }
};
exports.authMiddleware = authMiddleware;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ success: false, error: 'Acesso negado: permissão insuficiente' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
