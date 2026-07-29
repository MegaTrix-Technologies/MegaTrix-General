import { Link } from "@tanstack/react-router";
import { Terminal, Mail, Phone, MapPin, ArrowUpRight, Cpu, ShieldCheck, Globe } from "lucide-react";
import MTLogo from "@/components/MTLogo";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-20 border-t-2 border-[#1E2538] bg-black text-white font-sans">
      {/* RETRO GRID OVERLAY */}
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-15" />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-20" />

      {/* TOP SECTION GRID */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* COLUMN 1: BRAND & MISSION */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <MTLogo className="h-10 w-auto" />
            </Link>
            <p className="text-xs md:text-sm leading-relaxed text-[#CBD5E1]">
              Megatrix delivers high-performance full-stack web applications, hardened cloud infrastructure, and custom artificial intelligence pipelines with uncompromising execution.
            </p>
            <div className="inline-flex items-center gap-2 border border-[#1E2538] bg-[#090A0F] px-3.5 py-1.5 font-mono text-xs text-[#0055FF]">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              SYSTEM STATUS: 100% OPERATIONAL
            </div>
          </div>

          {/* COLUMN 2: QUICK NAVIGATION */}
          <div>
            <h3 className="mb-4 font-mono text-xs font-bold tracking-widest text-[#0055FF] flex items-center gap-2">
              <Terminal size={14} />
              NAVIGATION ARCHIVE
            </h3>
            <ul className="space-y-2.5 font-sans text-xs md:text-sm font-semibold text-[#CBD5E1]">
              <li>
                <Link to="/" className="hover:text-[#0055FF] transition-colors flex items-center gap-1.5">
                  &rarr; Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[#0055FF] transition-colors flex items-center gap-1.5">
                  &rarr; Projects Catalog
                </Link>
              </li>
              <li>
                <Link to="/architecture" className="hover:text-[#0055FF] transition-colors flex items-center gap-1.5">
                  &rarr; System Architecture
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#0055FF] transition-colors flex items-center gap-1.5">
                  &rarr; Contact Us
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#0055FF] transition-colors flex items-center gap-1.5 text-[#7C89A8]">
                  &rarr; Command Center (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CORE ENGINEERING SERVICES */}
          <div>
            <h3 className="mb-4 font-mono text-xs font-bold tracking-widest text-[#0055FF] flex items-center gap-2">
              <Cpu size={14} />
              CORE COMPETENCIES
            </h3>
            <ul className="space-y-2.5 text-xs md:text-sm text-[#CBD5E1]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0055FF]" />
                Full-Stack SaaS Ecosystems
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0055FF]" />
                Cloud & DevOps Pipelines
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0055FF]" />
                AI & RAG Vector Inference
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0055FF]" />
                Multi-Tenant Databases
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0055FF]" />
                IVR Telephony & Fraud Control
              </li>
            </ul>
          </div>

          {/* COLUMN 4: DIRECT HEADQUARTERS & CONTACT */}
          <div>
            <h3 className="mb-4 font-mono text-xs font-bold tracking-widest text-[#0055FF] flex items-center gap-2">
              <Globe size={14} />
              COMMAND NODE CONTACT
            </h3>
            <ul className="space-y-3 text-xs md:text-sm text-[#CBD5E1]">
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="text-[#0055FF] flex-shrink-0 mt-0.5" />
                <a href="mailto:contact@megatrix.com" className="hover:text-white break-all">
                  contact@megatrix.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#0055FF] flex-shrink-0" />
                <a href="tel:+18005550199" className="hover:text-white">
                  +1 (800) 555-0199
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#0055FF] flex-shrink-0 mt-0.5" />
                <span>100 Cybernetic Way, Suite 400, San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT & TOP RETURN BAR */}
      <div className="relative z-10 border-t border-[#1E2538] bg-[#090A0F] py-6">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-8 md:px-12">
          <div className="font-mono text-xs tracking-widest text-[#94A3B8]">
            © 2026 MEGATRIX SOFTWARE HOUSE. ALL RIGHTS RESERVED.
          </div>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 border border-[#1E2538] bg-black px-4 py-2 font-mono text-xs font-bold tracking-widest text-[#CBD5E1] hover:border-[#0055FF] hover:text-white transition-all"
          >
            RETURN TO TOP
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
