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

  return (
    <nav
      style={{ backgroundColor: "var(--mt-nav-bg)", borderBottomColor: "var(--mt-nav-border)" }}
      className="sticky top-0 z-50 border-b backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-3 md:px-12 md:py-4">
        <div className="flex items-center gap-10 lg:gap-14">
          {/* LOGO */}
          <Link
            to="/"
            aria-label="Megatrix home"
            className="flex shrink-0 items-center opacity-90 transition-opacity hover:opacity-100"
          >
            <MTLogo className="h-9 w-auto md:h-10" />
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
                    isActive
                      ? "text-white"
                      : "text-[#B8C4DE] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {label}
                  <span
                    className={`pointer-events-none absolute inset-x-3 -bottom-[3px] h-[2px] origin-left bg-[#0055FF] transition-transform duration-200 ${
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
          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            title={isLight ? "Switch to dark mode" : "Switch to light mode"}
            className="relative flex h-9 w-16 cursor-pointer items-center rounded-full border border-[#1E2538] bg-[#12151E] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            {/* Track icons */}
            <span
              className="absolute left-2 flex items-center justify-center transition-opacity duration-300"
              style={{ opacity: isLight ? 1 : 0.3 }}
            >
              <Sun size={12} className="text-amber-400" />
            </span>
            <span
              className="absolute right-2 flex items-center justify-center transition-opacity duration-300"
              style={{ opacity: isLight ? 0.3 : 1 }}
            >
              <Moon size={12} className="text-[#7C89A8]" />
            </span>
            {/* Sliding thumb */}
            <span
              className="absolute h-6 w-6 rounded-full shadow-md transition-all duration-300"
              style={{
                left: isLight ? "calc(100% - 28px)" : "4px",
                backgroundColor: isLight ? "#0044DD" : "#0055FF",
                boxShadow: isLight
                  ? "0 2px 8px rgba(0,68,221,0.6)"
                  : "0 2px 8px rgba(0,85,255,0.6)",
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
        className="flex items-center gap-1 overflow-x-auto border-t border-[#1E2538] px-4 py-2 md:hidden"
      >
        {NAV_LINKS.map(({ to, label }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-current={isActive ? "page" : undefined}
              className={`whitespace-nowrap rounded-sm px-3 py-1.5 font-sans text-[11px] font-bold tracking-[0.14em] transition-colors ${
                isActive
                  ? "bg-[#0055FF]/20 text-white"
                  : "text-[#B8C4DE] hover:text-white"
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
