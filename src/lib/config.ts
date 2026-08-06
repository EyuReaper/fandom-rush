export const API_URL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:3000';

const parsedMockTimeout = Number(import.meta.env.VITE_AD_MOCK_TIMEOUT);
export const AD_MOCK_TIMEOUT =
  Number.isFinite(parsedMockTimeout) && parsedMockTimeout >= 0 ? parsedMockTimeout : 5000;

// Ad unit IDs for each ad surface. Empty until a real ad network
// (AdMob/AdSense) replaces MockRewardedProvider and the BannerAd placeholder.
export const AD_UNIT_IDS = {
  revive: (import.meta.env.VITE_AD_UNIT_REVIVE as string) || '',
  chaosPreview: (import.meta.env.VITE_AD_UNIT_CHAOS_PREVIEW as string) || '',
  banner: (import.meta.env.VITE_AD_UNIT_BANNER as string) || '',
};
