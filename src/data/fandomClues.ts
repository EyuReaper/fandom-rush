export type Difficulty = "easy" | "medium" | "hard";

export interface FandomClue {
  id: number;
  fandom: string;
  category: string;
  difficulty: Difficulty;
  objectName: string;
  imagePath: string;
  correctAnswer: string;
  premium?: "enthusiast" | "fanatic";
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

  // === ENTHUSIAST PACK — Mythology ===
  { id: 500, fandom: "Greek Mythology", category: "mythology", difficulty: "easy", premium: "enthusiast", objectName: "Thunderbolt", imagePath: "/src/assets/mythology/greek/thunderbolt.png", correctAnswer: "Greek Mythology" },
  { id: 501, fandom: "Greek Mythology", category: "mythology", difficulty: "medium", premium: "enthusiast", objectName: "Medusa Head", imagePath: "/src/assets/mythology/greek/medusa-head.png", correctAnswer: "Greek Mythology" },
  { id: 502, fandom: "Greek Mythology", category: "mythology", difficulty: "hard", premium: "enthusiast", objectName: "Pandora Box", imagePath: "/src/assets/mythology/greek/pandora-box.png", correctAnswer: "Greek Mythology" },
  { id: 503, fandom: "Norse Mythology", category: "mythology", difficulty: "easy", premium: "enthusiast", objectName: "Mjolnir", imagePath: "/src/assets/mythology/norse/mjolnir.png", correctAnswer: "Norse Mythology" },
  { id: 504, fandom: "Norse Mythology", category: "mythology", difficulty: "medium", premium: "enthusiast", objectName: "Yggdrasil", imagePath: "/src/assets/mythology/norse/yggdrasil.png", correctAnswer: "Norse Mythology" },
  { id: 505, fandom: "Norse Mythology", category: "mythology", difficulty: "hard", premium: "enthusiast", objectName: "Valkyrie Wing", imagePath: "/src/assets/mythology/norse/valkyrie-wing.png", correctAnswer: "Norse Mythology" },
  { id: 506, fandom: "Egyptian Mythology", category: "mythology", difficulty: "easy", premium: "enthusiast", objectName: "Ankh", imagePath: "/src/assets/mythology/egyptian/ankh.png", correctAnswer: "Egyptian Mythology" },
  { id: 507, fandom: "Egyptian Mythology", category: "mythology", difficulty: "medium", premium: "enthusiast", objectName: "Eye of Horus", imagePath: "/src/assets/mythology/egyptian/eye-of-horus.png", correctAnswer: "Egyptian Mythology" },
  { id: 508, fandom: "Egyptian Mythology", category: "mythology", difficulty: "hard", premium: "enthusiast", objectName: "Sarcophagus", imagePath: "/src/assets/mythology/egyptian/sarcophagus.png", correctAnswer: "Egyptian Mythology" },
  { id: 509, fandom: "Japanese Mythology", category: "mythology", difficulty: "easy", premium: "enthusiast", objectName: "Torii Gate", imagePath: "/src/assets/mythology/japanese/torii-gate.png", correctAnswer: "Japanese Mythology" },
  { id: 510, fandom: "Japanese Mythology", category: "mythology", difficulty: "medium", premium: "enthusiast", objectName: "Kitsune Mask", imagePath: "/src/assets/mythology/japanese/kitsune-mask.png", correctAnswer: "Japanese Mythology" },
  { id: 511, fandom: "Japanese Mythology", category: "mythology", difficulty: "hard", premium: "enthusiast", objectName: "Oni Mask", imagePath: "/src/assets/mythology/japanese/oni-mask.png", correctAnswer: "Japanese Mythology" },

