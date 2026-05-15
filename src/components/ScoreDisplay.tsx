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
      <div className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
        Current Score
      </div>
      <div className="text-5xl font-black tabular-nums tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        {score.toLocaleString()}
      </div>

      {combo > 1 && (
        <motion.div
          key={combo}
          initial={{ scale: 0.8, opacity: 0, x: 20 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          className="mt-2 flex items-center gap-2 justify-end"
        >
          <div className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <span className="text-white font-black italic text-sm tracking-widest uppercase">
              ×{combo} Combo
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
