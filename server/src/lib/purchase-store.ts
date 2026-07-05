// Shared in-memory store for TEST_MODE (no Postgres required)
export const testPurchaseStore = new Map<string, { user_id: string; pack_id: string; subscription_id: string }>();
