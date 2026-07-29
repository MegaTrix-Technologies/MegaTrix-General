import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  Plus,
  Trash2,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import MTLogo from "@/components/MTLogo";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const ADMIN_EMAIL = "admin@megatrix.com";
const ADMIN_PASS = "megatrix2026";

interface Project {
  id: string;
  title: string;
  description: string;
  tools: string[];
  image_url: string | null;
  project_link: string | null;
  github_link: string | null;
  deployed_on: string | null;
}

function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tools, setTools] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [deployedOn, setDeployedOn] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("megatrix_admin_auth") === "true") {
      setIsAuthed(true);
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProjects(data as Project[]);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setIsAuthed(true);
      localStorage.setItem("megatrix_admin_auth", "true");
      setError("");
      fetchProjects();
    } else {
      setError("ACCESS DENIED: Invalid credentials.");
    }
  };

  const handleLogout = () => {
    setIsAuthed(false);
    localStorage.removeItem("megatrix_admin_auth");
  };

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toolsArray = tools.split(",").map((t) => t.trim()).filter(Boolean);
    const payload: Record<string, unknown> = {
      title,
      description,
      tools: toolsArray,
    };
    if (imageUrl) payload.image_url = imageUrl;
    if (projectLink) payload.project_link = projectLink;
    if (githubLink) payload.github_link = githubLink;
    if (deployedOn) payload.deployed_on = deployedOn;

    const { error: err } = await supabase.from("projects").insert([payload as never]);
    if (err) {
      alert("Error adding project: " + err.message);
    } else {
      setTitle("");
      setDescription("");
      setTools("");
      setImageUrl("");
      setProjectLink("");
      setGithubLink("");
      setDeployedOn("");
      fetchProjects();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project record?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  };

  if (!isAuthed) {
    return (
      <div className="relative min-h-screen bg-[#090A0F] text-white font-mono flex items-center justify-center px-4">
        <div className="pointer-events-none fixed inset-0 retro-grid opacity-30" />
        <div className="pointer-events-none fixed inset-0 scanlines opacity-40" />

        <form
          onSubmit={handleLogin}
          className="relative z-10 w-full max-w-md border border-[#1E2538] bg-[#12151E] p-8 shadow-[0_0_40px_rgba(0,85,255,0.15)]"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center bg-[#0055FF] p-2 shadow-[0_0_20px_rgba(0,85,255,0.4)]">
              <MTLogo variant="white" className="h-full w-auto" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest">ADMIN PORTAL</h1>
              <p className="text-[10px] tracking-widest text-[#7C89A8]">
                MEGATRIX SECURITY GATEWAY
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 border border-red-500/50 bg-red-950/40 p-3 text-[11px] tracking-widest text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-widest text-[#7C89A8] mb-1.5">
                ADMIN EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@megatrix.com"
                className="w-full border border-[#1E2538] bg-[#090A0F] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0055FF]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest text-[#7C89A8] mb-1.5">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[#1E2538] bg-[#090A0F] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#0055FF]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0055FF] py-3 text-xs font-bold tracking-widest text-white shadow-[0_0_20px_rgba(0,85,255,0.4)] hover:bg-[#0044cc]"
            >
              AUTHENTICATE
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[10px] tracking-widest text-[#7C89A8] hover:text-white"
            >
              <ArrowLeft size={12} />
              RETURN TO PUBLIC WEBSITE
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#090A0F] text-white font-mono">
      <div className="pointer-events-none fixed inset-0 retro-grid opacity-30" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2538] pb-6">
          <div className="flex items-center gap-3">
            <MTLogo variant="white" className="h-7 w-auto" />
            <div>
              <h1 className="text-sm font-bold tracking-widest">MEGATRIX // COMMAND CENTER</h1>
              <p className="text-[10px] tracking-widest text-[#7C89A8]">
                LOGGED IN AS: {ADMIN_EMAIL}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-[#1E2538] px-3 py-2 text-[10px] tracking-widest hover:border-[#0055FF] hover:text-[#0055FF]"
            >
              <ArrowLeft size={12} />
              VIEW SITE
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 border border-red-500/40 px-3 py-2 text-[10px] tracking-widest text-red-400 hover:bg-red-950/40"
            >
              <LogOut size={12} />
              LOGOUT
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* FORM */}
          <form
            onSubmit={handleAdd}
            className="lg:col-span-1 space-y-3 border border-[#1E2538] bg-[#12151E] p-5"
          >
            <h2 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest">
              <Plus size={14} className="text-[#0055FF]" />
              ADD NEW PROJECT
            </h2>

            <Field label="PROJECT TITLE *" required value={title} onChange={setTitle} placeholder="e.g. AsanShipping SaaS" />
            <div>
              <label className="block text-[10px] tracking-widest text-[#7C89A8] mb-1">
                DESCRIPTION *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed project summary..."
                className="w-full border border-[#1E2538] bg-[#090A0F] p-2.5 text-xs text-white focus:outline-none focus:border-[#0055FF]"
              />
            </div>
            <Field label="TOOLS & TECH (COMMA SEPARATED) *" required value={tools} onChange={setTools} placeholder="Next.js, Tailwind, Supabase" />
            <Field label="IMAGE URL (OPTIONAL)" value={imageUrl} onChange={setImageUrl} placeholder="https://..." type="url" />
            <Field label="LIVE PROJECT LINK (OPTIONAL)" value={projectLink} onChange={setProjectLink} placeholder="https://megatrix.dev" type="url" />
            <Field label="GITHUB REPO LINK (OPTIONAL)" value={githubLink} onChange={setGithubLink} placeholder="https://github.com/..." type="url" />
            <Field label="DEPLOYED ON (OPTIONAL)" value={deployedOn} onChange={setDeployedOn} placeholder="Vercel, AWS, Render..." />

            <button
              type="submit"
              disabled={saving}
              className="mt-2 w-full bg-[#0055FF] py-3 text-xs font-bold tracking-widest text-white shadow-[0_0_20px_rgba(0,85,255,0.4)] hover:bg-[#0044cc] disabled:opacity-50"
            >
              {saving ? "SAVING RECORD..." : "PUBLISH PROJECT"}
            </button>
          </form>

          {/* LIST */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xs font-bold tracking-widest text-[#7C89A8]">
              // EXISTING DATABASE RECORDS ({projects.length})
            </h2>
            {projects.length === 0 ? (
              <div className="border border-dashed border-[#1E2538] bg-[#12151E]/50 p-10 text-center text-[11px] tracking-widest text-[#7C89A8]">
                NO PROJECT ENTRIES FOUND.
              </div>
            ) : (
              projects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-4 border border-[#1E2538] bg-[#12151E] p-4"
                >
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-sm font-bold text-white">{p.title}</h3>
                    <p className="line-clamp-1 text-xs text-[#7C89A8]">{p.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {p.tools?.map((t, i) => (
                        <span
                          key={i}
                          className="border border-[#1E2538] bg-[#090A0F] px-1.5 py-0.5 text-[9px] tracking-widest text-[#7C89A8]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="border border-transparent p-2 text-red-400 hover:border-red-500/50 hover:bg-red-950/40"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] tracking-widest text-[#7C89A8] mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#1E2538] bg-[#090A0F] p-2.5 text-xs text-white focus:outline-none focus:border-[#0055FF]"
      />
    </div>
  );
}