export type Difficulty = "easy" | "medium" | "hard";

export interface FandomClue {
  id: number;
  fandom: string;
  category: string;
  difficulty: Difficulty;
  objectName: string;
  imagePath: string;
  correctAnswer: string;
}

export const fandomClues: FandomClue[] = [
  // === ANIME ===
  {
    id: 1,
    fandom: "One Piece",
    category: "anime",
    difficulty: "easy",
    objectName: "Straw Hat",
    imagePath: "/assets/anime/one-piece/straw-hat.png",
    correctAnswer: "One Piece",
  },
  {
    id: 2,
    fandom: "One Piece",
    category: "anime",
    difficulty: "medium",
    objectName: "Wanted Poster",
    imagePath: "/assets/anime/one-piece/wanted-poster.png",
    correctAnswer: "One Piece",
  },
  {
    id: 3,
    fandom: "One Piece",
    category: "anime",
    difficulty: "hard",
    objectName: "Devil Fruit",
    imagePath: "/assets/anime/one-piece/devil-fruit.png",
    correctAnswer: "One Piece",
  },

  // === MOVIES ===
  {
    id: 4,
    fandom: "Harry Potter",
    category: "movies",
    difficulty: "easy",
    objectName: "Wizard Wand",
    imagePath: "/assets/movies/harry-potter/wizard-wand.png",
    correctAnswer: "Harry Potter",
  },
  {
    id: 5,
    fandom: "Harry Potter",
    category: "movies",
    difficulty: "medium",
    objectName: "Sorting Hat",
    imagePath: "/assets/movies/harry-potter/sorting-hat.png",
    correctAnswer: "Harry Potter",
  },
  {
    id: 6,
    fandom: "Harry Potter",
    category: "movies",
    difficulty: "hard",
    objectName: "Marauder's Map",
    imagePath: "/assets/movies/harry-potter/marauders-map.png",
    correctAnswer: "Harry Potter",
  },

  // === TV SHOWS ===
  {
    id: 7,
    fandom: "Breaking Bad",
    category: "tv-shows",
    difficulty: "easy",
    objectName: "Yellow Hazmat Suit",
    imagePath: "/assets/tv-shows/breaking-bad/yellow-hazmat-suit.png",
    correctAnswer: "Breaking Bad",
  },
  {
    id: 8,
    fandom: "Breaking Bad",
    category: "tv-shows",
    difficulty: "medium",
    objectName: "RV",
    imagePath: "/assets/tv-shows/breaking-bad/rv.png",
    correctAnswer: "Breaking Bad",
  },
  {
    id: 9,
    fandom: "Breaking Bad",
    category: "tv-shows",
    difficulty: "hard",
    objectName: "Blue Crystal",
    imagePath: "/assets/tv-shows/breaking-bad/blue-crystal.png",
    correctAnswer: "Breaking Bad",
  },

  // === CARTOONS ===
  {
    id: 10,
    fandom: "SpongeBob SquarePants",
    category: "cartoons",
    difficulty: "easy",
    objectName: "Pineapple House",
    imagePath: "/assets/cartoons/spongebob/pineapple-house.png",
    correctAnswer: "SpongeBob SquarePants",
  },
  {
    id: 11,
    fandom: "Pokémon",
    category: "cartoons",
    difficulty: "easy",
    objectName: "Pokéball",
    imagePath: "/assets/cartoons/pokemon/pokeball.png",
    correctAnswer: "Pokémon",
  },

  // Add more here as you generate assets...
];
