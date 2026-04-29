-- Script de Migração Incremental: Apenas tabelas novas do Ambiente de Mentoria
-- Seguro para executar mesmo que algumas tabelas já existam (usa IF NOT EXISTS)

-- Roles
CREATE TABLE IF NOT EXISTS "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);

-- Users
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"role_id" uuid,
	"password_hash" text NOT NULL,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"reset_password_token" text,
	"reset_password_expires" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

-- Companies (Empresas Mentoradas)
CREATE TABLE IF NOT EXISTS "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"segmento" text,
	"porte" text,
	"mentor_id" uuid,
	"lead_id" uuid,
	"status_programa" text,
	"cnpj" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Company Users (Vínculo Usuário <-> Empresa)
CREATE TABLE IF NOT EXISTS "company_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"papel_no_caso" text
);

-- Journeys (Trilhas de Aprendizagem)
CREATE TABLE IF NOT EXISTS "journeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"template_id" text,
	"etapa_atual" text,
	"progresso" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Modules (Módulos dentro de uma Jornada)
CREATE TABLE IF NOT EXISTS "modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journey_id" uuid NOT NULL,
	"ordem" integer NOT NULL,
	"titulo" text NOT NULL,
	"objetivo" text,
	"regra_liberacao" text,
	"status" text DEFAULT 'locked'
);

-- Tasks (Tarefas e Entregáveis)
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journey_id" uuid NOT NULL,
	"module_id" uuid,
	"titulo" text NOT NULL,
	"descricao" text,
	"prazo" timestamp,
	"prioridade" text,
	"status" text DEFAULT 'pending',
	"responsavel_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Deliverables (Evidências para Tarefas)
CREATE TABLE IF NOT EXISTS "deliverables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" uuid NOT NULL,
	"tipo" text,
	"arquivo_url" text,
	"versao" integer DEFAULT 1,
	"status" text DEFAULT 'submitted',
	"enviado_por" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Comments (Comentários contextuais)
CREATE TABLE IF NOT EXISTS "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"autor_id" uuid NOT NULL,
	"alvo_tipo" text,
	"alvo_id" uuid NOT NULL,
	"texto" text NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);

-- Indicators (Indicadores de Negócio)
CREATE TABLE IF NOT EXISTS "indicators" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"periodicidade" text,
	"meta" text,
	"valor_atual" text,
	"ultima_atualizacao" timestamp DEFAULT now()
);

-- Action Plan Items (Plano de 90 dias)
CREATE TABLE IF NOT EXISTS "action_plan_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"janela" text,
	"acao" text NOT NULL,
	"responsavel" text,
	"prazo" timestamp,
	"status" text DEFAULT 'pending'
);

-- Foreign Keys (ADD CONSTRAINT IF NOT EXISTS não suportado em PG < 16, então usamos DO $$ EXCEPTION)
DO $$ BEGIN
  ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "companies" ADD CONSTRAINT "companies_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "companies" ADD CONSTRAINT "companies_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "company_users" ADD CONSTRAINT "company_users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "company_users" ADD CONSTRAINT "company_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "journeys" ADD CONSTRAINT "journeys_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "modules" ADD CONSTRAINT "modules_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "journeys"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "tasks" ADD CONSTRAINT "tasks_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "journeys"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "tasks" ADD CONSTRAINT "tasks_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "tasks" ADD CONSTRAINT "tasks_responsavel_id_users_id_fk" FOREIGN KEY ("responsavel_id") REFERENCES "users"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_enviado_por_users_id_fk" FOREIGN KEY ("enviado_por") REFERENCES "users"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "indicators" ADD CONSTRAINT "indicators_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "action_plan_items" ADD CONSTRAINT "action_plan_items_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "comments" ADD CONSTRAINT "comments_autor_id_users_id_fk" FOREIGN KEY ("autor_id") REFERENCES "users"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Updates for Password Recovery
DO $$ BEGIN
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_token" text;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_expires" timestamp;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "cnpj" text;
  ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "notes" text;
EXCEPTION WHEN others THEN NULL; END $$;
