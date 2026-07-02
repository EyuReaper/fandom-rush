import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Zap, Clock, Target, Loader2, Globe, User, Shield, Shuffle } from "lucide-react";
import { authClient } from "../lib/auth-client";
import { API_URL } from "../lib/config";

interface Score {
  user_id: string;
  user_name: string;
  user_image: string;
  score: number;
  game_mode: string;
  category: string;
  created_at: string;
  rank?: number;
  pack_ids?: string;
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
    { id: "chaos", label: "Chaos", icon: <Shuffle className="w-4 h-4" /> },
    { id: "survival", label: "Survival", icon: <Shield className="w-4 h-4" /> }
  ];

  useEffect(() => {
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 10000);
    const fetchScores = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/leaderboard?mode=${activeMode}`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          signal: abortController.signal,
        });
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (!abortController.signal.aborted)
          console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
    return () => { clearTimeout(timeout); abortController.abort(); };
  }, [activeMode]);

  const isUserInTop = data.scores.some(s => s.user_id === session?.user?.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#050508]/95 backdrop-blur-2xl selection:bg-cyan-500 selection:text-black"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-[pulse_4s_infinite]" />
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-3xl bg-[#0d0d14]/90 border border-white/10 rounded-[20px] shadow-[0_0_60px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header - Tactical Style */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <Globe className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <p className="text-[10px] font-black text-cyan-500/60 uppercase tracking-[0.4em]">Live Database Connection</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                Global <span className="text-cyan-400">Rankings</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/10 rounded-xl transition-all group"
          >
            <X className="w-6 h-6 text-gray-500 group-hover:text-white" />
          </button>
        </div>

        {/* Tabs - Skewed Design */}
        <div className="flex gap-4 p-6 bg-white/[0.01] border-b border-white/5">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl border transition-all text-[11px] font-black uppercase tracking-[0.2em] ${
                activeMode === mode.id
                  ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] skew-x-[-10deg]"
                  : "bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:border-white/10"
              }`}
            >
              <span className={activeMode === mode.id ? "skew-x-[10deg] flex items-center gap-2" : "flex items-center gap-2"}>
                {mode.icon}
                {mode.label}
              </span>
            </button>
          ))}
        </div>

        {/* Content - Dossier Style */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
          {loading ? (
            <div className="h-80 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                <div className="absolute inset-0 blur-xl bg-cyan-500/20 animate-pulse" />
              </div>
              <p className="text-[11px] font-black text-cyan-500/50 uppercase tracking-[0.5em] animate-pulse">Decrypting mission logs...</p>
            </div>
          ) : data.scores.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center gap-6 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Target className="w-10 h-10 text-gray-700" />
              </div>
              <div>
                <p className="text-gray-500 text-xl font-bold italic mb-2 tracking-tight">No Operatives Found</p>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Be the first to establish a presence</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {data.scores.map((score, index) => {
                const isCurrentUser = session?.user?.id === score.user_id;
                const isTop3 = index < 3;
                const hasFanatic = score.pack_ids?.includes("fanatic");

                return (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    key={index}
                    className={`flex items-center gap-6 p-5 rounded-[15px] border transition-all group relative overflow-hidden ${
                      isCurrentUser
                        ? "bg-cyan-500/15 border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)]"
                        : hasFanatic
                        ? "bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_25px_rgba(234,179,8,0.15)]"
                        : isTop3
                        ? "bg-white/[0.04] border-white/10 hover:border-white/20"
                        : "bg-white/[0.01] border-white/5 hover:border-white/10"
                    }`}
                  >
                    {/* Rank Indicator */}
                    <div className={`w-12 text-3xl font-black italic leading-none ${
                      index === 0 ? "text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" :
                      index === 1 ? "text-gray-300" :
                      index === 2 ? "text-amber-600" :
                      isCurrentUser ? "text-cyan-400" : "text-gray-700"
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* User Profile */}
                    <div className={`relative group/avatar`}>
                        <div className={`w-12 h-12 rounded-xl border rotate-3 group-hover:rotate-0 transition-transform overflow-hidden bg-[#0a0a0f] ${
                        isCurrentUser ? "border-cyan-500/50" : "border-white/10"
                        }`}>
                        {score.user_image ? (
                            <img src={score.user_image} alt={score.user_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-black text-sm">
                                {score.user_name?.charAt(0) || <User className="w-5 h-5" />}
                            </div>
                        )}
                        </div>
                        {isTop3 && (
                            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black ${
                                index === 0 ? "bg-yellow-500 text-black" : index === 1 ? "bg-gray-300 text-black" : "bg-amber-600 text-white"
                            }`}>
                                ★
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className={`text-lg font-black truncate uppercase tracking-tight italic ${
                            isCurrentUser ? "text-cyan-400" : hasFanatic ? "text-yellow-400 group-hover:text-yellow-300 transition-colors" : "text-white group-hover:text-cyan-400 transition-colors"
                        }`}>
                            {score.user_name}
                        </p>
                        {hasFanatic && !isCurrentUser && (
                          <span className="text-[7px] font-black bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/30 tracking-widest uppercase">Fanatic</span>
                        )}
                        {isCurrentUser && (
                          <span className="text-[7px] font-black bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30 tracking-widest uppercase">Operative</span>
                        )}
                      </div>
                      <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">
                          {score.category !== 'all' ? `${score.category} specialist` : 'unrestricted fan'}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className={`text-3xl font-black tabular-nums tracking-tighter leading-none ${
                          isCurrentUser || isTop3 ? "text-white" : "text-gray-500"
                      }`}>
                        {score.score.toLocaleString()}
                      </p>
                      <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-2 italic">Points Acquired</p>
                    </div>

                    {/* Subtle Scanline Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />
                  </motion.div>
                );
              })}

              {/* Personal Sticky Footer Rank */}
              {!isUserInTop && data.userScore && (
                <div className="sticky bottom-0 z-20 pt-4 mt-8 pb-2 bg-gradient-to-t from-[#0d0d14] to-transparent">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-6 p-6 rounded-[20px] border border-cyan-500/50 bg-[#0d0d14] shadow-[0_-10px_40px_rgba(6,182,212,0.15)] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-cyan-500/[0.03] pointer-events-none" />

                    <div className="w-12 text-3xl font-black italic leading-none text-cyan-400">
                      #{data.userScore.rank}
                    </div>

                    <div className="w-14 h-14 rounded-2xl border-2 border-cyan-500/30 overflow-hidden bg-[#050508] p-1">
                      <div className="w-full h-full rounded-xl overflow-hidden">
                        {data.userScore.user_image ? (
                            <img src={data.userScore.user_image} alt={data.userScore.user_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-black text-sm">
                                {data.userScore.user_name?.charAt(0) || <User className="w-6 h-6" />}
                            </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-xl font-black truncate text-cyan-400 uppercase tracking-tight italic">
                            {data.userScore.user_name}
                        </p>
                        <span className="text-[8px] font-black bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/40 tracking-[0.2em] uppercase">Current Active State</span>
                      </div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                          Personal Dossier Record
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-4xl font-black tabular-nums tracking-tighter leading-none text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        {data.userScore.score.toLocaleString()}
                      </p>
                      <p className="text-[9px] font-black text-cyan-500/60 uppercase tracking-widest mt-2 italic">Max Score</p>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Dossier Info */}
        <div className="px-8 py-5 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
           <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.6em]">
              Data retrieval: TOP 50 Contenders
           </p>
           <div className="flex items-center gap-4">
              <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-cyan-500/40 animate-pulse" />
                  <div className="w-1 h-1 rounded-full bg-cyan-500/40 animate-pulse [animation-delay:0.2s]" />
                  <div className="w-1 h-1 rounded-full bg-cyan-500/40 animate-pulse [animation-delay:0.4s]" />
              </div>
              <p className="text-[9px] font-black text-cyan-500/40 uppercase tracking-widest">v1.2 // Secure Session</p>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
