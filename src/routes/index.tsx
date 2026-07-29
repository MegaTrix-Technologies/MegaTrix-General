import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Terminal,
  Cpu,
  ShieldCheck,
  Layers,
  ArrowRight,
  Code2,
} from "lucide-react";
import Preloader from "@/components/Preloader";
import MTLogo from "@/components/MTLogo";
import AnimatedMTLogo from "@/components/AnimatedMTLogo";
import logoNav from "@/assets/mt-white-on-black.png.asset.json";



export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [loading, setLoading] = useState(true);

  if (loading) return <Preloader onComplete={() => setLoading(false)} />;

  return (
    <div className="relative min-h-screen bg-[#090A0F] text-white">
      <div className="pointer-events-none fixed inset-0 iso-blocks opacity-60" />
      <div className="pointer-events-none fixed inset-0 retro-grid opacity-20" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-25" />
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />

      {/* NAV */}
      <nav className="relative z-10 border-b border-[#1E2538] bg-[#090A0F]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-3">
            <img src={logoNav.url} alt="MEGATRIX" className="h-8 w-auto" />
          </a>
          <div className="hidden gap-8 text-[11px] tracking-widest text-[#B8C4DE] md:flex">
            <a href="#projects" className="hover:text-white">// PROJECTS</a>
            <a href="#architecture" className="hover:text-white">// ARCHITECTURE</a>
            <a href="#contact" className="hover:text-white">// CONTACT</a>
          </div>
          <a
            href="#contact"
            className="flex items-center gap-2 border border-[#2A3552] bg-[#12151E] px-3 py-2 text-[10px] tracking-widest text-white hover:border-[#0055FF] hover:text-[#0055FF]"
          >
            <Terminal size={12} />
            CONTACT
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <div className="mb-6 inline-flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-3 py-1.5 text-[10px] tracking-widest text-[#B8C4DE]">
              <Terminal size={12} className="text-[#0055FF]" />
              ENTERPRISE SOFTWARE ENGINEERING & ARCHITECTURE
            </div>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              BUILDING NEXT-GEN
              <br />
              <span className="text-[#0055FF] glow-text">DIGITAL SYSTEMS</span> & PLATFORMS
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#B8C4DE] md:text-base">
              Megatrix delivers high-performance full-stack applications, secure cloud
              infrastructure, and custom artificial intelligence pipelines with
              uncompromising execution.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 bg-[#0055FF] px-6 py-3 text-xs font-bold tracking-widest text-white shadow-[0_0_25px_rgba(0,85,255,0.4)] transition-all hover:bg-[#0044cc]"
              >
                EXPLORE WORK
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-[#1E2538] px-6 py-3 text-xs font-bold tracking-widest text-white hover:border-[#0055FF] hover:text-[#0055FF]"
              >
                <Code2 size={14} />
                INITIATE PROJECT
              </a>
            </div>
          </div>

          {/* Animated pixel logo — builds dot by dot, then restarts */}
          <div className="hidden md:block">
            <div className="relative border border-[#1E2538] bg-[#0B0D14]/70 p-6 shadow-[0_0_60px_-20px_rgba(0,85,255,0.5)]">
              <div className="mb-3 flex items-center justify-between text-[9px] tracking-widest text-[#B8C4DE]">
                <span className="text-[#0055FF]">// RENDER_MT.exe</span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0055FF]" />
                  BUILDING
                </span>
              </div>
              <AnimatedMTLogo className="h-52 w-auto" />
              <div className="mt-3 text-center text-[9px] tracking-[0.35em] text-[#B8C4DE]">
                M E G A T R I X
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="relative z-10 border-t border-[#1E2538] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 max-w-2xl">
            <div className="mb-2 text-[10px] tracking-widest text-[#0055FF]">
              // CORE COMPETENCIES
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">ENGINEERED FOR SCALE</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#B8C4DE]">
              We build robust digital architecture combining retro-futuristic design
              principles with cutting-edge backend engineering.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                Icon: Layers,
                title: "Full-Stack Ecosystems",
                body: "High-performance web applications built using Next.js, React, Node.js, and scalable cloud databases.",
              },
              {
                Icon: ShieldCheck,
                title: "Secure Infrastructure",
                body: "Hardened authentication mechanisms, role-based access control, and encrypted data pipelines.",
              },
              {
                Icon: Cpu,
                title: "AI & RAG Pipelines",
                body: "Custom machine learning models, retrieval-augmented generation systems, and automated intelligence.",
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="group border border-[#1E2538] bg-[#12151E] p-6 transition-all hover:border-[#0055FF] hover:shadow-[0_0_25px_rgba(0,85,255,0.2)]"
              >
                <Icon size={28} className="text-[#0055FF]" />
                <h3 className="mt-5 text-base font-bold">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#B8C4DE]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="relative z-10 border-t border-[#1E2538] py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3">
            <MTLogo variant="white" className="h-5 w-auto" />
            <span className="text-[10px] tracking-widest text-[#B8C4DE]">
              © 2026 MEGATRIX SOFTWARE HOUSE. ALL RIGHTS RESERVED.
            </span>
          </div>
          <div className="flex gap-6 text-[10px] tracking-widest text-[#B8C4DE]">
            <a href="#projects" className="hover:text-white">Projects</a>
            <a href="#architecture" className="hover:text-white">Architecture</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

