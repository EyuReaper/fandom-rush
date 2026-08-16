import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-[#0a0a1a]/90 backdrop-blur-sm">
      <Loader2 className="w-10 h-10 text-neon animate-spin drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]" />
      <p className="text-xs font-black uppercase tracking-[0.3em] text-neon/60">
        Loading&hellip;
      </p>
    </div>
  );
}
