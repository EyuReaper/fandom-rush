import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
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

const G = "#00ff41";
const GD = "#00aa22";

function greenBar(value: number, max: number) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-3 bg-[#003300] border border-[#00ff41]/20 rounded overflow-hidden">
      <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${GD}, ${G})` }} />
    </div>
  );
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black font-mono selection:bg-[#00ff41] selection:text-black"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,65,0.15)_2px,rgba(0,255,65,0.15)_4px)]" />
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-4xl border border-[#00ff41]/30 bg-black shadow-[0_0_60px_rgba(0,255,65,0.1)] flex flex-col max-h-[90vh] overflow-hidden"
        style={{ boxShadow: `0 0 40px rgba(0,255,65,0.08), inset 0 0 80px rgba(0,255,65,0.02)` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#00ff41]/20">
          <div className="flex items-center gap-4">
            <span className="text-[#00ff41] text-xl leading-none" style={{ fontFamily: "monospace", fontWeight: 700 }}>{">"}_</span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#00aa22]">// CLASSIFIED //</p>
              <h2 className="text-xl font-bold tracking-tight text-[#00ff41]">
                TELEMETRY TERMINAL
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 border border-[#00ff41]/30 hover:bg-[#00ff41]/10 transition-colors" style={{ color: G }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {toastVisible && session?.user?.email !== "eyureaper@gmail.com" && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 border border-[#00ff41]/40 bg-black text-[#00ff41] px-6 py-3 text-sm font-bold whitespace-nowrap"
            style={{ boxShadow: `0 0 20px rgba(0,255,65,0.2)` }}>
            &gt;&gt; YOU FOUND THE SECRET TELEMETRY ROOM! &lt;&lt;
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {loading && !data ? (
            <div className="h-96 flex flex-col items-center justify-center gap-6">
              <Loader2 className="w-10 h-10 animate-spin" style={{ color: G }} />
              <p className="text-[11px] uppercase tracking-[0.5em] text-[#00aa22] animate-pulse">ACCESSING TERMINAL...</p>
            </div>
          ) : error ? (
            <div className="h-96 flex flex-col items-center justify-center gap-6 text-center">
              <div className="w-16 h-16 border border-red-500/50 flex items-center justify-center">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <p className="text-red-500 text-lg font-bold mb-1">CONNECTION FAILED</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#005500]">LINK TO TELEMETRY FEED LOST</p>
              </div>
            </div>
          ) : data ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "TOTAL PLAYERS", value: data.totals.totalPlayers.toLocaleString() },
                  { label: "GAMES PLAYED", value: data.totals.totalGamesPlayed.toLocaleString() },
                  { label: "GAMES TODAY", value: data.totals.gamesToday.toLocaleString() },
                  { label: "ACTIVE / WEEK", value: data.totals.activeUsers7d.toLocaleString() },
                ].map((stat) => (
                  <div key={stat.label} className="border border-[#00ff41]/20 p-4 text-center bg-[#000800]">
                    <p className="text-2xl font-bold text-[#00ff41] tabular-nums">{stat.value}</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#008800] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Per Mode */}
              <div className="border border-[#00ff41]/20 p-5 bg-[#000800]">
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#00aa22] mb-4">// GAMES PER MODE</h3>
                {(() => {
                  const modes = Object.entries(data.perMode);
                  const maxCount = Math.max(...modes.map(([, v]) => v.count), 1);
                  const labels: Record<string, string> = { endless: "ENDLESS", "sixty-second": "60-SEC", chaos: "CHAOS", category: "CATEGORY" };
                  return modes.map(([key, val]) => (
                    <div key={key} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#00ff41] font-bold">{labels[key] || key}</span>
                        <span className="text-[#008800] tabular-nums">
                          {val.count} <span className="text-[9px]">| AVG {val.avgScore.toLocaleString()}</span>
                        </span>
                      </div>
                      {greenBar(val.count, maxCount)}
                    </div>
                  ));
                })()}
              </div>

              {/* Score stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-[#00ff41]/20 p-5 text-center bg-[#000800]">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#008800] mb-2">GLOBAL AVERAGE SCORE</p>
                  <p className="text-4xl font-bold text-[#00ff41] tabular-nums">
                    {data.leaderboard.globalAvgScore?.toLocaleString() || "—"}
                  </p>
                </div>
                <div className="border border-[#00ff41]/20 p-5 text-center bg-[#000800]">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#008800] mb-2">HIGHEST SCORE EVER</p>
                  <p className="text-4xl font-bold text-[#00ff41] tabular-nums" style={{ textShadow: `0 0 10px ${G}` }}>
                    {data.leaderboard.highestScoreEver?.toLocaleString() || "—"}
                  </p>
                </div>
              </div>

              {/* Category Popularity */}
              <div className="border border-[#00ff41]/20 p-5 bg-[#000800]">
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#00aa22] mb-4">// CATEGORY POPULARITY</h3>
                {(() => {
                  const cats = Object.entries(data.popularity.perCategory);
                  const maxCat = Math.max(...cats.map(([, v]) => v), 1);
                  return cats.map(([key, val]) => (
                    <div key={key} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#00ff41] font-bold uppercase">{key}</span>
                        <span className="text-[#008800] tabular-nums">{val.toLocaleString()}</span>
                      </div>
                      {greenBar(val, maxCat)}
                    </div>
                  ));
                })()}
              </div>

              {/* Ratings */}
              {data.ratings.totalRatings > 0 && (
                <div className="border border-[#00ff41]/20 p-5 bg-[#000800]">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#00aa22] mb-3">// COMMUNITY RATING</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold text-[#00ff41]" style={{ textShadow: `0 0 15px ${G}` }}>
                      {data.ratings.averageRating?.toFixed(1) || "—"}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#00ff41]">{data.ratings.averageRating?.toFixed(1)} / 5.0</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#008800]">{data.ratings.totalRatings} RATINGS</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Server */}
              <div className="border border-[#00ff41]/20 p-5 bg-[#000800]">
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#00aa22] mb-3">// SERVER</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#008800] mb-1">UPTIME</p>
                    <p className="text-lg font-bold text-[#00ff41]">{data.server.uptimeHours}h</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#008800] mb-1">SINCE</p>
                    <p className="text-lg font-bold text-[#00ff41]">{new Date(data.server.startTime).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-[#00ff41]/20 bg-black flex items-center justify-between">
          <p className="text-[8px] uppercase tracking-[0.5em] text-[#005500]">LIVE DATA // REFRESH 30S</p>
          <p className="text-[8px] uppercase tracking-widest text-[#005500]">v{data?.server.version || "?.?.?"}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
