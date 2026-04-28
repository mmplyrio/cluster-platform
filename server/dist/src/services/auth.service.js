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
}
exports.AuthService = AuthService;
