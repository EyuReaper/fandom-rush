import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreDisplay } from '../components/ScoreDisplay';

describe('ScoreDisplay', () => {
  it('renders the score formatted with commas', () => {
    render(<ScoreDisplay score={1234} combo={0} />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders "Current Score" label', () => {
    render(<ScoreDisplay score={0} combo={0} />);
    expect(screen.getByText('Current Score')).toBeInTheDocument();
  });

  it('shows combo streak when combo > 1', () => {
    render(<ScoreDisplay score={0} combo={5} />);
    expect(screen.getByText(/Combo Streak/i)).toBeInTheDocument();
  });

  it('does not show combo when combo is 0', () => {
    render(<ScoreDisplay score={0} combo={0} />);
    expect(screen.queryByText(/Combo Streak/i)).not.toBeInTheDocument();
  });

  it('does not show combo when combo is 1', () => {
    render(<ScoreDisplay score={0} combo={1} />);
    expect(screen.queryByText(/Combo Streak/i)).not.toBeInTheDocument();
  });
});