  // === ENTHUSIAST PACK — Internet Culture ===
  { id: 512, fandom: "Memes", category: "internet", difficulty: "easy", premium: "enthusiast", objectName: "Distracted Boyfriend", imagePath: "/src/assets/internet/memes/distracted-boyfriend.png", correctAnswer: "Memes" },
  { id: 513, fandom: "Memes", category: "internet", difficulty: "medium", premium: "enthusiast", objectName: "Doge", imagePath: "/src/assets/internet/memes/doge.png", correctAnswer: "Memes" },
  { id: 514, fandom: "Memes", category: "internet", difficulty: "hard", premium: "enthusiast", objectName: "Pepe", imagePath: "/src/assets/internet/memes/pepe.png", correctAnswer: "Memes" },
  { id: 515, fandom: "Creepypasta", category: "internet", difficulty: "easy", premium: "enthusiast", objectName: "Slenderman", imagePath: "/src/assets/internet/creepypasta/slenderman.png", correctAnswer: "Creepypasta" },
  { id: 516, fandom: "Creepypasta", category: "internet", difficulty: "medium", premium: "enthusiast", objectName: "Jeff the Killer", imagePath: "/src/assets/internet/creepypasta/jeff-the-killer.png", correctAnswer: "Creepypasta" },
  { id: 517, fandom: "Creepypasta", category: "internet", difficulty: "hard", premium: "enthusiast", objectName: "Sonic.exe", imagePath: "/src/assets/internet/creepypasta/sonic-exe.png", correctAnswer: "Creepypasta" },
  { id: 518, fandom: "Viral Games", category: "internet", difficulty: "easy", premium: "enthusiast", objectName: "Flappy Bird", imagePath: "/src/assets/internet/viral-games/flappy-bird.png", correctAnswer: "Viral Games" },
  { id: 519, fandom: "Viral Games", category: "internet", difficulty: "medium", premium: "enthusiast", objectName: "Among Us", imagePath: "/src/assets/internet/viral-games/among-us.png", correctAnswer: "Viral Games" },
  { id: 520, fandom: "Viral Games", category: "internet", difficulty: "hard", premium: "enthusiast", objectName: "Geometry Dash", imagePath: "/src/assets/internet/viral-games/geometry-dash.png", correctAnswer: "Viral Games" },
  { id: 521, fandom: "Web Series", category: "internet", difficulty: "easy", premium: "enthusiast", objectName: "Salad Fingers", imagePath: "/src/assets/internet/web-series/salad-fingers.png", correctAnswer: "Web Series" },
  { id: 522, fandom: "Web Series", category: "internet", difficulty: "medium", premium: "enthusiast", objectName: "Homestar Runner", imagePath: "/src/assets/internet/web-series/homestar-runner.png", correctAnswer: "Web Series" },
  { id: 523, fandom: "Web Series", category: "internet", difficulty: "hard", premium: "enthusiast", objectName: "Don't Hug Me", imagePath: "/src/assets/internet/web-series/dont-hug-me.png", correctAnswer: "Web Series" },

  // === ENTHUSIAST PACK — Sports ===
  { id: 524, fandom: "Basketball", category: "sports", difficulty: "easy", premium: "enthusiast", objectName: "Basketball Ball", imagePath: "/src/assets/sports/basketball/basketball-ball.png", correctAnswer: "Basketball" },
  { id: 525, fandom: "Basketball", category: "sports", difficulty: "medium", premium: "enthusiast", objectName: "Jersey 23", imagePath: "/src/assets/sports/basketball/jersey-23.png", correctAnswer: "Basketball" },
  { id: 526, fandom: "Basketball", category: "sports", difficulty: "hard", premium: "enthusiast", objectName: "Championship Trophy", imagePath: "/src/assets/sports/basketball/championship-trophy.png", correctAnswer: "Basketball" },
  { id: 527, fandom: "Soccer", category: "sports", difficulty: "easy", premium: "enthusiast", objectName: "Soccer Ball", imagePath: "/src/assets/sports/soccer/soccer-ball.png", correctAnswer: "Soccer" },
  { id: 528, fandom: "Soccer", category: "sports", difficulty: "medium", premium: "enthusiast", objectName: "World Cup Trophy", imagePath: "/src/assets/sports/soccer/world-cup-trophy.png", correctAnswer: "Soccer" },
  { id: 529, fandom: "Soccer", category: "sports", difficulty: "hard", premium: "enthusiast", objectName: "Red Card", imagePath: "/src/assets/sports/soccer/red-card.png", correctAnswer: "Soccer" },
  { id: 530, fandom: "Boxing", category: "sports", difficulty: "easy", premium: "enthusiast", objectName: "Boxing Glove", imagePath: "/src/assets/sports/boxing/boxing-glove.png", correctAnswer: "Boxing" },
  { id: 531, fandom: "Boxing", category: "sports", difficulty: "medium", premium: "enthusiast", objectName: "Heavyweight Belt", imagePath: "/src/assets/sports/boxing/heavyweight-belt.png", correctAnswer: "Boxing" },
  { id: 532, fandom: "Boxing", category: "sports", difficulty: "hard", premium: "enthusiast", objectName: "Punching Bag", imagePath: "/src/assets/sports/boxing/punching-bag.png", correctAnswer: "Boxing" },
  { id: 533, fandom: "Olympics", category: "sports", difficulty: "easy", premium: "enthusiast", objectName: "Gold Medal", imagePath: "/src/assets/sports/olympics/gold-medal.png", correctAnswer: "Olympics" },
  { id: 534, fandom: "Olympics", category: "sports", difficulty: "medium", premium: "enthusiast", objectName: "Olympic Torch", imagePath: "/src/assets/sports/olympics/olympic-torch.png", correctAnswer: "Olympics" },
  { id: 535, fandom: "Olympics", category: "sports", difficulty: "hard", premium: "enthusiast", objectName: "Laurel Wreath", imagePath: "/src/assets/sports/olympics/laurel-wreath.png", correctAnswer: "Olympics" },

