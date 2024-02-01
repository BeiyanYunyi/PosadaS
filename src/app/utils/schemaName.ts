const schemaReg = /(?<=schema=).*/;
const schemaName = schemaReg.exec(process.env.DATABASE_URL!)?.[0] || 'public';
export default schemaName;
