import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Layers, ShieldCheck, Cpu, Terminal, ArrowRight, ArrowLeft, Code2, Database, Network, Server } from "lucide-react";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import MTLogo from "@/components/MTLogo";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture | MegaTrix" },
      { name: "description", content: "Core competencies, high-throughput systems, and architectural standards at MegaTrix." },
      { property: "og:title", content: "Architecture | MegaTrix" },
    ],
  }),
  component: ArchitecturePage,
});

function ArchitecturePage() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "var(--mt-bg)", color: "var(--mt-text)" }}>
      <div className="pointer-events-none fixed inset-0 iso-blocks opacity-60" />
      <div className="pointer-events-none fixed inset-0 retro-grid opacity-20" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-25" />
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />

      {/* REUSABLE NAVBAR */}
      <Navbar />

      {/* BACK BUTTON */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 pt-8">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 px-4 py-2 font-mono text-xs font-bold tracking-widest transition-all rounded-sm border"
          style={{
            borderColor: "var(--mt-border)",
            backgroundColor: "var(--mt-bg-card)",
            color: "var(--mt-text-secondary)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--mt-blue)";
            (e.currentTarget as HTMLElement).style.color = "var(--mt-text-heading)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--mt-border)";
            (e.currentTarget as HTMLElement).style.color = "var(--mt-text-secondary)";
          }}
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" style={{ color: "var(--mt-blue)" }} />
          RETURN TO BASE
        </Link>
      </div>

      {/* HERO / HEADER */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 py-10 md:py-16">

        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl" style={{ color: "var(--mt-text-heading)" }}>
          ENGINEERED FOR <span className="glow-text" style={{ color: "var(--mt-blue)" }}>UNCOMPROMISING SCALE</span>
        </h1>
        <p className="mt-6 max-w-3xl text-base md:text-lg leading-relaxed" style={{ color: "var(--mt-text-body)" }}>
          Our engineering principles blend retro-futuristic precision with modern, production-grade cloud microservices, vector intelligence, and resilient event-driven architectures.
        </p>
      </section>

      {/* COMPETENCIES GRID */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              Icon: Layers,
              title: "Full-Stack Ecosystems",
              tag: "DISTRIBUTED SYSTEMS",
              body: "High-performance web applications built using Next.js, React, Node.js, and scalable multi-tenant databases.",
              details: ["React / Next.js SSR & CSR", "TypeScript Type Safety", "Express & FastAPI APIs", "REST & GraphQL Services"],
            },
            {
              Icon: ShieldCheck,
              title: "Secure Infrastructure",
              tag: "HARDENED BACKEND",
              body: "Hardened authentication mechanisms, role-based access control, IVR fraud verification, and encrypted data pipelines.",
              details: ["JWT & RLS Security", "BullMQ Event Queues", "Redis Distributed Caching", "Rate-limiting Gateways"],
            },
            {
              Icon: Cpu,
              title: "AI & Vector Pipelines",
              tag: "MACHINE LEARNING",
              body: "Custom machine learning models, retrieval-augmented generation (RAG) systems, Naive Bayes classifiers, and NLP processing.",
              details: ["TF-IDF & Naive Bayes NLP", "Scikit-Learn & PyTorch", "Levenshtein String Matching", "FastAPI AI Inference"],
            },
            {
              Icon: Database,
              title: "Data Persistence & Caching",
              tag: "HIGH-THROUGHPUT STORAGE",
              body: "Multi-layered database systems featuring PostgreSQL, Supabase RLS, MongoDB multi-tenant schemas, and in-memory LRU caches.",
              details: ["PostgreSQL & Supabase", "MongoDB Indexing", "Redis Cache Invalidation", "Prisma & Mongoose ORM"],
            },
            {
              Icon: Network,
              title: "Webhooks & Automation",
              tag: "REAL-TIME EVENTS",
              body: "Asynchronous webhook consumers for Shopify, WooCommerce, and payment processors with retry guarantees.",
              details: ["Real-time Webhook Listeners", "Shopify & WooCommerce Sync", "IVR Voice Telephony Integration", "Automated Email Alerts"],
            },
            {
              Icon: Server,
              title: "Cloud & DevOps",
              tag: "INFRASTRUCTURE DEPLOYMENT",
              body: "Containerized application deployment using Docker, Vercel edge networks, AWS cloud infrastructure, and Render background workers.",
              details: ["Vercel Edge Functions", "Docker Containers", "AWS Cloud Services", "CI/CD Pipeline Automation"],
            },
          ].map(({ Icon, title, tag, body, details }) => (
            <div
              key={title}
              className="group border-2 p-8 transition-all rounded-sm flex flex-col justify-between"
              style={{ borderColor: "var(--mt-border)", backgroundColor: "var(--mt-bg-card)" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--mt-blue)";
                el.style.boxShadow = "0 0 35px rgba(0,68,221,0.25)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--mt-border)";
                el.style.boxShadow = "none";
              }}
            >
              <div>
                <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: "var(--mt-border)" }}>
                  <Icon size={32} style={{ color: "var(--mt-blue)" }} />
                  <span className="font-mono text-xs font-bold tracking-widest" style={{ color: "var(--mt-blue)" }}>{tag}</span>
                </div>
                <h3
                  className="text-xl md:text-2xl font-extrabold transition-colors"
                  style={{ color: "var(--mt-text-heading)" }}
                >
                  {title}
                </h3>
                <p className="mt-3.5 text-sm md:text-base leading-relaxed" style={{ color: "var(--mt-text-body)" }}>{body}</p>
              </div>

              <div className="mt-8 border-t pt-4" style={{ borderColor: "var(--mt-border)" }}>
                <div className="mb-3 font-mono text-xs font-bold tracking-widest" style={{ color: "var(--mt-blue)" }}>SPECIFICATIONS</div>
                <ul className="space-y-2 text-xs md:text-sm font-medium" style={{ color: "var(--mt-text-soft)" }}>
                  {details.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--mt-blue)" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CALL TO ACTION */}
        <div className="mt-16 border-2 p-10 text-center rounded-sm" style={{ borderColor: "var(--mt-border)", backgroundColor: "var(--mt-bg-card)" }}>
          <h3 className="text-2xl font-extrabold" style={{ color: "var(--mt-text-heading)" }}>READY TO BUILD YOUR NEXT SYSTEM?</h3>
          <p className="mt-2.5 text-sm md:text-base" style={{ color: "var(--mt-text-body)" }}>
            Initiate a project transmission or explore our catalog of completed architecture solutions.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 font-sans text-xs md:text-sm font-bold tracking-widest text-white transition-all"
              style={{ backgroundColor: "var(--mt-blue)", boxShadow: "0 0 20px rgba(0,68,221,0.4)" }}
            >
              <Code2 size={16} />
              CONTACT US
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 border px-7 py-3.5 font-sans text-xs md:text-sm font-bold tracking-widest transition-all"
              style={{ borderColor: "var(--mt-border)", backgroundColor: "var(--mt-bg-card)", color: "var(--mt-text-secondary)" }}
            >
              EXPLORE PROJECTS
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ENHANCED FOOTER */}
      <Footer />
    </div>
  );
}
