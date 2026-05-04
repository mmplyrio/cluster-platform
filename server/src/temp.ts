import postgres from 'postgres';
const sql = postgres('postgresql://postgres.mwjrunydcnxneiyeftsj:PlataformCluster2402@aws-0-us-west-2.pooler.supabase.com:6543/postgres', { prepare: false });

async function run() {
  try {
    const mods = await sql`SELECT * FROM mentorship_template_modules WHERE template_id = 'ebcab07f-6334-4d6e-b4f7-88302a6d4034'`;
    console.log(mods);
  } catch(e) {
    console.error(e);
  } finally {
    await sql.end();
  }
}
run();
