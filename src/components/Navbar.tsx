import { Link, useLocation } from "@tanstack/react-router";
import { Terminal, Sun, Moon } from "lucide-react";
import MTLogo from "@/components/MTLogo";
import { useTheme } from "@/hooks/useTheme";

// Main navigation header links configuration
const NAV_LINKS = [
  { to: "/", label: "HOME" },
  { to: "/projects", label: "PROJECTS" },
  { to: "/architecture", label: "ARCHITECTURE" },
] as const;

// Main navigation bar component providing site routing and theme toggle controls
export default function Navbar() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  // Colors that adapt to theme
  const logoColor = isLight ? "#0A0F1E" : "#FFFFFF";
  const wordmarkColor = isLight ? "#0A0F1E" : "#FFFFFF";
  const navLinkActive = isLight ? "text-[#0A0F1E]" : "text-white";
  const navLinkIdle = isLight
    ? "text-[#3D5080] hover:bg-black/5 hover:text-[#0A0F1E]"
    : "text-[#B8C4DE] hover:bg-white/5 hover:text-white";
  const activeIndicator = isLight ? "bg-[#0044DD]" : "bg-[#0055FF]";
  const mobileBorder = isLight ? "border-[#D1D9EE]" : "border-[#1E2538]";
  const mobileLinkActive = isLight
    ? "bg-[#0044DD]/10 text-[#0A0F1E]"
    : "bg-[#0055FF]/20 text-white";
  const mobileLinkIdle = isLight ? "text-[#3D5080] hover:text-[#0A0F1E]" : "text-[#B8C4DE] hover:text-white";

  return (
    <nav
      style={{ backgroundColor: "var(--mt-nav-bg)", borderBottomColor: "var(--mt-nav-border)" }}
      className="sticky top-0 z-50 border-b backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-3 md:px-12 md:py-4">
        <div className="flex items-center gap-10 lg:gap-14">
          {/* LOGO — pixel art flips to Orbitron wordmark on hover */}
          <Link
            to="/"
            aria-label="Megatrix home"
            className="group relative flex h-10 shrink-0 items-center overflow-hidden md:h-11"
          >
            {/* LAYER 1: Pixel-art MT mark (default visible, slides up + fades out on hover) */}
            <span
              className="absolute inset-0 flex items-center transition-all duration-300 ease-out group-hover:-translate-y-full group-hover:opacity-0"
              aria-hidden="true"
            >
              <MTLogo className="h-9 w-auto md:h-10" color={logoColor} />
            </span>

            {/* LAYER 2: Orbitron wordmark (hidden below, slides up + fades in on hover) */}
            <span
              className="absolute inset-0 flex items-center translate-y-full opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
              aria-hidden="true"
            >
              <span
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 900,
                  fontSize: "1.25rem",
                  letterSpacing: "0.05em",
                  lineHeight: 1,
                  color: wordmarkColor,
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}
              >
                MegaTrix
              </span>
            </span>

            {/* Invisible spacer — uses the wordmark to reserve full width */}
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 900,
                fontSize: "1.25rem",
                letterSpacing: "0.05em",
                lineHeight: 1,
                whiteSpace: "nowrap",
                visibility: "hidden",
                userSelect: "none",
              }}
              aria-hidden="true"
            >
              MegaTrix
            </span>
          </Link>

          {/* PRIMARY NAVIGATION */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative rounded-sm px-3 py-2 font-sans text-xs font-bold tracking-[0.14em] transition-colors md:text-[13px] ${
                    isActive ? navLinkActive : navLinkIdle
                  }`}
                >
                  {label}
                  <span
                    className={`pointer-events-none absolute inset-x-3 -bottom-[3px] h-[2px] origin-left ${activeIndicator} transition-transform duration-200 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE: THEME TOGGLE + CONTACT CTA */}
        <div className="flex items-center gap-3">
          {/* THEME TOGGLE BUTTON — Minimalist Pill Switch */}
          <button
            onClick={toggleTheme}
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            title={isLight ? "Switch to dark mode" : "Switch to light mode"}
            className={`relative flex h-[28px] w-[54px] cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055FF] ${
              isLight ? "bg-black" : "bg-white"
            }`}
          >
            {/* Sliding knob matching navbar color of current theme */}
            <span
              className="h-[22px] w-[22px] rounded-full shadow-sm transition-all duration-300"
              style={{
                left: isLight ? "calc(100% - 25px)" : "3px",
                backgroundColor: isLight ? "#F8FAFC" : "#090A0F",
                position: "absolute",
              }}
            />
          </button>

          {/* PRIMARY ACTION */}
          <Link
            to="/contact"
            className="group flex shrink-0 items-center gap-2 rounded-sm bg-[#0055FF] px-4 py-2.5 font-sans text-[11px] font-bold tracking-[0.14em] text-white shadow-[0_6px_20px_-8px_rgba(0,85,255,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1A66FF] hover:shadow-[0_10px_28px_-8px_rgba(0,85,255,1)] md:px-5 md:text-[13px]"
          >
            <Terminal size={15} className="transition-transform duration-200 group-hover:scale-110" />
            CONTACT US
          </Link>
        </div>
      </div>

      {/* MOBILE NAVIGATION ROW */}
      <div
        className={`flex items-center gap-1 overflow-x-auto border-t ${mobileBorder} px-4 py-2 md:hidden`}
      >
        {NAV_LINKS.map(({ to, label }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-current={isActive ? "page" : undefined}
              className={`whitespace-nowrap rounded-sm px-3 py-1.5 font-sans text-[11px] font-bold tracking-[0.14em] transition-colors ${
                isActive ? mobileLinkActive : mobileLinkIdle
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
