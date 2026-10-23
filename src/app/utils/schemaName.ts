const schemaName =
  process.env.SCHEMA_NAME ||
  (process.env.DATABASE_URL
    ? new URL(process.env.DATABASE_URL).searchParams.get('schema')
    : undefined) ||
  'public';
export default schemaName;
