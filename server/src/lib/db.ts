import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000, // fail after 10s instead of hanging for ever
});

pool.on('error', (err) => {   // prevent crash on idle client errors
  console.error('Unexpected pool error:', err.message);
});
