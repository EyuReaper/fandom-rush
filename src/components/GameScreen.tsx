import { useEffect, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useGameStore } from "../stores/useGameStore";
import { authClient } from "../lib/auth-client";
import { API_URL } from "../lib/config";
import { TimeBar } from "./TimeBar";
import { ScoreDisplay } from "./ScoreDisplay";
import Leaderboard from "./Leaderboard";
import StarRating from "./StarRating";
import { Send, CheckCircle2 } from "lucide-react";
import SurvivalMode from "./SurvivalMode";
import {
  Heart,
  CheckCircle,
  XCircle,
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Zap,
} from "lucide-react";

export default function GameScreen() {
  const {
    currentClue,
    options,
    score,
    combo,
    lives,
    timeLeft,
    isPlaying,
    highScore,
    swipeMode,
    gameMode,
    selectedCategory,
    maxTime,
    selectAnswer,
    startGame,
    resetGame,
    chaosModifiers,
  } = useGameStore();

  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [activeKeyIndex, setActiveKeyIndex] = useState<number | null>(null);
  const [floatingPoints, setFloatingPoints] = useState<{
    points: number;
    id: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratingStatus, setRatingStatus] = useState<"idle" | "prompt" | "submitting" | "success" | "error" | "already_rated">("idle");
  const ratingCheckedRef = useRef(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const submittedRef = useRef(false);

  const { data: session } = authClient.useSession();

  // Swipe logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const isGameOver = !isPlaying && currentClue !== null;

  useEffect(() => {
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 10000);
    if (submittedRef.current) return;
    submittedRef.current = true;
    const submitGlobalScore = async () => {
      if (isGameOver && session && score > 0 && submitStatus === "idle" && !isSubmitting) {
        setIsSubmitting(true);
        try {
          const response = await fetch(`${API_URL}/api/leaderboard`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            signal: abortController.signal,
            body: JSON.stringify({
              score,
              gameMode,
              category: selectedCategory || "all",
            }),
          });
          if (response.ok) {
            setSubmitStatus("success");
          } else {
            setSubmitStatus("error");
          }
        } catch  {
          if (!abortController.signal.aborted) setSubmitStatus("error");
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    submitGlobalScore();
    return () => { clearTimeout(timeout); abortController.abort(); submittedRef.current = false; };

  }, [isGameOver, session, score, gameMode, selectedCategory, submitStatus, isSubmitting]);

  useEffect(() => {
    if (!isGameOver || !session || ratingCheckedRef.current) return;
    ratingCheckedRef.current = true;

    const userId = session.user.id;
    if (localStorage.getItem(`fandomRushRated_${userId}`)) return;

    const abortController = new AbortController();
    fetch(`${API_URL}/api/ratings/user`, {
      credentials: "include",
      signal: abortController.signal,
    })
      .then((res) => {
        if (abortController.signal.aborted) return;
        if (res.status === 404) setRatingStatus("prompt");
        else if (res.ok) {
          setRatingStatus("already_rated");
          localStorage.setItem(`fandomRushRated_${userId}`, "true");
        }
      })
      .catch(() => {});

    return () => abortController.abort();
  }, [isGameOver, session]);

  const submitRating = useCallback(async () => {
    if (!session || rating === 0) return;
    setRatingStatus("submitting");

    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 10000);

    try {
      const res = await fetch(`${API_URL}/api/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating, reviewText: reviewText || undefined }),
        signal: abortController.signal,
      });
      if (res.ok) {
        setRatingStatus("success");
        localStorage.setItem(`fandomRushRated_${session.user.id}`, "true");
      } else {
        setRatingStatus("error");
      }
    } catch {
      if (!abortController.signal.aborted) setRatingStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  }, [session, rating, reviewText]);

  const handleAnswer = useCallback((answer: string, index?: number) => {
    if (feedback || !answer || !currentClue) return;
    setSelectedOption(answer);
    if (index !== undefined) setActiveKeyIndex(index);

    const isCorrect = answer === currentClue?.correctAnswer;

    // Haptic Feedback
    if ("vibrate" in navigator) {
      if (isCorrect) navigator.vibrate(10); // Light tap for correct
      else navigator.vibrate([50, 30, 50]); // Double buzz for wrong
    }

    if (isCorrect) {
      setFeedback("correct");

      // Matching store logic for floating points
      const difficultyPoints =
        currentClue.difficulty === "easy"
          ? 10
          : currentClue.difficulty === "medium"
            ? 25
            : 50;

      const elapsed = maxTime - timeLeft;
      let speedBonus: number;
      if (gameMode !== "sixty-second") {
        if (elapsed < 2) speedBonus = 30;
        else if (elapsed < 3) speedBonus = 20;
        else speedBonus = 5;
      } else {
        speedBonus = 10;
      }

      const multiplier = 1 + Math.floor((combo + 1) / 5) * 0.3;
      const points = Math.floor((difficultyPoints + speedBonus) * multiplier);

      setFloatingPoints({ points, id: Date.now() });
    } else {
      setFeedback("wrong");
    }

    selectAnswer(answer);

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      setActiveKeyIndex(null);
      setFloatingPoints(null);
      x.set(0);
      y.set(0);
    }, 450);
  }, [feedback, currentClue, gameMode, timeLeft, maxTime, combo, selectAnswer, x, y]);

  // Keyboard Support
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!isPlaying || !options.length || feedback) return;

      const key = e.key.toLowerCase();
      const { invertedControls } = chaosModifiers;

      // 1-4 keys (usually not inverted as they are direct labels)
      const num = parseInt(key);
      if (num >= 1 && num <= 4) {
        handleAnswer(options[num - 1], num - 1);
        return;
      }

      // WASD / Arrow keys
      if (key === "w" || key === "arrowup") handleAnswer(options[invertedControls ? 3 : 0], invertedControls ? 3 : 0);
      if (key === "a" || key === "arrowleft") handleAnswer(options[invertedControls ? 2 : 1], invertedControls ? 2 : 1);
      if (key === "d" || key === "arrowright") handleAnswer(options[invertedControls ? 1 : 2], invertedControls ? 1 : 2);
      if (key === "s" || key === "arrowdown") handleAnswer(options[invertedControls ? 0 : 3], invertedControls ? 0 : 3);
    },
    [isPlaying, options, feedback, handleAnswer, chaosModifiers],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const onDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
    if (!swipeMode || feedback) return;

    const threshold = 100;
    const { offset } = info;
    const { invertedControls } = chaosModifiers;

    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x > threshold) handleAnswer(options[invertedControls ? 1 : 2], invertedControls ? 1 : 2); // Right
      else if (offset.x < -threshold) handleAnswer(options[invertedControls ? 2 : 1], invertedControls ? 2 : 1); // Left
    } else {
      if (offset.y > threshold) handleAnswer(options[invertedControls ? 0 : 3], invertedControls ? 0 : 3); // Down
      else if (offset.y < -threshold) handleAnswer(options[invertedControls ? 3 : 0], invertedControls ? 3 : 0); // Up
    }
  };

  // ====================== GAME OVER SCREEN ======================
  if (isGameOver) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white flex items-center justify-center p-6 relative overflow-hidden selection:bg-cyan-500 selection:text-black">
        {/* --- CYBER BACKGROUND --- */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #1a1a2e 1px, transparent 1px), linear-gradient(to bottom, #1a1a2e 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
          }}
        />

        {/* Dynamic Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="text-center max-w-lg w-full relative z-10"
        >
          {/* Header */}
          <div className="mb-12 relative">
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8"
            >
              <Trophy className="w-20 h-20 mx-auto text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]" />
            </motion.div>
            <h1 className="arcade-title text-6xl md:text-8xl tracking-[0.5em] text-white text-center leading-[1.2] mb-6" style={{ animation: 'blink 2s step-end infinite' }}>
              GAME OVER
            </h1>
          </div>

          {/* Stats Card */}
          <div className="bg-[#0d0d14]/80 backdrop-blur-3xl border border-white/10 rounded-[24px] p-10 mb-10 shadow-2xl relative overflow-hidden group text-left">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />

            <div className="mb-10">
              <p className="text-gray-500 text-[10px] font-black tracking-[0.4em] uppercase mb-4">SCORE TALLY</p>
              <div className="relative inline-block">
                <p className="text-8xl font-black text-white tabular-nums tracking-tighter leading-none">
                  {score.toLocaleString()}
                </p>
                {score > 0 && score === highScore && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: -10 }}
                    className="absolute -top-10 -right-20 bg-yellow-400 text-black text-[9px] font-black px-4 py-1.5 rounded-full shadow-[0_5px_20px_rgba(250,204,21,0.4)] uppercase tracking-widest"
                  >
                    NEW HIGH SCORE!
                  </motion.div>
                )}
              </div>
            </div>

            {/* Rating Prompt */}
            {(ratingStatus === "prompt" || ratingStatus === "submitting" || ratingStatus === "error") && (
              <div className="bg-[#0d0d14]/80 backdrop-blur-3xl border border-white/10 rounded-[24px] p-8 mb-10 relative overflow-hidden text-left">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50" />
                <p className="text-gray-500 text-[10px] font-black tracking-[0.4em] uppercase mb-6">
                  RATE THIS MISSION
                </p>
                {ratingStatus !== "submitting" && (
                  <>
                    <div className="flex justify-center mb-6">
                      <StarRating value={rating} variant="row" onChange={setRating} />
                    </div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Leave a review (optional)..."
                      rows={3}
                      maxLength={500}
                      className="w-full bg-[#050508] border border-white/10 rounded-xl p-4 text-sm text-white/70 placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 resize-none mb-4"
                    />
                  </>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={submitRating}
                  disabled={rating === 0 || ratingStatus === "submitting"}
                  className="w-full py-4 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 text-xs font-black uppercase tracking-widest transition-all hover:bg-cyan-500/30 disabled:opacity-40"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  {ratingStatus === "submitting" ? "TRANSMITTING..." : "TRANSMIT RATING"}
                </motion.button>
                {ratingStatus === "error" && (
                  <p className="text-red-400 text-[10px] font-bold mt-3 text-center uppercase tracking-wider">
                    Transmission failed. Try again.
                  </p>
                )}
              </div>
            )}

            {ratingStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0d0d14]/80 backdrop-blur-3xl border border-green-500/20 rounded-[24px] p-6 mb-10 relative overflow-hidden text-center"
              >
                <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-green-400 font-black tracking-wider uppercase text-sm">
                  Rating Transmitted
                </p>
              </motion.div>
            )}

            {/* Global Leaderboard Access */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowLeaderboard(true)}
                className="mb-10 py-5 px-6 bg-white/[0.03] hover:bg-white/[0.06] cursor-pointer transition-all rounded-2xl border border-white/5 flex items-center justify-between group/btn"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover/btn:border-yellow-500/40 transition-colors">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] leading-tight">Global Rankings</p>
                        {!session ? (
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">Sign in to join the elite</p>
                        ) : submitStatus === "success" ? (
                            <p className="text-[9px] font-bold text-green-400 uppercase tracking-tight mt-0.5 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Mission Data Uploaded
                            </p>
                        ) : submitStatus === "error" ? (
                            <p className="text-[9px] font-bold text-red-400 uppercase tracking-tight mt-0.5">Upload Failed</p>
                        ) : (
                            <p className="text-[9px] font-bold text-cyan-400/50 uppercase tracking-tight mt-0.5 animate-pulse">Synchronizing rankings...</p>
                        )}
                    </div>
                </div>
                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest group-hover/btn:translate-x-1 transition-transform">
                    Expand →
                </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-10 pt-8 border-t border-white/5">
              <div>
                <p className="text-gray-500 text-[9px] uppercase font-black tracking-[0.4em] mb-3">Peak Combo</p>
                <p className="text-4xl font-black italic text-white leading-none">×{combo}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-[9px] uppercase font-black tracking-[0.4em] mb-3">Personal Best</p>
                <p className="text-4xl font-black italic text-white/60 leading-none">
                  {highScore.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-5">
            <motion.button
              whileHover={{ scale: 1.02, skewX: "-3deg" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startGame(gameMode, selectedCategory || undefined)}
              className="relative p-[2px] transition-all duration-300 group"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
               <div className="relative py-6 bg-cyan-500 hover:bg-cyan-400 text-black text-xl font-black italic rounded-xl shadow-2xl transition-all uppercase tracking-tighter flex items-center justify-center gap-4">
                  <Zap className="w-6 h-6 fill-black" />
                  INSERT COIN
               </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetGame}
              className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 transition-all"
            >
              BACK TO TITLE SCREEN
            </motion.button>
          </div>
        </motion.div>
        {/* CRT overlay */}
        <div className="crt-overlay fixed inset-0 opacity-[0.04]" />

        {/* Vignette */}
        <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)' }} />
      </div>
    );
  }

  if (gameMode === "survival" && isPlaying) {
    return <SurvivalMode />;
  }

  if (!currentClue) return null;

  // ====================== MAIN GAME ======================
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden relative selection:bg-cyan-500/30">
      {/* Background Ambience */}
      <div className={`absolute inset-0 transition-colors duration-500 pointer-events-none ${
        feedback === 'correct' ? 'bg-green-500/10' : feedback === 'wrong' ? 'bg-red-500/10' : 'bg-transparent'
      }`} />

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-[#0a0a1a] to-transparent">
        <div className="flex items-center gap-6">
          {gameMode !== 'sixty-second' && (
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">CREDITS</span>
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 transition-all duration-300 ${i < lives ? "text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "text-gray-800"}`}
                />
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1">
             {gameMode === 'category' && (
              <div className="text-[10px] font-black uppercase tracking-widest text-cyan-500">
                Category: {selectedCategory}
              </div>
            )}
            <TimeBar timeLeft={timeLeft} maxTime={maxTime} />
          </div>
        </div>
        <ScoreDisplay score={score} combo={combo} />
      </div>

      {/* Main Game Area */}
      <div className="h-full min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6">
        <div className="w-full max-w-xl relative">
          {/* Combo Streak Indicator */}
          <AnimatePresence>
            {combo >= 5 && !feedback && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
              >
                <div className="bg-orange-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(249,115,22,0.4)] animate-bounce">
                  Hot Streak
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentClue.id}
              style={{ x, y, rotate, opacity }}
              drag={swipeMode && !feedback}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              onDragEnd={onDragEnd}
              whileDrag={{ scale: 1.05, cursor: "grabbing" }}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={chaosModifiers.movingTargets ? {
                scale: 1,
                opacity: 1,
                y: [0, -15, 15, 0],
                x: [0, 15, -15, 0],
                transition: {
                  y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                  x: { repeat: Infinity, duration: 2.5, ease: "easeInOut" },
                }
              } : { scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
              className={`relative z-20 ${swipeMode ? 'cursor-grab' : ''}`}
            >
              <div
                className={`bg-[#0d0d14]/80 backdrop-blur-2xl border-2 rounded-[24px] p-8 md:p-12 flex items-center justify-center min-h-[360px] md:min-h-[460px] transition-all duration-300 shadow-2xl relative overflow-hidden group ${
                  feedback === "correct"
                    ? "border-green-500 shadow-green-500/20"
                    : feedback === "wrong"
                      ? "border-red-500 shadow-red-500/20 animate-shake"
                      : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Background Atmosphere */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>

                {/* Object Glow */}
                <div className="absolute inset-0 bg-cyan-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <img
                  src={currentClue.imagePath}
                  alt={currentClue.objectName}
                  style={{ filter: chaosModifiers.blurryClues ? "blur(10px)" : "none" }}
                  className="max-h-[240px] md:max-h-[340px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 transition-all duration-500 group-hover:scale-105"
                />

                {/* Wrong Overlay */}
                <AnimatePresence>
                  {feedback === "wrong" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-red-500/20 flex items-center justify-center z-20 backdrop-blur-sm"
                    >
                      <XCircle className="w-32 h-32 text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tactical Corner Accents */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/20" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/20" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/20" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/20" />
              </div>

              {/* Swipe Direction Indicators */}
              {swipeMode && !feedback && (
                <div className="absolute inset-0 pointer-events-none hidden md:block">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
                    <ArrowUp className="w-6 h-6" />
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">{options[0]}</span>
                  </div>
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">{options[3]}</span>
                    <ArrowDown className="w-6 h-6" />
                  </div>
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-1 text-white/40 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                    <ArrowLeft className="w-6 h-6 rotate-90" />
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">{options[1]}</span>
                  </div>
                   <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 text-white/40" style={{ writingMode: 'vertical-rl' }}>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase">{options[2]}</span>
                    <ArrowRight className="w-6 h-6 -rotate-90" />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Multiple Choice Grid */}
          {!swipeMode && (
            <div className="grid grid-cols-2 gap-4 mt-8 md:mt-12 relative z-30">
              {options.map((option, index) => {
                const isSelected = selectedOption === option;
                const isCorrectOption = option === currentClue.correctAnswer;
                const isPressed = activeKeyIndex === index;

                return (
                  <motion.button
                    key={option}
                    whileHover={!feedback ? { scale: 1.02, skewX: "-2deg" } : {}}
                    whileTap={!feedback ? { scale: 0.98 } : {}}
                    animate={isPressed ? { scale: 0.95, backgroundColor: "rgba(255, 255, 255, 0.1)" } : {}}
                    onClick={() => handleAnswer(option, index)}
                    disabled={!!feedback}
                    className={`group relative bg-[#0d0d14]/80 backdrop-blur-xl border-2 rounded-[12px] p-6 md:p-8 text-left transition-all ${
                      isSelected && feedback === "correct"
                        ? "border-green-500 bg-green-500/20"
                        : isSelected && feedback === "wrong"
                          ? "border-red-500 bg-red-500/20"
                          : isCorrectOption && feedback
                            ? "border-green-500/50 bg-green-500/5"
                            : isPressed
                              ? "border-cyan-400 bg-white/10 shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)]"
                              : "border-white/10 hover:border-cyan-400 hover:bg-white/10 shadow-[0_4px_0_rgba(0,0,0,0.3)]"
                    }`}
                  >
                    <span className="absolute top-4 right-4 bg-white/5 text-[9px] w-6 h-6 flex items-center justify-center rounded-sm border border-white/10 font-black">
                      {index + 1}
                    </span>
                    <span className="block text-xl md:text-2xl font-black italic tracking-tighter uppercase">{option}</span>

                    {isSelected && feedback === "correct" && (
                      <CheckCircle className="absolute bottom-4 right-4 text-green-500 w-6 h-6" />
                    )}
                    {isSelected && feedback === "wrong" && (
                      <XCircle className="absolute bottom-4 right-4 text-red-500 w-6 h-6" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Points */}
      <AnimatePresence>
        {floatingPoints && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{ opacity: 1, y: -120, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
          >
            <span className="text-7xl md:text-9xl font-black italic text-green-400 drop-shadow-[0_0_30px_rgba(74,222,128,0.5)] tracking-tighter">
              +{floatingPoints.points}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Help */}
      <KeyboardHelp />

      <AnimatePresence>
        {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      </AnimatePresence>

      {/* CRT overlay */}
      <div className="crt-overlay fixed inset-0 opacity-[0.04]" />

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)' }} />
    </div>
  );
}

function KeyboardHelp() {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const show = () => {
      setVisible(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 3000);
    };

    show();
    window.addEventListener("keydown", show);
    window.addEventListener("mousedown", show);
    window.addEventListener("touchstart", show);

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("keydown", show);
      window.removeEventListener("mousedown", show);
      window.removeEventListener("touchstart", show);
    };
  }, []);

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
      transition={{ duration: 0.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white/30 text-[10px] font-black uppercase tracking-widest flex gap-4"
    >
      <div className="flex gap-2">
        Pick: <span className="text-cyan-400 font-black">1-4</span>
      </div>
      <div className="w-px h-3 bg-white/10" />
      <div className="flex gap-2">
        Control: <span className="text-cyan-400 font-black">W A S D</span> / <span className="text-cyan-400 font-black">ARROWS</span>
      </div>
    </motion.div>
  );
}
