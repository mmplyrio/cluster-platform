"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const postgres_1 = __importDefault(require("postgres"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const connectionString = (process.env.DATABASE_URL || '').replace(/%(?![0-9a-fA-F]{2})/g, '%25');
const client = (0, postgres_1.default)(connectionString, { ssl: 'require', prepare: false });
async function main() {
    console.log('🔄 Aplicando migrações incrementais...');
    const sqlPath = path_1.default.join(process.cwd(), 'drizzle', 'mentoria_incremental.sql');
    if (!fs_1.default.existsSync(sqlPath)) {
        console.error('❌ Arquivo mentoria_incremental.sql não encontrado em /drizzle');
        process.exit(1);
    }
    try {
        const sql = fs_1.default.readFileSync(sqlPath, 'utf-8');
        console.log('⚡ Executando SQL incremental...');
        await client.unsafe(sql);
        console.log('✅ Banco de dados sincronizado com sucesso!');
    }
    catch (error) {
        console.error('❌ Falha na migração:', error);
        process.exit(1);
    }
    finally {
        await client.end();
    }
}
main();
