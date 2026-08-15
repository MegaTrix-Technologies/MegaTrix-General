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
  User,
  X,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Edit3,
  Star,
  Upload,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import MTLogo from "@/components/MTLogo";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console | MegaTrix" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
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
  gallery_images?: string[];
  created_at?: string;
  sort_order?: number;
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const uploadFileToWeb = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split(".").pop() || "png";
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data } = await supabase.storage
        .from("project-images")
        .upload(filePath, file, { upsert: true });

      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(filePath);
        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch {}

    // Fallback: Client-side Data URL conversion (100% works without external bucket setup)
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleBatchFileUpload = async (filesList: FileList | File[]) => {
    const files = Array.from(filesList);
    if (!files.length) return;
    setUploadingImage(true);

    let currentCover = imageUrl;
    const newGallery = [...galleryImages];

    for (const file of files) {
      const webUrl = await uploadFileToWeb(file);
      if (webUrl) {
        if (!currentCover) {
          currentCover = webUrl;
          setImageUrl(webUrl);
        } else if (newGallery.length < 10) {
          newGallery.push(webUrl);
        }
      }
    }

    setGalleryImages(newGallery);
    setUploadingImage(false);
  };

  const handleSetAsCover = (index: number) => {
    const selectedImage = galleryImages[index];
    const oldCover = imageUrl;

    setImageUrl(selectedImage);
    setGalleryImages((prev) => {
      const updated = [...prev];
      if (oldCover) {
        updated[index] = oldCover;
      } else {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  const handleRemoveCover = () => {
    if (galleryImages.length > 0) {
      const [first, ...rest] = galleryImages;
      setImageUrl(first);
      setGalleryImages(rest);
    } else {
      setImageUrl("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (isCover) {
      setUploadingImage(true);
      const webUrl = await uploadFileToWeb(files[0]);
      if (webUrl) setImageUrl(webUrl);
      setUploadingImage(false);
    } else {
      handleBatchFileUpload(files);
    }
    e.target.value = "";
  };

  const handleAddGalleryImage = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!galleryInput.trim()) return;
    if (galleryImages.length >= 10) {
      alert("MAXIMUM LIMIT REACHED: Admin can add a maximum of 10 gallery images per project.");
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

    const handleSubmissionsChange = () => fetchSubmissions();
    window.addEventListener("megatrix_submissions_updated", handleSubmissionsChange);
    window.addEventListener("storage", handleSubmissionsChange);
    return () => {
      window.removeEventListener("megatrix_submissions_updated", handleSubmissionsChange);
      window.removeEventListener("storage", handleSubmissionsChange);
    };
  }, []);

  const fetchProjects = async () => {
    let localMap: Record<string, Project> = {};
    try {
      const cached = localStorage.getItem("megatrix_local_projects");
      if (cached) localMap = JSON.parse(cached);
    } catch {}

    let res = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (res.error && (res.error.message.includes("sort_order") || res.error.code === "42703")) {
      res = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
    }

    if (res.data) {
      const mapped = (res.data as Project[]).map((p, idx) => {
        const local = localMap[p.id] || Object.values(localMap).find((l) => l.title === p.title);
        return {
          ...p,
          sort_order: p.sort_order ?? idx,
          gallery_images: (local?.gallery_images && local.gallery_images.length > 0)
            ? local.gallery_images
            : (p.gallery_images || []),
          image_url: local?.image_url || p.image_url,
          tools: local?.tools || p.tools,
          description: local?.description || p.description,
        };
      });

      // Include any local projects that aren't in Supabase yet
      Object.keys(localMap).forEach((id) => {
        if (!mapped.some((m) => m.id === id)) {
          mapped.push(localMap[id]);
        }
      });

      setProjects(mapped);
    } else if (Object.keys(localMap).length > 0) {
      setProjects(Object.values(localMap));
    }
  };

  const fetchContactInfo = async () => {
    try {
      const cached = localStorage.getItem("megatrix_contact_info");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.email) setContactEmail(parsed.email);
        if (parsed.address) setContactAddress(parsed.address);
        if (parsed.phone) setContactPhone(parsed.phone);
      }
    } catch {}

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
      try {
        localStorage.setItem(
          "megatrix_contact_info",
          JSON.stringify({
            email: data.email || "",
            address: data.address || "",
            phone: data.phone || "",
          })
        );
      } catch {}
    }
  };

  const fetchSubmissions = async () => {
    let localItems: ContactSubmission[] = [];
    try {
      const cached = localStorage.getItem("megatrix_contact_submissions");
      if (cached) localItems = JSON.parse(cached);
    } catch {}

    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      const dbIds = new Set(data.map((d) => d.id));
      const combined = [...data, ...localItems.filter((l) => !dbIds.has(l.id))];
      setSubmissions(combined as ContactSubmission[]);
    } else {
      setSubmissions(localItems);
    }
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

  const handleEditClick = (project: Project) => {
    setEditingProjectId(project.id);
    setTitle(project.title || "");
    setDescription(project.description || "");
    setTools(Array.isArray(project.tools) ? project.tools.join(", ") : "");
    setImageUrl(project.image_url || "");
    setGalleryImages(project.gallery_images || []);
    setGalleryInput("");
    setProjectLink(project.project_link || "");
    setGithubLink(project.github_link || "");
    setDeployedOn(project.deployed_on || "");
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setTitle("");
    setDescription("");
    setTools("");
    setImageUrl("");
    setGalleryImages([]);
    setGalleryInput("");
    setProjectLink("");
    setGithubLink("");
    setDeployedOn("");
  };

  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toolsArray = tools.split(",").map((t) => t.trim()).filter(Boolean);
    const targetId = editingProjectId || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `proj_${Date.now()}`);
    const nextOrder = projects.length > 0 ? Math.max(...projects.map(p => p.sort_order ?? 0)) + 1 : 0;
    
    const updatedRecord: Project = {
      id: targetId,
      title,
      description,
      tools: toolsArray,
      image_url: imageUrl.trim() || null,
      gallery_images: galleryImages,
      project_link: projectLink.trim() || null,
      github_link: githubLink.trim() || null,
      deployed_on: deployedOn.trim() || null,
      sort_order: editingProjectId ? (projects.find(p => p.id === editingProjectId)?.sort_order ?? 0) : nextOrder,
    };

    // Save to local cache immediately so gallery_images are preserved 100%
    try {
      const cached = localStorage.getItem("megatrix_local_projects");
      const localMap: Record<string, Project> = cached ? JSON.parse(cached) : {};
      localMap[targetId] = updatedRecord;
      localStorage.setItem("megatrix_local_projects", JSON.stringify(localMap));
      window.dispatchEvent(new Event("megatrix_projects_updated"));
    } catch {}

    const payload: Record<string, unknown> = {
      id: targetId,
      title,
      description,
      tools: toolsArray,
      image_url: imageUrl.trim() || null,
      gallery_images: galleryImages,
      project_link: projectLink.trim() || null,
      github_link: githubLink.trim() || null,
      deployed_on: deployedOn.trim() || null,
    };

    if (editingProjectId === null) {
      payload.sort_order = nextOrder;
    }

    let err: { message: string; code?: string } | null = null;

    if (editingProjectId) {
      const res = await supabase.from("projects").update(payload as never).eq("id", editingProjectId);
      err = res.error;
      if (err && (err.message.includes("gallery_images") || err.message.includes("sort_order") || err.message.includes("schema cache") || err.code === "42703")) {
        const fallbackPayload = { ...payload };
        delete fallbackPayload.gallery_images;
        delete fallbackPayload.sort_order;
        const res2 = await supabase.from("projects").update(fallbackPayload as never).eq("id", editingProjectId);
        err = res2.error;
      }
    } else {
      // Use UPSERT with targetId to prevent creating duplicate rows!
      const res = await supabase.from("projects").upsert([payload as never], { onConflict: "id" });
      err = res.error;
      if (err && (err.message.includes("gallery_images") || err.message.includes("sort_order") || err.message.includes("schema cache") || err.code === "42703")) {
        const fallbackPayload = { ...payload };
        delete fallbackPayload.gallery_images;
        delete fallbackPayload.sort_order;
        const res2 = await supabase.from("projects").upsert([fallbackPayload as never], { onConflict: "id" });
        err = res2.error;
      }
    }

    setProjects((prev) => {
      const exists = prev.some((p) => p.id === targetId);
      if (exists) {
        return prev.map((p) => (p.id === targetId ? updatedRecord : p));
      } else {
        return [updatedRecord, ...prev];
      }
    });

    handleCancelEdit();
    setSaving(false);
  };

  const handleDeleteProject = async (id: string) => {
    const targetProj = projects.find((p) => p.id === id);
    
    // 1. Remove from local storage cache
    try {
      const cached = localStorage.getItem("megatrix_local_projects");
      if (cached) {
        const localMap: Record<string, Project> = JSON.parse(cached);
        delete localMap[id];
        if (targetProj?.title) {
          Object.keys(localMap).forEach((k) => {
            if (localMap[k].title?.trim().toLowerCase() === targetProj.title.trim().toLowerCase()) {
              delete localMap[k];
            }
          });
        }
        localStorage.setItem("megatrix_local_projects", JSON.stringify(localMap));
        window.dispatchEvent(new Event("megatrix_projects_updated"));
      }
    } catch {}

    // 2. Remove from React UI state immediately
    setProjects((prev) => prev.filter((p) => p.id !== id));

    // 3. Delete from Supabase (handling valid UUIDs vs legacy non-UUID IDs)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUUID) {
      await supabase.from("projects").delete().eq("id", id);
    } else if (targetProj?.title) {
      await supabase.from("projects").delete().eq("title", targetProj.title);
    }

    fetchProjects();
  };

  const handleMoveProject = async (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const temp = updated[currentIndex];
    updated[currentIndex] = updated[targetIndex];
    updated[targetIndex] = temp;

    const finalizedUpdates = updated.map((p, idx) => ({
      ...p,
      sort_order: idx,
    }));

    setProjects(finalizedUpdates);

    try {
      for (const item of finalizedUpdates) {
        const { error } = await supabase
          .from("projects")
          .update({ sort_order: item.sort_order } as never)
          .eq("id", item.id);
        if (error && (error.message.includes("sort_order") || error.message.includes("schema cache") || error.code === "42703")) {
          break;
        }
      }
    } catch {}
  };

  const handleSaveContact = async (e: FormEvent) => {
    e.preventDefault();
    setSavingContact(true);
    setContactSavedMsg("");

    const contactPayload = {
      email: contactEmail,
      address: contactAddress,
      phone: contactPhone,
    };

    try {
      localStorage.setItem("megatrix_contact_info", JSON.stringify(contactPayload));
      window.dispatchEvent(new Event("megatrix_contact_updated"));
    } catch (err) {
      console.error(err);
    }

    let err: { message: string } | null = null;
    if (contactId) {
      const res = await supabase.from("contact_info").update({
        ...contactPayload,
        updated_at: new Date().toISOString(),
      } as never).eq("id", contactId);
      err = res.error;
    } else {
      const res = await supabase.from("contact_info").insert([contactPayload as never]).select().single();
      err = res.error;
      if (res.data) {
        setContactId((res.data as { id: string }).id);
      }
    }

    if (err) {
      if (err.message.includes("contact_info") || err.message.includes("schema cache")) {
        setContactSavedMsg("SAVED TO LOCAL STORAGE (Database table 'contact_info' not found in Supabase schema).");
        setTimeout(() => setContactSavedMsg(""), 5000);
      } else {
        alert("Error saving contact info: " + err.message);
      }
    } else {
      setContactSavedMsg("CONTACT SETTINGS SAVED SUCCESSFULLY ON SUPABASE.");
      setTimeout(() => setContactSavedMsg(""), 3500);
      fetchContactInfo();
    }
    setSavingContact(false);
  };

  const handleUpdateSubmissionStatus = async (id: string, status: string) => {
    try {
      const cached = JSON.parse(localStorage.getItem("megatrix_contact_submissions") || "[]");
      const updated = cached.map((item: { id: string; status: string }) =>
        item.id === id ? { ...item, status } : item
      );
      localStorage.setItem("megatrix_contact_submissions", JSON.stringify(updated));
    } catch {}

    await supabase.from("contact_submissions").update({ status } as never).eq("id", id);
    fetchSubmissions();
    if (selectedSubmission?.id === id) {
      setSelectedSubmission((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    try {
      const cached = JSON.parse(localStorage.getItem("megatrix_contact_submissions") || "[]");
      const filtered = cached.filter((item: { id: string }) => item.id !== id);
      localStorage.setItem("megatrix_contact_submissions", JSON.stringify(filtered));
    } catch {}

    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error && !error.message.includes("contact_submissions") && !error.message.includes("schema cache")) {
      alert("ERROR DELETING TRANSMISSION: " + error.message);
    }
    if (selectedSubmission?.id === id) setSelectedSubmission(null);
    fetchSubmissions();
  };

  if (!isAuthed) {
    return (
      <div className="relative min-h-screen bg-[#090A0F] text-white font-sans flex items-center justify-center px-4">
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
              className="inline-flex items-center justify-center gap-2.5 border border-[#0055FF] bg-[#0055FF]/15 px-6 py-3.5 font-sans text-xs font-bold tracking-widest text-white hover:bg-[#0055FF] hover:shadow-[0_0_25px_rgba(0,85,255,0.5)] transition-all w-full"
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
    <div className="relative min-h-screen bg-[#090A0F] text-white font-sans">
      <div className="pointer-events-none fixed inset-0 retro-grid opacity-30" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-40" />

      <Navbar />

      {/* BACK BUTTON */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 pt-8">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 border border-[#1E2538] bg-black px-4 py-2 font-sans text-xs font-bold tracking-widest text-[#B8C4DE] hover:text-white hover:border-[#0055FF] hover:shadow-[0_0_15px_rgba(0,85,255,0.2)] transition-all rounded-sm"
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
              className="inline-flex items-center gap-2 border border-[#0055FF] bg-[#0055FF]/15 px-4 py-2.5 font-sans text-xs font-bold tracking-widest text-white hover:bg-[#0055FF] hover:shadow-[0_0_20px_rgba(0,85,255,0.4)] transition-all"
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
                <label className="block text-[11px] tracking-widest text-[#B8C4DE] font-semibold mb-2">
                  OFFICE ADDRESS / LOCATION *
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  placeholder="100 Cybernetic Way, Suite 400..."
                  className="w-full border border-[#1E2538] bg-[#090A0F] p-3.5 text-sm text-white focus:outline-none focus:border-[#0055FF] focus:shadow-[0_0_15px_rgba(0,85,255,0.25)] rounded-sm transition-all"
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

            {/* ADD / EDIT PROJECT FORM */}
            <form
              onSubmit={handleAddProject}
              className="space-y-3 border border-[#1E2538] bg-[#12151E] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="flex items-center gap-2 text-xs font-bold tracking-widest text-white">
                  {editingProjectId ? <Edit3 size={14} className="text-[#0055FF]" /> : <Plus size={14} className="text-[#0055FF]" />}
                  {editingProjectId ? "EDIT PROJECT RECORD" : "ADD NEW PROJECT"}
                </h2>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-[10px] font-bold text-red-400 hover:underline tracking-wider"
                  >
                    CANCEL EDIT
                  </button>
                )}
              </div>

              <Field label="PROJECT TITLE *" required value={title} onChange={setTitle} placeholder="e.g. AsanShipping SaaS" />

              <div>
                <label className="block text-[11px] tracking-widest text-[#B8C4DE] font-semibold mb-1">
                  TECHNOLOGIES USED (COMMA-SEPARATED) *
                </label>
                <p className="text-[10px] text-[#7C89A8] mb-2 font-mono">
                  Separate tech stack items with commas (e.g. React, TypeScript, TailwindCSS, Supabase, Node.js)
                </p>
                <input
                  type="text"
                  required
                  value={tools}
                  onChange={(e) => setTools(e.target.value)}
                  placeholder="React, TypeScript, TailwindCSS, Supabase, Node.js"
                  className="w-full border border-[#1E2538] bg-[#090A0F] p-3.5 text-sm text-white focus:outline-none focus:border-[#0055FF] focus:shadow-[0_0_15px_rgba(0,85,255,0.25)] rounded-sm transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-widest text-[#B8C4DE] font-semibold mb-2">
                  DESCRIPTION *
                </label>
                <textarea
                  required
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed project summary..."
                  className="w-full border border-[#1E2538] bg-[#090A0F] p-3.5 text-sm text-white focus:outline-none focus:border-[#0055FF] focus:shadow-[0_0_15px_rgba(0,85,255,0.25)] rounded-sm transition-all"
                />
              </div>

              {/* ADVANCED MULTI-IMAGE MEDIA MANAGER */}
              <div className="space-y-4 border border-[#1E2538] bg-[#090A0F] p-4 rounded-sm">
                <div className="flex items-center justify-between border-b border-[#1E2538] pb-2">
                  <span className="text-[11px] font-bold tracking-widest text-[#0055FF] flex items-center gap-1.5">
                    <ImageIcon size={14} />
                    PROJECT MEDIA GALLERY & COVER MANAGER
                  </span>
                  <span className="text-[10px] font-bold text-[#CBD5E1] font-mono">
                    {galleryImages.length} / 10 GALLERY IMAGES
                  </span>
                </div>

                {/* BATCH UPLOAD DROPZONE */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleBatchFileUpload(e.dataTransfer.files);
                    }
                  }}
                  className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed transition-all rounded-sm text-center ${
                    isDragging
                      ? "border-[#0055FF] bg-[#0055FF]/20"
                      : "border-[#1E2538] bg-[#12151E] hover:border-[#0055FF]/50"
                  }`}
                >
                  <Upload size={24} className="mb-2 text-[#0055FF]" />
                  <p className="text-xs font-bold tracking-widest text-white mb-1">
                    DRAG & DROP MULTIPLE IMAGES HERE
                  </p>
                  <p className="text-[10px] text-[#7C89A8] mb-3">
                    Upload up to 10 project images at once (First file auto-sets as Cover image)
                  </p>
                  <label className="inline-flex items-center gap-2 border border-[#0055FF] bg-[#0055FF] px-4 py-2 text-xs font-bold text-white hover:bg-[#0044cc] cursor-pointer transition-all shadow-[0_0_15px_rgba(0,85,255,0.4)]">
                    <Upload size={14} />
                    {uploadingImage ? "PROCESSING MEDIA..." : "SELECT MEDIA FILES (MULTI-SELECT)"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) handleBatchFileUpload(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>

                {/* COVER IMAGE PREVIEW CARD */}
                <div>
                  <label className="block text-[10px] tracking-widest text-[#B8C4DE] font-semibold mb-1.5 flex items-center justify-between">
                    <span>PRIMARY COVER IMAGE</span>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        className="text-[9px] text-red-400 hover:underline"
                      >
                        REMOVE COVER
                      </button>
                    )}
                  </label>
                  {imageUrl ? (
                    <div className="relative aspect-video w-full overflow-hidden border-2 border-[#0055FF] bg-[#12151E] group shadow-[0_0_20px_rgba(0,85,255,0.25)]">
                      <img src={imageUrl} alt="Cover Preview" className="h-full w-full object-cover" />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 border border-[#0055FF] bg-black/80 px-2.5 py-1 text-[9px] font-bold text-[#00FFFF] backdrop-blur-sm">
                        <Star size={11} className="fill-[#00FFFF]" />
                        PRIMARY COVER IMAGE
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        className="absolute top-2 right-2 rounded bg-red-600/90 p-1 text-white hover:bg-red-700"
                        title="Remove cover image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex aspect-video w-full flex-col items-center justify-center border border-dashed border-[#1E2538] bg-[#12151E] text-center p-4">
                      <ImageIcon size={24} className="mb-2 text-[#1E2538]" />
                      <p className="text-[10px] tracking-widest text-[#7C89A8]">
                        NO COVER IMAGE SET YET
                      </p>
                      <p className="text-[9px] text-[#0055FF] mt-1 font-mono">
                        Upload images above or click "Set as Cover" on any gallery thumbnail below
                      </p>
                    </div>
                  )}
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or paste Cover Image URL..."
                      className="flex-1 border border-[#1E2538] bg-[#12151E] p-2.5 text-xs text-white focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>
                </div>

                {/* GALLERY IMAGES GRID (MAX 10) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] tracking-widest text-[#B8C4DE] font-semibold">
                      GALLERY IMAGES ({galleryImages.length} / 10)
                    </label>
                  </div>

                  {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {galleryImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-video overflow-hidden border border-[#1E2538] bg-[#12151E]"
                        >
                          <img src={img} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover" />
                          <div className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 text-[8px] font-bold text-white border border-[#1E2538]">
                            #{idx + 1}
                          </div>
                          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                            <button
                              type="button"
                              onClick={() => handleSetAsCover(idx)}
                              className="w-full flex items-center justify-center gap-1 border border-[#0055FF] bg-[#0055FF] px-1.5 py-1 text-[9px] font-bold text-white hover:bg-[#0044cc]"
                            >
                              <Star size={10} />
                              MAKE COVER
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="w-full flex items-center justify-center gap-1 border border-red-500/50 bg-red-950/80 px-1.5 py-1 text-[9px] font-bold text-red-300 hover:bg-red-900"
                            >
                              <Trash2 size={10} />
                              REMOVE
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#7C89A8] italic font-mono border border-dashed border-[#1E2538] p-3 text-center">
                      No additional gallery images added yet.
                    </p>
                  )}

                  {/* PASTE DIRECT URL FOR GALLERY */}
                  <div className="mt-2.5 flex gap-2">
                    <input
                      type="text"
                      value={galleryInput}
                      onChange={(e) => setGalleryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddGalleryImage(e);
                        }
                      }}
                      placeholder="Paste single Gallery Image URL..."
                      disabled={galleryImages.length >= 10}
                      className="flex-1 border border-[#1E2538] bg-[#12151E] p-2.5 text-xs text-white focus:outline-none focus:border-[#0055FF] disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryImage}
                      disabled={galleryImages.length >= 10 || !galleryInput.trim()}
                      className="border border-[#0055FF] bg-[#0055FF]/20 px-3 py-1.5 text-xs font-bold text-[#0055FF] hover:bg-[#0055FF] hover:text-white disabled:opacity-50 transition-all"
                    >
                      + ADD URL
                    </button>
                  </div>
                </div>
              </div>

              <Field label="LIVE PROJECT LINK (OPTIONAL)" value={projectLink} onChange={setProjectLink} placeholder="https://megatrix.dev" type="url" />
              <Field label="GITHUB REPO LINK (OPTIONAL)" value={githubLink} onChange={setGithubLink} placeholder="https://github.com/..." type="url" />
              <Field label="DEPLOYED ON (OPTIONAL)" value={deployedOn} onChange={setDeployedOn} placeholder="Vercel, AWS, Render..." />

              <button
                type="submit"
                disabled={saving}
                className="mt-2 w-full bg-[#0055FF] py-3 text-xs font-bold tracking-widest text-white shadow-[0_0_20px_rgba(0,85,255,0.4)] hover:bg-[#0044cc] disabled:opacity-50"
              >
                {saving ? "SAVING RECORD..." : editingProjectId ? "UPDATE PROJECT" : "PUBLISH PROJECT"}
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
              projects.map((p, index) => (
                <div
                  key={`${p.id}-${p.sort_order ?? index}`}
                  className="flex items-center justify-between gap-4 border border-[#1E2538] bg-[#12151E] p-4"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#0055FF]">#{index + 1}</span>
                      <h3 className="text-sm font-bold text-white">{p.title}</h3>
                    </div>
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

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 border border-[#1E2538] bg-[#090A0F] p-1 rounded-sm">
                      <button
                        type="button"
                        onClick={() => handleMoveProject(index, "up")}
                        disabled={index === 0}
                        className="p-1 text-[#7C89A8] hover:text-white hover:bg-[#1E2538] disabled:opacity-25 transition-all rounded-xs"
                        title="Move project up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveProject(index, "down")}
                        disabled={index === projects.length - 1}
                        className="p-1 text-[#7C89A8] hover:text-white hover:bg-[#1E2538] disabled:opacity-25 transition-all rounded-xs"
                        title="Move project down"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEditClick(p)}
                      className="flex items-center gap-1.5 border border-[#0055FF]/40 bg-[#0055FF]/10 px-3 py-1.5 text-xs font-bold text-[#0055FF] hover:bg-[#0055FF] hover:text-white transition-all rounded-sm"
                      title="Edit project details"
                    >
                      <Edit3 size={13} />
                      EDIT
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteProject(p.id)}
                      className="border border-transparent p-2 text-red-400 hover:border-red-500/50 hover:bg-red-950/40 rounded-sm transition-all"
                      title="Delete project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
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
      <label className="block text-[11px] tracking-widest text-[#B8C4DE] font-semibold mb-2">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#1E2538] bg-[#090A0F] p-3.5 text-sm text-white focus:outline-none focus:border-[#0055FF] focus:shadow-[0_0_15px_rgba(0,85,255,0.25)] rounded-sm transition-all"
      />
    </div>
  );
}