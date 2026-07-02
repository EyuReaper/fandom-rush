import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../stores/useGameStore";
import { TimeBar } from "./TimeBar";
import { ScoreDisplay } from "./ScoreDisplay";
import {
  Heart,
  Shield,
  TrendingUp,
  Crown,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function SurvivalMode() {
  const {
    currentClue,
    options,
    score,
    combo,
    lives,
    timeLeft,
    maxTime,
    swipeMode,
    bankedScore,
    streak,
    escalationLevel,
    selectAnswer,
  } = useGameStore();

  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [floatingPoints, setFloatingPoints] = useState<{ points: number; id: number } | null>(null);

  const handleAnswer = (answer: string) => {
    if (feedback || !answer || !currentClue) return;
    setSelectedOption(answer);

    const isCorrect = answer === currentClue.correctAnswer;

    if ("vibrate" in navigator) {
      if (isCorrect) navigator.vibrate(10);
      else navigator.vibrate([50, 30, 50]);
    }

    if (isCorrect) {
      setFeedback("correct");
      const difficultyPoints =
        currentClue.difficulty === "easy" ? 10
        : currentClue.difficulty === "medium" ? 25 : 50;
      const elapsed = maxTime - timeLeft;
      const speedBonus = elapsed < 2 ? 30 : elapsed < 3 ? 20 : 5;
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
    }, 450);
  };

  // Keyboard support (same as GameScreen)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!options.length || feedback) return;
      const key = e.key.toLowerCase();
      const num = parseInt(key);
      if (num >= 1 && num <= 4) {
        handleAnswer(options[num - 1]);
        return;
      }
      if (key === "w" || key === "arrowup") handleAnswer(options[0]);
      if (key === "a" || key === "arrowleft") handleAnswer(options[1]);
      if (key === "d" || key === "arrowright") handleAnswer(options[2]);
      if (key === "s" || key === "arrowdown") handleAnswer(options[3]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, feedback]);

  if (!currentClue) return null;

  const nextBankAt = 5 - ((streak) % 5);
  const isBankProtected = bankedScore > 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative selection:bg-yellow-500 selection:text-black">
      {/* Amber/gold background glow for survival mode */}
      <div className={`absolute inset-0 transition-colors duration-500 pointer-events-none ${
        feedback === 'correct' ? 'bg-yellow-500/10' : feedback === 'wrong' ? 'bg-red-500/10' : 'bg-amber-900/5'
      }`} />

      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-[#0a0a0f] to-transparent">
        <div className="flex items-center gap-6">
          {/* Lives — 6 hearts */}
          <div className="flex gap-1 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
            {Array.from({ length: 6 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 transition-all duration-300 ${
                  i < lives
                    ? "text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    : "text-gray-800"
                }`}
              />
            ))}
          </div>

          {/* Escalation Level */}
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-xl">
            <TrendingUp className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-black text-yellow-400">LV.{escalationLevel}</span>
          </div>

          {/* Banked Score */}
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
            <Shield className={`w-4 h-4 ${isBankProtected ? "text-amber-400" : "text-gray-600"}`} />
            <span className={`text-xs font-black ${isBankProtected ? "text-amber-400" : "text-gray-600"}`}>
              {bankedScore.toLocaleString()}
            </span>
          </div>

          <TimeBar timeLeft={timeLeft} maxTime={maxTime} />
        </div>

        <ScoreDisplay score={score} combo={combo} />
      </div>

      {/* Main Game Area */}
      <div className="h-full min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6">
        <div className="w-full max-w-xl relative">
          {/* Survival Mode Header */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-[9px] font-black tracking-[0.3em] uppercase">
              <Crown className="w-3 h-3" />
              Survival Mode
            </div>
            {/* Bank progress */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all ${
                      step <= (streak % 5)
                        ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]"
                        : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                {nextBankAt === 0 ? "BANKING..." : `${nextBankAt} to bank`}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentClue.id}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, filter: "blur(10px)" }}
              className="relative z-20"
            >
              <div
                className={`bg-[#0d0d14]/80 backdrop-blur-2xl border-2 rounded-[24px] p-8 md:p-12 flex items-center justify-center min-h-[360px] md:min-h-[460px] transition-all duration-300 shadow-2xl relative overflow-hidden ${
                  feedback === "correct"
                    ? "border-yellow-500 shadow-yellow-500/20"
                    : feedback === "wrong"
                      ? "border-red-500 shadow-red-500/20 animate-shake"
                      : "border-amber-500/20 hover:border-amber-500/40"
                }`}
              >
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:20px_20px]" />
                </div>
                <div className="absolute inset-0 bg-amber-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <img
                  src={currentClue.imagePath}
                  alt={currentClue.objectName}
                  className="max-h-[240px] md:max-h-[340px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 transition-all duration-500 group-hover:scale-105"
                />

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
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Option Buttons */}
          {!swipeMode && (
            <div className="grid grid-cols-2 gap-4 mt-8 md:mt-12 relative z-30">
              {options.map((option) => {
                const isSelected = selectedOption === option;
                const isCorrectOption = option === currentClue.correctAnswer;
                return (
                  <motion.button
                    key={option}
                    whileHover={!feedback ? { scale: 1.02, skewX: "-2deg" } : {}}
                    whileTap={!feedback ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(option)}
                    disabled={!!feedback}
                    className={`group relative bg-[#0d0d14]/80 backdrop-blur-xl border-2 rounded-[12px] p-6 md:p-8 text-left transition-all ${
                      isSelected && feedback === "correct"
                        ? "border-yellow-500 bg-yellow-500/20"
                        : isSelected && feedback === "wrong"
                          ? "border-red-500 bg-red-500/20"
                          : isCorrectOption && feedback
                            ? "border-yellow-500/50 bg-yellow-500/5"
                            : "border-white/10 hover:border-yellow-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="block text-xl md:text-2xl font-black italic tracking-tighter uppercase">{option}</span>
                    {isSelected && feedback === "correct" && (
                      <CheckCircle className="absolute bottom-4 right-4 text-yellow-500 w-6 h-6" />
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
            <span className="text-7xl md:text-9xl font-black italic text-yellow-400 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)] tracking-tighter">
              +{floatingPoints.points}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
