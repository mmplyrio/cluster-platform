import fetch from 'node-fetch';
import 'dotenv/config';

async function test() {
    const alunoId = '5615dc40-cfc4-4180-8e24-c3036fed42c2';
    const API_URL = 'http://localhost:4000/api';
    
    // We need a token. I'll use a hardcoded one if I can find it or just try without it to see if it reaches the server.
    const res = await fetch(`${API_URL}/mentor/alunos/${alunoId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    console.log('Status:', res.status);
    const json = await res.json();
    console.log('Body:', json);
}
test();
