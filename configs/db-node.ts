/**
 * Database configuration for Node.js scripts
 * Uses process.env instead of import.meta.env
 */

import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

const databaseUrl = process.env.VITE_DRIZZLE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('VITE_DRIZZLE_DATABASE_URL environment variable is not set. Make sure .env.local exists.');
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
