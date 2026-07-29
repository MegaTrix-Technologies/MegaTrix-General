import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  Plus,
  Trash2,
  ArrowLeft,
  LogOut,
  Mail,
  Save,
  Check,
  Inbox,
  Paperclip,
  ExternalLink,
  MessageSquare,
  Clock,
  Phone,
  User,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
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

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  attachments: string[];
  status: string;
  created_at: string;
}

function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tools, setTools] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryInput, setGalleryInput] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [deployedOn, setDeployedOn] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddGalleryImage = () => {
    if (!galleryInput.trim()) return;
    if (galleryImages.length >= 10) {
      alert("MAXIMUM LIMIT REACHED: Admin can add a maximum of 10 images per project.");
      return;
    }
    setGalleryImages((prev) => [...prev, galleryInput.trim()]);
    setGalleryInput("");
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Contact Info state
  const [contactId, setContactId] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState("contact@megatrix.com");
  const [contactAddress, setContactAddress] = useState("100 Cybernetic Way, Suite 400, San Francisco, CA 94107");
  const [contactPhone, setContactPhone] = useState("+1 (800) 555-0199");
  const [savingContact, setSavingContact] = useState(false);
  const [contactSavedMsg, setContactSavedMsg] = useState("");

  // Client Submissions State
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("megatrix_admin_auth") === "true") {
      setIsAuthed(true);
      fetchProjects();
      fetchContactInfo();
      fetchSubmissions();
    }
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProjects(data as Project[]);
  };

  const fetchContactInfo = async () => {
    const { data } = await supabase
      .from("contact_info")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (data) {
      setContactId(data.id);
      setContactEmail(data.email || "");
      setContactAddress(data.address || "");
      setContactPhone(data.phone || "");
    }
  };

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSubmissions(data as ContactSubmission[]);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setIsAuthed(true);
      localStorage.setItem("megatrix_admin_auth", "true");
      setError("");
      fetchProjects();
      fetchContactInfo();
      fetchSubmissions();
    } else {
      setError("ACCESS DENIED: Invalid credentials.");
    }
  };

  const handleLogout = () => {
    setIsAuthed(false);
    localStorage.removeItem("megatrix_admin_auth");
  };

  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toolsArray = tools.split(",").map((t) => t.trim()).filter(Boolean);
    const payload: Record<string, unknown> = {
      title,
      description,
      tools: toolsArray,
    };
    if (imageUrl) payload.image_url = imageUrl;
    if (galleryImages.length > 0) payload.gallery_images = galleryImages;
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
      setGalleryImages([]);
      setGalleryInput("");
      setProjectLink("");
      setGithubLink("");
      setDeployedOn("");
      fetchProjects();
    }
    setSaving(false);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project record?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  };

  const handleSaveContact = async (e: FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    setContactSavedMsg("");

    let err: { message: string } | null = null;
    if (contactId) {
      const res = await supabase.from("contact_info").update({
        email: contactEmail,
        address: contactAddress,
        phone: contactPhone,
        updated_at: new Date().toISOString(),
      } as never).eq("id", contactId);
      err = res.error;
    } else {
      const res = await supabase.from("contact_info").insert([{
        email: contactEmail,
        address: contactAddress,
        phone: contactPhone,
      }] as never).select().single();
      err = res.error;
      if (res.data) {
        setContactId((res.data as { id: string }).id);
      }
    }

    if (err) {
      alert("Error saving contact info: " + err.message);
    } else {
      setContactSavedMsg("CONTACT SETTINGS SAVED SUCCESSFULLY");
      setTimeout(() => setContactSavedMsg(""), 3500);
      fetchContactInfo();
    }
    setSavingContact(false);
  };

  const handleUpdateSubmissionStatus = async (id: string, status: string) => {
    await supabase.from("contact_submissions").update({ status } as never).eq("id", id);
    fetchSubmissions();
    if (selectedSubmission?.id === id) {
      setSelectedSubmission((prev) => prev ? { ...prev, status } : null);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm("Delete this client transmission record?")) return;
    await supabase.from("contact_submissions").delete().eq("id", id);
    if (selectedSubmission?.id === id) setSelectedSubmission(null);
    fetchSubmissions();
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
              <MTLogo variant="white" showText={false} />
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
              className="inline-flex items-center justify-center gap-2.5 border border-[#0055FF] bg-[#0055FF]/15 px-6 py-3.5 font-pixel text-[11px] font-bold tracking-widest text-white hover:bg-[#0055FF] hover:shadow-[0_0_25px_rgba(0,85,255,0.5)] transition-all w-full"
            >
              <ArrowLeft size={16} />
              RETURN TO PUBLIC WEBSITE
            </Link>
          </div>
        </form>
      </div>
    );
  }

  const newSubmissionsCount = submissions.filter((s) => s.status === "NEW").length;

  return (
    <div className="relative min-h-screen bg-[#090A0F] text-white font-mono">
      <div className="pointer-events-none fixed inset-0 retro-grid opacity-30" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-40" />

      <Navbar />

      {/* BACK BUTTON */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 pt-8">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 border border-[#1E2538] bg-black px-4 py-2 font-mono text-xs font-bold tracking-widest text-[#B8C4DE] hover:text-white hover:border-[#0055FF] hover:shadow-[0_0_15px_rgba(0,85,255,0.2)] transition-all rounded-sm"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5 text-[#0055FF]" />
          RETURN TO BASE
        </Link>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 py-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2538] pb-6">
          <div className="flex items-center gap-3">
            <Link to="/">
              <MTLogo className="h-10 w-auto" />
            </Link>
            <div className="border-l border-[#1E2538] pl-3 ml-1">
              <h1 className="text-xs font-bold tracking-widest">COMMAND CENTER</h1>
              <p className="text-[9px] tracking-widest text-[#7C89A8]">
                LOGGED IN AS: {ADMIN_EMAIL}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-[#0055FF] bg-[#0055FF]/15 px-4 py-2.5 font-pixel text-[10px] font-bold tracking-widest text-white hover:bg-[#0055FF] hover:shadow-[0_0_20px_rgba(0,85,255,0.4)] transition-all"
            >
              <ArrowLeft size={14} />
              RETURN TO SITE
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

        {/* CLIENT INQUIRIES / SUBMISSIONS PANEL */}
        <div className="mb-10 border border-[#1E2538] bg-[#12151E] p-6 shadow-[0_0_30px_rgba(0,85,255,0.1)]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2538] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center border border-[#0055FF] bg-[#0055FF]/20 text-[#0055FF]">
                <Inbox size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold tracking-widest text-white">
                  CLIENT INQUIRIES & TRANSMISSIONS ({submissions.length})
                </h2>
                <p className="text-[10px] tracking-widest text-[#7C89A8]">
                  RECEIVED FORM TRANSMISSIONS FROM PROSPECTIVE CLIENTS
                </p>
              </div>
            </div>
            {newSubmissionsCount > 0 && (
              <span className="border border-[#0055FF] bg-[#0055FF]/20 px-3 py-1 text-[10px] font-bold tracking-widest text-[#0055FF]">
                {newSubmissionsCount} NEW TRANSMISSION{newSubmissionsCount > 1 ? "S" : ""}
              </span>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* SUBMISSION LIST */}
            <div className="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {submissions.length === 0 ? (
                <div className="border border-dashed border-[#1E2538] bg-[#090A0F] p-8 text-center text-[10px] tracking-widest text-[#7C89A8]">
                  NO CLIENT TRANSMISSIONS RECORDED YET.
                </div>
              ) : (
                submissions.map((sub) => {
                  const isSelected = selectedSubmission?.id === sub.id;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubmission(sub);
                        if (sub.status === "NEW") handleUpdateSubmissionStatus(sub.id, "READ");
                      }}
                      className={`cursor-pointer border p-4 transition-all ${
                        isSelected
                          ? "border-[#0055FF] bg-[#0055FF]/10 shadow-[0_0_15px_rgba(0,85,255,0.2)]"
                          : "border-[#1E2538] bg-[#090A0F] hover:border-[#0055FF]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] tracking-widest">
                        <span className="font-bold text-[#0055FF]">{sub.subject}</span>
                        <span
                          className={`px-1.5 py-0.5 text-[8px] font-bold tracking-widest ${
                            sub.status === "NEW"
                              ? "bg-[#0055FF] text-white"
                              : sub.status === "REPLIED"
                              ? "bg-green-900/60 text-green-400"
                              : "border border-[#1E2538] text-[#7C89A8]"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      <div className="mt-2 text-xs font-bold text-white flex items-center gap-1.5">
                        <User size={12} className="text-[#7C89A8]" />
                        {sub.name}
                      </div>
                      <div className="text-[10px] text-[#7C89A8] truncate">{sub.email}</div>

                      <div className="mt-2 text-[9px] text-[#7C89A8] flex items-center justify-between pt-2 border-t border-[#1E2538]">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(sub.created_at).toLocaleDateString()}
                        </span>
                        {sub.attachments?.length > 0 && (
                          <span className="flex items-center gap-1 text-[#0055FF]">
                            <Paperclip size={10} />
                            {sub.attachments.length} ATTACHMENT{sub.attachments.length > 1 ? "S" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* SUBMISSION DETAIL VIEW */}
            <div className="lg:col-span-2 border border-[#1E2538] bg-[#090A0F] p-6">
              {selectedSubmission ? (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E2538] pb-4">
                    <div>
                      <div className="text-[9px] tracking-widest text-[#0055FF]">SUBJECT</div>
                      <h3 className="text-base font-bold text-white">{selectedSubmission.subject}</h3>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={selectedSubmission.status}
                        onChange={(e) => handleUpdateSubmissionStatus(selectedSubmission.id, e.target.value)}
                        className="border border-[#1E2538] bg-[#12151E] px-3 py-1 text-[10px] font-bold tracking-widest text-white focus:outline-none focus:border-[#0055FF]"
                      >
                        <option value="NEW">STATUS: NEW</option>
                        <option value="READ">STATUS: READ</option>
                        <option value="REPLIED">STATUS: REPLIED</option>
                      </select>
                      <button
                        onClick={() => handleDeleteSubmission(selectedSubmission.id)}
                        className="border border-red-500/40 p-1.5 text-red-400 hover:bg-red-950/40"
                        title="Delete Transmission"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3 border-b border-[#1E2538] pb-4 text-xs">
                    <div>
                      <div className="text-[9px] tracking-widest text-[#7C89A8]">CLIENT NAME</div>
                      <div className="font-bold text-white mt-0.5">{selectedSubmission.name}</div>
                    </div>
                    <div>
                      <div className="text-[9px] tracking-widest text-[#7C89A8]">EMAIL ADDRESS</div>
                      <a
                        href={`mailto:${selectedSubmission.email}`}
                        className="font-bold text-[#0055FF] hover:underline mt-0.5 block truncate"
                      >
                        {selectedSubmission.email}
                      </a>
                    </div>
                    <div>
                      <div className="text-[9px] tracking-widest text-[#7C89A8]">PHONE / CONTACT</div>
                      <div className="font-bold text-white mt-0.5">
                        {selectedSubmission.phone ? (
                          <a href={`tel:${selectedSubmission.phone}`} className="hover:text-[#0055FF]">
                            {selectedSubmission.phone}
                          </a>
                        ) : (
                          "NOT PROVIDED"
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 text-[9px] tracking-widest text-[#7C89A8]">
                      PROJECT REQUIREMENTS & MESSAGE
                    </div>
                    <div className="border border-[#1E2538] bg-[#12151E] p-4 text-xs leading-relaxed text-[#B8C4DE] whitespace-pre-wrap">
                      {selectedSubmission.message}
                    </div>
                  </div>

                  {/* ATTACHMENTS */}
                  {selectedSubmission.attachments && selectedSubmission.attachments.length > 0 && (
                    <div>
                      <div className="mb-2 text-[9px] tracking-widest text-[#0055FF]">
                        ATTACHED SPECIFICATION DOCUMENTS & IMAGES ({selectedSubmission.attachments.length})
                      </div>
                      <div className="space-y-2">
                        {selectedSubmission.attachments.map((link, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between border border-[#1E2538] bg-[#12151E] p-3 text-xs"
                          >
                            <span className="truncate max-w-md text-[#B8C4DE]">{link}</span>
                            <a
                              href={link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] tracking-widest text-[#0055FF] hover:underline"
                            >
                              <ExternalLink size={12} />
                              OPEN LINK
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-3 border-t border-[#1E2538]">
                    <a
                      href={`mailto:${selectedSubmission.email}?subject=RE: ${encodeURIComponent(
                        selectedSubmission.subject,
                      )}`}
                      onClick={() => handleUpdateSubmissionStatus(selectedSubmission.id, "REPLIED")}
                      className="inline-flex items-center gap-2 bg-[#0055FF] px-4 py-2 text-xs font-bold tracking-widest text-white shadow-[0_0_15px_rgba(0,85,255,0.4)] hover:bg-[#0044cc]"
                    >
                      <MessageSquare size={14} />
                      REPLY VIA EMAIL
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center text-center text-[10px] tracking-widest text-[#7C89A8]">
                  <Inbox size={32} className="mb-3 text-[#1E2538]" />
                  SELECT A TRANSMISSION RECORD FROM THE LIST TO VIEW FULL DETAILS & ATTACHMENTS.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT COLUMN: FORMS */}
          <div className="lg:col-span-1 space-y-8">
            {/* CONTACT SETTINGS FORM */}
            <form
              onSubmit={handleSaveContact}
              className="space-y-3 border border-[#1E2538] bg-[#12151E] p-5 shadow-[0_0_20px_rgba(0,85,255,0.08)]"
            >
              <h2 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-white">
                <Mail size={14} className="text-[#0055FF]" />
                CONTACT DETAILS SETTINGS
              </h2>

              {contactSavedMsg && (
                <div className="flex items-center gap-2 border border-green-500/50 bg-green-950/40 p-2.5 text-[10px] tracking-widest text-green-400">
                  <Check size={12} />
                  {contactSavedMsg}
                </div>
              )}

              <Field
                label="EMAIL ADDRESS *"
                required
                type="email"
                value={contactEmail}
                onChange={setContactEmail}
                placeholder="contact@megatrix.com"
              />

              <Field
                label="CONTACT PHONE / DIRECT LINE *"
                required
                value={contactPhone}
                onChange={setContactPhone}
                placeholder="+1 (800) 555-0199"
              />

              <div>
                <label className="block text-[10px] tracking-widest text-[#7C89A8] mb-1">
                  OFFICE ADDRESS / LOCATION *
                </label>
                <textarea
                  required
                  rows={3}
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  placeholder="100 Cybernetic Way, Suite 400..."
                  className="w-full border border-[#1E2538] bg-[#090A0F] p-2.5 text-xs text-white focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <button
                type="submit"
                disabled={savingContact}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-[#0055FF] py-3 text-xs font-bold tracking-widest text-white shadow-[0_0_20px_rgba(0,85,255,0.4)] hover:bg-[#0044cc] disabled:opacity-50"
              >
                <Save size={14} />
                {savingContact ? "SAVING..." : "UPDATE CONTACT INFO"}
              </button>
            </form>

            {/* ADD PROJECT FORM */}
            <form
              onSubmit={handleAddProject}
              className="space-y-3 border border-[#1E2538] bg-[#12151E] p-5"
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
              <Field label="COVER IMAGE URL (OPTIONAL)" value={imageUrl} onChange={setImageUrl} placeholder="https://..." type="url" />

              {/* GALLERY IMAGES (MAX 10) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] tracking-widest text-[#7C89A8]">
                    ADDITIONAL GALLERY IMAGES (MAX 10)
                  </label>
                  <span className="text-[9px] text-[#0055FF] font-bold">
                    {galleryImages.length} / 10 IMAGES
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                    placeholder="https://image-link.png"
                    disabled={galleryImages.length >= 10}
                    className="flex-1 border border-[#1E2538] bg-[#090A0F] p-2.5 text-xs text-white focus:outline-none focus:border-[#0055FF] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    disabled={galleryImages.length >= 10}
                    className="border border-[#0055FF] bg-[#0055FF]/20 px-3 py-2 text-[10px] font-bold text-[#0055FF] hover:bg-[#0055FF] hover:text-white disabled:opacity-50 transition-all"
                  >
                    + ADD
                  </button>
                </div>

                {galleryImages.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative h-12 w-16 overflow-hidden border border-[#1E2538] bg-[#090A0F]"
                      >
                        <img src={img} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute right-0.5 top-0.5 bg-red-600/90 p-0.5 text-white hover:bg-red-700"
                          title="Remove image"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
          </div>

          {/* RIGHT COLUMN: PROJECT LIST */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xs font-bold tracking-widest text-[#7C89A8]">
              EXISTING DATABASE RECORDS ({projects.length})
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
                    onClick={() => handleDeleteProject(p.id)}
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