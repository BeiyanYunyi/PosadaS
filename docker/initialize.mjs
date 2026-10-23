import { spawn } from 'node:child_process';
import { access, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const output = resolve('.next');
const marker = resolve(output, '.posadas-ready');
const imageId = (await readFile('.posadas-image-id', 'utf8')).trim();
if (!imageId) throw new Error('Missing image identity');

async function isReady() {
  try {
    return (await readFile(marker, 'utf8')).trim() === imageId &&
      (await readFile(resolve(output, 'BUILD_ID'), 'utf8')).trim().length > 0;
  } catch {
    return false;
  }
}

if (await isReady()) {
  console.log('PosadaS build is ready for this image.');
} else if (process.argv.includes('--check')) {
  throw new Error('No completed build for this image. Run init with a shared /app/.next volume first.');
} else {
  // Validate without logging secrets. Runtime code also needs these values.
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for prerendering');
  const serveUrl = new URL(process.env.SERVE_URL || '');
  if (!['http:', 'https:'].includes(serveUrl.protocol)) throw new Error('SERVE_URL must be HTTP(S)');
  // Existing schema.ts uses pgSchema, which cannot represent public.
  let databaseUrl;
  try {
    databaseUrl = new URL(process.env.DATABASE_URL);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL URL');
  }
  if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol)) {
    throw new Error('DATABASE_URL must use postgres:// or postgresql://');
  }
  const schema = process.env.SCHEMA_NAME || databaseUrl.searchParams.get('schema');
  if (!schema || schema === 'public') {
    throw new Error('Set SCHEMA_NAME or DATABASE_URL schema parameter to the existing non-public schema');
  }
  process.env.SCHEMA_NAME = schema;
  const font = process.env.POSADAS_FONT_PATH || './src/app/topic/[topicId]/MapleMono-NF-CN-Regular.ttf';
  await access(font, constants.R_OK);
  await mkdir(output, { recursive: true });
  // Keep the mount point itself. A failed/interrupted attempt must never be reused.
  for (const entry of await readdir(output)) {
    await rm(resolve(output, entry), { recursive: true, force: true });
  }
  const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
    stdio: 'inherit',
    env: process.env,
  });
  let interrupted = false;
  for (const signal of ['SIGTERM', 'SIGINT']) {
    process.on(signal, () => {
      interrupted = true;
      child.kill(signal);
    });
  }
  const code = await new Promise((resolveExit, reject) => {
    child.once('error', reject);
    child.once('exit', (status) => resolveExit(status ?? 1));
  });
  if (code !== 0 || interrupted) process.exit(code || 1);
  if (!(await readFile(resolve(output, 'BUILD_ID'), 'utf8')).trim()) {
    throw new Error('next build did not produce a BUILD_ID');
  }
  // Commit the success marker only after Next exits successfully.
  await writeFile(`${marker}.tmp`, `${imageId}\n`);
  await rename(`${marker}.tmp`, marker);
  console.log('PosadaS initialization completed.');
}