  // === FANATIC PACK — Music ===
  { id: 600, fandom: "K-Pop", category: "music", difficulty: "easy", premium: "fanatic", objectName: "Light Stick", imagePath: "/src/assets/music/kpop/light-stick.png", correctAnswer: "K-Pop" },
  { id: 601, fandom: "K-Pop", category: "music", difficulty: "medium", premium: "fanatic", objectName: "Photocard", imagePath: "/src/assets/music/kpop/photocard.png", correctAnswer: "K-Pop" },
  { id: 602, fandom: "K-Pop", category: "music", difficulty: "hard", premium: "fanatic", objectName: "Microphone", imagePath: "/src/assets/music/kpop/microphone.png", correctAnswer: "K-Pop" },
  { id: 603, fandom: "Rock", category: "music", difficulty: "easy", premium: "fanatic", objectName: "Electric Guitar", imagePath: "/src/assets/music/rock/electric-guitar.png", correctAnswer: "Rock" },
  { id: 604, fandom: "Rock", category: "music", difficulty: "medium", premium: "fanatic", objectName: "Vinyl Record", imagePath: "/src/assets/music/rock/vinyl-record.png", correctAnswer: "Rock" },
  { id: 605, fandom: "Rock", category: "music", difficulty: "hard", premium: "fanatic", objectName: "Marshall Amp", imagePath: "/src/assets/music/rock/marshall-amp.png", correctAnswer: "Rock" },
  { id: 606, fandom: "Hip Hop", category: "music", difficulty: "easy", premium: "fanatic", objectName: "Boombox", imagePath: "/src/assets/music/hiphop/boombox.png", correctAnswer: "Hip Hop" },
  { id: 607, fandom: "Hip Hop", category: "music", difficulty: "medium", premium: "fanatic", objectName: "Cassette Tape", imagePath: "/src/assets/music/hiphop/cassette-tape.png", correctAnswer: "Hip Hop" },
  { id: 608, fandom: "Hip Hop", category: "music", difficulty: "hard", premium: "fanatic", objectName: "Chain Necklace", imagePath: "/src/assets/music/hiphop/chain-necklace.png", correctAnswer: "Hip Hop" },
  { id: 609, fandom: "Classical", category: "music", difficulty: "easy", premium: "fanatic", objectName: "Violin", imagePath: "/src/assets/music/classical/violin.png", correctAnswer: "Classical" },
  { id: 610, fandom: "Classical", category: "music", difficulty: "medium", premium: "fanatic", objectName: "Sheet Music", imagePath: "/src/assets/music/classical/sheet-music.png", correctAnswer: "Classical" },
  { id: 611, fandom: "Classical", category: "music", difficulty: "hard", premium: "fanatic", objectName: "Conductor's Baton", imagePath: "/src/assets/music/classical/conductors-baton.png", correctAnswer: "Classical" },

