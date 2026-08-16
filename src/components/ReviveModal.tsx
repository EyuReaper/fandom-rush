import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";
import { useGameStore } from "../stores/useGameStore";
import { useModalA11y } from "../hooks/useModalA11y";

export default function ReviveModal() {
  const revive = useGameStore((s) => s.revive);
  const endGame = useGameStore((s) => s.endGame);
  const modalRef = useModalA11y(true, endGame);
  const [isWatching, setIsWatching] = useState(false);

  const handleWatchAd = async () => {
    if (isWatching) return;
    setIsWatching(true);
    try {
      await revive();
      // Ad skipped/failed leaves the prompt open — treat as decline
      if (useGameStore.getState().showRevivePrompt) {
        endGame();
      }
    } catch {
      endGame();
    } finally {
      setIsWatching(false);
    }
  };

  const handleGiveUp = () => {
    if (isWatching) return;
    endGame();
  };

  return (
    <motion.div
      ref={modalRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="revive-modal-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-[#0d0d14]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
            <Heart className="w-10 h-10 text-red-400 fill-red-400/30 drop-shadow-[0_0_12px_rgba(248,113,113,0.5)]" />
          </div>
        </div>

        <h2
          id="revive-modal-title"
          className="text-2xl md:text-3xl font-black italic tracking-tight text-white uppercase mb-3"
        >
          Lives Depleted
        </h2>
        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
          Watch an ad to continue with 1 life
        </p>

        <div className="flex flex-col gap-3">
          <motion.button
            type="button"
            whileHover={isWatching ? undefined : { scale: 1.02 }}
            whileTap={isWatching ? undefined : { scale: 0.98 }}
            onClick={handleWatchAd}
            disabled={isWatching}
            className="w-full py-4 px-6 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-black uppercase tracking-wider text-sm shadow-[0_0_24px_rgba(34,211,238,0.25)] hover:bg-cyan-500/30 hover:shadow-[0_0_32px_rgba(34,211,238,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isWatching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading Ad…
              </>
            ) : (
              <>🎬 Watch Ad to Revive</>
            )}
          </motion.button>

          <button
            type="button"
            onClick={handleGiveUp}
            disabled={isWatching}
            className="w-full py-3 px-6 rounded-2xl bg-transparent border border-white/10 text-gray-500 font-bold uppercase tracking-wider text-xs hover:bg-white/5 hover:text-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Give Up
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
