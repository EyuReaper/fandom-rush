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
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">Time Status</span>
        <span className={`text-xs font-black tabular-nums tracking-widest ${isUrgent ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
          {timeLeft.toFixed(1)}s
        </span>
      </div>
      <div className="w-64 bg-white/[0.03] rounded-sm h-3 border border-white/5 p-[1px] overflow-hidden relative">
        {/* Background Segments */}
        <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-[1px] h-full bg-white/[0.05]" />
            ))}
        </div>
        
        <motion.div
          className={`h-full rounded-sm relative ${
            isUrgent 
              ? "bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
              : "bg-gradient-to-r from-cyan-600 to-blue-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          }`}
          initial={{ width: "100%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        >
          {/* Inner Glare */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20" />
        </motion.div>
      </div>
    </div>
  );
}
