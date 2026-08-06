import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AdManager, MockRewardedProvider } from '../lib/adManager';

describe('AdManager', () => {
  let manager: AdManager;

  beforeEach(() => {
    manager = new AdManager();
    document.body.innerHTML = '';
  });

  describe('showRewardedVideo', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('resolves true via the default MockRewardedProvider after the configured timeout', async () => {
      const promise = manager.showRewardedVideo();
      vi.advanceTimersByTime(5000);
      await expect(promise).resolves.toBe(true);
    });

    it('delegates to a custom provider set via setRewardedProvider', async () => {
      const custom = { show: vi.fn().mockResolvedValue(false) };
      manager.setRewardedProvider(custom);

      const result = await manager.showRewardedVideo();

      expect(custom.show).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });

    it('surfaces provider rejection (ad failed to load) to the caller', async () => {
      const failing = { show: vi.fn().mockRejectedValue(new Error('ad network error')) };
      manager.setRewardedProvider(failing);

      await expect(manager.showRewardedVideo()).rejects.toThrow('ad network error');
    });
  });

  describe('showBanner / hideBanner — ad blocker resilience', () => {
    it('does nothing (no throw) when the container is missing, e.g. stripped by an ad blocker', () => {
      expect(() => manager.showBanner('banner-ad-container')).not.toThrow();
      expect(() => manager.hideBanner('banner-ad-container')).not.toThrow();
    });

    it('toggles hidden state and dataset on an existing container', () => {
      const el = document.createElement('div');
      el.id = 'banner-ad-container';
      el.hidden = true;
      document.body.appendChild(el);

      manager.showBanner('banner-ad-container');
      expect(el.hidden).toBe(false);
      expect(el.dataset.adState).toBe('visible');

      manager.hideBanner('banner-ad-container');
      expect(el.hidden).toBe(true);
      expect(el.dataset.adState).toBe('hidden');
    });
  });
});

describe('MockRewardedProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('always resolves true, simulating a completed ad watch', async () => {
    const provider = new MockRewardedProvider();
    const promise = provider.show();
    vi.advanceTimersByTime(5000);
    await expect(promise).resolves.toBe(true);
  });
});
