import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useGameStore } from "../stores/useGameStore";
import { TimeBar } from "./TimeBar";
import { ScoreDisplay } from "./ScoreDisplay";
import {
  Heart,
  CheckCircle,
  XCircle,
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
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
  } = useGameStore();

  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [floatingPoints, setFloatingPoints] = useState<{
    points: number;
    id: number;
  } | null>(null);

  // Swipe logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const isGameOver = !isPlaying && currentClue !== null;

  const handleAnswer = useCallback((answer: string) => {
    if (feedback || !answer || !currentClue) return;
    setSelectedOption(answer);

    const isCorrect = answer === currentClue?.correctAnswer;
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
      let speedBonus = 0;
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
      
      // 1-4 keys
      const num = parseInt(key);
      if (num >= 1 && num <= 4) {
        handleAnswer(options[num - 1]);
        return;
      }

      // WASD / Arrow keys
      if (key === "w" || key === "arrowup") handleAnswer(options[0]);
      if (key === "a" || key === "arrowleft") handleAnswer(options[1]);
      if (key === "d" || key === "arrowright") handleAnswer(options[2]);
      if (key === "s" || key === "arrowdown") handleAnswer(options[3]);
    },
    [isPlaying, options, feedback, swipeMode, handleAnswer],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const onDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
    if (!swipeMode || feedback) return;

    const threshold = 100;
    const { offset } = info;

    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x > threshold) handleAnswer(options[2]); // Right
      else if (offset.x < -threshold) handleAnswer(options[1]); // Left
    } else {
      if (offset.y > threshold) handleAnswer(options[3]); // Down
      else if (offset.y < -threshold) handleAnswer(options[0]); // Up
    }
  };

  // ====================== GAME OVER SCREEN ======================
  if (isGameOver) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full relative z-10"
        >
          <div className="mb-8">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Trophy className="w-24 h-24 mx-auto text-yellow-400 mb-4" />
            </motion.div>
            <h1 className="text-7xl font-black italic text-red-500 tracking-tighter uppercase leading-none">
              Game <br/>Over
            </h1>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[40px] p-10 mb-10 shadow-2xl">
            <div className="mb-6">
              <p className="text-gray-500 text-xs font-black tracking-[0.3em] uppercase mb-2">Final Score</p>
              <div className="relative inline-block">
                <p className="text-7xl font-black text-cyan-400 tabular-nums tracking-tighter">
                  {score.toLocaleString()}
                </p>
                {score > 0 && score === highScore && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: -10 }}
                    className="absolute -top-6 -right-12 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-[0_5px_15px_rgba(250,204,21,0.4)] uppercase tracking-widest"
                  >
                    New Record!
                  </motion.div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div className="text-left">
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">Max Combo</p>
                <p className="text-3xl font-black italic">×{combo}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">Best Score</p>
                <p className="text-3xl font-black italic text-white/80">
                  {highScore.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startGame(gameMode, selectedCategory || undefined)}
              className="w-full py-6 bg-cyan-500 hover:bg-cyan-400 text-black text-2xl font-black italic rounded-2xl shadow-[0_10px_30px_rgba(6,182,212,0.4)] transition-all"
            >
              PLAY AGAIN
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-black uppercase tracking-widest text-gray-500"
            >
              Back to Menu
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentClue) return null;

  // ====================== MAIN GAME ======================
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative selection:bg-cyan-500/30">
      {/* Background Ambience */}
      <div className={`absolute inset-0 transition-colors duration-500 pointer-events-none ${
        feedback === 'correct' ? 'bg-green-500/10' : feedback === 'wrong' ? 'bg-red-500/10' : 'bg-transparent'
      }`} />

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-[#0a0a0f] to-transparent">
        <div className="flex items-center gap-6">
          {gameMode !== 'sixty-second' && (
            <div className="flex gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-6 h-6 transition-all duration-300 ${i < lives ? "text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "text-gray-800"}`}
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
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
              className={`relative z-20 ${swipeMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              <div
                className={`bg-white/5 backdrop-blur-2xl border-2 rounded-[40px] p-8 md:p-12 flex items-center justify-center min-h-[360px] md:min-h-[460px] transition-all duration-300 shadow-2xl relative overflow-hidden group ${
                  feedback === "correct"
                    ? "border-green-500 shadow-green-500/20"
                    : feedback === "wrong"
                      ? "border-red-500 shadow-red-500/20 animate-shake"
                      : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Object Glow */}
                <div className="absolute inset-0 bg-cyan-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <img
                  src={currentClue.imagePath}
                  alt={currentClue.objectName}
                  className="max-h-[240px] md:max-h-[340px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10"
                />

                {/* Wrong Overlay */}
                <AnimatePresence>
                  {feedback === "wrong" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-red-500/20 flex items-center justify-center z-20"
                    >
                      <XCircle className="w-32 h-32 text-red-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Swipe Direction Indicators */}
              {swipeMode && !feedback && (
                <div className="absolute inset-0 pointer-events-none hidden md:block">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
                    <ArrowUp className="w-6 h-6" />
                    <span className="text-[10px] font-black tracking-widest uppercase">{options[0]}</span>
                  </div>
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
                    <span className="text-[10px] font-black tracking-widest uppercase">{options[3]}</span>
                    <ArrowDown className="w-6 h-6" />
                  </div>
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-1 text-white/40 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                    <ArrowLeft className="w-6 h-6 rotate-90" />
                    <span className="text-[10px] font-black tracking-widest uppercase">{options[1]}</span>
                  </div>
                   <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 text-white/40" style={{ writingMode: 'vertical-rl' }}>
                    <span className="text-[10px] font-black tracking-widest uppercase">{options[2]}</span>
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

                return (
                  <motion.button
                    key={option}
                    whileHover={!feedback ? { scale: 1.05, y: -5 } : {}}
                    whileTap={!feedback ? { scale: 0.95 } : {}}
                    onClick={() => handleAnswer(option)}
                    disabled={!!feedback}
                    className={`group relative bg-white/5 backdrop-blur-xl border-2 rounded-[24px] p-6 md:p-8 text-left transition-all ${
                      isSelected && feedback === "correct"
                        ? "border-green-500 bg-green-500/20"
                        : isSelected && feedback === "wrong"
                          ? "border-red-500 bg-red-500/20"
                          : isCorrectOption && feedback
                            ? "border-green-500/50 bg-green-500/5"
                            : "border-white/10 hover:border-cyan-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="absolute top-4 right-4 bg-white/5 text-[10px] w-6 h-6 flex items-center justify-center rounded-full border border-white/10 font-black">
                      {index + 1}
                    </span>
                    <span className="block text-lg md:text-xl font-black italic tracking-tight uppercase">{option}</span>

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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white/30 text-[10px] font-black uppercase tracking-widest flex gap-4">
        <div>
          Keys: <span className="text-cyan-400">1-4</span>
        </div>
        {swipeMode && (
          <>
            <div className="w-px h-3 bg-white/10" />
            <div>
              Swipe: <span className="text-cyan-400">W A S D</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
