import { Link, useLocation } from "@tanstack/react-router";
import { Terminal } from "lucide-react";
import MTLogo from "@/components/MTLogo";

export default function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="relative z-50 border-b border-[#1E2538] bg-black">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 md:px-12 py-3.5">
        <div className="flex items-center gap-12">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <MTLogo className="h-10 w-auto" />
          </Link>

          {/* CLEAN, CRISP NAVIGATION LINKS */}
          <div className="hidden gap-8 font-sans text-xs md:text-sm font-bold tracking-widest text-[#B8C4DE] md:flex">
            <Link
              to="/"
              className={`transition-colors hover:text-white ${pathname === "/" ? "text-white underline underline-offset-8 decoration-[#0055FF] decoration-2" : ""
                }`}
            >
              HOME
            </Link>
            <Link
              to="/projects"
              className={`transition-colors hover:text-white ${pathname === "/projects" ? "text-white underline underline-offset-8 decoration-[#0055FF] decoration-2" : ""
                }`}
            >
              PROJECTS
            </Link>
            <Link
              to="/architecture"
              className={`transition-colors hover:text-white ${pathname === "/architecture" ? "text-white underline underline-offset-8 decoration-[#0055FF] decoration-2" : ""
                }`}
            >
              ARCHITECTURE
            </Link>
          </div>
        </div>

        {/* PROMINENT RIGHT ACTION BUTTON */}
        <Link
          to="/contact"
          className="group flex items-center gap-2 border border-[#0055FF] bg-[#0055FF] px-5 py-2.5 font-sans text-xs md:text-sm font-bold tracking-widest text-white shadow-[0_0_20px_rgba(0,85,255,0.4)] hover:bg-[#0044cc] hover:shadow-[0_0_30px_rgba(0,85,255,0.6)] transition-all"
        >
          <Terminal size={15} />
          CONTACT US
        </Link>
      </div>
    </nav>
  );
}
