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
  { id: 7, fandom: "Jujutsu Kaisen", category: "anime", difficulty: "easy", objectName: "Gojo's Blindfold", imagePath: "/src/assets/anime/jujutsu-kaisen/gojo-blindfold.png", correctAnswer: "Jujutsu Kaisen" },
  { id: 8, fandom: "Jujutsu Kaisen", category: "anime", difficulty: "medium", objectName: "Cursed Doll", imagePath: "/src/assets/anime/jujutsu-kaisen/cursed-doll.png", correctAnswer: "Jujutsu Kaisen" },
  { id: 9, fandom: "Jujutsu Kaisen", category: "anime", difficulty: "hard", objectName: "Prison Realm", imagePath: "/src/assets/anime/jujutsu-kaisen/prison-realm.png", correctAnswer: "Jujutsu Kaisen" },

  // Dragon Ball
  { id: 10, fandom: "Dragon Ball", category: "anime", difficulty: "easy", objectName: "4-Star Dragon Ball", imagePath: "/src/assets/anime/dragon-ball/dragon-ball.png", correctAnswer: "Dragon Ball" },
  { id: 11, fandom: "Dragon Ball", category: "anime", difficulty: "medium", objectName: "Scouter", imagePath: "/src/assets/anime/dragon-ball/scouter.png", correctAnswer: "Dragon Ball" },
  { id: 12, fandom: "Dragon Ball", category: "anime", difficulty: "hard", objectName: "Power Pole", imagePath: "/src/assets/anime/dragon-ball/power-pole.png", correctAnswer: "Dragon Ball" },

  // Pokémon
  { id: 13, fandom: "Pokémon", category: "anime", difficulty: "easy", objectName: "Pokéball", imagePath: "/src/assets/anime/pokemon/pokeball.png", correctAnswer: "Pokémon" },
  { id: 14, fandom: "Pokémon", category: "anime", difficulty: "medium", objectName: "Pokédex", imagePath: "/src/assets/anime/pokemon/pokedex.png", correctAnswer: "Pokémon" },
  { id: 15, fandom: "Pokémon", category: "anime", difficulty: "hard", objectName: "Gym Badge", imagePath: "/src/assets/anime/pokemon/gym-badge.png", correctAnswer: "Pokémon" },

  // === MOVIES ===
  // Harry Potter
  { id: 100, fandom: "Harry Potter", category: "movies", difficulty: "easy", objectName: "Wizard Wand", imagePath: "/src/assets/movies/harry-potter/wand.png", correctAnswer: "Harry Potter" },
  { id: 101, fandom: "Harry Potter", category: "movies", difficulty: "medium", objectName: "Golden Snitch", imagePath: "/src/assets/movies/harry-potter/snitch.png", correctAnswer: "Harry Potter" },
  { id: 102, fandom: "Harry Potter", category: "movies", difficulty: "hard", objectName: "Sorting Hat", imagePath: "/src/assets/movies/harry-potter/sorting-hat.png", correctAnswer: "Harry Potter" },

  // Star Wars
  { id: 103, fandom: "Star Wars", category: "movies", difficulty: "easy", objectName: "Lightsaber", imagePath: "/src/assets/movies/star-wars/lightsaber.png", correctAnswer: "Star Wars" },
  { id: 104, fandom: "Star Wars", category: "movies", difficulty: "medium", objectName: "Death Star", imagePath: "/src/assets/movies/star-wars/deathstar.png", correctAnswer: "Star Wars" },
  { id: 105, fandom: "Star Wars", category: "movies", difficulty: "hard", objectName: "Millennium Falcon", imagePath: "/src/assets/movies/star-wars/falcon.png", correctAnswer: "Star Wars" },

  // Marvel
  { id: 106, fandom: "Marvel", category: "movies", difficulty: "easy", objectName: "Iron Man Helmet", imagePath: "/src/assets/movies/marvel/ironman-helmet.png", correctAnswer: "Marvel" },
  { id: 107, fandom: "Marvel", category: "movies", difficulty: "medium", objectName: "Cap's Shield", imagePath: "/src/assets/movies/marvel/shield.png", correctAnswer: "Marvel" },
  { id: 108, fandom: "Marvel", category: "movies", difficulty: "hard", objectName: "Infinity Gauntlet", imagePath: "/src/assets/movies/marvel/gauntlet.png", correctAnswer: "Marvel" },

  // Lord of the Rings
  { id: 109, fandom: "Lord of the Rings", category: "movies", difficulty: "easy", objectName: "The One Ring", imagePath: "/src/assets/movies/lotr/one-ring.png", correctAnswer: "Lord of the Rings" },
  { id: 110, fandom: "Lord of the Rings", category: "movies", difficulty: "medium", objectName: "Sting Sword", imagePath: "/src/assets/movies/lotr/sting.png", correctAnswer: "Lord of the Rings" },
  { id: 111, fandom: "Lord of the Rings", category: "movies", difficulty: "hard", objectName: "Evenstar Pendant", imagePath: "/src/assets/movies/lotr/evenstar.png", correctAnswer: "Lord of the Rings" },

  // Batman
  { id: 112, fandom: "Batman", category: "movies", difficulty: "easy", objectName: "Batarang", imagePath: "/src/assets/movies/batman/batarang.png", correctAnswer: "Batman" },
  { id: 113, fandom: "Batman", category: "movies", difficulty: "medium", objectName: "Batmobile", imagePath: "/src/assets/movies/batman/batmobile.png", correctAnswer: "Batman" },
  { id: 114, fandom: "Batman", category: "movies", difficulty: "hard", objectName: "Grappling Hook", imagePath: "/src/assets/movies/batman/grapple.png", correctAnswer: "Batman" },

  // === TV SHOWS ===
  // Breaking Bad
  { id: 200, fandom: "Breaking Bad", category: "tv-shows", difficulty: "easy", objectName: "Heisenberg Hat", imagePath: "/src/assets/tv/breaking-bad/hat.png", correctAnswer: "Breaking Bad" },
  { id: 201, fandom: "Breaking Bad", category: "tv-shows", difficulty: "medium", objectName: "The RV", imagePath: "/src/assets/tv/breaking-bad/rv.png", correctAnswer: "Breaking Bad" },
  { id: 202, fandom: "Breaking Bad", category: "tv-shows", difficulty: "hard", objectName: "Blue Crystal", imagePath: "/src/assets/tv/breaking-bad/crystal.png", correctAnswer: "Breaking Bad" },

  // Stranger Things
  { id: 203, fandom: "Stranger Things", category: "tv-shows", difficulty: "easy", objectName: "Waffle", imagePath: "/src/assets/tv/stranger-things/waffle.png", correctAnswer: "Stranger Things" },
  { id: 204, fandom: "Stranger Things", category: "tv-shows", difficulty: "medium", objectName: "Walkie Talkie", imagePath: "/src/assets/tv/stranger-things/walkie-talkie.png", correctAnswer: "Stranger Things" },
  { id: 205, fandom: "Stranger Things", category: "tv-shows", difficulty: "hard", objectName: "D20 Dice", imagePath: "/src/assets/tv/stranger-things/dice.png", correctAnswer: "Stranger Things" },

  // Friends
  { id: 206, fandom: "Friends", category: "tv-shows", difficulty: "easy", objectName: "Central Perk Mug", imagePath: "/src/assets/tv/friends/mug.png", correctAnswer: "Friends" },
  { id: 207, fandom: "Friends", category: "tv-shows", difficulty: "medium", objectName: "Orange Sofa", imagePath: "/src/assets/tv/friends/sofa.png", correctAnswer: "Friends" },
  { id: 208, fandom: "Friends", category: "tv-shows", difficulty: "hard", objectName: "Phoebe's Guitar", imagePath: "/src/assets/tv/friends/guitar.png", correctAnswer: "Friends" },

  // Wednesday
  { id: 209, fandom: "Wednesday", category: "tv-shows", difficulty: "easy", objectName: "Thing (Hand)", imagePath: "/src/assets/tv/wednesday/thing.png", correctAnswer: "Wednesday" },
  { id: 210, fandom: "Wednesday", category: "tv-shows", difficulty: "medium", objectName: "Cello", imagePath: "/src/assets/tv/wednesday/cello.png", correctAnswer: "Wednesday" },
  { id: 211, fandom: "Wednesday", category: "tv-shows", difficulty: "hard", objectName: "Typewriter", imagePath: "/src/assets/tv/wednesday/typewriter.png", correctAnswer: "Wednesday" },

  // === CARTOONS ===
  // SpongeBob
  { id: 300, fandom: "SpongeBob SquarePants", category: "cartoons", difficulty: "easy", objectName: "Pineapple House", imagePath: "/src/assets/cartoons/spongebob/pineapple.png", correctAnswer: "SpongeBob SquarePants" },
  { id: 301, fandom: "SpongeBob SquarePants", category: "cartoons", difficulty: "medium", objectName: "Krabby Patty", imagePath: "/src/assets/cartoons/spongebob/patty.png", correctAnswer: "SpongeBob SquarePants" },
  { id: 302, fandom: "SpongeBob SquarePants", category: "cartoons", difficulty: "hard", objectName: "Jellyfish Net", imagePath: "/src/assets/cartoons/spongebob/net.png", correctAnswer: "SpongeBob SquarePants" },

  // Adventure Time
  { id: 303, fandom: "Adventure Time", category: "cartoons", difficulty: "easy", objectName: "Finn's Hat", imagePath: "/src/assets/cartoons/adventure-time/hat.png", correctAnswer: "Adventure Time" },
  { id: 304, fandom: "Adventure Time", category: "cartoons", difficulty: "medium", objectName: "Jake's Violia", imagePath: "/src/assets/cartoons/adventure-time/violia.png", correctAnswer: "Adventure Time" },
  { id: 305, fandom: "Adventure Time", category: "cartoons", difficulty: "hard", objectName: "Enchiridion", imagePath: "/src/assets/cartoons/adventure-time/book.png", correctAnswer: "Adventure Time" },

  // Ben 10
  { id: 306, fandom: "Ben 10", category: "cartoons", difficulty: "easy", objectName: "Omnitrix", imagePath: "/src/assets/cartoons/ben-10/omnitrix.png", correctAnswer: "Ben 10" },
  { id: 307, fandom: "Ben 10", category: "cartoons", difficulty: "medium", objectName: "Rust Bucket (RV)", imagePath: "/src/assets/cartoons/ben-10/rv.png", correctAnswer: "Ben 10" },
  { id: 308, fandom: "Ben 10", category: "cartoons", difficulty: "hard", objectName: "Sumo Slammer Card", imagePath: "/src/assets/cartoons/ben-10/card.png", correctAnswer: "Ben 10" },

  // Avatar
  { id: 309, fandom: "Avatar: TLA", category: "cartoons", difficulty: "easy", objectName: "Aang's Glider", imagePath: "/src/assets/cartoons/avatar/glider.png", correctAnswer: "Avatar: TLA" },
  { id: 310, fandom: "Avatar: TLA", category: "cartoons", difficulty: "medium", objectName: "Sokka's Boomerang", imagePath: "/src/assets/cartoons/avatar/boomerang.png", correctAnswer: "Avatar: TLA" },
  { id: 311, fandom: "Avatar: TLA", category: "cartoons", difficulty: "hard", objectName: "White Lotus Tile", imagePath: "/src/assets/cartoons/avatar/tile.png", correctAnswer: "Avatar: TLA" },

  // === GAMES ===
  // Minecraft
  { id: 400, fandom: "Minecraft", category: "games", difficulty: "easy", objectName: "Diamond Sword", imagePath: "/src/assets/games/minecraft/sword.png", correctAnswer: "Minecraft" },
  { id: 401, fandom: "Minecraft", category: "games", difficulty: "medium", objectName: "Crafting Table", imagePath: "/src/assets/games/minecraft/table.png", correctAnswer: "Minecraft" },
  { id: 402, fandom: "Minecraft", category: "games", difficulty: "hard", objectName: "Redstone Torch", imagePath: "/src/assets/games/minecraft/torch.png", correctAnswer: "Minecraft" },

  // Zelda
  { id: 403, fandom: "The Legend of Zelda", category: "games", difficulty: "easy", objectName: "Master Sword", imagePath: "/src/assets/games/zelda/sword.png", correctAnswer: "The Legend of Zelda" },
  { id: 404, fandom: "The Legend of Zelda", category: "games", difficulty: "medium", objectName: "Hylian Shield", imagePath: "/src/assets/games/zelda/shield.png", correctAnswer: "The Legend of Zelda" },
  { id: 405, fandom: "The Legend of Zelda", category: "games", difficulty: "hard", objectName: "Ocarina of Time", imagePath: "/src/assets/games/zelda/ocarina.png", correctAnswer: "The Legend of Zelda" },

  // Grand Theft Auto
  { id: 406, fandom: "Grand Theft Auto", category: "games", difficulty: "easy", objectName: "Baseball Bat", imagePath: "/src/assets/games/gta/bat.png", correctAnswer: "Grand Theft Auto" },
  { id: 407, fandom: "Grand Theft Auto", category: "games", difficulty: "medium", objectName: "Spray Can", imagePath: "/src/assets/games/gta/spray.png", correctAnswer: "Grand Theft Auto" },
  { id: 408, fandom: "Grand Theft Auto", category: "games", difficulty: "hard", objectName: "Money Briefcase", imagePath: "/src/assets/games/gta/money.png", correctAnswer: "Grand Theft Auto" },

  // The Last of Us
  { id: 409, fandom: "The Last of Us", category: "games", difficulty: "easy", objectName: "Firefly Pendant", imagePath: "/src/assets/games/tlou/pendant.png", correctAnswer: "The Last of Us" },
  { id: 410, fandom: "The Last of Us", category: "games", difficulty: "medium", objectName: "Ellie's Bow", imagePath: "/src/assets/games/tlou/bow.png", correctAnswer: "The Last of Us" },
  { id: 411, fandom: "The Last of Us", category: "games", difficulty: "hard", objectName: "Gas Mask", imagePath: "/src/assets/games/tlou/mask.png", correctAnswer: "The Last of Us" },
];
