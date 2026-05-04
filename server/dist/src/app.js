"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const mentor_routes_1 = __importDefault(require("./routes/mentor.routes"));
const mentee_routes_1 = __importDefault(require("./routes/mentee.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const app = (0, express_1.default)();
// Suporta múltiplas URLs separadas por vírgula, ex: "https://app.vercel.app,https://preview.vercel.app"
const rawFrontendUrls = process.env.FRONTEND_URL || '';
const extraOrigins = rawFrontendUrls
    .split(',')
    .map(u => u.trim())
    .filter(Boolean);
const allowedOrigins = [
    'http://localhost:3000',
    ...extraOrigins,
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Permite chamadas sem origin (ex: Postman, server-to-server no mesmo host)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.some(o => origin.startsWith(o))) {
            return callback(null, true);
        }
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        console.warn(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
        callback(new Error(`CORS bloqueado para origin: ${origin}`));
    },
    credentials: true,
}));
app.use(express_1.default.json());
// Health check endpoint — útil para monitorar se o serviço está online
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/mentor', mentor_routes_1.default);
app.use('/api/mentee', mentee_routes_1.default);
app.use('/api/chat', chat_routes_1.default);
// Fallback 404 handler para rotas não encontradas
app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Rota não encontrada' });
});
// Global error handler
app.use((err, _req, res, _next) => {
    console.error('[Global Error]', err);
    res.status(500).json({ success: false, error: err.message || 'Erro interno no servidor' });
});
exports.default = app;
