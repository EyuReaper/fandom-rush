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
  { id: 1, fandom: "One Piece", category: "anime", difficulty: "easy", objectName: "Straw Hat", imagePath: "/src/assets/anime/one-piece/straw-hat.png", correctAnswer: "One Piece" },
  { id: 2, fandom: "One Piece", category: "anime", difficulty: "medium", objectName: "Wanted Poster", imagePath: "/src/assets/anime/one-piece/wanted-poster.png", correctAnswer: "One Piece" },
  { id: 3, fandom: "One Piece", category: "anime", difficulty: "hard", objectName: "Devil Fruit", imagePath: "/src/assets/anime/one-piece/devil-fruit.png", correctAnswer: "One Piece" },
  
  // Naruto
  { id: 4, fandom: "Naruto", category: "anime", difficulty: "easy", objectName: "Leaf Headband", imagePath: "/src/assets/anime/naruto/leaf-headband.png", correctAnswer: "Naruto" },
  { id: 5, fandom: "Naruto", category: "anime", difficulty: "medium", objectName: "Kunai", imagePath: "/src/assets/anime/naruto/kunai.png", correctAnswer: "Naruto" },
  { id: 6, fandom: "Naruto", category: "anime", difficulty: "hard", objectName: "Uchiha Fan", imagePath: "/src/assets/anime/naruto/fan.png", correctAnswer: "Naruto" },
  
  // Jujutsu Kaisen
  { id: 7, fandom: "Jujutsu Kaisen", category: "anime", difficulty: "easy", objectName: "Gojo's Blindfold", imagePath: "/src/assets/anime/jujutsu-kaizen/gojo's-blindfold.png", correctAnswer: "Jujutsu Kaisen" },
  { id: 8, fandom: "Jujutsu Kaisen", category: "anime", difficulty: "medium", objectName: "Cursed Doll", imagePath: "/src/assets/anime/jujutsu-kaizen/cursed-doll.png", correctAnswer: "Jujutsu Kaisen" },
  { id: 9, fandom: "Jujutsu Kaisen", category: "anime", difficulty: "hard", objectName: "Prison Realm", imagePath: "/src/assets/anime/jujutsu-kaizen/prison-realm.png", correctAnswer: "Jujutsu Kaisen" },

  // Dragon Ball
  { id: 10, fandom: "Dragon Ball", category: "anime", difficulty: "easy", objectName: "4-Star Dragon Ball", imagePath: "/src/assets/anime/dragon-ball/dragon-ball.png", correctAnswer: "Dragon Ball" },
  { id: 11, fandom: "Dragon Ball", category: "anime", difficulty: "medium", objectName: "Scouter", imagePath: "/src/assets/anime/dragon-ball/scouter.png", correctAnswer: "Dragon Ball" },
  { id: 12, fandom: "Dragon Ball", category: "anime", difficulty: "hard", objectName: "Power Pole", imagePath: "/src/assets/anime/dragon-ball/power-pole.png", correctAnswer: "Dragon Ball" },

  // === MOVIES ===
  // Harry Potter
  { id: 100, fandom: "Harry Potter", category: "movies", difficulty: "easy", objectName: "Flying Broomstick", imagePath: "/src/assets/movies/harry-potter/flying-broomstick.png", correctAnswer: "Harry Potter" },
  { id: 101, fandom: "Harry Potter", category: "movies", difficulty: "medium", objectName: "Golden Snitch", imagePath: "/src/assets/movies/harry-potter/flying-ball.png", correctAnswer: "Harry Potter" },
  { id: 102, fandom: "Harry Potter", category: "movies", difficulty: "hard", objectName: "Ron's Car", imagePath: "/src/assets/movies/harry-potter/Ron's-car.png", correctAnswer: "Harry Potter" },

  // Star Wars
  { id: 103, fandom: "Star Wars", category: "movies", difficulty: "easy", objectName: "Maul's Lightsaber", imagePath: "/src/assets/movies/star-wars/mauls-lightsaber.png", correctAnswer: "Star Wars" },
  { id: 104, fandom: "Star Wars", category: "movies", difficulty: "medium", objectName: "Death Star", imagePath: "/src/assets/movies/star-wars/deathstar.png", correctAnswer: "Star Wars" },
  { id: 105, fandom: "Star Wars", category: "movies", difficulty: "hard", objectName: "Millennium Falcon", imagePath: "/src/assets/movies/star-wars/millennium-falcon.png", correctAnswer: "Star Wars" },

  // Marvel
  { id: 106, fandom: "Marvel", category: "movies", difficulty: "easy", objectName: "Loki's Scepter", imagePath: "/src/assets/movies/marvel/loki's-scepter.png", correctAnswer: "Marvel" },
  { id: 107, fandom: "Marvel", category: "movies", difficulty: "medium", objectName: "Tesseract", imagePath: "/src/assets/movies/marvel/tesseract.png", correctAnswer: "Marvel" },

  // Pokemon
  { id: 13, fandom: "Pokemon", category: "anime", difficulty: "easy", objectName: "Master Ball", imagePath: "/src/assets/anime/pokemon/master-ball.png", correctAnswer: "Pokemon" },
  { id: 14, fandom: "Pokemon", category: "anime", difficulty: "medium", objectName: "Egg Incubator", imagePath: "/src/assets/anime/pokemon/egg-incubator.png", correctAnswer: "Pokemon" },
  { id: 15, fandom: "Pokemon", category: "anime", difficulty: "hard", objectName: "Super Potion", imagePath: "/src/assets/anime/pokemon/super-potion.png", correctAnswer: "Pokemon" },

  // === CARTOONS ===
  // Adventure Time
  { id: 200, fandom: "Adventure Time", category: "cartoons", difficulty: "easy", objectName: "Ice Crown", imagePath: "/src/assets/cartoons/adventure-time/Ice-Crown.png", correctAnswer: "Adventure Time" },
  { id: 201, fandom: "Adventure Time", category: "cartoons", difficulty: "medium", objectName: "Grass Sword", imagePath: "/src/assets/cartoons/adventure-time/Grass-Sword.png", correctAnswer: "Adventure Time" },
  { id: 202, fandom: "Adventure Time", category: "cartoons", difficulty: "hard", objectName: "Scarlet", imagePath: "/src/assets/cartoons/adventure-time/scarlet.png", correctAnswer: "Adventure Time" },
];
