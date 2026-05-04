import 'dotenv/config';
import postgres from 'postgres';

const connectionString = (process.env.DATABASE_URL || '').replace(/%(?![0-9a-fA-F]{2})/g, '%25');
const client = postgres(connectionString, { ssl: 'require', prepare: false });

async function main() {
    console.log('🔄 Adicionando turma_id na tabela journeys...');
    try {
        await client.unsafe(`
            ALTER TABLE "journeys" ADD COLUMN IF NOT EXISTS "turma_id" uuid;
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journeys_turma_id_turmas_id_fk') THEN
                    ALTER TABLE "journeys" ADD CONSTRAINT "journeys_turma_id_turmas_id_fk" FOREIGN KEY ("turma_id") REFERENCES "public"."turmas"("id") ON DELETE set null ON UPDATE no action;
                END IF;
            END $$;
        `);
        console.log('✅ Coluna e constraint adicionadas com sucesso!');
    } catch (error) {
        console.error('❌ Falha:', error);
    } finally {
        await client.end();
    }
}

main();
