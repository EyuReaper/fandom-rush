import { motion } from "framer-motion";

export function TimeBar({
  timeLeft,
  maxTime,
}: {
  timeLeft: number;
  maxTime: number;
}) {
  const percentage = (timeLeft / maxTime) * 100;

  return (
    <div className="w-80 bg-white/10 rounded-full h-2.5 overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${timeLeft <= 3 ? "bg-red-500" : "bg-cyan-400"}`}
        initial={{ width: "100%" }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
