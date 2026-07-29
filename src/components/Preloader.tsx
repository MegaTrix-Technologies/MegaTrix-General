import { useState, useEffect } from "react";
import AnimatedMTLogo from "@/components/AnimatedMTLogo";

interface PreloaderProps {
  onComplete: () => void;
  /** Custom duration in ms (defaults to 1800ms) */
  duration?: number;
}

export default function Preloader({ onComplete, duration = 1800 }: PreloaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => onComplete(), 150);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete, duration]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090A0F] font-mono">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-40" />

      <div className="relative z-10 w-full max-w-md mx-4 border border-[#1E2538] bg-[#0B0D14]/90 p-8 shadow-[0_0_80px_-15px_rgba(0,85,255,0.4)]">
        <div className="mb-4 flex items-center justify-between border-b border-[#1E2538] pb-3 text-[10px] tracking-widest text-[#B8C4DE]">
          <span className="text-[#0055FF]">RENDER_MT.exe</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#0055FF]" />
            INITIALIZING
          </span>
        </div>

        {/* Cyber pixel logo building animation */}
        <div className="flex justify-center py-4">
          <AnimatedMTLogo className="h-44 w-auto" step={35} hold={500} />
        </div>

        {/* Progress bar and status */}
        <div className="mt-4 space-y-2.5 border-t border-[#1E2538] pt-4">
          <div className="flex items-center justify-between text-[9px] tracking-widest text-[#7C89A8]">
            <span>LOADING MEGATRIX CORE...</span>
            <span className="font-bold text-[#0055FF]">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden border border-[#1E2538] bg-[#12151E]">
            <div
              className="h-full bg-[#0055FF] transition-all duration-75 ease-out shadow-[0_0_12px_rgba(0,85,255,0.9)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="pt-2 text-center text-[9px] tracking-[0.35em] text-[#B8C4DE]">
            M E G A T R I X
          </div>
        </div>
      </div>
    </div>
  );
}