import jwt from 'jsonwebtoken';

const token = jwt.sign(
  {
    userId: 'c0d4c2bb-2098-4ee0-9c17-35e3ba5a844b',
    email: 'mateus_monteiro123@hotmail.com',
    role: 'MENTOR'
  },
  'centralized_secret_key_cluster_2024_auth_sync',
  { expiresIn: '1h' }
);

async function testApi() {
  try {
    const res = await fetch("http://localhost:4000/api/mentor/alunos/5615dc40-cfc4-4180-8e24-c3036fed42c2", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Response:", JSON.stringify(json).substring(0, 200));
  } catch(e) {
    console.error(e);
  }
}
testApi();
