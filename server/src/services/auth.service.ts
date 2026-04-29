import { db } from '../db';
import { users, roles } from '../db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';

export class AuthService {
    static async setup() {
        const requiredRoles = ['ADMIN', 'COMERCIAL', 'MENTOR', 'ALUNO'];
        
        const existingRoles = await db.select().from(roles);
        const rolesMap = new Map(existingRoles.map(r => [r.name, r.id]));

        for (const roleName of requiredRoles) {
            if (!rolesMap.has(roleName)) {
                const [newRole] = await db.insert(roles).values({ name: roleName }).returning();
                rolesMap.set(roleName, newRole.id);
            }
        }

        const testUsers = [
            { email: 'admin@cluster.com', name: 'Master Admin', role: 'ADMIN' },
            { email: 'comercial@cluster.com', name: 'Vendedor Comercial', role: 'COMERCIAL' },
            { email: 'mentor@cluster.com', name: 'Mentor Principal', role: 'MENTOR' },
            { email: 'aluno@cluster.com', name: 'Aluno de Teste', role: 'ALUNO' },
        ];

        const hash = await bcrypt.hash('Senha123!', 10);

        for (const u of testUsers) {
            const [existingUser] = await db.select().from(users).where(eq(users.email, u.email));
            if (!existingUser) {
                await db.insert(users).values({
                    fullName: u.name,
                    email: u.email,
                    passwordHash: hash,
                    roleId: rolesMap.get(u.role)!,
                });
            } else {
                await db.update(users).set({
                    passwordHash: hash,
                    roleId: rolesMap.get(u.role)!
                }).where(eq(users.id, existingUser.id));
            }
        }

        return { success: true, message: 'Setup roles and test accounts completed.' };
    }

    static async checkEmail(email: string) {
        const [user] = await db.select({
            id: users.id, email: users.email, lastLogin: users.lastLogin
        }).from(users).where(eq(users.email, email));
        
        if (!user) return null;
        return { exists: true, isFirstAccess: !user.lastLogin };
    }

    static async setPassword(email: string, password: string) {
        const [user] = await db.select({
            id: users.id, email: users.email, lastLogin: users.lastLogin,
            roleName: roles.name, fullName: users.fullName,
        }).from(users)
        .leftJoin(roles, eq(users.roleId, roles.id))
        .where(eq(users.email, email));

        if (!user) throw new Error('user_not_found');
        if (user.lastLogin) throw new Error('already_set');

        const hash = await bcrypt.hash(password, 10);
        await db.update(users).set({ passwordHash: hash, lastLogin: new Date() }).where(eq(users.id, user.id));

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.roleName },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.roleName } };
    }

    static async login(email: string, password: string) {
        const [user] = await db.select({
            id: users.id, email: users.email, passwordHash: users.passwordHash,
            fullName: users.fullName, roleName: roles.name, roleId: users.roleId
        }).from(users)
        .leftJoin(roles, eq(users.roleId, roles.id))
        .where(eq(users.email, email));

        if (!user || !user.roleName) throw new Error('invalid_credentials');

        if (!user.passwordHash) throw new Error('invalid_credentials');

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) throw new Error('invalid_credentials');

        await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, user.id));

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.roleName },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.roleName } };
    }

    static async getMe(userId: string) {
        const [user] = await db.select({
            id: users.id, 
            email: users.email, 
            fullName: users.fullName, 
            roleName: roles.name 
        }).from(users)
        .leftJoin(roles, eq(users.roleId, roles.id))
        .where(eq(users.id, userId));

        if (!user) throw new Error('user_not_found');

        return {
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: user.roleName,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random` // Provide a nice fallback avatar based on name
        };
    }
    static async updateMe(userId: string, data: { fullName?: string, email?: string, password?: string }) {
        const updateData: any = {};
        if (data.fullName) updateData.fullName = data.fullName;
        if (data.email) updateData.email = data.email;
        if (data.password) {
            updateData.passwordHash = await bcrypt.hash(data.password, 10);
        }

        if (Object.keys(updateData).length === 0) return { success: true };

        await db.update(users).set(updateData).where(eq(users.id, userId));
        return { success: true };
    }
}
