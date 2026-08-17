import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { afterAll, beforeAll } from 'vitest';
import { pool } from '../lib/db';
import fs from 'fs';
import path from 'path';

let container: StartedPostgreSqlContainer;

beforeAll(async () => {
  // Start the PostgreSQL container
  container = await new PostgreSqlContainer().start();

  // Set the environment variable so the pool connects to the test database
  process.env.DATABASE_URL = container.getConnectionUri();

  // Load the schema
  const schemaPath = path.resolve(__dirname, '../../full_schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // We need to re-initialize the pool's configuration or connect to it
  // Wait, the pool is exported from db.ts and it might have already evaluated process.env.DATABASE_URL.
  // Instead, let's redefine the connection details or recreate the pool.
  // We can just update the pool config if we're careful.
  pool.options.connectionString = process.env.DATABASE_URL;

  // Run the schema
  await pool.query(schema);
});

afterAll(async () => {
  await pool.end();
  await container.stop();
});
