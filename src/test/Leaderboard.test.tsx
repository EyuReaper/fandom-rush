/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { API_URL } from '../lib/config';

vi.mock('../lib/auth-client', () => ({
  authClient: {
    useSession: vi.fn(),
  },
}));

import { authClient } from '../lib/auth-client';
import Leaderboard from '../components/Leaderboard';

const mockScores = [
  { user_id: "u1", user_name: "PlayerOne", user_image: null, score: 5000, game_mode: "endless", category: "all", created_at: "2026-01-01T00:00:00Z" },
  { user_id: "u2", user_name: "PlayerTwo", user_image: null, score: 3000, game_mode: "endless", category: "all", created_at: "2026-01-02T00:00:00Z" },
  { user_id: "u3", user_name: "PlayerThree", user_image: null, score: 1000, game_mode: "endless", category: "all", created_at: "2026-01-03T00:00:00Z" },
];

describe('Leaderboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authClient.useSession).mockReturnValue({
      data: null,
      isPending: false,
    } as any);
    globalThis.fetch = vi.fn();
  });

  it('shows loading state initially', () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(new Promise(() => {}) as any);
    render(<Leaderboard onClose={vi.fn()} />);
    expect(screen.getByText(/Decrypting mission logs/i)).toBeInTheDocument();
  });

  it('renders the Top Scores heading', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue({
      json: () => Promise.resolve({ scores: mockScores, userScore: null }),
      ok: true,
    } as any);
    render(<Leaderboard onClose={vi.fn()} />);
    expect(await screen.findByRole('heading', { name: /Top Scores/i })).toBeInTheDocument();
  });

  it('renders three mode tabs', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue({
      json: () => Promise.resolve({ scores: mockScores, userScore: null }),
      ok: true,
    } as any);
    render(<Leaderboard onClose={vi.fn()} />);
    expect(await screen.findByText('Endless')).toBeInTheDocument();
    expect(screen.getByText('60-Sec')).toBeInTheDocument();
    expect(screen.getByText('Chaos')).toBeInTheDocument();
  });

  it('renders score entries after loading', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue({
      json: () => Promise.resolve({ scores: mockScores, userScore: null }),
      ok: true,
    } as any);
    render(<Leaderboard onClose={vi.fn()} />);
    expect(await screen.findByText('PlayerOne')).toBeInTheDocument();
    expect(screen.getByText('PlayerTwo')).toBeInTheDocument();
    expect(screen.getByText('PlayerThree')).toBeInTheDocument();
  });

  it('displays scores formatted', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue({
      json: () => Promise.resolve({ scores: mockScores, userScore: null }),
      ok: true,
    } as any);
    render(<Leaderboard onClose={vi.fn()} />);
    expect(await screen.findByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('3,000')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('shows "NO SCORES YET // BE THE FIRST" when empty', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue({
      json: () => Promise.resolve({ scores: [], userScore: null }),
      ok: true,
    } as any);
    render(<Leaderboard onClose={vi.fn()} />);
    expect(await screen.findByText(/NO SCORES YET \/\/ BE THE FIRST/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    vi.mocked(globalThis.fetch).mockResolvedValue({
      json: () => Promise.resolve({ scores: mockScores, userScore: null }),
      ok: true,
    } as any);
    render(<Leaderboard onClose={onClose} />);
    const closeBtn = await screen.findByRole('button', { name: '' });
    fireEvent.click(closeBtn.closest('button')!);
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('shows user score footer when user is not in top scores', async () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: { user: { id: "u99", name: "CurrentUser", email: "a@b.com", image: null }, session: { id: "s1" } },
      isPending: false,
    } as any);
    vi.mocked(globalThis.fetch).mockResolvedValue({
      json: () => Promise.resolve({
        scores: mockScores,
        userScore: { user_id: "u99", user_name: "CurrentUser", user_image: null, score: 500, rank: 15 },
      }),
      ok: true,
    } as any);
    render(<Leaderboard onClose={vi.fn()} />);
    expect(await screen.findByText(/CurrentUser/i)).toBeInTheDocument();
    expect(screen.getByText(/#15/i)).toBeInTheDocument();
  });

  it('highlights the current user in the list', async () => {
    vi.mocked(authClient.useSession).mockReturnValue({
      data: { user: { id: "u1", name: "PlayerOne", email: "a@b.com", image: null }, session: { id: "s1" } },
      isPending: false,
    } as any);
    vi.mocked(globalThis.fetch).mockResolvedValue({
      json: () => Promise.resolve({ scores: mockScores, userScore: null }),
      ok: true,
    } as any);
    render(<Leaderboard onClose={vi.fn()} />);
    expect(await screen.findByText('PlayerOne')).toBeInTheDocument();
    expect(screen.getByText('PLAYER', { exact: true })).toBeInTheDocument();
  });

  it('fetches scores with the selected mode', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue({
      json: () => Promise.resolve({ scores: mockScores, userScore: null }),
      ok: true,
    } as any);
    render(<Leaderboard onClose={vi.fn()} />);
    await screen.findByText('PlayerOne');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_URL}/api/leaderboard?mode=endless`,
      expect.objectContaining({ credentials: 'include' })
    );
  });
});
