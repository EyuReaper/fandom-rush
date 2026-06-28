import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Users, Gamepad2, TrendingUp, Activity, Loader2, Star } from "lucide-react";
import { authClient } from "../lib/auth-client";
import { API_URL } from "../lib/config";
import confetti from "canvas-confetti";

interface TelemetryData {
  totals: {
    totalPlayers: number;
    totalGamesPlayed: number;
    gamesToday: number;
    gamesThisWeek: number;
    activeUsers7d: number;
  };
  perMode: Record<string, { count: number; avgScore: number }>;
  leaderboard: { globalAvgScore: number; highestScoreEver: number };
  popularity: { mostPopularCategory: string; perCategory: Record<string, number> };
  ratings: { averageRating: number | null; totalRatings: number };
  server: { startTime: string; uptimeHours: number; version: string };
}

interface TelemetryDashboardProps {
  onClose: () => void;
}

export default function TelemetryDashboard({ onClose }: TelemetryDashboardProps) {
  const { data: session } = authClient.useSession();
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toastVisible, setToastVisible] = useState(true);

  useEffect(() => {
    if (session?.user?.email !== "eyureaper@gmail.com") {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    }
    const toastTimer = setTimeout(() => setToastVisible(false), 4000);
    return () => clearTimeout(toastTimer);
  }, [session]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/telemetry`);
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        if (mounted) setData(json);
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const ratingColor = (val: number) => {
    if (val >= 4.5) return "#22c55e";
    if (val >= 3.5) return "#84cc16";
    if (val >= 2.5) return "#eab308";
    if (val >= 1.5) return "#f97316";
    return "#ef4444";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#050508]/95 backdrop-blur-2xl selection:bg-cyan-500 selection:text-black"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-[pulse_4s_infinite]" />
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl bg-[#0d0d14]/90 border border-white/10 rounded-[20px] shadow-[0_0_60px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/30">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-purple-500/60 uppercase tracking-[0.4em]">Classified Access</p>
              <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">
                Secret <span className="text-purple-400">Telemetry</span>
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-xl transition-all group">
            <X className="w-6 h-6 text-gray-500 group-hover:text-white" />
          </button>
        </div>

        {toastVisible && session?.user?.email !== "eyureaper@gmail.com" && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-6 py-3 rounded-xl text-sm font-bold backdrop-blur-md animate-bounce whitespace-nowrap">
            🎉 You found the secret telemetry room!
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
          {loading && !data ? (
            <div className="h-96 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <div className="absolute inset-0 blur-xl bg-purple-500/20 animate-pulse" />
              </div>
              <p className="text-[11px] font-black text-purple-500/50 uppercase tracking-[0.5em] animate-pulse">
                Decrypting intelligence data...
              </p>
            </div>
          ) : error ? (
            <div className="h-96 flex flex-col items-center justify-center gap-6 text-center">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
                <X className="w-10 h-10 text-red-500" />
              </div>
              <div>
                <p className="text-gray-500 text-xl font-bold italic mb-2 tracking-tight">Failed to Load Telemetry</p>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Connection to intelligence feed lost</p>
              </div>
            </div>
          ) : data ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Players", value: data.totals.totalPlayers.toLocaleString(), icon: <Users className="w-5 h-5" />, color: "cyan", border: "border-cyan-500/30", bg: "bg-cyan-500/10", text: "text-cyan-400" },
                  { label: "Games Played", value: data.totals.totalGamesPlayed.toLocaleString(), icon: <Gamepad2 className="w-5 h-5" />, color: "yellow", border: "border-yellow-500/30", bg: "bg-yellow-500/10", text: "text-yellow-400" },
                  { label: "Today", value: data.totals.gamesToday.toLocaleString(), icon: <Activity className="w-5 h-5" />, color: "emerald", border: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-400" },
                  { label: "Active / Week", value: data.totals.activeUsers7d.toLocaleString(), icon: <TrendingUp className="w-5 h-5" />, color: "purple", border: "border-purple-500/30", bg: "bg-purple-500/10", text: "text-purple-400" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/[0.03] border border-white/10 rounded-[16px] p-5 text-center">
                    <div className={`inline-flex p-3 rounded-xl ${stat.bg} ${stat.border} mb-3`}>
                      <div className={stat.text}>{stat.icon}</div>
                    </div>
                    <p className="text-3xl font-black text-white tabular-nums tracking-tighter">{stat.value}</p>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-[16px] p-6 space-y-4">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Games Per Mode</h3>
                {(() => {
                  const modes = Object.entries(data.perMode);
                  const maxCount = Math.max(...modes.map(([, v]) => v.count), 1);
                  const labels: Record<string, string> = { endless: "Endless", "sixty-second": "60-Sec", chaos: "Chaos", category: "Category" };
                  return modes.map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 font-bold uppercase tracking-wide">{labels[key] || key}</span>
                        <span className="text-gray-500 tabular-nums">
                          {val.count.toLocaleString()} <span className="text-[10px] text-gray-600">| Avg: {val.avgScore.toLocaleString()}</span>
                        </span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${(val.count / maxCount) * 100}%` }} />
                      </div>
                    </div>
                  ));
                })()}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/[0.03] border border-white/5 rounded-[16px] p-6 text-center">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">Global Average Score</p>
                  <p className="text-5xl font-black text-white tabular-nums tracking-tighter">
                    {data.leaderboard.globalAvgScore?.toLocaleString() || "—"}
                  </p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-[16px] p-6 text-center">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">Highest Score Ever</p>
                  <p className="text-5xl font-black text-yellow-400 tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                    {data.leaderboard.highestScoreEver?.toLocaleString() || "—"}
                  </p>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/5 rounded-[16px] p-6 space-y-4">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Category Popularity</h3>
                {(() => {
                  const cats = Object.entries(data.popularity.perCategory);
                  const maxCat = Math.max(...cats.map(([, v]) => v), 1);
                  return cats.map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 font-bold uppercase tracking-wide">{key}</span>
                        <span className="text-gray-500 tabular-nums">{val.toLocaleString()}</span>
                      </div>
                      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${(val / maxCat) * 100}%` }} />
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {data.ratings.totalRatings > 0 && (
                <div className="bg-white/[0.03] border border-white/5 rounded-[16px] p-6 space-y-4">
                  <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Community Rating</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative inline-flex items-center justify-center">
                      <Star className="w-10 h-10" fill={ratingColor(data.ratings.averageRating ?? 0)} color={ratingColor(data.ratings.averageRating ?? 0)} />
                      <span className="absolute text-[10px] font-black text-white">{Math.round(data.ratings.averageRating ?? 0)}</span>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white">{data.ratings.averageRating?.toFixed(1)}</p>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{data.ratings.totalRatings} ratings</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white/[0.03] border border-white/5 rounded-[16px] p-6 space-y-4">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Server</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-1">Uptime</p>
                    <p className="text-xl font-black text-white">{data.server.uptimeHours}h</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-1">Since</p>
                    <p className="text-xl font-black text-white">{new Date(data.server.startTime).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="px-8 py-5 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.6em]">Live Data &bull; Refreshes every 30s</p>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-purple-500/40 animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-purple-500/40 animate-pulse [animation-delay:0.2s]" />
              <div className="w-1 h-1 rounded-full bg-purple-500/40 animate-pulse [animation-delay:0.4s]" />
            </div>
            <p className="text-[9px] font-black text-purple-500/40 uppercase tracking-widest">v{data?.server.version || "?.?.?"}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
