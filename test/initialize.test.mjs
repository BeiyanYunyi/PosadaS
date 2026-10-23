import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readFile, access, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const script = resolve('docker/initialize.mjs');
async function fixture(t) {
  const cwd = await mkdtemp(join(tmpdir(), 'posadas-init-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  await mkdir(join(cwd, 'node_modules/next/dist/bin'), { recursive: true });
  await writeFile(join(cwd, '.posadas-image-id'), 'image-one');
  await writeFile(join(cwd, 'font.ttf'), 'fixture');
  const env = { ...process.env, DATABASE_URL: 'postgres://unused/db?schema=test',
    SERVE_URL: 'https://example.test', SCHEMA_NAME: '', POSADAS_FONT_PATH: join(cwd, 'font.ttf') };
  const cli = join(cwd, 'node_modules/next/dist/bin/next');
  const success = `require('fs').writeFileSync('.next/BUILD_ID', 'build-one');`;
  await writeFile(cli, success);
  return { cwd, env, cli, success, run: (...args) => spawnSync(process.execPath, [script, ...args], { cwd, env, encoding: 'utf8' }) };
}

test('init succeeds, repeated init reuses, and start check needs no build configuration', async (t) => {
  const f = await fixture(t);
  assert.equal(f.run().status, 0);
  assert.equal(await readFile(join(f.cwd, '.next/.posadas-ready'), 'utf8'), 'image-one\n');
  await writeFile(f.cli, 'process.exit(99)');
  assert.equal(f.run().status, 0);
  delete f.env.DATABASE_URL;
  assert.equal(f.run('--check').status, 0);
});

test('uninitialized, foreign-image, and missing BUILD_ID artifacts are rejected', async (t) => {
  const f = await fixture(t);
  assert.notEqual(f.run('--check').status, 0);
  assert.equal(f.run().status, 0);
  await writeFile(join(f.cwd, '.posadas-image-id'), 'image-two');
  assert.notEqual(f.run('--check').status, 0);
  assert.equal(f.run().status, 0);
  await rm(join(f.cwd, '.next/BUILD_ID'));
  assert.notEqual(f.run('--check').status, 0);
});

test('failed build removes stale state and a later retry succeeds', async (t) => {
  const f = await fixture(t);
  assert.equal(f.run().status, 0);
  await writeFile(join(f.cwd, '.posadas-image-id'), 'image-two');
  await writeFile(f.cli, `require('fs').writeFileSync('.next/BUILD_ID', 'partial'); process.exit(42);`);
  assert.equal(f.run().status, 42);
  await assert.rejects(access(join(f.cwd, '.next/.posadas-ready')));
  assert.notEqual(f.run('--check').status, 0);
  await writeFile(f.cli, f.success);
  assert.equal(f.run().status, 0);
});

test('zero exit without BUILD_ID is not success', async (t) => {
  const f = await fixture(t);
  await writeFile(f.cli, 'process.exit(0)');
  assert.notEqual(f.run().status, 0);
  await assert.rejects(access(join(f.cwd, '.next/.posadas-ready')));
});

test('missing database, invalid URL, public schema, and missing font fail before build', async (t) => {
  const f = await fixture(t);
  for (const [key, value] of [['DATABASE_URL', ''], ['SERVE_URL', 'invalid'], ['SCHEMA_NAME', 'public'], ['POSADAS_FONT_PATH', '/nonexistent-font']]) {
    const before = f.env[key];
    f.env[key] = value;
    assert.notEqual(f.run().status, 0, key);
    await assert.rejects(access(join(f.cwd, '.next/.posadas-ready')));
    f.env[key] = before;
  }
});

test('SIGTERM is forwarded and an interrupted build never becomes ready', { timeout: 10000 }, async (t) => {
  const f = await fixture(t);
  await writeFile(f.cli, `require('fs').writeFileSync('started', 'yes'); setInterval(() => {}, 1000);`);
  const child = spawn(process.execPath, [script], { cwd: f.cwd, env: f.env, stdio: 'ignore' });
  t.after(() => child.kill('SIGKILL'));
  const exited = new Promise((resolveExit) => child.once('exit', (code) => resolveExit(code)));
  for (;;) {
    try { await access(join(f.cwd, 'started')); break; } catch { await new Promise((r) => setTimeout(r, 20)); }
  }
  child.kill('SIGTERM');
  assert.notEqual(await exited, 0);
  await assert.rejects(access(join(f.cwd, '.next/.posadas-ready')));
});

test('invalid database URL diagnostics never expose its value', async (t) => {
  const f = await fixture(t);
  f.env.DATABASE_URL = 'password-sensitive-value';
  const result = f.run();
  assert.notEqual(result.status, 0);
  assert.ok(!result.stderr.includes('password-sensitive-value'));
});
