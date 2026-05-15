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
  // One Piece
  {
    id: 1,
    fandom: "One Piece",
    category: "anime",
    difficulty: "easy",
    objectName: "Straw Hat",
    imagePath: "/src/assets/anime/one-piece/straw-hat.png",
    correctAnswer: "One Piece",
  },
  {
    id: 2,
    fandom: "One Piece",
    category: "anime",
    difficulty: "medium",
    objectName: "Wanted Poster",
    imagePath: "/src/assets/anime/one-piece/wanted-poster.png",
    correctAnswer: "One Piece",
  },
  {
    id: 3,
    fandom: "One Piece",
    category: "anime",
    difficulty: "hard",
    objectName: "Devil Fruit",
    imagePath: "/src/assets/anime/one-piece/devil-fruit.png",
    correctAnswer: "One Piece",
  },
  // Naruto
  {
    id: 12,
    fandom: "Naruto",
    category: "anime",
    difficulty: "easy",
    objectName: "Leaf Headband",
    imagePath: "/src/assets/anime/naruto/leaf-headband.png",
    correctAnswer: "Naruto",
  },
  {
    id: 13,
    fandom: "Naruto",
    category: "anime",
    difficulty: "medium",
    objectName: "Kunai",
    imagePath: "/src/assets/anime/naruto/kunai.png",
    correctAnswer: "Naruto",
  },
  {
    id: 14,
    fandom: "Naruto",
    category: "anime",
    difficulty: "hard",
    objectName: "Uchiha Fan",
    imagePath: "/src/assets/anime/naruto/fan.png",
    correctAnswer: "Naruto",
  },
  // Jujutsu Kaisen
  {
    id: 18,
    fandom: "Jujutsu Kaisen",
    category: "anime",
    difficulty: "easy",
    objectName: "Gojo's Blindfold",
    imagePath: "/src/assets/anime/Jujitsu kaizen/gojo's-blindfold.png",
    correctAnswer: "Jujutsu Kaisen",
  },
  {
    id: 19,
    fandom: "Jujutsu Kaisen",
    category: "anime",
    difficulty: "medium",
    objectName: "Cursed Doll",
    imagePath: "/src/assets/anime/Jujitsu kaizen/cursed-doll.png",
    correctAnswer: "Jujutsu Kaisen",
  },
  {
    id: 20,
    fandom: "Jujutsu Kaisen",
    category: "anime",
    difficulty: "hard",
    objectName: "Prison Realm",
    imagePath: "/src/assets/anime/Jujitsu kaizen/prison-realm.png",
    correctAnswer: "Jujutsu Kaisen",
  },

  // === MOVIES ===
  // Harry Potter
  {
    id: 4,
    fandom: "Harry Potter",
    category: "movies",
    difficulty: "easy",
    objectName: "Flying Broomstick",
    imagePath: "/src/assets/movies/Harry potter/flying-broomstick.png",
    correctAnswer: "Harry Potter",
  },
  {
    id: 5,
    fandom: "Harry Potter",
    category: "movies",
    difficulty: "medium",
    objectName: "Flying Ball",
    imagePath: "/src/assets/movies/Harry potter/flying-ball.png",
    correctAnswer: "Harry Potter",
  },
  {
    id: 6,
    fandom: "Harry Potter",
    category: "movies",
    difficulty: "hard",
    objectName: "Ron's Car",
    imagePath: "/src/assets/movies/Harry potter/Ron's-car.png",
    correctAnswer: "Harry Potter",
  },
  // Star Wars
  {
    id: 15,
    fandom: "Star Wars",
    category: "movies",
    difficulty: "easy",
    objectName: "Death Star",
    imagePath: "/src/assets/movies/Star wars/deathstar.png",
    correctAnswer: "Star Wars",
  },
  {
    id: 21,
    fandom: "Star Wars",
    category: "movies",
    difficulty: "medium",
    objectName: "Maul's Lightsaber",
    imagePath: "/src/assets/movies/Star wars/mauls-lightsaber.png",
    correctAnswer: "Star Wars",
  },
  {
    id: 22,
    fandom: "Star Wars",
    category: "movies",
    difficulty: "hard",
    objectName: "Millennium Falcon",
    imagePath: "/src/assets/movies/Star wars/millennium-falcon.png",
    correctAnswer: "Star Wars",
  },
  // Marvel
  {
    id: 16,
    fandom: "Marvel",
    category: "movies",
    difficulty: "easy",
    objectName: "Tesseract",
    imagePath: "/src/assets/movies/Marvel/tesseract.png",
    correctAnswer: "Marvel",
  },
  {
    id: 23,
    fandom: "Marvel",
    category: "movies",
    difficulty: "medium",
    objectName: "Loki's Scepter",
    imagePath: "/src/assets/movies/Marvel/loki's-scepter.png",
    correctAnswer: "Marvel",
  },
];
