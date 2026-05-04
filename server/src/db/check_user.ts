import 'dotenv/config';
import postgres from 'postgres';

const connectionString = (process.env.DATABASE_URL || '').replace(/%(?![0-9a-fA-F]{2})/g, '%25');
const client = postgres(connectionString, { ssl: 'require', prepare: false });

async function main() {
    try {
        const users = await client.unsafe("SELECT id, email FROM users WHERE email = 'mateus_monteiro123@hotmail.com'");
        console.log('User:', users);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.end();
    }
}

main();
