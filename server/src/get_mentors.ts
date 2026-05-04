import postgres from 'postgres';
const sql = postgres('postgresql://postgres.mwjrunydcnxneiyeftsj:PlataformCluster2402@aws-0-us-west-2.pooler.supabase.com:6543/postgres', { prepare: false });

async function getMentors() {
  try {
    const users = await sql`SELECT u.id, u.full_name, u.email, u.password_hash, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = 'MENTOR'`;
    console.log(JSON.stringify(users, null, 2));
  } catch(e) {
    console.error(e);
  } finally {
    await sql.end();
  }
}
getMentors();
