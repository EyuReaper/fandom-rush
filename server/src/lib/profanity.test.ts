import { describe, it, expect } from 'vitest';
import { containsProfanity } from './profanity';

describe('containsProfanity', () => {
  it('should return false for clean text', () => {
    expect(containsProfanity('This is a great game!')).toBe(false);
  });

  it('should return true for profanity', () => {
    expect(containsProfanity('fuck this')).toBe(true);
  });

  it('should be case-insensitive', () => {
    expect(containsProfanity('ShIt')).toBe(true);
  });
});
