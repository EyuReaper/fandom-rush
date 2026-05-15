import { motion } from "framer-motion";

export function TimeBar({
  timeLeft,
  maxTime,
}: {
  timeLeft: number;
  maxTime: number;
}) {
  const percentage = (timeLeft / maxTime) * 100;
  const isUrgent = timeLeft <= (maxTime * 0.3);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rush Timer</span>
        <span className={`text-sm font-black tabular-nums ${isUrgent ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
          {timeLeft.toFixed(1)}s
        </span>
      </div>
      <div className="w-64 bg-white/5 rounded-full h-3 border border-white/10 p-0.5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full relative ${
            isUrgent 
              ? "bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
              : "bg-gradient-to-r from-cyan-600 to-blue-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          }`}
          initial={{ width: "100%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Inner Glare */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}
