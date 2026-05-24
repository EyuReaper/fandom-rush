import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Zap, Clock, LayoutGrid, Target, Loader2, Globe, User } from "lucide-react";
import { authClient } from "../lib/auth-client";

interface Score {
  user_id: string;
  user_name: string;
  user_image: string;
  score: number;
  game_mode: string;
  category: string;
  created_at: string;
  rank?: number;
}

interface LeaderboardData {
  scores: Score[];
  userScore: (Score & { rank: number }) | null;
}

interface LeaderboardProps {
  onClose: () => void;
}

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const { data: session } = authClient.useSession();
  const [data, setData] = useState<LeaderboardData>({ scores: [], userScore: null });
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState("endless");

  const modes = [
    { id: "endless", label: "Endless", icon: <Zap className="w-4 h-4" /> },
    { id: "sixty-second", label: "60-Sec", icon: <Clock className="w-4 h-4" /> },
    { id: "chaos", label: "Chaos", icon: <LayoutGrid className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      try {
        const response = await authClient.fetch(`http://localhost:3000/api/leaderboard?mode=${activeMode}`);
        if (response.data) {
          setData(response.data as LeaderboardData);
        } else if (response.error) {
           console.error("Failed to fetch leaderboard:", response.error);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [activeMode]);

  const isUserInTop = data.scores.some(s => s.user_id === session?.user?.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#050508]/90 backdrop-blur-xl"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        className="relative w-full max-w-2xl bg-[#0d0d14] border border-cyan-500/20 rounded-[10px] shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <Globe className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                Global <span className="text-cyan-400">Rankings</span>
              </h2>
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em]">The world's best fans</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 bg-white/[0.02] border-b border-white/5">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                activeMode === mode.id
                  ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  : "bg-white/5 border-white/5 text-gray-500 hover:bg-white/10"
              }`}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
              <p className="text-[10px] font-black text-cyan-500/50 uppercase tracking-[0.3em]">Synchronizing data...</p>
            </div>
          ) : data.scores.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-center">
              <Target className="w-12 h-12 text-gray-700 mb-2" />
              <p className="text-gray-500 font-bold italic">No scores recorded yet for this mode.</p>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Be the first to claim glory!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.scores.map((score, index) => {
                const isCurrentUser = session?.user?.id === score.user_id;
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${
                      isCurrentUser
                        ? "bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                        : index === 0 
                        ? "bg-yellow-500/5 border-yellow-500/20" 
                        : index === 1 
                        ? "bg-gray-400/5 border-gray-400/20"
                        : index === 2
                        ? "bg-amber-700/5 border-amber-700/20"
                        : "bg-white/[0.02] border-white/5"
                    }`}
                  >
                    <div className={`w-8 text-xl font-black italic ${
                      index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-700" : isCurrentUser ? "text-cyan-400" : "text-gray-600"
                    }`}>
                      #{index + 1}
                    </div>
                    
                    <div className={`w-10 h-10 rounded-full border overflow-hidden bg-white/5 flex-shrink-0 ${
                      isCurrentUser ? "border-cyan-500/50" : "border-white/10"
                    }`}>
                      {score.user_image ? (
                          <img src={score.user_image} alt={score.user_name} className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 font-black text-xs">
                              {score.user_name?.charAt(0) || <User className="w-4 h-4" />}
                          </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`font-bold truncate transition-colors uppercase tracking-tight italic ${
                        isCurrentUser ? "text-cyan-400" : "group-hover:text-cyan-400"
                      }`}>
                        {score.user_name} {isCurrentUser && <span className="text-[8px] not-italic ml-2 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30">YOU</span>}
                      </p>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                          {score.category !== 'all' ? `${score.category} Master` : 'Elite Fan'}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className={`text-2xl font-black tabular-nums tracking-tighter leading-none ${
                          isCurrentUser || index < 3 ? "text-white" : "text-gray-400"
                      }`}>
                        {score.score.toLocaleString()}
                      </p>
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">Points</p>
                    </div>
                  </motion.div>
                );
              })}

              {!isUserInTop && data.userScore && (
                <>
                  <div className="flex justify-center py-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-gray-800" />)}
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 rounded-xl border bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)] sticky bottom-0 z-10"
                  >
                    <div className="w-8 text-xl font-black italic text-cyan-400">
                      #{data.userScore.rank}
                    </div>
                    
                    <div className="w-10 h-10 rounded-full border border-cyan-500/50 overflow-hidden bg-white/5 flex-shrink-0">
                      {data.userScore.user_image ? (
                          <img src={data.userScore.user_image} alt={data.userScore.user_name} className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 font-black text-xs">
                              {data.userScore.user_name?.charAt(0) || <User className="w-4 h-4" />}
                          </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-cyan-400 uppercase tracking-tight italic">
                        {data.userScore.user_name} <span className="text-[8px] not-italic ml-2 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30">YOU</span>
                      </p>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                          Personal Best
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black tabular-nums tracking-tighter leading-none text-white">
                        {data.userScore.score.toLocaleString()}
                      </p>
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">Points</p>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
           <p className="text-center text-[8px] font-black text-gray-600 uppercase tracking-[0.5em]">
              Showing top 50 global contenders
           </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
