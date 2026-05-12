"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const postgres_1 = __importDefault(require("postgres"));
const connectionString = (process.env.DATABASE_URL || '').replace(/%(?![0-9a-fA-F]{2})/g, '%25');
const client = (0, postgres_1.default)(connectionString, { ssl: 'require', prepare: false });
async function main() {
    console.log('🔍 Checking Turmas and Journeys...');
    try {
        const turmasList = await client.unsafe('SELECT id, nome, mentor_id FROM turmas');
        console.log('Turmas:', turmasList);
        const journeysList = await client.unsafe('SELECT id, company_id, turma_id FROM journeys');
        console.log('Journeys:', journeysList);
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await client.end();
    }
}
main();
