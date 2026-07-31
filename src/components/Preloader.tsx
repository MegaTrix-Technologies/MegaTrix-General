import { useState, useEffect } from "react";
import AnimatedMTLogo from "@/components/AnimatedMTLogo";

interface PreloaderProps {
  onComplete: () => void;
  /** Custom duration in ms (defaults to 1800ms) */
  duration?: number;
  title?: string;
  statusText?: string;
}

export default function Preloader({
  onComplete,
  duration = 1000,
  title = "RENDER_MT.exe",
  statusText = "LOADING MEGATRIX CORE...",
}: PreloaderProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--mt-bg)] font-mono transition-colors duration-200">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30 [html[data-theme='light']_&]:opacity-[0.08]" />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-40 [html[data-theme='light']_&]:hidden" />

      <div className="relative z-10 w-full max-w-md mx-4 border border-[var(--mt-border)] bg-[var(--mt-bg-card)] p-8 shadow-[0_0_60px_rgba(0,85,255,0.15)] rounded-sm transition-all duration-200">
        <div className="mb-4 flex items-center justify-between border-b border-[var(--mt-border)] pb-3 text-[10px] tracking-widest text-[var(--mt-text-secondary)]">
          <span className="text-[var(--mt-blue)]">{title}</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--mt-blue)]" />
            INITIALIZING
          </span>
        </div>

        {/* Cyber pixel logo building animation */}
        <div className="flex justify-center py-4">
          <AnimatedMTLogo className="h-44 w-auto" step={35} hold={500} />
        </div>

        {/* Progress bar and status */}
        <div className="mt-4 space-y-2.5 border-t border-[var(--mt-border)] pt-4">
          <div className="flex items-center justify-between text-[9px] tracking-widest text-[var(--mt-text-muted)]">
            <span>{statusText}</span>
            <span className="font-bold text-[var(--mt-blue)]">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden border border-[var(--mt-border)] bg-[var(--mt-bg-panel)]">
            <div
              className="h-full bg-[var(--mt-blue)] transition-all duration-75 ease-out shadow-[0_0_10px_var(--mt-blue)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="pt-2 text-center text-[9px] tracking-[0.35em] text-[var(--mt-text-secondary)]">
            M E G A T R I X
          </div>
        </div>
      </div>
    </div>
  );
}