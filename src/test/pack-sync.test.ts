import { describe, it, expect } from 'vitest';
import { PLANS } from '../../server/src/lib/birrjs-plans';
// Import the client's clue definitions to verify they only use valid server pack IDs
import { fandomClues } from '../data/fandomClues';

describe('Pack ID synchronization (Contract Test)', () => {
  it('server pack IDs match the exact strings the client expects', () => {
    // The client relies on these exact string literals in useGameStore.ts
    // (e.g., entitlements.includes("fanatic")) and ShopScreen.tsx.
    const serverPackIds = Object.keys(PLANS);
    
    expect(serverPackIds).toContain('enthusiast');
    expect(serverPackIds).toContain('fanatic');
    expect(serverPackIds.length).toBe(2);
  });

  it('client premium clues only use valid server pack IDs', () => {
    const serverPackIds = Object.keys(PLANS);
    
    for (const clue of fandomClues) {
      if (clue.premium) {
        expect(serverPackIds).toContain(clue.premium);
      }
    }
  });
});
