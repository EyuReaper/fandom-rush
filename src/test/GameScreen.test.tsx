/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useGameStore } from '../stores/useGameStore';

vi.mock('../lib/auth-client', () => ({
  authClient: {
    useSession: vi.fn(),
  },
}));

vi.mock('./Leaderboard', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="leaderboard-modal">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

import { authClient } from '../lib/auth-client';
import GameScreen from '../components/GameScreen';

const mockClue = {
  id: 1,
  fandom: "One Piece",
  category: "anime",
  difficulty: "easy" as const,
  objectName: "Straw Hat",
  imagePath: "/src/assets/anime/one-piece/straw-hat.png",
  correctAnswer: "One Piece",
};

describe('GameScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGameStore.getState().resetGame();
    localStorage.clear();
    vi.mocked(authClient.useSession).mockReturnValue({
      data: null,
      isPending: false,
    } as any);
    globalThis.fetch = vi.fn();
  });

  it('returns null when there is no currentClue', () => {
    const { container } = render(<GameScreen />);
    expect(container.innerHTML).toBe('');
  });

  it('renders the clue image during gameplay', () => {
    useGameStore.setState({
      isPlaying: true,
      currentClue: mockClue,
      options: ["One Piece", "Naruto", "Dragon Ball", "Pokemon"],
    });
    render(<GameScreen />);
    const img = screen.getByAltText('Straw Hat');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockClue.imagePath);
  });

  it('renders four answer options during gameplay', () => {
    useGameStore.setState({
      isPlaying: true,
      currentClue: mockClue,
      options: ["One Piece", "Naruto", "Dragon Ball", "Pokemon"],
    });
    render(<GameScreen />);
    expect(screen.getByText('One Piece')).toBeInTheDocument();
    expect(screen.getByText('Naruto')).toBeInTheDocument();
    expect(screen.getByText('Dragon Ball')).toBeInTheDocument();
    expect(screen.getByText('Pokemon')).toBeInTheDocument();
  });

  it('shows keyboard help footer', () => {
    useGameStore.setState({
      isPlaying: true,
      currentClue: mockClue,
      options: ["One Piece", "Naruto", "Dragon Ball", "Pokemon"],
    });
    render(<GameScreen />);
    expect(screen.getByText(/1-4/)).toBeInTheDocument();
    expect(screen.getByText(/W A S D/)).toBeInTheDocument();
  });

  it('renders hearts for non-sixty-second modes', () => {
    useGameStore.setState({
      isPlaying: true,
      currentClue: mockClue,
      options: ["One Piece", "Naruto", "Dragon Ball", "Pokemon"],
      gameMode: "endless",
      lives: 3,
    });
    render(<GameScreen />);
    const hearts = document.querySelectorAll('[class*="fill-red-500"]');
    expect(hearts.length).toBe(3);
  });

  it('does not render hearts for sixty-second mode', () => {
    useGameStore.setState({
      isPlaying: true,
      currentClue: mockClue,
      options: ["One Piece", "Naruto", "Dragon Ball", "Pokemon"],
      gameMode: "sixty-second",
      lives: 3,
    });
    render(<GameScreen />);
    const hearts = document.querySelectorAll('[class*="fill-red-500"]');
    expect(hearts.length).toBe(0);
  });

  it('shows the score during gameplay', () => {
    useGameStore.setState({
      isPlaying: true,
      currentClue: mockClue,
      options: ["One Piece", "Naruto", "Dragon Ball", "Pokemon"],
      score: 250,
    });
    render(<GameScreen />);
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  it('shows GAME OVER screen when game ends', () => {
    useGameStore.setState({
      isPlaying: false,
      currentClue: mockClue,
      score: 100,
      lives: 0,
      combo: 0,
      highScore: 100,
      gameMode: "endless",
    });
    render(<GameScreen />);
    expect(screen.getByText(/GAME/i)).toBeInTheDocument();
    expect(screen.getByText(/OVER/i)).toBeInTheDocument();
    expect(screen.getAllByText('100').length).toBeGreaterThanOrEqual(1);
  });

  it('shows "New Sector Record" on game over when score matches highScore', () => {
    useGameStore.setState({
      isPlaying: false,
      currentClue: mockClue,
      score: 500,
      lives: 0,
      combo: 0,
      highScore: 500,
      gameMode: "endless",
    });
    render(<GameScreen />);
    expect(screen.getByText(/NEW HIGH SCORE/i)).toBeInTheDocument();
  });

  it('shows INSERT COIN button on game over', () => {
    useGameStore.setState({
      isPlaying: false,
      currentClue: mockClue,
      score: 100,
      lives: 0,
      combo: 0,
      highScore: 200,
      gameMode: "endless",
    });
    render(<GameScreen />);
    expect(screen.getByText(/INSERT COIN/i)).toBeInTheDocument();
  });

  it('shows BACK TO TITLE SCREEN button on game over', () => {
    useGameStore.setState({
      isPlaying: false,
      currentClue: mockClue,
      score: 100,
      lives: 0,
      combo: 0,
      highScore: 200,
      gameMode: "endless",
    });
    render(<GameScreen />);
    expect(screen.getByText(/BACK TO TITLE SCREEN/i)).toBeInTheDocument();
  });

  it('INSERT COIN restarts the same game mode', () => {
    useGameStore.setState({
      isPlaying: false,
      currentClue: mockClue,
      score: 100,
      lives: 0,
      combo: 0,
      highScore: 200,
      gameMode: "endless",
    });
    render(<GameScreen />);
    fireEvent.click(screen.getByText(/INSERT COIN/i));
    expect(useGameStore.getState().isPlaying).toBe(true);
    expect(useGameStore.getState().gameMode).toBe('endless');
  });

  it('BACK TO TITLE SCREEN resets to main menu', () => {
    useGameStore.setState({
      isPlaying: false,
      currentClue: mockClue,
      score: 100,
      lives: 0,
      combo: 0,
      highScore: 200,
      gameMode: "endless",
    });
    render(<GameScreen />);
    fireEvent.click(screen.getByText(/BACK TO TITLE SCREEN/i));
    expect(useGameStore.getState().isPlaying).toBe(false);
    expect(useGameStore.getState().currentClue).toBeNull();
  });

  it('triggers correct answer feedback when clicking the right option', () => {
    useGameStore.setState({
      isPlaying: true,
      currentClue: mockClue,
      options: ["One Piece", "Naruto", "Dragon Ball", "Pokemon"],
      score: 0,
      combo: 0,
    });
    render(<GameScreen />);
    fireEvent.click(screen.getByText('One Piece'));
    expect(useGameStore.getState().combo).toBe(1);
  });

  it('triggers wrong answer feedback and loses a life', () => {
    useGameStore.setState({
      isPlaying: true,
      currentClue: mockClue,
      options: ["One Piece", "Naruto", "Dragon Ball", "Pokemon"],
      lives: 3,
      combo: 0,
    });
    render(<GameScreen />);
    fireEvent.click(screen.getByText('Naruto'));
    expect(useGameStore.getState().lives).toBe(2);
    expect(useGameStore.getState().combo).toBe(0);
  });

  it('shows combo streak indicator at 5+ combo', () => {
    useGameStore.setState({
      isPlaying: true,
      currentClue: mockClue,
      options: ["One Piece", "Naruto", "Dragon Ball", "Pokemon"],
      score: 0,
      combo: 5,
    });
    render(<GameScreen />);
    expect(screen.getByText(/Hot Streak/i)).toBeInTheDocument();
  });

  it('shows category name in category mode', () => {
    useGameStore.setState({
      isPlaying: true,
      currentClue: mockClue,
      options: ["One Piece", "Naruto", "Dragon Ball", "Pokemon"],
      gameMode: "category",
      selectedCategory: "anime",
    });
    render(<GameScreen />);
    expect(screen.getByText(/anime/i)).toBeInTheDocument();
  });
});
