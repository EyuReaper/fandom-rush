// Compatibility shim — @birrjs packages have breaking API changes since v0.1.2.
// Provides the `birrjs.checkout.create()` interface expected by packs.ts.
// Replace with real BirrJs integration when the API stabilizes.

import { env } from './env.js';

export const birrjs = {
  checkout: {
    async create(params: { priceId: string; userId: string; successUrl: string; cancelUrl: string }) {
      return {
        url: `${env.callbackUrl}/api/packs/callback?session_id=mock_${params.userId}_${Date.now()}`,
        id: `cs_mock_${Date.now()}`,
      };
    },
  },
};
