import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Terminal, Mail, Phone, MapPin, ArrowUpRight, Cpu, Globe } from "lucide-react";
import MTLogo from "@/components/MTLogo";
import { supabase } from "@/integrations/supabase/client";

/**
 * Footer component displaying site navigation links, dynamic contact information from Supabase/cache, and social branding.
 */
export default function Footer() {
  const [contact, setContact] = useState({
    email: "contact@megatrix.com",
    phone: "+1 (800) 555-0199",
    address: "100 Cybernetic Way, Suite 400, San Francisco, CA 94107",
  });

  useEffect(() => {
    const updateFromCacheOrDB = async () => {
      try {
        const cached = localStorage.getItem("megatrix_contact_info");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.email || parsed.phone || parsed.address) {
            setContact((prev) => ({
              email: parsed.email || prev.email,
              phone: parsed.phone || prev.phone,
              address: parsed.address || prev.address,
            }));
          }
        }
      } catch {}

      try {
        const { data } = await supabase
          .from("contact_info")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (data) {
          setContact({
            email: data.email || "contact@megatrix.com",
            address: data.address || "100 Cybernetic Way, Suite 400, San Francisco, CA 94107",
            phone: data.phone || "+1 (800) 555-0199",
          });
        }
      } catch {}
    };

    updateFromCacheOrDB();

    const handleStorageChange = () => {
      updateFromCacheOrDB();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("megatrix_contact_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("megatrix_contact_updated", handleStorageChange);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-footer relative z-20 border-t-2 border-[#1E2538] bg-black text-white font-sans" style={{ backgroundColor: "#090A0F", color: "#F8FAFC", borderTopColor: "#1E2538" }}>
      {/* RETRO GRID OVERLAY */}
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-15" />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-20" />

      {/* TOP SECTION GRID */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* COLUMN 1: BRAND & MISSION */}
          <div className="space-y-4">
            {/* LOGO — pixel art flips to Orbitron wordmark on hover */}
            <Link
              to="/"
              aria-label="Megatrix home"
              className="group relative inline-flex h-12 items-center overflow-hidden"
            >
              {/* LAYER 1: Pixel-art MT mark (default visible, slides up + fades out on hover) */}
              <span
                className="absolute inset-0 flex items-center transition-all duration-300 ease-out group-hover:-translate-y-full group-hover:opacity-0"
                aria-hidden="true"
              >
                <MTLogo className="h-10 w-auto" />
              </span>

              {/* LAYER 2: Orbitron wordmark (slides up + fades in on hover) */}
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
                    color: "#FFFFFF",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                  }}
                >
                  MegaTrix
                </span>
              </span>

              {/* Invisible spacer — reserves width for the wordmark */}
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
              {[
                { to: "/", label: "Home" },
                { to: "/projects", label: "Projects Catalog" },
                { to: "/architecture", label: "System Architecture" },
                { to: "/contact", label: "Contact Us" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group inline-flex items-center gap-2 transition-colors hover:text-white"
                  >
                    <span className="text-[#0055FF] transition-transform duration-200 group-hover:translate-x-1">
                      &rarr;
                    </span>
                    <span className="link-underline">{label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/admin"
                  className="group inline-flex items-center gap-2 text-[#7C89A8] transition-colors hover:text-[#B8C4DE]"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                  <span className="link-underline">Command Center (Admin)</span>
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
                <Mail size={16} className="mt-0.5 shrink-0 text-[#0055FF]" />
                <a href={`mailto:${contact.email}`} className="link-underline break-all hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-[#0055FF]" />
                <a href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`} className="link-underline hover:text-white">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#0055FF]" />
                <span className="leading-6">{contact.address}</span>
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
