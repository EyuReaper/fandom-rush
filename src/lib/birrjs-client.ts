import { API_URL } from "./config";

export async function getPlans() {
  const res = await fetch(`${API_URL}/api/packs/plans`);
  return res.json();
}

export async function getEntitlements(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/packs/entitlements`, { credentials: 'include' });
  if (!res.ok) return [];
  return res.json();
}

export async function initiateCheckout(packId: string) {
  // call server endpoint that creates a BirrJs checkout session
  const res = await fetch(`${API_URL}/api/packs/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ packId }), });
  return res.json();
}
