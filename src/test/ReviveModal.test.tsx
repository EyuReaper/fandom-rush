import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviveModal from '../components/ReviveModal';

const revive = vi.fn();
const endGame = vi.fn();

vi.mock('../stores/useGameStore', () => {
  const store = Object.assign(
    (selector?: (s: Record<string, unknown>) => unknown) => {
      const state = {
        revive,
        endGame,
        showRevivePrompt: true,
      };
      return selector ? selector(state) : state;
    },
    {
      getState: () => ({
        revive,
        endGame,
        showRevivePrompt: true,
      }),
    },
  );
  return { useGameStore: store };
});

describe('ReviveModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    revive.mockResolvedValue(undefined);
  });

  it('renders heading and both action buttons', () => {
    render(<ReviveModal />);
    expect(screen.getByText(/Lives Depleted/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Watch Ad to Revive/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Give Up/i })).toBeInTheDocument();
  });

  it('calls endGame when Give Up is clicked', () => {
    render(<ReviveModal />);
    fireEvent.click(screen.getByRole('button', { name: /Give Up/i }));
    expect(endGame).toHaveBeenCalledTimes(1);
  });

  it('calls revive when Watch Ad is clicked', async () => {
    // Successful revive clears the prompt so endGame is not called
    const { useGameStore } = await import('../stores/useGameStore');
    (useGameStore as { getState: () => { showRevivePrompt: boolean } }).getState = () => ({
      showRevivePrompt: false,
    });

    render(<ReviveModal />);
    fireEvent.click(screen.getByRole('button', { name: /Watch Ad to Revive/i }));

    await waitFor(() => {
      expect(revive).toHaveBeenCalledTimes(1);
    });
    expect(endGame).not.toHaveBeenCalled();
  });
});
