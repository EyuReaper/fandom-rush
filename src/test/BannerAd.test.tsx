import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import BannerAd from '../components/BannerAd';

vi.mock('../lib/adManager', () => ({
  showBanner: vi.fn(),
  hideBanner: vi.fn(),
}));

import { showBanner, hideBanner } from '../lib/adManager';

describe('BannerAd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the AdSense target container with glass styling', () => {
    const { container } = render(<BannerAd />);
    const el = container.querySelector('#banner-ad-container');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('id', 'banner-ad-container');
    expect(el?.className).toContain('bg-white/5');
    expect(el?.className).toContain('min-h-[90px]');
  });

  it('shows a Sponsored label', () => {
    const { getByText } = render(<BannerAd />);
    expect(getByText('Sponsored')).toBeInTheDocument();
  });

  it('calls showBanner on mount and hideBanner on unmount', () => {
    render(<BannerAd />);
    expect(showBanner).toHaveBeenCalledWith('banner-ad-container');
    cleanup();
    expect(hideBanner).toHaveBeenCalledWith('banner-ad-container');
  });
});
