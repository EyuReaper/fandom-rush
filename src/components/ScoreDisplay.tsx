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
      <div className="text-4xl font-bold tabular-nums">
        {score.toLocaleString()}
      </div>

      {combo > 1 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-orange-400 font-bold text-xl flex items-center gap-1 justify-end"
        >
          🔥🔥 {combo}x COMBO
        </motion.div>
      )}
    </div>
  );
}
