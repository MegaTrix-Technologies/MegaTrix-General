import { useState, useEffect } from "react";
import MTLogo from "@/components/MTLogo";

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
        <MTLogo
          variant="white"
          className="h-24 w-auto pixel-blink drop-shadow-[0_0_25px_rgba(0,85,255,0.55)]"
        />

        <div className="text-center">
          <div className="text-xs tracking-widest text-[#7C89A8]">
            INITIALIZING SYSTEM{".".repeat(dots)}
          </div>
        </div>
      </div>
    </div>
  );
}