import { useEffect } from "react";
import { showBanner, hideBanner } from "../lib/adManager";

const BANNER_CONTAINER_ID = "banner-ad-container";

/**
 * Passive game-over banner slot. MVP renders a glass placeholder;
 * production AdSense mounts into `#banner-ad-container`.
 */
export default function BannerAd() {
  useEffect(() => {
    showBanner(BANNER_CONTAINER_ID);
    return () => hideBanner(BANNER_CONTAINER_ID);
  }, []);

  return (
    <div
      id={BANNER_CONTAINER_ID}
      data-ad-slot="banner"
      className="w-full max-w-lg min-h-[90px] mx-auto mb-10 bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center"
      aria-label="Sponsored content"
    >
      <span className="absolute top-2 left-3 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">
        Sponsored
      </span>
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(168,85,247,0.12) 50%, rgba(236,72,153,0.1) 100%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-1 py-6 px-4">
        <div className="h-2 w-24 rounded-full bg-white/10" />
        <div className="h-2 w-16 rounded-full bg-white/5" />
      </div>
    </div>
  );
}
