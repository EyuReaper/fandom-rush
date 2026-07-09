/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../lib/auth-client', () => ({
  authClient: {
    useSession: vi.fn(),
    signIn: { social: vi.fn() },
    signOut: vi.fn(),
  },
}));

import { authClient } from '../lib/auth-client';
import LoginButton from '../components/LoginButton';

describe('LoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading skeleton when session is pending', () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: undefined,
      isPending: true,
    } as any);

    const { container } = render(<LoginButton />);
    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('shows Sign In button when user is not logged in', () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: null,
      isPending: false,
    } as any);

    render(<LoginButton />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('shows user name and avatar when logged in', () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: {
        user: {
          id: '123',
          name: 'TestUser',
          email: 'test@test.com',
          image: 'https://example.com/avatar.png',
        },
        session: { id: 'sess1' },
      },
      isPending: false,
    } as any);

    render(<LoginButton />);
    expect(screen.getByText('TestUser')).toBeInTheDocument();
    const img = screen.getByAltText('TestUser');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');
  });

  it('shows fallback icon when logged in user has no image', () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: {
        user: {
          id: '123',
          name: 'NoImgUser',
          email: 'test@test.com',
          image: null,
        },
        session: { id: 'sess1' },
      },
      isPending: false,
    } as any);

    render(<LoginButton />);
    expect(screen.getByText('NoImgUser')).toBeInTheDocument();
    expect(screen.getByText(/PLAYER/i)).toBeInTheDocument();
  });

  it('calls signIn.social when Sign In button is clicked', () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: null,
      isPending: false,
    } as any);

    render(<LoginButton />);
    fireEvent.click(screen.getByText('Sign In'));
    expect(authClient.signIn.social).toHaveBeenCalledWith({
      provider: 'google',
      callbackURL: window.location.origin,
    });
  });

  it('calls signOut when avatar button is clicked while signed in', () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: {
        user: {
          id: '123',
          name: 'TestUser',
          email: 'test@test.com',
          image: null,
        },
        session: { id: 'sess1' },
      },
      isPending: false,
    } as any);

    render(<LoginButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(authClient.signOut).toHaveBeenCalled();
  });
});