  // === FANATIC PACK — History ===
  { id: 612, fandom: "Ancient Rome", category: "history", difficulty: "easy", premium: "fanatic", objectName: "Roman Helmet", imagePath: "/src/assets/history/rome/roman-helmet.png", correctAnswer: "Ancient Rome" },
  { id: 613, fandom: "Ancient Rome", category: "history", difficulty: "medium", premium: "fanatic", objectName: "Colosseum", imagePath: "/src/assets/history/rome/colosseum.png", correctAnswer: "Ancient Rome" },
  { id: 614, fandom: "Ancient Rome", category: "history", difficulty: "hard", premium: "fanatic", objectName: "Gladius Sword", imagePath: "/src/assets/history/rome/gladius-sword.png", correctAnswer: "Ancient Rome" },
  { id: 615, fandom: "Feudal Japan", category: "history", difficulty: "easy", premium: "fanatic", objectName: "Katana", imagePath: "/src/assets/history/feudal-japan/katana.png", correctAnswer: "Feudal Japan" },
  { id: 616, fandom: "Feudal Japan", category: "history", difficulty: "medium", premium: "fanatic", objectName: "Samurai Helmet", imagePath: "/src/assets/history/feudal-japan/samurai-helmet.png", correctAnswer: "Feudal Japan" },
  { id: 617, fandom: "Feudal Japan", category: "history", difficulty: "hard", premium: "fanatic", objectName: "Shuriken", imagePath: "/src/assets/history/feudal-japan/shuriken.png", correctAnswer: "Feudal Japan" },
  { id: 618, fandom: "Wild West", category: "history", difficulty: "easy", premium: "fanatic", objectName: "Cowboy Hat", imagePath: "/src/assets/history/wild-west/cowboy-hat.png", correctAnswer: "Wild West" },
  { id: 619, fandom: "Wild West", category: "history", difficulty: "medium", premium: "fanatic", objectName: "Revolver", imagePath: "/src/assets/history/wild-west/revolver.png", correctAnswer: "Wild West" },
  { id: 620, fandom: "Wild West", category: "history", difficulty: "hard", premium: "fanatic", objectName: "Wanted Poster", imagePath: "/src/assets/history/wild-west/wanted-poster-west.png", correctAnswer: "Wild West" },
  { id: 621, fandom: "Medieval", category: "history", difficulty: "easy", premium: "fanatic", objectName: "Knight Shield", imagePath: "/src/assets/history/medieval/knight-shield.png", correctAnswer: "Medieval" },
  { id: 622, fandom: "Medieval", category: "history", difficulty: "medium", premium: "fanatic", objectName: "Castle Tower", imagePath: "/src/assets/history/medieval/castle-tower.png", correctAnswer: "Medieval" },
  { id: 623, fandom: "Medieval", category: "history", difficulty: "hard", premium: "fanatic", objectName: "Royal Crown", imagePath: "/src/assets/history/medieval/royal-crown.png", correctAnswer: "Medieval" },

