CREATE TABLE "mentorship_template_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"ordem" integer NOT NULL,
	"titulo" text NOT NULL,
	"objetivo_macro" text
);
--> statement-breakpoint
CREATE TABLE "mentorship_template_objectives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"descricao" text NOT NULL,
	"ordem" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mentorship_template_modules" ADD CONSTRAINT "mentorship_template_modules_template_id_mentorship_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."mentorship_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_template_objectives" ADD CONSTRAINT "mentorship_template_objectives_module_id_mentorship_template_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."mentorship_template_modules"("id") ON DELETE cascade ON UPDATE no action;