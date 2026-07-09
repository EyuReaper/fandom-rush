import { motion } from "framer-motion";

export function ScoreDisplay({
  score,
  combo,
}: {
  score: number;
  combo: number;
}) {
  return (
    <div className="text-right">
      <div className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mb-1">
        Current Score
      </div>
      <div className="text-6xl font-black font-mono tabular-nums tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] leading-none">
        {score.toLocaleString()}
      </div>

      {combo > 1 && (
        <motion.div
          key={combo}
          initial={{ scale: 0.8, opacity: 0, x: 20 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          className="mt-4 flex items-center gap-2 justify-end"
        >
          <div className="px-4 py-1.5 bg-gradient-to-r from-pink-600 to-yellow-500 rounded-full shadow-[0_5px_20px_rgba(219,39,119,0.3)]">
            <span className="text-white font-black italic text-[10px] tracking-[0.2em] uppercase">
              ×{combo} Combo Streak
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
