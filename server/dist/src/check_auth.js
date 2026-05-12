"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const schema_1 = require("./db/schema");
const drizzle_orm_1 = require("drizzle-orm");
require("dotenv/config");
async function check() {
    const alunoId = '5615dc40-cfc4-4180-8e24-c3036fed42c2';
    const [company] = await db_1.db.select().from(schema_1.companies).where((0, drizzle_orm_1.eq)(schema_1.companies.id, alunoId));
    console.log('Company:', company);
    if (company) {
        const js = await db_1.db.select().from(schema_1.journeys).where((0, drizzle_orm_1.eq)(schema_1.journeys.companyId, company.id));
        console.log('Journeys:', js);
        for (const j of js) {
            if (j.turmaId) {
                const [t] = await db_1.db.select().from(schema_1.turmas).where((0, drizzle_orm_1.eq)(schema_1.turmas.id, j.turmaId));
                console.log('Turma:', t);
                const tms = await db_1.db.select().from(schema_1.turmaMentores).where((0, drizzle_orm_1.eq)(schema_1.turmaMentores.turmaId, j.turmaId));
                console.log('TurmaMentores:', tms);
            }
        }
    }
    process.exit(0);
}
check();
