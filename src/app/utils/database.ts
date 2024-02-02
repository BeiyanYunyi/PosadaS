import * as schema from '@drizzle/schema/schema';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { cache } from 'react';

const getDb = cache(async () => {
  const client = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(client, { schema });
  return db;
});

const db = await getDb();

export default db;
