import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

let container: StartedPostgreSqlContainer | undefined;

export async function setup() {
  container = await new PostgreSqlContainer('postgres:16-alpine').start();
  process.env.DATABASE_URL = container.getConnectionUri();

  const { Pool } = pg;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const schemaPath = path.resolve(__dirname, '../../full_schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  await pool.query(schema);
  await pool.end();

  process.env.VITE_TEST_DATABASE_URL = process.env.DATABASE_URL;
}

export async function teardown() {
  if (container) {
    await container.stop();
  }
}
