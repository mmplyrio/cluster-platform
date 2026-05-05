import { db } from './db';
import { companies, journeys, turmas, turmaMentores } from './db/schema';
import { eq } from 'drizzle-orm';
import 'dotenv/config';

async function check() {
    const alunoId = '5615dc40-cfc4-4180-8e24-c3036fed42c2';
    const [company] = await db.select().from(companies).where(eq(companies.id, alunoId));
    console.log('Company:', company);
    
    if (company) {
        const js = await db.select().from(journeys).where(eq(journeys.companyId, company.id));
        console.log('Journeys:', js);
        
        for (const j of js) {
            if (j.turmaId) {
                const [t] = await db.select().from(turmas).where(eq(turmas.id, j.turmaId));
                console.log('Turma:', t);
                const tms = await db.select().from(turmaMentores).where(eq(turmaMentores.turmaId, j.turmaId));
                console.log('TurmaMentores:', tms);
            }
        }
    }
    process.exit(0);
}
check();
