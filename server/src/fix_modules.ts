import postgres from 'postgres';
const sql = postgres('postgresql://postgres.mwjrunydcnxneiyeftsj:PlataformCluster2402@aws-0-us-west-2.pooler.supabase.com:6543/postgres', { prepare: false });

async function fix() {
  const templateId = 'ebcab07f-6334-4d6e-b4f7-88302a6d4034';
  
  const mods = [
    { template_id: templateId, titulo: 'Diagnosticar', objetivo_macro: 'Entender a situação atual', ordem: 1 },
    { template_id: templateId, titulo: 'Organizar', objetivo_macro: 'Arrumar as finanças', ordem: 2 },
    { template_id: templateId, titulo: 'Prever', objetivo_macro: 'Planejar o futuro', ordem: 3 },
    { template_id: templateId, titulo: 'Calibrar', objetivo_macro: 'Ajustar as contas', ordem: 4 },
    { template_id: templateId, titulo: 'Rotinizar', objetivo_macro: 'Criar rotinas financeiras', ordem: 5 },
    { template_id: templateId, titulo: 'Crescer', objetivo_macro: 'Aumentar o lucro', ordem: 6 },
  ];

  const existing = await sql`SELECT * FROM mentorship_template_modules WHERE template_id = ${templateId}`;
  if (existing.length === 0) {
    for (const m of mods) {
       await sql`INSERT INTO mentorship_template_modules (template_id, titulo, objetivo_macro, ordem) VALUES (${m.template_id}, ${m.titulo}, ${m.objetivo_macro}, ${m.ordem})`;
    }
    console.log('Módulos adicionados ao template Lucro Estruturado!');
  } else {
    console.log('Template já possui módulos.');
  }

  const journeys = await sql`SELECT id FROM journeys WHERE template_id = ${templateId}`;
  for (const j of journeys) {
    const existingMods = await sql`SELECT id FROM modules WHERE journey_id = ${j.id}`;
    if (existingMods.length === 0) {
       console.log('Copiando módulos para journey: ' + j.id);
       for (const m of mods) {
         await sql`INSERT INTO modules (journey_id, titulo, objetivo, ordem, status) VALUES (${j.id}, ${m.titulo}, ${m.objetivo_macro}, ${m.ordem}, ${m.ordem === 1 ? 'active' : 'locked'})`;
       }
    }
  }

  await sql.end();
}
fix().catch(console.error);
