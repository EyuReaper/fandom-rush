import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useGameStore } from "../stores/useGameStore";
import { audioManager } from "../lib/audioManager";
import { authClient } from "../lib/auth-client";
import { API_URL } from "../lib/config";
import LoginButton from "./LoginButton";
import Leaderboard from "./Leaderboard";
import TelemetryDashboard from "./TelemetryDashboard";
import ShopScreen from "./ShopScreen";
import StarRating from "./StarRating";
import {
  Zap,
  Clock,
  Tv,
  LayoutGrid,
  ChevronLeft,
  Target,
  Settings,
  Trophy,
  X,
  Info,
  Volume2,
  VolumeX,
  Store,
  Crown,
} from "lucide-react";

const particles = Array.from({ length: 20 }).map((_, i) => ({
  duration: 0.8 + Math.random(),
  delay: Math.random() * 2,
  x: [(i - 10) * 8, (i - 10) * 12],
}));

export default function MainMenu() {
  const {
    startGame,
    highScore,
    swipeMode,
    toggleSwipeMode,
    isMuted,
    toggleMute,
    isPlaying,
    entitlements,
    fetchEntitlements,
  } = useGameStore();
  const [showCategories, setShowCategories] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const tapTimestamps = useRef<number[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { data: session } = authClient.useSession();
  const [carouselIndex, setCarouselIndex] = useState(0);

  interface ReviewEntry {
    rating: number;
    review_text: string;
    created_at: string;
    user_name: string;
    user_image: string | null;
  }

  const [ratingData, setRatingData] = useState<{
    average: number | null;
    total: number;
    recent: ReviewEntry[];
  } | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const claimScore = async () => {
      if (session && highScore > 0) {
        const hasClaimed = localStorage.getItem(
          `fandomRushClaimed_${session.user.id}`,
        );
        if (hasClaimed === highScore.toString()) return;

        try {
          await fetch(`${API_URL}/api/leaderboard/claim`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            signal: abortController.signal,
            body: JSON.stringify({
              score: highScore,
              gameMode: "endless",
              category: "all",
            }),
          });
          localStorage.setItem(
            `fandomRushClaimed_${session.user.id}`,
            highScore.toString(),
          );
        } catch (err) {
          console.error("Failed to claim score:", err);
        }
      }
    };

    claimScore();
    return () => abortController.abort();
  }, [session, highScore]);

  useEffect(() => {
    if (session) fetchEntitlements();
  }, [session, fetchEntitlements]);

  useEffect(() => {
    if (!ratingData?.recent?.length) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % ratingData.recent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ratingData?.recent?.length]);


  useEffect(() => {
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 10000);

    fetch(`${API_URL}/api/ratings`, {
      signal: abortController.signal,
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) setRatingData({ average: data.average, total: data.total, recent: data.recent ?? [] });
      })
      .catch(() => { });

    return () => { clearTimeout(timeout); abortController.abort(); };

  }, []);


  const handleInteraction = useCallback(() => {
    audioManager.playBGM(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (!isPlaying) {
      audioManager.playBGM(isMuted);
    }
  }, [isPlaying, isMuted]);

  useEffect(() => {
    window.addEventListener("mousedown", handleInteraction, { once: true });
    window.addEventListener("keydown", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });
    return () => {
      window.removeEventListener("mousedown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [handleInteraction]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const categories = [
    {
      id: "anime",
      name: "Anime",
      icon: "🍱",
      color: "from-orange-500 to-red-600",
      glow: "shadow-orange-500/20",
    },
    {
      id: "movies",
      name: "Movies",
      icon: "🎬",
      color: "from-blue-500 to-cyan-400",
      glow: "shadow-blue-500/20",
    },
    {
      id: "tv",
      name: "TV Shows",
      icon: "📺",
      color: "from-emerald-500 to-teal-400",
      glow: "shadow-emerald-500/20",
      disabled: false,
    },
    {
      id: "cartoons",
      name: "Cartoons",
      icon: "🎨",
      color: "from-yellow-400 to-orange-500",
      glow: "shadow-yellow-500/20",
    },
    {
      id: "games",
      name: "Games",
      icon: "🎮",
      color: "from-fuchsia-500 to-purple-600",
      glow: "shadow-fuchsia-500/20",
      disabled: false,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex flex-col items-center justify-center p-12 md:p-20 relative overflow-hidden selection:bg-cyan-400 selection:text-black">
      {/* --- CYBER BACKGROUND --- */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #1a1a2e 1px, transparent 1px), linear-gradient(to bottom, #1a1a2e 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          transform: `perspective(1000px) rotateX(60deg) translateY(${mousePos.y}px) translateZ(-100px)`,
          maskImage:
            "radial-gradient(ellipse at center, black, transparent 80%)",
        }}
      />

      {/* Dynamic Glows */}
      <motion.div
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -100, 100, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -120, 120, 0],
          y: [0, 120, -120, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#ff2d78]/10 rounded-full blur-[140px] pointer-events-none"
      />

      {/* --- TOP HUD --- */}
      <div className="absolute top-16 left-12 right-12 z-[100] flex justify-between items-start">
        <LoginButton />
        <div className="flex gap-3">
          <motion.button
            aria-label="Shop"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowShop(true)}
            className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-colors shadow-2xl"
          >
            <Store className="w-7 h-7 text-pink-400 drop-shadow-[0_0_8px_rgba(219,39,119,0.5)]" />
          </motion.button>

          <motion.button
            aria-label="How to Play"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowHowToPlay(true)}
            className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-colors shadow-2xl"
          >
            <Info className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSettings(true)}
            className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-colors shadow-2xl"
          >
            <Settings className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showCategories ? (
          <motion.div
            key="main-menu"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center w-full max-w-6xl relative z-10 py-20"
          >
              {/* --- HEADER --- */}
              <motion.div
                variants={itemVariants}
                className="text-center mb-24 relative item-center"
              >
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-[11px] font-black tracking-[0.4em] mb-12 uppercase backdrop-blur-md">
                  <Target className="w-4 h-4 animate-pulse" />
                  An arcade guessing game
                </div>

                <div className="relative group mb-12 pb-16">
                  <motion.div
                    animate={{
                      opacity: [1, 1, 0.92, 1, 1, 1, 0.88, 1, 1, 0.95, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >
                    {/* Background neon glow */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                      <span className="text-6xl md:text-9xl font-black leading-none blur-2xl opacity-50" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
                        <span className="text-[var(--color-neon)]" style={{ textShadow: '0 0 21px var(--color-neon), 0 0 42px var(--color-neon), 0 0 82px var(--color-neon)' }}>
                          FAND ♥ M
                        </span>
                        <span className="text-[var(--color-hot-pink)]" style={{ textShadow: '0 0 21px var(--color-hot-pink), 0 0 42px var(--color-hot-pink), 0 0 82px var(--color-hot-pink)' }}>
                          RUSH
                        </span>
                      </span>
                    </div>

                    {/* Foreground crisp text */}
                    <h1 onClick={() => {
                      const now = Date.now();
                      tapTimestamps.current = [...tapTimestamps.current.filter(t => now - t < 3000), now];
                      if (tapTimestamps.current.length >= 10) {
                        tapTimestamps.current = [];
                        setShowTelemetry(true);
                      }
                    }} className="text-6xl md:text-9xl font-black leading-none relative z-10 flex items-baseline justify-center cursor-pointer" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
                      <span className="flex items-baseline">
                        FAND
                        <motion.span
                          initial={{ y: -300, x: -150, opacity: 0, rotate: -15 }}
                          animate={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
                          transition={{ type: "spring", damping: 14, stiffness: 100, delay: 0.4 }}
                          className="inline-flex items-center justify-center w-[0.75em] h-[0.75em] self-center mx-[0.06em] relative"
                        >
                          <motion.span
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Fandom_heart-logo.svg"
                              alt="Fandom Logo"
                              className="w-full h-full object-contain brightness-0 invert"
                              style={{ filter: 'brightness(0) invert(1)' }}
                            />
                          </motion.span>
                        </motion.span>
                        M
                      </span>
                      <span>
                        RUSH
                      </span>
                    </h1>
                  </motion.div>
                </div>

              <div className="relative py-6 overflow-hidden flex flex-col items-center">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {particles.map((p, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -80],
                        x: p.x,
                        opacity: [0, 0.8, 0],
                        scaleY: [1, 2, 0.5],
                        scaleX: [1, 0.5, 0],
                      }}
                      transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeOut",
                      }}
                      className="absolute w-2 h-2 rounded-full bg-gradient-to-t from-pink-500 to-yellow-400 blur-sm"
                    />
                  ))}
                </div>

              </div>
            </motion.div>

            <div className="h-16" />

            {/* --- TOP STATS --- */}
            <motion.div
              variants={itemVariants}
              onClick={() => setShowLeaderboard(true)}
              className="group relative bg-[#10101a] p-1 w-full max-w-lg overflow-hidden cursor-pointer active:scale-95 transition-transform rounded-[16px] mt-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="bg-[#0a0a0f] rounded-[14px] p-10 flex items-center gap-10 relative z-10 border border-white/5">
                <div className="relative">
                  <div className="w-20 h-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                    <Trophy className="text-yellow-500 w-10 h-10 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-lg">
                    1ST
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-[11px] uppercase font-black tracking-[0.3em] mb-3">
                    Global High Score
                  </p>
                  <p className="text-6xl font-black text-white tabular-nums tracking-tighter leading-none">
                    {highScore.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {ratingData && ratingData.total > 0 && (
              <motion.div
                variants={itemVariants}
                className="mb-28 w-full max-w-lg"
              >
                <div className="bg-[#10101a] p-1 rounded-[16px]">
                  <div className="bg-[#0a0a0f] rounded-[14px] p-8 flex items-center gap-10 relative z-10 border border-white/5">
                    <div className="w-20 h-20 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/30">
                      <StarRating value={ratingData.average ?? 0} variant="badge" size={36} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-[11px] uppercase font-black tracking-[0.3em] mb-3">
                        Community Rating
                      </p>
                      <p className="text-5xl font-black text-white tabular-nums tracking-tighter leading-none">
                        {ratingData.average ? Number(ratingData.average).toFixed(1) : "—"}
                        <span className="text-lg text-gray-500 font-bold ml-2 align-baseline">
                          / 5
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mt-1">
                        {ratingData.total} review{ratingData.total !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {ratingData?.recent && ratingData.recent.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="w-full max-w-lg mb-28"
              >
                <div className="bg-[#10101a] p-1 rounded-[16px]">
                  <div className="bg-[#0a0a0f] rounded-[14px] p-8 z-10 border border-white/5 min-h-[170px]">
                    <p className="text-gray-500 text-[10px] font-black tracking-[0.4em] uppercase mb-6 text-center">
                      RECENT REVIEWS
                    </p>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={carouselIndex}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                          {ratingData.recent[carouselIndex].user_image ? (
                            <img
                              src={ratingData.recent[carouselIndex].user_image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-cyan-400 font-black text-lg">
                              {ratingData.recent[carouselIndex].user_name?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-sm font-bold text-white truncate">
                              {ratingData.recent[carouselIndex].user_name}
                            </p>
                            <StarRating value={ratingData.recent[carouselIndex].rating} variant="badge" size={18} />
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            &ldquo;{ratingData.recent[carouselIndex].review_text}&rdquo;
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-center gap-2 mt-6">
                      {ratingData.recent.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCarouselIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === carouselIndex ? "bg-cyan-400 w-4" : "bg-white/20 hover:bg-white/40"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex justify-center gap-4 mt-4">
                      <button
                        onClick={() => setCarouselIndex((p) => (p - 1 + ratingData.recent.length) % ratingData.recent.length)}
                        className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60 hover:text-cyan-400 transition-colors"
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={() => setCarouselIndex((p) => (p + 1) % ratingData.recent.length)}
                        className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60 hover:text-cyan-400 transition-colors"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* spacer */}
            <div className="h-16" />

            {/* --- GAME MODES --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              <MenuButton
                icon={<Zap className="w-10 h-10 " />}
                title="Endless Rush"
                description="The ultimate survival test. 3 lives. Infinite glory."
                onClick={() => startGame("endless")}
                accent="cyan"
              />
              <MenuButton
                icon={<Clock className="w-10 h-10" />}
                title="60-Second Rush"
                description="Maximum intensity. How many can you get before zero?"
                onClick={() => startGame("sixty-second")}
                accent="purple"
              />
              <MenuButton
                icon={<Tv className="w-10 h-10" />}
                title="Category Rush"
                description="Master your specific domains. Anime, Movies, and more."
                onClick={() => setShowCategories(true)}
                accent="emerald"
              />
              <MenuButton
                icon={<LayoutGrid className="w-10 h-10" />}
                title="Chaos Mode"
                description="Random modifiers. Moving targets. Pure insanity."
                onClick={() => startGame("chaos")}
                accent="red"
              />
              <MenuButton
                icon={<Crown className="w-10 h-10" />}
                title="Survival Mode"
                description="Bank your score. 3 extra lives. Fanatic Pack required."
                onClick={() => startGame("survival")}
                accent="amber"
                disabled={!entitlements.includes("fanatic")}
              />
            </div>

            {/* --- FOOTER --- */}
            <motion.div
              variants={itemVariants}
              className="mt-24 flex flex-col items-center gap-6"
            >
              <div className="text-gray-600 text-[10px] font-black uppercase tracking-[0.6em]">
                © 2026 FANDOM RUSH
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="categories"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-6xl relative z-10 py-12"
          >
            <div className="flex items-center justify-between mb-16">
              <div>
                <button
                  onClick={() => setShowCategories(false)}
                  className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all mb-6 font-black uppercase tracking-[0.2em] text-[10px]"
                >
                  <div className="p-2 rounded-full border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                  BACK TO TITLE SCREEN
                </button>
                <h2 className="text-6xl md:text-7xl font-black italic tracking-tighter leading-none">
                  SELECT{" "}
                  <span className="drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                      DOMAIN
                    </span>
                  </span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat, idx) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: idx * 0.05 },
                  }}
                  whileHover={!cat.disabled ? { scale: 1.02 } : {}}
                  whileTap={!cat.disabled ? { scale: 0.98 } : {}}
                  onClick={() => !cat.disabled && startGame("category", cat.id)}
                  disabled={cat.disabled}
                  className={`relative group h-40 rounded-[48px] overflow-hidden border-2 transition-all p-1 ${cat.disabled ? "opacity-30 grayscale border-white/5 cursor-not-allowed bg-white/[0.02]" : `border-white/5 hover:border-white/20 shadow-2xl ${cat.glow}`}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-5 group-hover:opacity-20 transition-opacity`}
                  />
                  <div className="h-full w-full bg-[#0d0d14] rounded-[40px] flex items-center p-10 relative z-10 border border-white/5 overflow-hidden">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cat.color} p-[1px] group-hover:rotate-6 transition-transform mr-8 flex-shrink-0`}
                    >
                      <div className="w-full h-full bg-[#0d0d14] rounded-[15px] flex items-center justify-center text-4xl">
                        {cat.icon}
                      </div>
                    </div>
                    <span className="text-4xl font-black italic tracking-tight uppercase group-hover:text-white transition-colors">
                      {cat.name}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SETTINGS --- */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-[#0a0a1a]/60 backdrop-blur-md"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateX: 10 }}
              className="relative w-full max-w-xl bg-[#0d0d14]/80 border border-cyan-500/20 rounded-[10px] shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-[pulse_4s_infinite]" />
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-cyan-500 rounded-full animate-pulse" />
                  <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                      DIP SWITCH <span className="text-cyan-400">SETTINGS</span>
                    </h2>
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em]">
                      ARCADE CONFIGURATION
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
              </div>

              <div className="p-10 space-y-10">
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Target className="w-4 h-4 text-cyan-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500/60">
                      DIP 1: CONTROLS
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-xl mb-4">
                    <span className="text-sm font-bold uppercase italic tracking-wider">
                      SWIPE
                    </span>
                    <button
                      onClick={toggleSwipeMode}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 border ${swipeMode ? "bg-cyan-500/20 border-cyan-500" : "bg-white/5 border-white/10"}`}
                    >
                      <motion.div
                        animate={{ x: swipeMode ? 24 : 4 }}
                        className={`absolute top-1 w-4 h-4 rounded-full ${swipeMode ? "bg-cyan-400" : "bg-gray-600"}`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-cyan-400" />
                      )}
                      <span className="text-sm font-bold uppercase italic tracking-wider">
                        AUDIO {isMuted ? "(MUTED)" : "(ON)"}
                      </span>
                    </div>
                    <button
                      onClick={toggleMute}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 border ${!isMuted ? "bg-cyan-500/20 border-cyan-500" : "bg-white/5 border-white/10"}`}
                    >
                      <motion.div
                        animate={{ x: !isMuted ? 24 : 4 }}
                        className={`absolute top-1 w-4 h-4 rounded-full ${!isMuted ? "bg-cyan-400" : "bg-gray-600"}`}
                      />
                    </button>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Info className="w-4 h-4 text-pink-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-500/60">
                      CREDITS
                    </span>
                  </div>
                  <div className="p-6 bg-white/[0.03] border border-white/5 rounded-xl space-y-4">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      <span className="text-white font-bold italic">
                        FANDOM RUSH
                      </span>{" "}
                      is an arcade game built for elite fans. Designed to make
                      you say "hey i have seen this before". Don't forget to
                      support the developer!
                    </p>
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[7px] font-black text-gray-600 uppercase tracking-widest mb-1">
                        Developer
                      </p>
                      <p className="text-xs font-bold italic text-cyan-400/80">
                        @EyuReaper
                      </p>
                    </div>
                  </div>
                </section>
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHowToPlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-[#0a0a1a]/60 backdrop-blur-md"
              onClick={() => setShowHowToPlay(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateX: 10 }}
              className="relative w-full max-w-xl bg-[#0d0d14]/80 border border-cyan-500/20 rounded-[10px] shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-cyan-500 rounded-full animate-pulse" />
                  <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                      HOW TO <span className="text-cyan-400">PLAY</span>
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setShowHowToPlay(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                >
                  <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
              </div>

              <div className="p-8 space-y-6 text-sm text-gray-300 leading-relaxed">
                <section>
                  <h3 className="text-cyan-400 font-black uppercase tracking-wider text-xs mb-2">
                    BASICS
                  </h3>
                  <p>
                    You'll see an iconic object from pop culture. Your job? Guess
                    which fandom it's from. Four choices — pick right, score
                    points. That's it.
                  </p>
                </section>

                <section>
                  <h3 className="text-cyan-400 font-black uppercase tracking-wider text-xs mb-2">
                    CONTROLS
                  </h3>
                  <ul className="space-y-1 list-disc list-inside text-gray-400">
                    <li>Tap an option to answer</li>
                    <li>Swipe left/right to navigate options</li>
                    <li>Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono text-white">1</kbd>–<kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono text-white">4</kbd> to answer with keyboard</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-cyan-400 font-black uppercase tracking-wider text-xs mb-2">
                    SCORING
                  </h3>
                  <ul className="space-y-1 list-disc list-inside text-gray-400">
                    <li>Each correct answer = <span className="text-white font-bold">100 points</span></li>
                    <li>Chain correct answers for a <span className="text-pink-400 font-bold">combo multiplier</span></li>
                    <li>Wrong answers break your combo</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-cyan-400 font-black uppercase tracking-wider text-xs mb-2">
                    GAME MODES
                  </h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><span className="text-cyan-300 font-bold">Rush</span> — 60 seconds. Max score wins. 3 lives.</li>
                    <li><span className="text-purple-300 font-bold">Endless</span> — No timer. Play till you lose all lives.</li>
                    <li><span className="text-emerald-300 font-bold">Blitz</span> — 10 rounds with a tight timer. Fast and intense.</li>
                    <li><span className="text-red-300 font-bold">Chaos</span> — Random mode every round. Adapt or die.</li>
                    <li><span className="text-amber-300 font-bold">Survival</span> — Bank your score. One wrong answer and it resets to zero.</li>
                  </ul>
                </section>
              </div>

              <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShop && <ShopScreen onClose={() => setShowShop(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showLeaderboard && (
          <Leaderboard onClose={() => setShowLeaderboard(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTelemetry && (
          <TelemetryDashboard onClose={() => setShowTelemetry(false)} />
        )}
      </AnimatePresence>

      {/* CRT overlay */}
      <div className="crt-overlay fixed inset-0 opacity-[0.04]" />
    </div>
  );
}

interface MenuButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  disabled?: boolean;
  accent: string;
}

function MenuButton({
  icon,
  title,
  description,
  onClick,
  disabled = false,
  accent,
}: MenuButtonProps) {
  const accents = {
    cyan: "border-cyan-500/30 text-cyan-400 hover:border-cyan-500",
    purple: "border-purple-500/30 text-purple-400 hover:border-purple-500",
    emerald: "border-emerald-500/30 text-emerald-400 hover:border-emerald-500",
    red: "border-red-500/30 text-red-400 hover:border-red-500",
    amber: "border-amber-500/30 text-amber-400 hover:border-amber-500",
  };

  return (
    <motion.button
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`group relative p-[2px] bg-[#0d0d14] transition-all duration-300 rounded-[12px] shadow-lg ${disabled ? "cursor-not-allowed" : accents[accent as keyof typeof accents]}`}
    >
      <div className="h-full w-full bg-[#0d0d14] rounded-[10px] p-8 flex flex-col relative z-10 border border-white/5 items-center text-center overflow-hidden">
        {!disabled && (
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 1.5,
            }}
            className="absolute top-0 w-32 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none z-20"
          />
        )}

        <div className="flex items-center justify-center mb-6">
          <div
            className={`p-5 rounded-2xl bg-white/[0.03] border border-white/10 transition-all ${!disabled && "group-hover:bg-white/10 group-hover:scale-110 group-hover:border-current"}`}
          >
            {icon}
          </div>
        </div>

        <h3 className="text-3xl font-black italic mb-3 tracking-tight uppercase transition-colors group-hover:text-white">
          {title}
        </h3>
        <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-[260px]">
          {description}
        </p>

        {!disabled && (
          <div className="absolute bottom-6 right-6 w-8 h-8 opacity-10 group-hover:opacity-30 transition-opacity">
            <div className="absolute bottom-0 right-0 w-full h-[1px] bg-current" />
            <div className="absolute bottom-0 right-0 w-[1px] h-full bg-current" />
          </div>
        )}
      </div>
      {disabled && (
        <div className="absolute inset-0 rounded-[10px] bg-[#0a0a1a]/80 flex items-center justify-center z-30 pointer-events-none backdrop-blur-sm">
          <span className="arcade-title text-[8px] text-yellow-500" style={{ textShadow: '0 0 10px rgba(255,215,0,0.5)', animation: 'blink 1.5s step-end infinite' }}>INSERT COIN</span>
        </div>
      )}
    </motion.button>
  );
}
