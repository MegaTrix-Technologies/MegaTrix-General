import { Link, useLocation } from "@tanstack/react-router";
import { Terminal } from "lucide-react";
import MTLogo from "@/components/MTLogo";

// Main navigation header links configuration
const NAV_LINKS = [
  { to: "/", label: "HOME" },
  { to: "/projects", label: "PROJECTS" },
  { to: "/architecture", label: "ARCHITECTURE" },
] as const;

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1E2538] bg-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-black/65">
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

        {/* PRIMARY ACTION */}
        <Link
          to="/contact"
          className="group flex shrink-0 items-center gap-2 rounded-sm bg-[#0055FF] px-4 py-2.5 font-sans text-[11px] font-bold tracking-[0.14em] text-white shadow-[0_6px_20px_-8px_rgba(0,85,255,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1A66FF] hover:shadow-[0_10px_28px_-8px_rgba(0,85,255,1)] md:px-5 md:text-[13px]"
        >
          <Terminal size={15} className="transition-transform duration-200 group-hover:scale-110" />
          CONTACT US
        </Link>
      </div>

      {/* MOBILE NAVIGATION ROW — links were previously unreachable below md */}
      <div className="flex items-center gap-1 overflow-x-auto border-t border-[#1E2538] px-4 py-2 md:hidden">
        {NAV_LINKS.map(({ to, label }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-current={isActive ? "page" : undefined}
              className={`whitespace-nowrap rounded-sm px-3 py-1.5 font-sans text-[11px] font-bold tracking-[0.14em] transition-colors ${
                isActive
                  ? "bg-[#0055FF]/15 text-white"
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
