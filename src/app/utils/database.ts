import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { cache } from 'react';
import * as schema from '../../../drizzle/schema';

const getDb = cache(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const db = drizzle(client, { schema });
  return db;
});

export const db = await getDb();
