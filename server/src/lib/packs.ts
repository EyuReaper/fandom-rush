import { pool } from "./db.js";
import type { PackId } from "./birrjs-plans.js";


export async function getEntitlements(userId: string): Promise<PackId[]> {
  const result = await pool.query('SELECT pack_id FROM pack_purchases WHERE user_id = $1', [userId]);
  return result.rows.map(r => r.pack_id as PackId);
}
