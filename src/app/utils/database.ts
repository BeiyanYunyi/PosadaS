import { cache } from 'react';
import { relations } from '../../../drizzle/schema';

const getDb = cache(async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

    const { drizzle } = await import('drizzle-orm/node-postgres');
    const { Pool } = await import('pg');
    const client = new Pool({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const db = drizzle({ client, relations });
    return db;
});

const db = await getDb();

export default db;
