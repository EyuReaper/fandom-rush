import { AD_MOCK_TIMEOUT } from "./config";

export interface RewardedVideoProvider {
  show(): Promise<boolean>;
}

/** A deterministic provider for local development and automated tests. */
export class MockRewardedProvider implements RewardedVideoProvider {
  show(): Promise<boolean> {
    return new Promise((resolve) => {
      window.setTimeout(() => resolve(true), AD_MOCK_TIMEOUT);
    });
  }
}

export class AdManager {
  private rewardedProvider: RewardedVideoProvider = new MockRewardedProvider();

  setRewardedProvider(provider: RewardedVideoProvider) {
    this.rewardedProvider = provider;
  }

  showRewardedVideo() {
    return this.rewardedProvider.show();
  }

  showBanner(containerId = "banner-ad-container") {
    if (typeof document === "undefined") return;

    const container = document.getElementById(containerId);
    if (!container) return;

    container.hidden = false;
    container.dataset.adState = "visible";
  }

  hideBanner(containerId = "banner-ad-container") {
    if (typeof document === "undefined") return;

    const container = document.getElementById(containerId);
    if (!container) return;

    container.hidden = true;
    container.dataset.adState = "hidden";
  }
}

export const adManager = new AdManager();

export const showRewardedVideo = () => adManager.showRewardedVideo();
export const showBanner = (containerId?: string) => adManager.showBanner(containerId);
export const hideBanner = (containerId?: string) => adManager.hideBanner(containerId);
