function schemaFromDatabaseUrl() {
  if (!process.env.DATABASE_URL) return undefined;
  try {
    return new URL(process.env.DATABASE_URL).searchParams.get('schema');
  } catch {
    // Do not include a credential-bearing URL in an exception.
    throw new Error('DATABASE_URL must be a valid PostgreSQL URL');
  }
}

const schemaName = process.env.SCHEMA_NAME || schemaFromDatabaseUrl() || 'public';
export default schemaName;