  // === FANATIC PACK — Tech ===
  { id: 624, fandom: "Retro Gaming", category: "tech", difficulty: "easy", premium: "fanatic", objectName: "Arcade Cabinet", imagePath: "/src/assets/tech/retro-gaming/arcade-cabinet.png", correctAnswer: "Retro Gaming" },
  { id: 625, fandom: "Retro Gaming", category: "tech", difficulty: "medium", premium: "fanatic", objectName: "Cartridge", imagePath: "/src/assets/tech/retro-gaming/cartridge.png", correctAnswer: "Retro Gaming" },
  { id: 626, fandom: "Retro Gaming", category: "tech", difficulty: "hard", premium: "fanatic", objectName: "Joystick", imagePath: "/src/assets/tech/retro-gaming/joystick.png", correctAnswer: "Retro Gaming" },
  { id: 627, fandom: "Sci-Fi", category: "tech", difficulty: "easy", premium: "fanatic", objectName: "Spaceship", imagePath: "/src/assets/tech/sci-fi/spaceship.png", correctAnswer: "Sci-Fi" },
  { id: 628, fandom: "Sci-Fi", category: "tech", difficulty: "medium", premium: "fanatic", objectName: "Robot Head", imagePath: "/src/assets/tech/sci-fi/robot-head.png", correctAnswer: "Sci-Fi" },
  { id: 629, fandom: "Sci-Fi", category: "tech", difficulty: "hard", premium: "fanatic", objectName: "Alien Blaster", imagePath: "/src/assets/tech/sci-fi/alien-blaster.png", correctAnswer: "Sci-Fi" },
  { id: 630, fandom: "Gadgets", category: "tech", difficulty: "easy", premium: "fanatic", objectName: "Smartwatch", imagePath: "/src/assets/tech/gadgets/smartwatch.png", correctAnswer: "Gadgets" },
  { id: 631, fandom: "Gadgets", category: "tech", difficulty: "medium", premium: "fanatic", objectName: "Drone", imagePath: "/src/assets/tech/gadgets/drone.png", correctAnswer: "Gadgets" },
  { id: 632, fandom: "Gadgets", category: "tech", difficulty: "hard", premium: "fanatic", objectName: "VR Headset", imagePath: "/src/assets/tech/gadgets/vr-headset.png", correctAnswer: "Gadgets" },
  { id: 633, fandom: "Cyberpunk", category: "tech", difficulty: "easy", premium: "fanatic", objectName: "Neon Glasses", imagePath: "/src/assets/tech/cyberpunk/neon-glasses.png", correctAnswer: "Cyberpunk" },
  { id: 634, fandom: "Cyberpunk", category: "tech", difficulty: "medium", premium: "fanatic", objectName: "Cyber Arm", imagePath: "/src/assets/tech/cyberpunk/cyber-arm.png", correctAnswer: "Cyberpunk" },
  { id: 635, fandom: "Cyberpunk", category: "tech", difficulty: "hard", premium: "fanatic", objectName: "Hologram Chip", imagePath: "/src/assets/tech/cyberpunk/hologram-chip.png", correctAnswer: "Cyberpunk" },

  // === FANATIC PACK — Anime Deep Cuts ===
  { id: 636, fandom: "Berserk", category: "anime", difficulty: "easy", premium: "fanatic", objectName: "Brand of Sacrifice", imagePath: "/src/assets/anime/berserk/brand-of-sacrifice.png", correctAnswer: "Berserk" },
  { id: 637, fandom: "Berserk", category: "anime", difficulty: "medium", premium: "fanatic", objectName: "Dragon Slayer", imagePath: "/src/assets/anime/berserk/dragonslayer-sword.png", correctAnswer: "Berserk" },
  { id: 638, fandom: "Berserk", category: "anime", difficulty: "hard", premium: "fanatic", objectName: "Behelit", imagePath: "/src/assets/anime/berserk/behelit.png", correctAnswer: "Berserk" },
  { id: 639, fandom: "Evangelion", category: "anime", difficulty: "easy", premium: "fanatic", objectName: "Entry Plug", imagePath: "/src/assets/anime/evangelion/entry-plug.png", correctAnswer: "Evangelion" },
  { id: 640, fandom: "Evangelion", category: "anime", difficulty: "medium", premium: "fanatic", objectName: "LCL Liquid", imagePath: "/src/assets/anime/evangelion/lcl-liquid.png", correctAnswer: "Evangelion" },
  { id: 641, fandom: "Evangelion", category: "anime", difficulty: "hard", premium: "fanatic", objectName: "Spear of Longinus", imagePath: "/src/assets/anime/evangelion/spear-of-longinus.png", correctAnswer: "Evangelion" },
  { id: 642, fandom: "Hunter x Hunter", category: "anime", difficulty: "easy", premium: "fanatic", objectName: "Hunter License", imagePath: "/src/assets/anime/hunter-x-hunter/hunter-license.png", correctAnswer: "Hunter x Hunter" },
  { id: 643, fandom: "Hunter x Hunter", category: "anime", difficulty: "medium", premium: "fanatic", objectName: "Gon's Fishing Rod", imagePath: "/src/assets/anime/hunter-x-hunter/gons-fishing-rod.png", correctAnswer: "Hunter x Hunter" },
  { id: 644, fandom: "Hunter x Hunter", category: "anime", difficulty: "hard", premium: "fanatic", objectName: "Spider Tattoo", imagePath: "/src/assets/anime/hunter-x-hunter/spider-tattoo.png", correctAnswer: "Hunter x Hunter" },
  { id: 645, fandom: "Cowboy Bebop", category: "anime", difficulty: "easy", premium: "fanatic", objectName: "Swordfish II", imagePath: "/src/assets/anime/cowboy-bebop/swordfish-ii.png", correctAnswer: "Cowboy Bebop" },
  { id: 646, fandom: "Cowboy Bebop", category: "anime", difficulty: "medium", premium: "fanatic", objectName: "Cigarette", imagePath: "/src/assets/anime/cowboy-bebop/cigarette.png", correctAnswer: "Cowboy Bebop" },
  { id: 647, fandom: "Cowboy Bebop", category: "anime", difficulty: "hard", premium: "fanatic", objectName: "Bebop Ship", imagePath: "/src/assets/anime/cowboy-bebop/bebop-ship.png", correctAnswer: "Cowboy Bebop" },

