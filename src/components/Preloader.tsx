import { useState, useEffect } from "react";

// MT pixel-grid mask (7 columns x 4 rows = 28 cells).
// 1 = lit pixel, 0 = empty. Left half spells "M", right half spells "T".
const MT_PATTERN = [
  1, 0, 1, 0, 1, 1, 1,
  1, 1, 1, 0, 0, 1, 0,
  1, 0, 1, 0, 0, 1, 0,
  1, 0, 1, 0, 0, 1, 0,
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => setDots((p) => (p % 3) + 1), 400);
    const timer = setTimeout(() => onComplete(), 2200);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090A0F]">
      <div className="absolute inset-0 retro-grid opacity-40" />
      <div className="absolute inset-0 scanlines" />

      <div className="relative flex flex-col items-center gap-6">
        <div className="grid grid-cols-7 gap-1">
          {MT_PATTERN.map((cell, i) => (
            <div
              key={i}
              className={
                cell
                  ? "h-4 w-4 bg-[#0055FF] shadow-[0_0_10px_rgba(0,85,255,0.9)] pixel-blink"
                  : "h-4 w-4 bg-[#12151E]"
              }
              style={{ animationDelay: `${(i % 7) * 80}ms` }}
            />
          ))}
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold tracking-[0.4em] text-white glow-text">
            MEGATRIX
          </div>
          <div className="mt-2 text-xs tracking-widest text-[#7C89A8]">
            INITIALIZING SYSTEM{".".repeat(dots)}
          </div>
        </div>
      </div>
    </div>
  );
}