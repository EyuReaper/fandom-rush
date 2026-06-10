import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimeBar } from '../components/TimeBar';

describe('TimeBar', () => {
  it('renders "Time Status" label', () => {
    render(<TimeBar timeLeft={8} maxTime={8} />);
    expect(screen.getByText('Time Status')).toBeInTheDocument();
  });

  it('displays the time left formatted to 1 decimal', () => {
    render(<TimeBar timeLeft={7.5} maxTime={8} />);
    expect(screen.getByText('7.5s')).toBeInTheDocument();
  });

  it('shows urgent styling when timeLeft <= 30% of maxTime', () => {
    render(<TimeBar timeLeft={2} maxTime={8} />);
    const timeSpan = screen.getByText('2.0s');
    expect(timeSpan.className).toContain('text-red-500');
  });

  it('shows normal styling when timeLeft > 30% of maxTime', () => {
    render(<TimeBar timeLeft={6} maxTime={8} />);
    const timeSpan = screen.getByText('6.0s');
    expect(timeSpan.className).toContain('text-cyan-400');
  });

  it('shows urgent at exactly 30% threshold', () => {
    render(<TimeBar timeLeft={2.4} maxTime={8} />);
    const timeSpan = screen.getByText('2.4s');
    expect(timeSpan.className).toContain('text-red-500');
  });
});
