import { cache } from 'react';
import { relations } from '../../../drizzle/schema';

const getDb = cache(async () => {
  if (process.env.DATABASE_URL) {
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const { Client } = await import('pg');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const db = drizzle({ client, relations });
    return db;
  }
  const { drizzle } = await import('drizzle-orm/vercel-postgres');
  const { sql } = await import('@vercel/postgres');
  const db = drizzle(sql, { relations });
  return db;
});

const db = await getDb();

export default db;
