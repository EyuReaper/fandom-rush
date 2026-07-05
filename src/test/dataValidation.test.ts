import { describe, it, expect } from 'vitest';
import { fandomClues } from '../data/fandomClues';
import { z } from 'zod';

const ClueSchema = z.object({
  id: z.number().int().positive(),
  fandom: z.string().min(1),
  category: z.enum(['anime', 'movies', 'cartoons', 'tv', 'games', 'mythology', 'internet', 'sports', 'music', 'history', 'tech']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  objectName: z.string().min(1),
  imagePath: z.string().startsWith('/src/assets/'),
  correctAnswer: z.string().min(1),
  premium: z.enum(['enthusiast', 'fanatic']).optional(),
});

describe('Fandom Clues Data Validation', () => {
  it('should have a valid schema for all clues', () => {
    fandomClues.forEach(clue => {
      const result = ClueSchema.safeParse(clue);
      if (!result.success) {
        console.error(`Validation failed for clue ID ${clue.id}:`, result.error.format());
      }
      expect(result.success).toBe(true);
    });
  });

  it('should have unique IDs for all clues', () => {
    const ids = fandomClues.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('should have valid image paths (simulated check)', () => {
    fandomClues.forEach(clue => {
      // Basic check that it looks like a valid path
      expect(clue.imagePath).toMatch(/\.(png|jpg|jpeg|svg|webp)$/i);
    });
  });

  it('should have correctAnswer matching the fandom name (usually)', () => {
    // In this game, correctAnswer IS the fandom name
    fandomClues.forEach(clue => {
      expect(clue.correctAnswer).toBe(clue.fandom);
    });
  });
  it('has correct premium clue distribution', () => {
    const free = fandomClues.filter(c => !c.premium).length;
    const enthusiast = fandomClues.filter(c => c.premium === 'enthusiast').length;
    const fanatic = fandomClues.filter(c => c.premium === 'fanatic').length;
    expect(free).toBe(70);
    expect(enthusiast).toBe(36);
    expect(fanatic).toBe(60);
    expect(free + enthusiast + fanatic).toBe(166);
  });

});