  // === FANATIC PACK — Gaming Deep Cuts ===
  { id: 648, fandom: "Minecraft", category: "games", difficulty: "easy", premium: "fanatic", objectName: "Diamond Sword", imagePath: "/src/assets/games/minecraft/diamond-sword.png", correctAnswer: "Minecraft" },
  { id: 649, fandom: "Minecraft", category: "games", difficulty: "medium", premium: "fanatic", objectName: "Creeper Face", imagePath: "/src/assets/games/minecraft/creeper-face.png", correctAnswer: "Minecraft" },
  { id: 650, fandom: "Minecraft", category: "games", difficulty: "hard", premium: "fanatic", objectName: "Ender Pearl", imagePath: "/src/assets/games/minecraft/ender-pearl.png", correctAnswer: "Minecraft" },
  { id: 651, fandom: "God of War", category: "games", difficulty: "easy", premium: "fanatic", objectName: "Leviathan Axe", imagePath: "/src/assets/games/god-of-war/leviathan-axe.png", correctAnswer: "God of War" },
  { id: 652, fandom: "God of War", category: "games", difficulty: "medium", premium: "fanatic", objectName: "Chaos Blades", imagePath: "/src/assets/games/god-of-war/chaos-blades.png", correctAnswer: "God of War" },
  { id: 653, fandom: "God of War", category: "games", difficulty: "hard", premium: "fanatic", objectName: "Head of Mimir", imagePath: "/src/assets/games/god-of-war/head-of-mimir.png", correctAnswer: "God of War" },
  { id: 654, fandom: "Dark Souls", category: "games", difficulty: "easy", premium: "fanatic", objectName: "Bonfire", imagePath: "/src/assets/games/dark-souls/bonfire.png", correctAnswer: "Dark Souls" },
  { id: 655, fandom: "Dark Souls", category: "games", difficulty: "medium", premium: "fanatic", objectName: "Sunlight Medal", imagePath: "/src/assets/games/dark-souls/sunlight-medal.png", correctAnswer: "Dark Souls" },
  { id: 656, fandom: "Dark Souls", category: "games", difficulty: "hard", premium: "fanatic", objectName: "Estus Flask", imagePath: "/src/assets/games/dark-souls/estus-flask.png", correctAnswer: "Dark Souls" },
  { id: 657, fandom: "DOOM", category: "games", difficulty: "easy", premium: "fanatic", objectName: "Super Shotgun", imagePath: "/src/assets/games/doom/super-shotgun.png", correctAnswer: "DOOM" },
  { id: 658, fandom: "DOOM", category: "games", difficulty: "medium", premium: "fanatic", objectName: "BFG", imagePath: "/src/assets/games/doom/bfg.png", correctAnswer: "DOOM" },
  { id: 659, fandom: "DOOM", category: "games", difficulty: "hard", premium: "fanatic", objectName: "Doom Slayer Helmet", imagePath: "/src/assets/games/doom/doom-slayer-helmet.png", correctAnswer: "DOOM" },
];
