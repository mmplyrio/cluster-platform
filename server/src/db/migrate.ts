import 'dotenv/config';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const connectionString = (process.env.DATABASE_URL || '').replace(/%(?![0-9a-fA-F]{2})/g, '%25');
const client = postgres(connectionString, { ssl: 'require', prepare: false });

async function main() {
    console.log('🔄 Aplicando migrações incrementais...');
    
    const sqlPath = path.join(process.cwd(), 'drizzle', '0002_previous_invaders.sql');
    
    if (!fs.existsSync(sqlPath)) {
        console.error('❌ Arquivo mentoria_incremental.sql não encontrado em /drizzle');
        process.exit(1);
    }
    
    try {
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        console.log('⚡ Executando SQL incremental...');
        await client.unsafe(sql);
        console.log('✅ Banco de dados sincronizado com sucesso!');
    } catch (error) {
        console.error('❌ Falha na migração:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

main();
