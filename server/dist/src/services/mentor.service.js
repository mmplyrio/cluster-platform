"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorService = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
class MentorService {
    static async getDashboard(mentorId) {
        const menteesList = await db_1.db.select({
            id: schema_1.companies.id,
            nome: schema_1.companies.nome,
            status: schema_1.companies.statusPrograma,
            turma: schema_1.journeys.createdAt,
        }).from(schema_1.companies)
            .leftJoin(schema_1.journeys, (0, drizzle_orm_1.eq)(schema_1.companies.id, schema_1.journeys.companyId))
            .where((0, drizzle_orm_1.eq)(schema_1.companies.mentorId, mentorId));
        const avaliacoesRecentes = await db_1.db.select().from(schema_1.funnelEvents)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.funnelEvents.createdAt))
            .limit(5);
        const avisosList = avaliacoesRecentes.map(e => ({
            id: e.id,
            titulo: 'Atualização de Lead',
            conteudo: `Um novo lead alcançou estágio: ${e.eventValue}`,
            data: e.createdAt.toLocaleDateString(),
            tipo: 'info'
        }));
        return {
            alunos: menteesList.map(m => ({
                id: m.id,
                nome: m.nome,
                turma: m.turma ? m.turma.toLocaleDateString() : 'Nova Turma',
                status: m.status === 'active' ? 'Ativo' : 'Pausado',
            })),
            avisos: avisosList.length > 0 ? avisosList : [
                { id: 'av1', titulo: 'Nenhum lead novo', conteudo: '', data: new Date().toLocaleDateString(), tipo: 'info' }
            ]
        };
    }
}
exports.MentorService = MentorService;
