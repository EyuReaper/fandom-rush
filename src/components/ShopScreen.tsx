import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Crown, Sparkles, Lock, Check, Loader2 } from "lucide-react";
import { useGameStore } from "../stores/useGameStore";
import { getPlans, initiateCheckout } from "../lib/birrjs-client";

interface ShopScreenProps {
  onClose: () => void;
}

interface Plan {
  birrjsPriceId: string;
  price: number;
  currency: string;
  name: string;
  description: string;
}

interface Plans {
  enthusiast: Plan;
  fanatic: Plan;
}

export default function ShopScreen({ onClose }: ShopScreenProps) {
  const entitlements = useGameStore((s) => s.entitlements);
  const [plans, setPlans] = useState<Plans | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 10000);
    const fetchPlans = async () => {
      try {
        const data = await getPlans();
        if (!abortController.signal.aborted) setPlans(data);
      } catch {
        // silently fail
      } finally {
        if (!abortController.signal.aborted) setLoading(false);
      }
    };
    fetchPlans();
    return () => {
      clearTimeout(timeout);
      abortController.abort();
    };
  }, []);

  const handleCheckout = async (packId: string) => {
    setCheckingOut(packId);
    try {
      const result = await initiateCheckout(packId);
      if (result?.url) {
        window.location.assign(result.url);
      }
    } catch {
      // silently fail
    } finally {
      setCheckingOut(null);
    }
  };

  const packEntries = plans
    ? Object.entries(plans).map(([id, plan]) => ({ id, ...plan }))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-[#0d0d14]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-gold/20 to-hot-pink/20 border border-gold/30">
            <Crown className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h2 className="text-3xl font-black italic tracking-tight text-white">
              POWER-UPS // <span className="text-hot-pink">CHARACTER UNLOCKS</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Insert coin to expand your trivia arsenal
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        )}

        {!loading && packEntries.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No packs available</p>
          </div>
        )}

        {!loading && packEntries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packEntries.map((plan) => {
              const owned = entitlements.includes(plan.id);
              const isFanatic = plan.id === "fanatic";
              const isCheckingOut = checkingOut === plan.id;
              const gradient = isFanatic
                ? "from-amber-500/20 to-orange-500/20 border-amber-500/30"
                : "from-cyan-500/20 to-blue-500/20 border-cyan-500/30";
              const btnGradient = isFanatic
                ? "from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500"
                : "from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500";
              const accentColor = isFanatic ? "text-amber-400" : "text-cyan-400";

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative rounded-2xl border bg-gradient-to-br p-6 ${gradient}`}
                >
                  {owned && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      <Check className="w-3 h-3" />
                      CLEARED
                    </div>
                  )}

                  <div className={`p-3 rounded-xl bg-white/5 border border-white/10 inline-flex mb-4 ${accentColor}`}>
                    {isFanatic ? (
                      <Crown className="w-6 h-6" />
                    ) : (
                      <Sparkles className="w-6 h-6" />
                    )}
                  </div>

                  <h3 className={`text-xl font-black italic tracking-tight mb-2 ${isFanatic ? "text-amber-200" : "text-white"}`}>
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="text-3xl font-black text-white mb-6">
                    {plan.price}<span className="text-sm font-medium text-gold">¢</span>
                  </div>

                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={owned || isCheckingOut}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                      owned
                        ? "bg-white/5 text-gray-500 cursor-not-allowed"
                        : `bg-gradient-to-r ${btnGradient} text-white shadow-lg hover:shadow-xl active:scale-[0.98]`
                    }`}
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : owned ? (
                      <>
                        <Check className="w-4 h-4" />
                        CLEARED
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        INSERT COIN
                      </>
                    )}
                  </button>

                  {isFanatic && !owned && (
                    <p className="text-[10px] text-gray-500 text-center mt-3">
                      Unlocks Survival Mode + exclusive cosmetics
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
