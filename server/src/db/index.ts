import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Ensure this environment variable is set
const connectionString = process.env.DATABASE_URL || '';

// Create a postgres client
const client = postgres(connectionString, { prepare: false });

import * as schema from './schema';

// Export the db instance
export const db = drizzle(client, { schema });

