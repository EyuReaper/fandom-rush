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

  // Avatar
  { id: 203, fandom: "Avatar", category: "cartoons", difficulty: "easy", objectName: "Sokka's Boomerang", imagePath: "/src/assets/cartoons/avatar/sokka's-boomrang.png", correctAnswer: "Avatar" },
  { id: 204, fandom: "Avatar", category: "cartoons", difficulty: "medium", objectName: "Aang's Glider", imagePath: "/src/assets/cartoons/avatar/avatar-glider.png", correctAnswer: "Avatar" },
  { id: 205, fandom: "Avatar", category: "cartoons", difficulty: "hard", objectName: "Blue Spirit Mask", imagePath: "/src/assets/cartoons/avatar/blue-spirit-mask.png", correctAnswer: "Avatar" },

  // Ben 10
  { id: 206, fandom: "Ben 10", category: "cartoons", difficulty: "easy", objectName: "Omnitrix", imagePath: "/src/assets/cartoons/ben-10/omnitrix.png", correctAnswer: "Ben 10" },

  // === MOVIES (cont.) ===
  // Batman
  { id: 108, fandom: "Batman", category: "movies", difficulty: "easy", objectName: "Bat Claw", imagePath: "/src/assets/movies/batman/bat-claw.png", correctAnswer: "Batman" },
  { id: 109, fandom: "Batman", category: "movies", difficulty: "medium", objectName: "Explosive Gel", imagePath: "/src/assets/movies/batman/explosive-gel.png", correctAnswer: "Batman" },
  { id: 110, fandom: "Batman", category: "movies", difficulty: "hard", objectName: "Riddler's Cane", imagePath: "/src/assets/movies/batman/riddlers-cane.png", correctAnswer: "Batman" },

  // Lord of the Rings
  { id: 111, fandom: "Lord of the Rings", category: "movies", difficulty: "easy", objectName: "The One Ring", imagePath: "/src/assets/movies/lotr/The-ring.png", correctAnswer: "Lord of the Rings" },
  { id: 112, fandom: "Lord of the Rings", category: "movies", difficulty: "medium", objectName: "Gandalf's Hat", imagePath: "/src/assets/movies/lotr/gandalf's-hat.png", correctAnswer: "Lord of the Rings" },
  { id: 113, fandom: "Lord of the Rings", category: "movies", difficulty: "hard", objectName: "Orcrist", imagePath: "/src/assets/movies/lotr/orcrist.png", correctAnswer: "Lord of the Rings" },

  // Marvel
  { id: 114, fandom: "Marvel", category: "movies", difficulty: "medium", objectName: "Winter Soldier Arm", imagePath: "/src/assets/movies/marvel/winter-soldier-arm.png", correctAnswer: "Marvel" },

  // === TV ===
  // Breaking Bad
  { id: 300, fandom: "Breaking Bad", category: "tv", difficulty: "easy", objectName: "Blue Meth", imagePath: "/src/assets/tv/breaking-bad/blue-meth.png", correctAnswer: "Breaking Bad" },
  { id: 301, fandom: "Breaking Bad", category: "tv", difficulty: "medium", objectName: "Gas Mask", imagePath: "/src/assets/tv/breaking-bad/gas-mask.png", correctAnswer: "Breaking Bad" },
  { id: 302, fandom: "Breaking Bad", category: "tv", difficulty: "hard", objectName: "Heisenberg Hat", imagePath: "/src/assets/tv/breaking-bad/heisenberg-hat.png", correctAnswer: "Breaking Bad" },

  // Game of Thrones
  { id: 303, fandom: "Game of Thrones", category: "tv", difficulty: "easy", objectName: "Dragon Egg", imagePath: "/src/assets/tv/game-of-thrones/dragon-egg.png", correctAnswer: "Game of Thrones" },
  { id: 304, fandom: "Game of Thrones", category: "tv", difficulty: "medium", objectName: "Iron Throne", imagePath: "/src/assets/tv/game-of-thrones/iron-throne.png", correctAnswer: "Game of Thrones" },
  { id: 305, fandom: "Game of Thrones", category: "tv", difficulty: "hard", objectName: "White Walker", imagePath: "/src/assets/tv/game-of-thrones/white-walker.png", correctAnswer: "Game of Thrones" },

  // The Simpsons
  { id: 306, fandom: "The Simpsons", category: "tv", difficulty: "easy", objectName: "Duff Beer", imagePath: "/src/assets/tv/simpsons/duff-beer.png", correctAnswer: "The Simpsons" },
  { id: 307, fandom: "The Simpsons", category: "tv", difficulty: "medium", objectName: "Squishee", imagePath: "/src/assets/tv/simpsons/squishee.png", correctAnswer: "The Simpsons" },
  { id: 308, fandom: "The Simpsons", category: "tv", difficulty: "hard", objectName: "Krusty Doll", imagePath: "/src/assets/tv/simpsons/krusty-doll.png", correctAnswer: "The Simpsons" },

  // Stranger Things
  { id: 309, fandom: "Stranger Things", category: "tv", difficulty: "easy", objectName: "Eggo Waffles", imagePath: "/src/assets/tv/stranger-things/eggo-waffles.png", correctAnswer: "Stranger Things" },
  { id: 310, fandom: "Stranger Things", category: "tv", difficulty: "medium", objectName: "Demogorgon", imagePath: "/src/assets/tv/stranger-things/demogorgon.png", correctAnswer: "Stranger Things" },
  { id: 311, fandom: "Stranger Things", category: "tv", difficulty: "hard", objectName: "Upside Down Tree", imagePath: "/src/assets/tv/stranger-things/upside-down-tree.png", correctAnswer: "Stranger Things" },

  // Wednesday
  { id: 312, fandom: "Wednesday", category: "tv", difficulty: "easy", objectName: "Typewriter", imagePath: "/src/assets/tv/wednesday/typewriter.png", correctAnswer: "Wednesday" },
  { id: 313, fandom: "Wednesday", category: "tv", difficulty: "medium", objectName: "Thing Hand", imagePath: "/src/assets/tv/wednesday/thing-hand.png", correctAnswer: "Wednesday" },
  { id: 314, fandom: "Wednesday", category: "tv", difficulty: "hard", objectName: "Nevermore Crest", imagePath: "/src/assets/tv/wednesday/nevermore-crest.png", correctAnswer: "Wednesday" },

  // Squid Game
  { id: 315, fandom: "Squid Game", category: "tv", difficulty: "easy", objectName: "Invitation Card", imagePath: "/src/assets/tv/squid-game/invitation-card.png", correctAnswer: "Squid Game" },
  { id: 316, fandom: "Squid Game", category: "tv", difficulty: "medium", objectName: "Piggy Bank", imagePath: "/src/assets/tv/squid-game/piggy-bank.png", correctAnswer: "Squid Game" },
  { id: 317, fandom: "Squid Game", category: "tv", difficulty: "hard", objectName: "Mask", imagePath: "/src/assets/tv/squid-game/mask.png", correctAnswer: "Squid Game" },

  // === GAMES ===
  // The Last of Us
  { id: 400, fandom: "The Last of Us", category: "games", difficulty: "easy", objectName: "Clicker", imagePath: "/src/assets/games/tlou/clicker.png", correctAnswer: "The Last of Us" },
  { id: 401, fandom: "The Last of Us", category: "games", difficulty: "medium", objectName: "Firefly Pendant", imagePath: "/src/assets/games/tlou/firefly-pendant.png", correctAnswer: "The Last of Us" },
  { id: 402, fandom: "The Last of Us", category: "games", difficulty: "hard", objectName: "Ellie's Switchblade", imagePath: "/src/assets/games/tlou/ellies-switchblade.png", correctAnswer: "The Last of Us" },

  // Zelda
  { id: 403, fandom: "Zelda", category: "games", difficulty: "easy", objectName: "Master Sword", imagePath: "/src/assets/games/zelda/master-sword.png", correctAnswer: "Zelda" },
  { id: 404, fandom: "Zelda", category: "games", difficulty: "medium", objectName: "Hylian Shield", imagePath: "/src/assets/games/zelda/hylian-shield.png", correctAnswer: "Zelda" },
  { id: 405, fandom: "Zelda", category: "games", difficulty: "hard", objectName: "Triforce", imagePath: "/src/assets/games/zelda/triforce.png", correctAnswer: "Zelda" },

  // Super Mario
  { id: 406, fandom: "Super Mario", category: "games", difficulty: "easy", objectName: "Super Mushroom", imagePath: "/src/assets/games/super-mario/super-mushroom.png", correctAnswer: "Super Mario" },
  { id: 407, fandom: "Super Mario", category: "games", difficulty: "medium", objectName: "Super Star", imagePath: "/src/assets/games/super-mario/super-star.png", correctAnswer: "Super Mario" },
  { id: 408, fandom: "Super Mario", category: "games", difficulty: "hard", objectName: "Question Block", imagePath: "/src/assets/games/super-mario/question-block.png", correctAnswer: "Super Mario" },

  // Fortnite
  { id: 409, fandom: "Fortnite", category: "games", difficulty: "easy", objectName: "Supply Drop", imagePath: "/src/assets/games/fortnite/supply-drop.png", correctAnswer: "Fortnite" },
  { id: 410, fandom: "Fortnite", category: "games", difficulty: "medium", objectName: "Llama Piñata", imagePath: "/src/assets/games/fortnite/llama-pinata.png", correctAnswer: "Fortnite" },
  { id: 411, fandom: "Fortnite", category: "games", difficulty: "hard", objectName: "Pickaxe", imagePath: "/src/assets/games/fortnite/pickaxe.png", correctAnswer: "Fortnite" },

  // Final Fantasy
  { id: 412, fandom: "Final Fantasy", category: "games", difficulty: "easy", objectName: "Moogle", imagePath: "/src/assets/games/final-fantasy/moogle.png", correctAnswer: "Final Fantasy" },
  { id: 413, fandom: "Final Fantasy", category: "games", difficulty: "medium", objectName: "Buster Sword", imagePath: "/src/assets/games/final-fantasy/buster-sword.png", correctAnswer: "Final Fantasy" },
  { id: 414, fandom: "Final Fantasy", category: "games", difficulty: "hard", objectName: "Materia", imagePath: "/src/assets/games/final-fantasy/materia.png", correctAnswer: "Final Fantasy" },
];
