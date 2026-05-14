import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../stores/useGameStore";
import { TimeBar } from "./TimeBar";
import { ScoreDisplay } from "./ScoreDisplay";
import { Clock, Heart, Flame, CheckCircle, XCircle } from "lucide-react";

export default function GameScreen() {
  const {
    currentClue,
    options,
    score,
    combo,
    lives,
    timeLeft,
    isPlaying,
    selectAnswer,
    startGame,
  } = useGameStore();

  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [floatingPoints, setFloatingPoints] = useState<{
    points: number;
    id: number;
  } | null>(null);

  // Keyboard Support
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!isPlaying || !options.length || feedback) return; // Disable during feedback
      const num = parseInt(e.key);
      if (num >= 1 && num <= 4) {
        handleAnswer(options[num - 1]);
      }
    },
    [isPlaying, options, feedback],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const handleAnswer = (answer: string) => {
    if (feedback) return;

    setSelectedOption(answer);

    const isCorrect = answer === currentClue?.correctAnswer;

    if (isCorrect) {
      setFeedback("correct");

      // Calculate points for floating animation
      const difficultyPoints =
        currentClue!.difficulty === "easy"
          ? 10
          : currentClue!.difficulty === "medium"
            ? 25
            : 50;
      const points =
        difficultyPoints + (timeLeft > 6 ? 30 : timeLeft > 4 ? 20 : 5);

      setFloatingPoints({ points, id: Date.now() });
    } else {
      setFeedback("wrong");
    }

    // Trigger store answer
    selectAnswer(answer);

    // Clear feedback after delay
    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      setFloatingPoints(null);
    }, 450);
  };

  // Show start screen
  if (!currentClue || !isPlaying) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <button
          onClick={() => startGame("endless")}
          className="px-16 py-8 bg-cyan-500 hover:bg-cyan-400 text-black text-3xl font-bold rounded-3xl transition-all active:scale-95 shadow-xl"
        >
          START FANDOM RUSH
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-8">
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-9 h-9 transition-all ${i < lives ? "text-red-500 fill-red-500" : "text-gray-700"}`}
              />
            ))}
          </div>
          <TimeBar timeLeft={timeLeft} maxTime={8} />
        </div>
        <ScoreDisplay score={score} combo={combo} />
      </div>

      {/* Combo Indicator */}
      {combo >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3 rounded-3xl shadow-lg">
            <Flame className="w-8 h-8" />
            <span className="text-3xl font-bold">COMBO ×{combo}</span>
          </div>
        </motion.div>
      )}

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-20 px-6">
        <div className="w-full max-w-2xl">
          {/* Object Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentClue.id}
              initial={{ scale: 0.75, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.2, opacity: 0, filter: "blur(10px)" }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="relative mb-16"
            >
              <div
                className={`bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-10 flex items-center justify-center min-h-[420px] transition-all duration-300 ${
                  feedback === "correct"
                    ? "border-green-500"
                    : feedback === "wrong"
                      ? "border-red-500"
                      : ""
                }`}
              >
                <img
                  src={currentClue.imagePath}
                  alt={currentClue.objectName}
                  className="max-h-[380px] object-contain drop-shadow-2xl"
                />
              </div>

              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/30 px-6 py-2 rounded-full text-sm font-medium">
                {currentClue.objectName}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Answer Choices */}
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === currentClue.correctAnswer;

              return (
                <motion.button
                  key={option}
                  whileHover={!feedback ? { scale: 1.05 } : {}}
                  whileTap={!feedback ? { scale: 0.96 } : {}}
                  onClick={() => handleAnswer(option)}
                  disabled={!!feedback}
                  className={`group relative bg-white/10 backdrop-blur-xl border rounded-3xl p-8 text-left transition-all duration-200 text-xl font-semibold min-h-[110px] ${
                    isSelected && feedback === "correct"
                      ? "border-green-500 bg-green-500/20"
                      : isSelected && feedback === "wrong"
                        ? "border-red-500 bg-red-500/20"
                        : isCorrect && feedback
                          ? "border-green-500 bg-green-500/10"
                          : "border-white/20 hover:border-cyan-400 hover:bg-white/15"
                  }`}
                >
                  <span className="absolute -top-3 -left-3 bg-white/10 text-xs w-8 h-8 flex items-center justify-center rounded-full border border-white/30 font-mono">
                    {index + 1}
                  </span>
                  <span className="block pt-3">{option}</span>

                  {/* Feedback Icons */}
                  {isSelected && feedback === "correct" && (
                    <CheckCircle className="absolute top-4 right-4 text-green-500 w-8 h-8" />
                  )}
                  {isSelected && feedback === "wrong" && (
                    <XCircle className="absolute top-4 right-4 text-red-500 w-8 h-8" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Points */}
      <AnimatePresence>
        {floatingPoints && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -120, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/3 left-1/2 text-5xl font-bold text-green-400 pointer-events-none"
          >
            +{floatingPoints.points}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-sm">
        Press{" "}
        <span className="text-cyan-400 font-mono font-medium">1 2 3 4</span> on
        keyboard
      </div>
    </div>
  );
}
