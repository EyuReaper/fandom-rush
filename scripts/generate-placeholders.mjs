import { writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, resolve } from "path";

const ASSETS_DIR = resolve("src/assets");

const ENTRIES = {
  // === ENTHUSIAST (36) — new categories ===
  mythology: [
    ["greek", ["thunderbolt", "medusa-head", "pandora-box"]],
    ["norse", ["mjolnir", "yggdrasil", "valkyrie-wing"]],
    ["egyptian", ["ankh", "eye-of-horus", "sarcophagus"]],
    ["japanese", ["torii-gate", "kitsune-mask", "oni-mask"]],
  ],
  internet: [
    ["memes", ["distracted-boyfriend", "doge", "pepe"]],
    ["creepypasta", ["slenderman", "jeff-the-killer", "sonic-exe"]],
    ["viral-games", ["flappy-bird", "among-us", "geometry-dash"]],
    ["web-series", ["salad-fingers", "homestar-runner", "dont-hug-me"]],
  ],
  sports: [
    ["basketball", ["basketball-ball", "jersey-23", "championship-trophy"]],
    ["soccer", ["soccer-ball", "world-cup-trophy", "red-card"]],
    ["boxing", ["boxing-glove", "heavyweight-belt", "punching-bag"]],
    ["olympics", ["gold-medal", "olympic-torch", "laurel-wreath"]],
  ],

  // === FANATIC (60) — 3 new + 2 existing categories ===
  music: [
    ["kpop", ["light-stick", "photocard", "microphone"]],
    ["rock", ["electric-guitar", "vinyl-record", "marshall-amp"]],
    ["hiphop", ["boombox", "cassette-tape", "chain-necklace"]],
    ["classical", ["violin", "sheet-music", "conductors-baton"]],
  ],
  history: [
    ["rome", ["roman-helmet", "colosseum", "gladius-sword"]],
    ["feudal-japan", ["katana", "samurai-helmet", "shuriken"]],
    ["wild-west", ["cowboy-hat", "revolver", "wanted-poster-west"]],
    ["medieval", ["knight-shield", "castle-tower", "royal-crown"]],
  ],
  tech: [
    ["retro-gaming", ["arcade-cabinet", "cartridge", "joystick"]],
    ["sci-fi", ["spaceship", "robot-head", "alien-blaster"]],
    ["gadgets", ["smartwatch", "drone", "vr-headset"]],
    ["cyberpunk", ["neon-glasses", "cyber-arm", "hologram-chip"]],
  ],

  // Anime deep cuts → existing "anime" category dir
  anime: [
    ["berserk", ["brand-of-sacrifice", "dragonslayer-sword", "behelit"]],
    ["evangelion", ["entry-plug", "lcl-liquid", "spear-of-longinus"]],
    ["hunter-x-hunter", ["hunter-license", "gons-fishing-rod", "spider-tattoo"]],
    ["cowboy-bebop", ["swordfish-ii", "cigarette", "bebop-ship"]],
  ],

  // Gaming deep cuts → existing "games" category dir
  games: [
    ["minecraft", ["diamond-sword", "creeper-face", "ender-pearl"]],
    ["god-of-war", ["leviathan-axe", "chaos-blades", "head-of-mimir"]],
    ["dark-souls", ["bonfire", "sunlight-medal", "estus-flask"]],
    ["doom", ["super-shotgun", "bfg", "doom-slayer-helmet"]],
  ],
};

const BASE64_1PX_PNG = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
const PNG_BUF = Buffer.from(BASE64_1PX_PNG, "base64");

let count = 0;
for (const [category, fandoms] of Object.entries(ENTRIES)) {
  for (const [fandomSlug, objects] of fandoms) {
    for (const obj of objects) {
      const filePath = resolve(ASSETS_DIR, category, fandomSlug, `${obj}.png`);
      if (existsSync(filePath)) continue;
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, PNG_BUF);
      count++;
    }
  }
}

console.log(`Created ${count} placeholder images`);
