import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function main() {
    try {
        console.log("Adding journey_id to action_plan_items...");
        await db.execute(sql`ALTER TABLE action_plan_items ADD COLUMN IF NOT EXISTS journey_id uuid REFERENCES journeys(id) ON DELETE CASCADE;`);
        console.log("Adding journey_id to responses...");
        await db.execute(sql`ALTER TABLE responses ADD COLUMN IF NOT EXISTS journey_id uuid REFERENCES journeys(id) ON DELETE CASCADE;`);
        console.log("Success!");
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
main();
