const schemaReg = /(?<=schema=).*/;
const schemaName =
  process.env.SCHEMA_NAME || schemaReg.exec(process.env.DATABASE_URL!)?.[0] || 'public';
export default schemaName;
