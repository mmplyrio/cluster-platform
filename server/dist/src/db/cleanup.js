"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const postgres_1 = __importDefault(require("postgres"));
const postgres_js_1 = require("drizzle-orm/postgres-js");
const schema = __importStar(require("./schema"));
const drizzle_orm_1 = require("drizzle-orm");
const connectionString = process.env.DATABASE_URL || '';
const client = (0, postgres_1.default)(connectionString);
const db = (0, postgres_js_1.drizzle)(client, { schema });
async function cleanup() {
    console.log('🧹 Iniciando limpeza de dados (Leads e Alunos)...');
    try {
        // 1. Identificar roles de aluno/mentorado
        const rolesList = await db.select().from(schema.roles);
        const menteeRoleIds = rolesList
            .filter(r => ['mentorado', 'ALUNO', 'colaborador'].includes(r.name))
            .map(r => r.id);
        console.log('Deletando dados de execução e templates...');
        // Deletar em ordem de dependência (filhos primeiro)
        await db.delete(schema.turmaMentores);
        await db.delete(schema.turmas);
        await db.delete(schema.mentorshipTemplateObjectives);
        await db.delete(schema.mentorshipTemplateModules);
        await db.delete(schema.mentorshipTemplates);
        await db.delete(schema.deliverables);
        await db.delete(schema.comments);
        await db.delete(schema.tasks);
        await db.delete(schema.modules);
        await db.delete(schema.indicators);
        await db.delete(schema.actionPlanItems);
        await db.delete(schema.journeys);
        await db.delete(schema.companyUsers);
        await db.delete(schema.companies);
        console.log('Deletando dados de leads...');
        await db.delete(schema.scores);
        await db.delete(schema.responses);
        await db.delete(schema.funnelEvents);
        await db.delete(schema.appointments);
        await db.delete(schema.leads);
        console.log('Deletando mensagens e conversas...');
        await db.delete(schema.messages);
        await db.delete(schema.conversationParticipants);
        await db.delete(schema.conversations);
        if (menteeRoleIds.length > 0) {
            console.log('Deletando usuários com perfil de aluno...');
            await db.delete(schema.users).where((0, drizzle_orm_1.inArray)(schema.users.roleId, menteeRoleIds));
        }
        console.log('✅ Limpeza concluída com sucesso!');
    }
    catch (error) {
        console.error('❌ Erro durante a limpeza:', error);
    }
    finally {
        await client.end();
    }
}
cleanup();
