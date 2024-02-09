import schemaName from '@/app/utils/schemaName';
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  driver: 'pg',
  dbCredentials: { connectionString: process.env.DATABASE_URL! },
  verbose: true,
  strict: true,
  schemaFilter: [schemaName],
  schema: './drizzle/*',
});
