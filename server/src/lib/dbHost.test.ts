import { describe, it, expect } from 'vitest';
import { dbHostIsLocal } from './dbHost.js';

describe('dbHostIsLocal', () => {
  it('treats localhost and loopback as local', () => {
    expect(dbHostIsLocal('postgresql://postgres:pw@localhost:5432/fandom_rush')).toBe(true);
    expect(dbHostIsLocal('postgresql://postgres:pw@127.0.0.1:5432/fandom_rush')).toBe(true);
    expect(dbHostIsLocal('postgresql://postgres:pw@[::1]:5432/fandom_rush')).toBe(true);
  });

  it('treats single-label docker-compose service names as local', () => {
    expect(dbHostIsLocal('postgresql://postgres:pw@postgres:5432/fandom_rush')).toBe(true);
    expect(dbHostIsLocal('postgresql://postgres:pw@db:5432/fandom_rush')).toBe(true);
  });

  it('treats dotted managed hosts (Supabase) as remote -> SSL', () => {
    expect(
      dbHostIsLocal('postgresql://postgres.[id]:[pw]@aws-0-us-east-1.pooler.supabase.com:6543/postgres')
    ).toBe(false);
    expect(dbHostIsLocal('postgresql://postgres:pw@db.xyz.supabase.co:5432/fandom_rush')).toBe(false);
  });

  it('treats an empty connection string as remote (conservative)', () => {
    expect(dbHostIsLocal('')).toBe(false);
    expect(dbHostIsLocal('not-a-url')).toBe(false);
  });
});