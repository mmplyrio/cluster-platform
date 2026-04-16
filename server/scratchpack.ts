import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function test() {
    try {
        console.log('Altering database table "users"...');
        await db.execute(sql`ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;`);
        console.log('Success! Dropped NOT NULL constraint on password_hash.');
    } catch (e: any) {
        console.error('Error occurred:');
        console.error('Error MESSAGE:', e.message);
        console.error('Full Error:', e);
    }
}
test().then(() => process.exit(0)).catch(() => process.exit(1));
