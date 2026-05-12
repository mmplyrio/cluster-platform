"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const postgres_1 = __importDefault(require("postgres"));
const connectionString = (process.env.DATABASE_URL || '').replace(/%(?![0-9a-fA-F]{2})/g, '%25');
const client = (0, postgres_1.default)(connectionString, { ssl: 'require', prepare: false });
async function main() {
    try {
        const users = await client.unsafe("SELECT id, email FROM users WHERE email = 'mateus_monteiro123@hotmail.com'");
        console.log('User:', users);
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await client.end();
    }
}
main();
