import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../stores/useGameStore";
import { audioManager } from "../lib/audioManager";
import { authClient } from "../lib/auth-client";
import LoginButton from "./LoginButton";
import Leaderboard from "./Leaderboard";
import {
  Zap,
  Clock,
  Tv,
  LayoutGrid,
  ChevronLeft,
  Target,
  Settings,
  Globe,
  X,
  Info,
  Volume2,
  VolumeX,
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
  } = useGameStore();
  const [showCategories, setShowCategories] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const claimScore = async () => {
      if (session && highScore > 0) {
        // Check if we've already claimed this score to avoid redundant API calls
        const hasClaimed = localStorage.getItem(
          `fandomRushClaimed_${session.user.id}`,
        );
        if (hasClaimed === highScore.toString()) return;

        try {
          await authClient.fetch(
            "http://localhost:3000/api/leaderboard/claim",
            {
              method: "POST",
              body: {
                score: highScore,
                gameMode: "endless", // Default for legacy high scores
                category: "all",
              },
            },
          );
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
  }, [session, highScore]);

  const handleInteraction = useCallback(() => {
    audioManager.playBGM(isMuted);
  }, [isMuted]);

  useEffect(() => {
    // If we're not playing, we should be hearing the BGM
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
      id: "tv-shows",
      name: "TV Shows",
      icon: "📺",
      color: "from-emerald-500 to-teal-400",
      glow: "shadow-emerald-500/20",
      disabled: true,
    },
    {
      id: "cartoons",
      name: "Cartoons",
      icon: "🎨",
      color: "from-yellow-400 to-orange-500",
      glow: "shadow-yellow-500/20",
      disabled: true,
    },
    {
      id: "games",
      name: "Games",
      icon: "🎮",
      color: "from-fuchsia-500 to-purple-600",
      glow: "shadow-fuchsia-500/20",
      disabled: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* --- CYBER BACKGROUND --- */}
      {/* Animated Grid */}
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
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"
      />

      {/* --- TOP HUD --- */}
      <div className="absolute top-8 left-8 right-8 z-[100] flex justify-between items-start">
        <LoginButton />

        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ rotate: 90, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSettings(true)}
          className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-colors shadow-2xl"
        >
          <Settings className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {!showCategories ? (
          <motion.div
            key="main-menu"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center w-full max-w-5xl relative z-10"
          >
            {/* --- HEADER --- */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-8 relative item-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-[10px] font-black tracking-[0.3em] mb-6 uppercase backdrop-blur-md">
                <Target className="w-3 h-3 animate-pulse" />
                An arcade guessing game
              </div>

              <div className="relative group">
                {/* Logo with Asteroid O drop */}
                <h1 className="text-4xl md:text-8xl font-black italic tracking-tighter leading-none mb-4 relative z-10 flex items-baseline justify-center">
                  <span className="text-white flex items-baseline">
                    FAND
                    <motion.span
                      initial={{
                        y: -500,
                        x: -200,
                        opacity: 0,
                        scale: 2,
                        rotate: -20,
                      }}
                      animate={{ y: 0, x: 0, opacity: 1, scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        damping: 18,
                        stiffness: 100,
                        delay: 0.6,
                      }}
                      className="inline-block w-[0.85em] h-[0.85em] self-center mx-[0.05em] relative"
                    >
                      {/* Logo asteroid tail effect */}
                      <motion.div
                        animate={{
                          height: [40, 120, 40],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{ duration: 0.4, repeat: Infinity }}
                        className="absolute -top-24 left-12 -translate-x-1/2 w-10 bg-gradient-to-t from-cyan-400/60 to-transparent blur-xl pointer-events-none"
                      />
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Fandom_heart-logo.svg"
                        alt="Fandom Logo"
                        className="w-full h-full object-contain brightness-0 invert drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                      />
                    </motion.span>
                    M
                  </span>
                  <span className=" text-transparent bg-clip-text bg-gradient-to-b from-pink-600 to-yellow-300 drop-shadow-[0_0_30px_rgba(219,39,119,0.3)] ">
                    RUSH &nbsp;
                  </span>
                </h1>
                <div className="absolute -inset-1 text-4xl md:text-8xl font-black italic tracking-tighter leading-none mb-4 opacity-20 blur-[2px] text-cyan-500 -translate-x-1 group-hover:-translate-x-2 transition-transform select-none pointer-events-none">
                  FAND M RUSH
                </div>{" "}
              </div>

              {/* Flamey Rush Animation Container */}
              <div className="relative py-4 overflow-hidden">
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
                <p className="text-gray-400 text-xl font-medium max-w-xl mx-auto leading-relaxed relative z-10">
                  Identify iconic objects at lightning speed. <br />
                  <span className="text-cyan-500/80 text-xs font-black uppercase tracking-[0.4em] italic flex items-center justify-center gap-3 mt-4">
                    <span className="w-4 h-[1px] bg-cyan-500/40" />
                    you think you're a fan? lets put that to test!
                    <span className="w-4 h-[1px] bg-cyan-500/40" />
                  </span>
                </p>
              </div>
            </motion.div>

            {/* --- TOP STATS --- */}
            <motion.div
              variants={itemVariants}
              onClick={() => setShowLeaderboard(true)}
              className="group relative bg-[#10101a]  p-6 mb-8 w-full max-w-md overflow-hidden cursor-pointer active:scale-95 transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="bg-[#0a0a0f] rounded-[10px] p-6 flex items-center gap-6 relative z-10 border border-white/5">
                <div className="relative">
                  <div className="w-15 h-15 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/30">
                    <Globe className="text-yellow-500 w-8 h-8 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                    RANK
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] mb-1">
                    Global High Score
                  </p>
                  <p className="text-4xl font-black text-white tabular-nums tracking-tighter leading-none">
                    {highScore.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* --- GAME MODES --- */}
            <div className="grid grid-cols-1 md:grid-cols-2  gap-6 w-full ">
              <MenuButton
                className="rounded-[10px]"
                icon={<Zap className="w-8 h-8 " />}
                title="Endless Rush"
                description="The ultimate survival test. 3 lives. Infinite glory."
                color="cyan"
                onClick={() => startGame("endless")}
                accent="cyan"
              />
              <MenuButton
                icon={<Clock className="w-8 h-8" />}
                title="60-Second Rush"
                description="Maximum intensity. How many can you get before zero?"
                color="purple"
                onClick={() => startGame("sixty-second")}
                accent="purple"
              />
              <MenuButton
                icon={<Tv className="w-8 h-8" />}
                title="Category Rush"
                description="Master your specific domains. Anime, Movies, and more."
                color="emerald"
                onClick={() => setShowCategories(true)}
                accent="emerald"
              />
              <MenuButton
                icon={<LayoutGrid className="w-8 h-8" />}
                title="Chaos Mode"
                description="Random modifiers. Moving targets. Pure insanity."
                color="red"
                onClick={() => startGame("chaos")}
                accent="red"
              />
            </div>

            {/* --- FOOTER --- */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col items-center gap-6"
            >
              <div className="text-gray-600 text-[9px] font-black uppercase tracking-[0.5em] mt-4">
                © 2026 FANDOM RUSH // an EyuReaper game
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="categories"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-6xl relative z-10"
          >
            <div className="flex items-center justify-between mb-16">
              <div>
                <button
                  onClick={() => setShowCategories(false)}
                  className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all mb-4 font-black uppercase tracking-[0.2em] text-[10px]"
                >
                  <div className="p-2 rounded-full border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                  to Main menu
                </button>
                <h2 className="text-6xl md:text-7xl font-black italic tracking-tighter leading-none">
                  SELECT{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    DOMAIN &nbsp;
                  </span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  className={`relative group h-32 rounded-[40px] overflow-hidden border-2 transition-all p-1 ${
                    cat.disabled
                      ? "opacity-30 grayscale border-white/5 cursor-not-allowed bg-white/[0.02]"
                      : `border-white/5 hover:border-white/20 shadow-2xl ${cat.glow}`
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-5 group-hover:opacity-20 transition-opacity`}
                  />

                  {/* Category Card Inner */}
                  <div className="h-full w-full bg-[#0d0d14] rounded-[23px] flex items-center p-6 relative z-10 border border-white/5 overflow-hidden">
                    {" "}
                    <div
                      className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${cat.color} p-[1px] mb-6 group-hover:rotate-6 transition-transform`}
                    >
                      <div className="w-full h-full bg-[#0d0d14] rounded-[15px] flex items-center justify-center text-3xl">
                        {cat.icon}
                      </div>
                    </div>
                    <span className="text-3xl font-black italic tracking-tight uppercase group-hover:text-white transition-colors">
                      {cat.name}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SETTINGS & ABOUT OVERLAY --- */}
      {/* --- SETTINGS & ABOUT OVERLAY --- */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            {/* Ultra-clear glass backdrop */}
            <div
              className="absolute inset-0 bg-[#050508]/60 backdrop-blur-md"
              onClick={() => setShowSettings(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateX: 10 }}
              className="relative w-full max-w-xl bg-[#0d0d14]/80 border border-cyan-500/20 rounded-[10px] shadow-[0_0_50px_rgba(6,182,212,0.1)] overflow-hidden"
            >
              {/* Subtle scanning line effect on the dialog */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-[pulse_4s_infinite]" />

              {/* Header - Tactical Style */}
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-cyan-500 rounded-full animate-pulse" />
                  <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                      Settings <span className="text-cyan-400">Config</span>
                    </h2>
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em]">
                      customize your experience.
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

              <div className="p-8 space-y-8">
                {/* Gameplay Section */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-4 h-4 text-cyan-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500/60">
                      Input controls
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl mb-4">
                    <span className="text-sm font-bold uppercase italic tracking-wider">
                      Swipe Mechanics
                    </span>
                    <button
                      onClick={toggleSwipeMode}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 border ${
                        swipeMode
                          ? "bg-cyan-500/20 border-cyan-500"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <motion.div
                        animate={{ x: swipeMode ? 24 : 4 }}
                        className={`absolute top-1 w-4 h-4 rounded-full ${swipeMode ? "bg-cyan-400" : "bg-gray-600"}`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-cyan-400" />
                      )}
                      <span className="text-sm font-bold uppercase italic tracking-wider">
                        Audio {isMuted ? "(Muted)" : "(On)"}
                      </span>
                    </div>
                    <button
                      onClick={toggleMute}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 border ${
                        !isMuted
                          ? "bg-cyan-500/20 border-cyan-500"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <motion.div
                        animate={{ x: !isMuted ? 24 : 4 }}
                        className={`absolute top-1 w-4 h-4 rounded-full ${!isMuted ? "bg-cyan-400" : "bg-gray-600"}`}
                      />
                    </button>
                  </div>
                </section>

                {/* About Section - Compact & Sharp */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-4 h-4 text-pink-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-500/60">
                      About Game
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                      <p className="text-xs text-gray-400 leading-relaxed">
                        <span className="text-white font-bold italic">
                          FANDOM RUSH
                        </span>{" "}
                        is an arcade game built for elite fans. Designed to make
                        you say "hey i have seen this before". Don't forget to
                        support the developer,And Thank you for playing!
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-center">
                        <p className="text-[7px] font-black text-gray-600 uppercase tracking-tighter">
                          Developer
                        </p>
                        <p className="text-xs font-bold italic text-cyan-400/80">
                          @EyuReaper
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer Accent */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLeaderboard && (
          <Leaderboard onClose={() => setShowLeaderboard(false)} />
        )}
      </AnimatePresence>
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
  className?: string;
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
    cyan: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400 group-hover:border-cyan-500",
    purple:
      "from-purple-500/20 to-fuchsia-500/20 border-purple-500/30 text-purple-400 group-hover:border-purple-500",
    emerald:
      "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400 group-hover:border-emerald-500",
    red: "from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400 group-hover:border-red-500",
  };

  return (
    <motion.button
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
      whileHover={!disabled ? { scale: 1.02, skewX: "-3deg" } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`relative p-[2px] transition-all duration-300 skew-x-[5deg] ${
        disabled
          ? "opacity-20 grayscale border-gray-800 bg-gray-900/20 cursor-not-allowed"
          : accents[accent as keyof typeof accents]
      }`}
    >
      <div
        className={`h-full w-full bg-[#0d0d14] rounded-[8px] p-5 flex flex-col relative z-10 border border-white/5 items-center text-center skew-x-[-10deg] mt-[-5px]`}
      >
        {/* Scanner Light Effect */}
        {!disabled && (
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "200%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 2,
            }}
            className="absolute top-0 w-24 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
          />
        )}

        <div className="flex items-start justify-between mb-6">
          <div
            className={`p-4 rounded-2xl bg-white/[0.03] border border-white/10 transition-all ${!disabled && "group-hover:bg-white/10 group-hover:scale-110 group-hover:border-current"}`}
          >
            {icon}
          </div>
        </div>

        <h3 className="text-3xl font-black italic mb-2 tracking-tight uppercase transition-colors group-hover:text-white">
          {title}
        </h3>
        <p className="text-sm font-medium text-gray-500 leading-relaxed ">
          {description}
        </p>

        {/* Decorative corner element */}
        {!disabled && (
          <div className="absolute bottom-4 right-4 w-8 h-8 opacity-10 group-hover:opacity-30 transition-opacity">
            <div className="absolute bottom-0 right-0 w-full h-[1px] bg-current" />
            <div className="absolute bottom-0 right-0 w-[1px] h-full bg-current" />
          </div>
        )}
      </div>
    </motion.button>
  );
}
