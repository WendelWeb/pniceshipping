import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.ts';

const sql = neon(import.meta.env.VITE_DRIZZLE_DATABASE_URL);
export const db = drizzle(sql ,{schema});


// const result = await db.execute('select 1');
