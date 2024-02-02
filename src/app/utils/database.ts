import * as schema from '@drizzle/schema/schema';
import { cache } from 'react';

const getDb = cache(async () => {
  if (process.env.DATABASE_URL) {
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const { Pool } = await import('pg');
    const client = new Pool({ connectionString: process.env.DATABASE_URL });
    // await client.connect();
    const db = drizzle(client, { schema });
    return db;
  }
  const { drizzle } = await import('drizzle-orm/vercel-postgres');
  const { sql } = await import('@vercel/postgres');
  const db = drizzle(sql, { schema });
  return db;
});

const db = await getDb();

export default db;
