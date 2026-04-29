"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const brevo_service_1 = require("./brevo.service");
const drizzle_orm_2 = require("drizzle-orm");
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
class AuthService {
    static async setup() {
        const requiredRoles = ['ADMIN', 'COMERCIAL', 'MENTOR', 'ALUNO'];
        const existingRoles = await db_1.db.select().from(schema_1.roles);
        const rolesMap = new Map(existingRoles.map(r => [r.name, r.id]));
        for (const roleName of requiredRoles) {
            if (!rolesMap.has(roleName)) {
                const [newRole] = await db_1.db.insert(schema_1.roles).values({ name: roleName }).returning();
                rolesMap.set(roleName, newRole.id);
            }
        }
        const testUsers = [
            { email: 'admin@cluster.com', name: 'Master Admin', role: 'ADMIN' },
            { email: 'comercial@cluster.com', name: 'Vendedor Comercial', role: 'COMERCIAL' },
            { email: 'mentor@cluster.com', name: 'Mentor Principal', role: 'MENTOR' },
            { email: 'aluno@cluster.com', name: 'Aluno de Teste', role: 'ALUNO' },
        ];
        const hash = await bcryptjs_1.default.hash('Senha123!', 10);
        for (const u of testUsers) {
            const [existingUser] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, u.email));
            if (!existingUser) {
                await db_1.db.insert(schema_1.users).values({
                    fullName: u.name,
                    email: u.email,
                    passwordHash: hash,
                    roleId: rolesMap.get(u.role),
                });
            }
            else {
                await db_1.db.update(schema_1.users).set({
                    passwordHash: hash,
                    roleId: rolesMap.get(u.role)
                }).where((0, drizzle_orm_1.eq)(schema_1.users.id, existingUser.id));
            }
        }
        return { success: true, message: 'Setup roles and test accounts completed.' };
    }
    static async checkEmail(email) {
        const [user] = await db_1.db.select({
            id: schema_1.users.id, email: schema_1.users.email, lastLogin: schema_1.users.lastLogin
        }).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (!user)
            return null;
        return { exists: true, isFirstAccess: !user.lastLogin };
    }
    static async setPassword(email, password) {
        const [user] = await db_1.db.select({
            id: schema_1.users.id, email: schema_1.users.email, lastLogin: schema_1.users.lastLogin,
            roleName: schema_1.roles.name, fullName: schema_1.users.fullName,
        }).from(schema_1.users)
            .leftJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.roleId, schema_1.roles.id))
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (!user)
            throw new Error('user_not_found');
        if (user.lastLogin)
            throw new Error('already_set');
        const hash = await bcryptjs_1.default.hash(password, 10);
        await db_1.db.update(schema_1.users).set({ passwordHash: hash, lastLogin: new Date() }).where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.roleName }, JWT_SECRET, { expiresIn: '24h' });
        return { token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.roleName } };
    }
    static async login(email, password) {
        const [user] = await db_1.db.select({
            id: schema_1.users.id, email: schema_1.users.email, passwordHash: schema_1.users.passwordHash,
            fullName: schema_1.users.fullName, roleName: schema_1.roles.name, roleId: schema_1.users.roleId
        }).from(schema_1.users)
            .leftJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.roleId, schema_1.roles.id))
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (!user || !user.roleName)
            throw new Error('invalid_credentials');
        if (!user.passwordHash)
            throw new Error('invalid_credentials');
        const validPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!validPassword)
            throw new Error('invalid_credentials');
        await db_1.db.update(schema_1.users).set({ lastLogin: new Date() }).where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.roleName }, JWT_SECRET, { expiresIn: '24h' });
        return { token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.roleName } };
    }
    static async getMe(userId) {
        const [user] = await db_1.db.select({
            id: schema_1.users.id,
            email: schema_1.users.email,
            fullName: schema_1.users.fullName,
            roleName: schema_1.roles.name
        }).from(schema_1.users)
            .leftJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.roleId, schema_1.roles.id))
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        if (!user)
            throw new Error('user_not_found');
        return {
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: user.roleName,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random` // Provide a nice fallback avatar based on name
        };
    }
    static async updateMe(userId, data) {
        const updateData = {};
        if (data.fullName)
            updateData.fullName = data.fullName;
        if (data.email)
            updateData.email = data.email;
        if (data.password) {
            updateData.passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        }
        if (Object.keys(updateData).length === 0)
            return { success: true };
        await db_1.db.update(schema_1.users).set(updateData).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        return { success: true };
    }
    static async forgotPassword(email) {
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (!user)
            throw new Error('user_not_found');
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour
        await db_1.db.update(schema_1.users).set({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: expires
        }).where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await brevo_service_1.BrevoService.enviarEmailRecuperacaoSenha(user.fullName, user.email, resetLink);
        return { success: true };
    }
    static async resetPassword(token, password) {
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_2.and)((0, drizzle_orm_1.eq)(schema_1.users.resetPasswordToken, hashedToken), (0, drizzle_orm_2.gt)(schema_1.users.resetPasswordExpires, new Date())));
        if (!user)
            throw new Error('invalid_or_expired_token');
        const hash = await bcryptjs_1.default.hash(password, 10);
        await db_1.db.update(schema_1.users).set({
            passwordHash: hash,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            lastLogin: user.lastLogin || new Date() // If first access, mark as logged in
        }).where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
        return { success: true };
    }
}
exports.AuthService = AuthService;
