# 🎮 FANDOM RUSH

**Fandom Rush** is a fast-paced, high-octane arcade fandom guessing game.  iconic shows, anime, movies, and games through their most famous **props and objects**.

> " Start the rush. Identify the thing. Beat the clock. Know how deep you recognize the objects."

---

## ⚡ The Core Gameplay Loop
Everything in Fandom Rush is built for **speed + recognition + arcade flow**.

1.  **SEE OBJECT** (Floating, premium 3D collectible asset)
2.  **INSTANT RECOGNITION** (Wand? Straw Hat? Hazmat Suit?)
3.  **CHOOSE ANSWER** (Swipe or Click)
4.  **COMBO + POINTS** (Speed matters!)
5.  **NEXT ROUND IMMEDIATELY**

---

## 📱 Platform-Based Gameplay

### Mobile → Swipe Mode (TikTok/Tinder Inspired)
Swipe the clue card toward the correct answer.
*   **Up/Down/Left/Right** swipes map to specific options.
*   Enabled by default on mobile devices.
*   Fast, tactile, and addictive.

### Desktop → Multiple Choice (MCQ)
Precision clicking or lightning-fast keyboard input.
*   **Keyboard Support:** Use `1`, `2`, `3`, `4` OR `W`, `A`, `S`, `D` / `Arrow Keys`.
*   Minimal UI to keep the focus on the clue.

---

## 🎨 Visual Identity: "Guess the Thing"
Fandom Rush moves away from generic trivia. The game identity is built on:
*   ❌ No Emojis
*   ❌ No Screenshots / Movie Scenes
*   ❌ No Character Faces
*   ✅ **Iconic Objects / Props Only**

### Art Direction
All assets follow a **Semi-Realistic Collectible Style**:
*   Floating, centered composition.
*   Soft cinematic lighting and shadows.
*   Stylized 3D render feel (AI-Assisted Asset Generation).

---

## 🏆 Scoring & Difficulty

### Base Points
*   **Easy:** +10
*   **Medium:** +25
*   **Hard:** +50

### Speed Bonus
React instantly for massive boosts:
*   **Under 2 seconds:** +30 points
*   **Under 3 seconds:** +20 points

### Combo System
Correct streaks build a multiplier (×1.3, ×1.6, ×2.0+). One mistake resets your multiplier—and in Endless Mode, costs a life!

---

## 🕹️ Game Modes
1.  **Endless Rush:** Survive as long as you can with 3 lives.
2.  **60-Second Rush:** Pure arcade mode—guess as many as possible in one minute.
3.  **Category Rush:** Focus on your specialty (Anime, Movies, TV, etc.).
4.  **Chaos Mode:** Random modifiers every round — speed boost, moving targets, inverted controls, blurry clues. Maximum insanity.

> Note: TV and Games categories are built and ready but currently disabled in the menu.

---

## 🛠️ Tech Stack
*   **Frontend:** React 19 + TypeScript + Vite
*   **Styling:** Tailwind CSS 4
*   **Animations:** Framer Motion
*   **State Management:** Zustand
*   **Icons:** Lucide React
*   **Backend:** Hono + BetterAuth (Google OAuth)
*   **Database:** PostgreSQL
*   **Infrastructure:** Docker Compose, GitHub Actions CI

---

## 🚀 Getting Started

### Option A — Docker (recommended)

```bash
cp .env.example .env   # fill in Google OAuth credentials
docker compose up
```

Opens at `http://localhost:5173`. No Node or Postgres install required.

### Option B — Local

```bash
# Terminal 1 — backend
cd server && cp .env.example .env   # configure DATABASE_URL + OAuth
npm install && npm run dev

# Terminal 2 — frontend
npm install && npm run dev
```

### Build

```bash
npm run build    # typechecks with tsc -b, then builds with Vite
```

---

*Built with ❤️ for fans everywhere.*
