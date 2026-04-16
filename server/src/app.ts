import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import mentorRoutes from './routes/mentor.routes';

const app = express();

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

app.use(cors({
    origin: (origin, callback) => {
        // Permite chamadas sem origin (ex: Postman, server-to-server no mesmo host)
        if (!origin) return callback(null, true);
        if (allowedOrigins.some(o => origin.startsWith(o))) {
            return callback(null, true);
        }
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        console.warn(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
        callback(new Error(`CORS bloqueado para origin: ${origin}`));
    },
    credentials: true,
}));

app.use(express.json());

// Health check endpoint — útil para monitorar se o serviço está online
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mentor', mentorRoutes);

export default app;
