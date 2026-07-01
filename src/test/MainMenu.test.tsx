/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useGameStore } from '../stores/useGameStore';

vi.mock('../lib/auth-client', () => ({
  authClient: {
    useSession: vi.fn(),
  },
}));

vi.mock('../components/Leaderboard', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="leaderboard-modal">
      <button onClick={onClose} data-testid="close-leaderboard">Close</button>
    </div>
  ),
}));

import { authClient } from '../lib/auth-client';
import MainMenu from '../components/MainMenu';

describe('MainMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGameStore.getState().resetGame();
    localStorage.clear();

    vi.mocked(authClient.useSession).mockReturnValue({
      data: null,
      isPending: false,
    } as any);
  });

  it('renders the game title', () => {
    render(<MainMenu />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toMatch(/FAND/i);
    expect(heading.textContent).toMatch(/RUSH/i);
  });

  it('renders all four game mode buttons', () => {
    render(<MainMenu />);
    expect(screen.getByText('Endless Rush')).toBeInTheDocument();
    expect(screen.getByText('60-Second Rush')).toBeInTheDocument();
    expect(screen.getByText('Category Rush')).toBeInTheDocument();
    expect(screen.getByText('Chaos Mode')).toBeInTheDocument();
  });

  it('shows the global high score', () => {
    useGameStore.setState({ highScore: 5000 });
    render(<MainMenu />);
    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText(/Global High Score/i)).toBeInTheDocument();
  });

  it('shows the settings button', () => {
    render(<MainMenu />);
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  it('starts endless game when Endless Rush is clicked', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('Endless Rush'));
    expect(useGameStore.getState().isPlaying).toBe(true);
    expect(useGameStore.getState().gameMode).toBe('endless');
  });

  it('starts 60-second game when 60-Second Rush is clicked', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('60-Second Rush'));
    expect(useGameStore.getState().isPlaying).toBe(true);
    expect(useGameStore.getState().gameMode).toBe('sixty-second');
  });

  it('starts chaos game when Chaos Mode is clicked', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('Chaos Mode'));
    expect(useGameStore.getState().isPlaying).toBe(true);
    expect(useGameStore.getState().gameMode).toBe('chaos');
  });

  it('opens category selector when Category Rush is clicked', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('Category Rush'));
    expect(screen.getByText(/SELECT/i)).toBeInTheDocument();
    expect(screen.getByText(/DOMAIN/i)).toBeInTheDocument();
  });

  it('shows all five categories in category selector', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('Category Rush'));
    expect(screen.getByText('Anime')).toBeInTheDocument();
    expect(screen.getByText('Movies')).toBeInTheDocument();
    expect(screen.getByText('TV Shows')).toBeInTheDocument();
    expect(screen.getByText('Cartoons')).toBeInTheDocument();
    expect(screen.getByText('Games')).toBeInTheDocument();
  });

  it('TV Shows and Games categories are now enabled', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('Category Rush'));
    const tvButton = screen.getByText('TV Shows').closest('button');
    const gamesButton = screen.getByText('Games').closest('button');
    expect(tvButton).toBeEnabled();
    expect(gamesButton).toBeEnabled();
  });

  it('can select a category from the category selector', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('Category Rush'));
    fireEvent.click(screen.getByText('Cartoons'));
    expect(useGameStore.getState().isPlaying).toBe(true);
    expect(useGameStore.getState().gameMode).toBe('category');
    expect(useGameStore.getState().selectedCategory).toBe('cartoons');
  });

  it('can go back to main menu from category selector', () => {
    render(<MainMenu />);
    fireEvent.click(screen.getByText('Category Rush'));
    fireEvent.click(screen.getByText(/to Main menu/i));
    expect(screen.getByText('Endless Rush')).toBeInTheDocument();
  });
});
