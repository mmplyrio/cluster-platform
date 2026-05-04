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
    console.log('🔄 Criando tabelas turmas e turma_mentores...');
    try {
        await client.unsafe(`
            CREATE TABLE IF NOT EXISTS "turmas" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                "nome" text NOT NULL,
                "descricao" text,
                "template_id" uuid,
                "preco" numeric(10, 2),
                "data_inicio" timestamp,
                "vagas" integer,
                "status" text DEFAULT 'planejada',
                "mentor_id" uuid,
                "created_at" timestamp DEFAULT now() NOT NULL
            );

            CREATE TABLE IF NOT EXISTS "turma_mentores" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
                "turma_id" uuid NOT NULL,
                "mentor_id" uuid NOT NULL
            );

            -- Add constraints safely
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'turmas_template_id_mentorship_templates_id_fk') THEN
                    ALTER TABLE "turmas" ADD CONSTRAINT "turmas_template_id_mentorship_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."mentorship_templates"("id") ON DELETE no action ON UPDATE no action;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'turmas_mentor_id_users_id_fk') THEN
                    ALTER TABLE "turmas" ADD CONSTRAINT "turmas_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'turma_mentores_turma_id_turmas_id_fk') THEN
                    ALTER TABLE "turma_mentores" ADD CONSTRAINT "turma_mentores_turma_id_turmas_id_fk" FOREIGN KEY ("turma_id") REFERENCES "public"."turmas"("id") ON DELETE cascade ON UPDATE no action;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'turma_mentores_mentor_id_users_id_fk') THEN
                    ALTER TABLE "turma_mentores" ADD CONSTRAINT "turma_mentores_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
                END IF;
            END $$;
        `);
        console.log('✅ Tabelas criadas com sucesso!');
    }
    catch (error) {
        console.error('❌ Falha:', error);
    }
    finally {
        await client.end();
    }
}
main();
