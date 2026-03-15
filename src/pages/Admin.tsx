import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import imageCompression from "browser-image-compression";

// ─── Types ───────────────────────────────────────────────
interface Settings {
  id: string;
  school_name: string;
  motto: string;
  about: string;
  phone: string;
  email: string;
  primary_color: string;
  logo_url: string;
  hero_bg_url: string;
  about_image_url: string;
  map_url: string;
  notice_text: string;
  show_notice: boolean;
  notice_expires_at: string;
}
interface Download {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
}
interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  category: string;
  is_published: boolean;
}
interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  is_published: boolean;
}
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}
interface GalleryItem {
  id: string;

  title: string;
  image_url: string;
  category: string;
  sort_order: number;
  is_published: boolean;
}

type Tab =
  | "general"
  | "notice"
  | "images"
  | "downloads"
  | "events"
  | "testimonials"
  | "faqs"
  | "gallery"
  | "pages";

export default function Admin() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [_uploading, _setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [_uploadingField, _setUploadingField] = useState<string | null>(null);
  const [savedFields, setSavedFields] = useState<Record<string, boolean>>({});
  const [addingEvent, setAddingEvent] = useState(false);
  const [addingTestimonial, setAddingTestimonial] = useState(false);
  const [addingFaq, setAddingFaq] = useState(false);
  const [addingGallery, setAddingGallery] = useState(false);
  const [addingDownload, setAddingDownload] = useState(false);

  // New item states
  const [newDownloadTitle, setNewDownloadTitle] = useState("");
  const [newDownloadFile, setNewDownloadFile] = useState<File | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    category: "General",
  });
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "Parent",
    message: "",
    rating: 5,
  });
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    category: "General",
  });
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryCategory, setNewGalleryCategory] = useState("General");
  const [newGalleryFile, setNewGalleryFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    const [s, d, e, t, f, g] = await Promise.all([
      supabase.from("school_settings").select("*").order("id").limit(1),
      supabase
        .from("downloads")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true }),
      supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("faqs")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("gallery")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);
    setSettings(s.data?.[0] || null);
    setDownloads(d.data || []);
    setEvents(e.data || []);
    setTestimonials(t.data || []);
    setFaqs(f.data || []);
    setGallery(g.data || []);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const updateSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("school_settings")
      .update(settings)
      .eq("id", settings.id);
    setSaving(false);
    error
      ? showToast("Save failed: " + error.message, "error")
      : showToast("Settings saved!");
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    setUploadingField(field);
    setSavedFields((prev) => ({ ...prev, [field]: false }));
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      const path = `public/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("school-images")
        .upload(path, compressed);
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = supabase.storage.from("school-images").getPublicUrl(path);
      const { error: updateError } = await supabase
        .from("school_settings")
        .update({ [field]: publicUrl })
        .eq("id", settings.id);
      if (updateError) throw updateError;
      setSettings({ ...settings, [field]: publicUrl });
      setSavedFields((prev) => ({ ...prev, [field]: true }));
      showToast("Image saved!");
    } catch (err: any) {
      showToast("Upload failed: " + err.message, "error");
    }
    setUploadingField(null);
  };

  // ─── Downloads ───────────────────────────────────────────
  const uploadDownload = async () => {
    if (!newDownloadFile || !newDownloadTitle.trim()) {
      showToast("Fill in title and file", "error");
      return;
    }
    setAddingDownload(true);
    try {
      // Step 1: Check session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Session:", session?.user?.email);
      if (!session) throw new Error("Not logged in — no session found");

      // Step 2: Upload to storage
      const path = `public/${Date.now()}_${newDownloadFile.name}`;
      console.log("Uploading to path:", path);
      const { data: storageData, error: storageError } = await supabase.storage
        .from("school-files")
        .upload(path, newDownloadFile);
      console.log("Storage result:", storageData, storageError);
      if (storageError) throw new Error("Storage: " + storageError.message);

      // Step 3: Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("school-files").getPublicUrl(path);
      console.log("Public URL:", publicUrl);

      // Step 4: Insert into DB
      const { data: dbData, error: dbError } = await supabase
        .from("downloads")
        .insert({
          title: newDownloadTitle.trim(),
          file_url: publicUrl,
        })
        .select();
      console.log("DB insert result:", dbData, dbError);
      if (dbError) throw new Error("Database: " + dbError.message);

      setNewDownloadTitle("");
      setNewDownloadFile(null);
      await fetchAll();
      showToast("Document uploaded!");
    } catch (err: any) {
      console.error("Upload error:", err);
      showToast("Upload failed: " + err.message, "error");
    }
    setAddingDownload(false);
  };
  const deleteDownload = async (id: string) => {
    if (!confirm("Delete this download?")) return;
    await supabase.from("downloads").delete().eq("id", id);
    showToast("Deleted");
    fetchAll();
  };

  // ─── Events ──────────────────────────────────────────────
  const addEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) {
      showToast("Title and date are required", "error");
      return;
    }
    setAddingEvent(true);
    const { error } = await supabase
      .from("events")
      .insert({ ...newEvent, is_published: true });
    if (error) {
      showToast("Failed: " + error.message, "error");
      setAddingEvent(false);
      return;
    }
    setNewEvent({
      title: "",
      description: "",
      event_date: "",
      event_time: "",
      location: "",
      category: "General",
    });
    showToast("Event added!");
    fetchAll();
    setAddingEvent(false);
  };
  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    showToast("Event deleted");
    fetchAll();
  };
  const toggleEvent = async (id: string, current: boolean) => {
    await supabase
      .from("events")
      .update({ is_published: !current })
      .eq("id", id);
    fetchAll();
  };

  // ─── Testimonials ────────────────────────────────────────
  const addTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.message) {
      showToast("Name and message required", "error");
      return;
    }
    setAddingTestimonial(true);
    await supabase
      .from("testimonials")
      .insert({ ...newTestimonial, is_published: true });
    setNewTestimonial({ name: "", role: "Parent", message: "", rating: 5 });
    showToast("Testimonial added!");
    fetchAll();
    setAddingTestimonial(false);
  };
  const deleteTestimonial = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    showToast("Deleted");
    fetchAll();
  };
  const toggleTestimonial = async (id: string, current: boolean) => {
    await supabase
      .from("testimonials")
      .update({ is_published: !current })
      .eq("id", id);
    fetchAll();
  };

  // ─── FAQs ────────────────────────────────────────────────
  const addFaq = async () => {
    if (!newFaq.question || !newFaq.answer) {
      showToast("Question and answer required", "error");
      return;
    }
    setAddingFaq(true);
    const maxOrder = Math.max(0, ...faqs.map((f) => f.sort_order));
    await supabase.from("faqs").insert({ ...newFaq, sort_order: maxOrder + 1 });
    setNewFaq({ question: "", answer: "", category: "General" });
    showToast("FAQ added!");
    fetchAll();
    setAddingFaq(false);
  };
  const deleteFaq = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("faqs").delete().eq("id", id);
    showToast("Deleted");
    fetchAll();
  };

  // ─── Gallery ─────────────────────────────────────────────
  const uploadGalleryImage = async () => {
    if (!newGalleryFile) {
      showToast("Select an image", "error");
      return;
    }
    setAddingGallery(true);
    try {
      const compressed = await imageCompression(newGalleryFile, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      const path = `public/${Date.now()}_${newGalleryFile.name}`;
      await supabase.storage.from("school-images").upload(path, compressed);
      const {
        data: { publicUrl },
      } = supabase.storage.from("school-images").getPublicUrl(path);
      const maxOrder = Math.max(0, ...gallery.map((g) => g.sort_order));
      await supabase
        .from("gallery")
        .insert({
          title: newGalleryTitle,
          category: newGalleryCategory,
          image_url: publicUrl,
          sort_order: maxOrder + 1,
          is_published: true,
        });
      setNewGalleryTitle("");
      setNewGalleryFile(null);
      showToast("Image added to gallery!");
      fetchAll();
    } catch (err: any) {
      showToast("Upload failed: " + err.message, "error");
    }
    setAddingGallery(false);
  };
  const deleteGalleryItem = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("gallery").delete().eq("id", id);
    showToast("Deleted");
    fetchAll();
  };
  const toggleGallery = async (id: string, current: boolean) => {
    await supabase
      .from("gallery")
      .update({ is_published: !current })
      .eq("id", id);
    fetchAll();
  };

  // ─── Pages (site_sections) ───────────────────────────────
  const pageSlugs = [
    { slug: "about", label: "About Us" },
    { slug: "admissions", label: "Admissions" },
    { slug: "events", label: "Events" },
    { slug: "downloads", label: "Downloads" },
    { slug: "contact", label: "Contact" },
  ];
  const [pages, setPages] = useState<
    Record<string, { id?: string; title: string; content: string }>
  >({});
  const [savingPage, setSavingPage] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("site_sections")
      .select("*")
      .then(({ data }) => {
        const map: Record<string, any> = {};
        (data || []).forEach((s: any) => {
          map[s.slug] = s;
        });
        // Pre-fill with defaults for any missing slugs
        pageSlugs.forEach(({ slug, label }) => {
          if (!map[slug]) map[slug] = { title: label, content: "" };
        });
        setPages(map);
      });
  }, []);

  const savePage = async (slug: string) => {
    const page = pages[slug];
    if (!page) return;
    setSavingPage(slug);
    if (page.id) {
      await supabase
        .from("site_sections")
        .update({ title: page.title, content: page.content })
        .eq("id", page.id);
    } else {
      const { data } = await supabase
        .from("site_sections")
        .insert({ slug, title: page.title, content: page.content })
        .select()
        .single();
      if (data) setPages((prev) => ({ ...prev, [slug]: data }));
    }
    showToast(`${page.title} saved!`);
    setSavingPage(null);
  };
  const inputCls =
    "w-full border border-[#0a1628]/20 p-3 focus:outline-none focus:border-[#c9a84c] transition-colors text-[#0a1628] bg-white";
  const labelCls =
    "block text-xs font-bold uppercase tracking-widest text-[#0a1628]/50 mb-2";
  const btnPrimary =
    "px-6 py-3 bg-[#0a1628] text-[#c9a84c] text-xs font-bold tracking-widest uppercase hover:bg-[#c9a84c] hover:text-[#0a1628] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed";
  const btnDanger =
    "text-xs text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors font-bold";
  const sectionHead = (label: string) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px w-8 bg-[#c9a84c]" />
      <h2 className="text-xs text-[#c9a84c] tracking-[0.3em] uppercase font-bold">
        {label}
      </h2>
    </div>
  );

  if (!settings)
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8f5ef]">
        <div className="w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const tabs: { id: Tab; label: string; icon: string; count?: number }[] = [
    { id: "general", label: "School Info", icon: "🏫" },
    { id: "notice", label: "Notice", icon: "📢" },
    { id: "images", label: "Images", icon: "🖼️" },
    { id: "pages", label: "Pages", icon: "📝" },
    {
      id: "downloads",
      label: "Downloads",
      icon: "📁",
      count: downloads.length,
    },
    { id: "events", label: "Events", icon: "📅", count: events.length },
    {
      id: "testimonials",
      label: "Testimonials",
      icon: "💬",
      count: testimonials.length,
    },
    { id: "faqs", label: "FAQs", icon: "❓", count: faqs.length },
    { id: "gallery", label: "Gallery", icon: "🖼️", count: gallery.length },
  ];

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 text-sm font-bold shadow-xl transition-all ${toast.type === "success" ? "bg-[#0a1628] text-[#c9a84c]" : "bg-red-600 text-white"}`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#0a1628] px-8 py-5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#c9a84c] flex items-center justify-center font-black text-[#0a1628] text-lg">
            {settings.school_name?.[0] || "A"}
          </div>
          <div>
            <div
              className="text-white font-black text-lg leading-none"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Admin Panel
            </div>
            <div className="text-[#c9a84c] text-xs tracking-widest uppercase">
              {settings.school_name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="text-white/60 hover:text-[#c9a84c] text-xs tracking-widest uppercase transition-colors"
          >
            View Site →
          </a>
          <button
            onClick={logout}
            className="px-4 py-2 border border-red-400/40 text-red-400 hover:bg-red-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 bg-white border border-[#0a1628]/10 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 ${activeTab === tab.id ? "bg-[#0a1628] text-[#c9a84c]" : "text-[#0a1628]/50 hover:text-[#0a1628]"}`}
            >
              <span>{tab.icon}</span>
              <span className="hidden md:inline">{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-[#c9a84c]/20 text-[#c9a84c]" : "bg-[#0a1628]/10 text-[#0a1628]/40"}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── GENERAL ── */}
        {activeTab === "general" && (
          <div className="bg-white border border-[#0a1628]/10 p-8 space-y-6">
            {sectionHead("School Information")}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                ["School Name", "school_name"],
                ["Motto", "motto"],
                ["Phone", "phone"],
                ["Email", "email"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <input
                    className={inputCls}
                    value={(settings as any)[key] || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <div>
              <label className={labelCls}>About the School</label>
              <textarea
                rows={5}
                className={inputCls + " resize-none"}
                value={settings.about || ""}
                onChange={(e) =>
                  setSettings({ ...settings, about: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelCls}>Google Maps Embed URL</label>
              <input
                className={inputCls}
                placeholder="https://maps.google.com/..."
                value={settings.map_url || ""}
                onChange={(e) =>
                  setSettings({ ...settings, map_url: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelCls}>Primary Brand Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-12 h-10 border border-[#0a1628]/20 cursor-pointer"
                  value={settings.primary_color || "#0a1628"}
                  onChange={(e) =>
                    setSettings({ ...settings, primary_color: e.target.value })
                  }
                />
                <span className="text-[#0a1628]/50 text-sm">
                  {settings.primary_color}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-[#0a1628]/10">
              <button
                onClick={updateSettings}
                disabled={saving}
                className={btnPrimary}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* ── NOTICE ── */}
        {activeTab === "notice" && (
          <div className="bg-white border border-[#0a1628]/10 p-8 space-y-6">
            {sectionHead("Notice Board")}
            <div className="flex items-center gap-3 p-4 bg-[#f8f5ef] border border-[#0a1628]/10">
              <input
                type="checkbox"
                id="show_notice"
                className="w-4 h-4 accent-[#c9a84c]"
                checked={settings.show_notice || false}
                onChange={(e) =>
                  setSettings({ ...settings, show_notice: e.target.checked })
                }
              />
              <label
                htmlFor="show_notice"
                className="text-sm font-bold text-[#0a1628] tracking-wide uppercase"
              >
                Enable Notice Bar
              </label>
            </div>
            <div>
              <label className={labelCls}>Notice Text</label>
              <textarea
                rows={3}
                className={inputCls + " resize-none"}
                value={settings.notice_text || ""}
                onChange={(e) =>
                  setSettings({ ...settings, notice_text: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelCls}>Auto-hide After (optional)</label>
              <input
                type="datetime-local"
                className="border border-[#0a1628]/20 p-3 focus:outline-none focus:border-[#c9a84c] text-[#0a1628]"
                value={settings.notice_expires_at || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notice_expires_at: e.target.value,
                  })
                }
              />
            </div>
            {settings.show_notice && settings.notice_text && (
              <div className="bg-[#0a1628] flex items-center gap-3 px-4 py-2.5">
                <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
                <span className="text-[#c9a84c] text-xs font-bold tracking-widest uppercase">
                  Notice
                </span>
                <span className="text-white/80 text-sm">
                  {settings.notice_text}
                </span>
              </div>
            )}
            <div className="pt-4 border-t border-[#0a1628]/10">
              <button
                onClick={updateSettings}
                disabled={saving}
                className={btnPrimary}
              >
                {saving ? "Saving..." : "Save Notice"}
              </button>
            </div>
          </div>
        )}

        {/* ── IMAGES ── */}
        {activeTab === "images" && (
          <div className="bg-white border border-[#0a1628]/10 p-8 space-y-8">
            {sectionHead("Site Images")}
            <p className="text-xs text-[#0a1628]/40">
              Images are saved automatically when you select a file. Wait for
              the ✅ confirmation before leaving.
            </p>
            {[
              {
                field: "hero_bg_url",
                label: "Hero Background Image",
                hint: "Full-width banner. Recommended: 1920×1080px",
              },
              {
                field: "about_image_url",
                label: "About Section Image",
                hint: "Next to About Us text. Recommended: 800×600px",
              },
              {
                field: "logo_url",
                label: "School Logo",
                hint: "Shown in navbar. Use PNG with transparent background.",
              },
            ].map(({ field, label, hint }) => (
              <div
                key={field}
                className={`border p-6 transition-all duration-300 ${savedFields[field] ? "border-green-400/50 bg-green-50/30" : "border-[#0a1628]/10"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <label className={labelCls}>{label}</label>
                  {uploadingField === field && (
                    <div className="flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest">
                      <div className="w-3 h-3 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </div>
                  )}
                  {savedFields[field] && uploadingField !== field && (
                    <span className="text-green-600 text-xs font-bold uppercase tracking-widest">
                      ✅ Saved
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#0a1628]/40 mb-4">{hint}</p>
                {(settings as any)[field] && (
                  <img
                    src={(settings as any)[field]}
                    alt={label}
                    className="w-full max-h-48 object-cover mb-4 border border-[#0a1628]/10"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingField !== null}
                  onChange={(e) => handleImageUpload(e, field)}
                  className="text-sm text-[#0a1628]/60 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#0a1628] file:text-[#c9a84c] file:text-xs file:font-bold file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-[#c9a84c] hover:file:text-[#0a1628] file:transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
            ))}
          </div>
        )}

        {/* ── PAGES ── */}
        {activeTab === "pages" && (
          <div className="bg-white border border-[#0a1628]/10 p-8 space-y-6">
            {sectionHead("Page Content")}
            <p className="text-xs text-[#0a1628]/40 -mt-2">
              Edit the content shown in each navbar modal. Changes appear
              instantly on the website.
            </p>
            {pageSlugs.map(({ slug, label }) => {
              const page = pages[slug] || { title: label, content: "" };
              return (
                <div
                  key={slug}
                  className="border border-[#0a1628]/10 p-6 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-px w-6 bg-[#c9a84c]" />
                    <span className="text-[#c9a84c] text-xs font-bold tracking-widest uppercase">
                      {label}
                    </span>
                  </div>
                  <div>
                    <label className={labelCls}>Page Title</label>
                    <input
                      className={inputCls}
                      value={page.title}
                      onChange={(e) =>
                        setPages((prev) => ({
                          ...prev,
                          [slug]: { ...page, title: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Content</label>
                    <textarea
                      rows={5}
                      className={inputCls + " resize-none"}
                      value={page.content}
                      placeholder={`Write the content for the ${label} page...`}
                      onChange={(e) =>
                        setPages((prev) => ({
                          ...prev,
                          [slug]: { ...page, content: e.target.value },
                        }))
                      }
                    />
                    <p className="text-xs text-[#0a1628]/30 mt-1">
                      Tip: Use a blank line between paragraphs. Use • for bullet
                      points.
                    </p>
                  </div>
                  <button
                    onClick={() => savePage(slug)}
                    disabled={savingPage === slug}
                    className={btnPrimary}
                  >
                    {savingPage === slug ? "Saving..." : `Save ${label}`}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── DOWNLOADS ── */}
        {activeTab === "downloads" && (
          <div className="bg-white border border-[#0a1628]/10 p-8 space-y-8">
            {sectionHead("Downloads & Documents")}
            <div className="border border-dashed border-[#0a1628]/20 p-6 space-y-4">
              <p className={labelCls}>Add New Document</p>
              <input
                className={inputCls}
                placeholder="Document title e.g. 'Term 2 Newsletter'"
                value={newDownloadTitle}
                onChange={(e) => setNewDownloadTitle(e.target.value)}
              />
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={(e) =>
                  setNewDownloadFile(e.target.files?.[0] || null)
                }
                className="text-sm text-[#0a1628]/60 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#0a1628] file:text-[#c9a84c] file:text-xs file:font-bold file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-[#c9a84c] hover:file:text-[#0a1628] file:transition-all"
              />
              <button
                onClick={uploadDownload}
                disabled={
                  addingDownload || !newDownloadTitle || !newDownloadFile
                }
                className={btnPrimary}
              >
                {addingDownload ? "Uploading..." : "Upload Document"}
              </button>
            </div>
            <div className="space-y-2">
              {downloads.length === 0 ? (
                <p className="text-[#0a1628]/30 text-sm text-center py-8">
                  No documents yet
                </p>
              ) : (
                downloads.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-4 border border-[#0a1628]/10 hover:border-[#c9a84c]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0a1628] flex items-center justify-center">
                        <span className="text-[#c9a84c] text-[10px] font-bold">
                          PDF
                        </span>
                      </div>
                      <span className="text-[#0a1628] font-semibold text-sm">
                        {d.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <a
                        href={d.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#0a1628]/40 hover:text-[#c9a84c] uppercase tracking-widest"
                      >
                        View
                      </a>
                      <button
                        onClick={() => deleteDownload(d.id)}
                        className={btnDanger}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── EVENTS ── */}
        {activeTab === "events" && (
          <div className="bg-white border border-[#0a1628]/10 p-8 space-y-8">
            {sectionHead("Events")}
            <div className="border border-dashed border-[#0a1628]/20 p-6 space-y-4">
              <p className={labelCls}>Add New Event</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Title *</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Sports Day"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Date *</label>
                  <input
                    type="date"
                    className={inputCls}
                    value={newEvent.event_date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, event_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Time</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. 9:00 AM"
                    value={newEvent.event_time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, event_time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. School Hall"
                    value={newEvent.location}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, location: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select
                    className={inputCls}
                    value={newEvent.category}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, category: e.target.value })
                    }
                  >
                    {[
                      "General",
                      "Sports",
                      "Academic",
                      "Cultural",
                      "Meeting",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  rows={2}
                  className={inputCls + " resize-none"}
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />
              </div>
              <button
                onClick={addEvent}
                disabled={addingEvent}
                className={btnPrimary}
              >
                {addingEvent ? "Adding..." : "Add Event"}
              </button>
            </div>
            <div className="space-y-2">
              {events.length === 0 ? (
                <p className="text-[#0a1628]/30 text-sm text-center py-8">
                  No events yet
                </p>
              ) : (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between p-4 border border-[#0a1628]/10 hover:border-[#c9a84c]/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0a1628] text-sm">
                          {ev.title}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-full ${ev.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                        >
                          {ev.is_published ? "Live" : "Hidden"}
                        </span>
                      </div>
                      <div className="text-[#0a1628]/40 text-xs mt-1">
                        {ev.event_date} {ev.event_time && `· ${ev.event_time}`}{" "}
                        {ev.location && `· ${ev.location}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleEvent(ev.id, ev.is_published)}
                        className="text-xs text-[#0a1628]/40 hover:text-[#c9a84c] uppercase tracking-widest"
                      >
                        {ev.is_published ? "Hide" : "Show"}
                      </button>
                      <button
                        onClick={() => deleteEvent(ev.id)}
                        className={btnDanger}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── TESTIMONIALS ── */}
        {activeTab === "testimonials" && (
          <div className="bg-white border border-[#0a1628]/10 p-8 space-y-8">
            {sectionHead("Testimonials")}
            <div className="border border-dashed border-[#0a1628]/20 p-6 space-y-4">
              <p className={labelCls}>Add New Testimonial</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name *</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Mrs. Kamau"
                    value={newTestimonial.name}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Role</label>
                  <select
                    className={inputCls}
                    value={newTestimonial.role}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        role: e.target.value,
                      })
                    }
                  >
                    {["Parent", "Alumni", "Student", "Staff"].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Rating</label>
                  <select
                    className={inputCls}
                    value={newTestimonial.rating}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        rating: Number(e.target.value),
                      })
                    }
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Star{r !== 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Message *</label>
                <textarea
                  rows={3}
                  className={inputCls + " resize-none"}
                  value={newTestimonial.message}
                  onChange={(e) =>
                    setNewTestimonial({
                      ...newTestimonial,
                      message: e.target.value,
                    })
                  }
                />
              </div>
              <button
                onClick={addTestimonial}
                disabled={addingTestimonial}
                className={btnPrimary}
              >
                {addingTestimonial ? "Adding..." : "Add Testimonial"}
              </button>
            </div>
            <div className="space-y-2">
              {testimonials.length === 0 ? (
                <p className="text-[#0a1628]/30 text-sm text-center py-8">
                  No testimonials yet
                </p>
              ) : (
                testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-start justify-between p-4 border border-[#0a1628]/10 hover:border-[#c9a84c]/40 transition-colors gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#0a1628] text-sm">
                          {t.name}
                        </span>
                        <span className="text-[#0a1628]/40 text-xs">
                          {t.role}
                        </span>
                        <span className="text-[#c9a84c] text-xs">
                          {"★".repeat(t.rating)}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-full ${t.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                        >
                          {t.is_published ? "Live" : "Hidden"}
                        </span>
                      </div>
                      <p className="text-[#0a1628]/60 text-sm italic">
                        "{t.message}"
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => toggleTestimonial(t.id, t.is_published)}
                        className="text-xs text-[#0a1628]/40 hover:text-[#c9a84c] uppercase tracking-widest"
                      >
                        {t.is_published ? "Hide" : "Show"}
                      </button>
                      <button
                        onClick={() => deleteTestimonial(t.id)}
                        className={btnDanger}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── FAQS ── */}
        {activeTab === "faqs" && (
          <div className="bg-white border border-[#0a1628]/10 p-8 space-y-8">
            {sectionHead("Frequently Asked Questions")}
            <div className="border border-dashed border-[#0a1628]/20 p-6 space-y-4">
              <p className={labelCls}>Add New FAQ</p>
              <div>
                <label className={labelCls}>Question *</label>
                <input
                  className={inputCls}
                  placeholder="e.g. What are the school fees?"
                  value={newFaq.question}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, question: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelCls}>Answer *</label>
                <textarea
                  rows={3}
                  className={inputCls + " resize-none"}
                  value={newFaq.answer}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, answer: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select
                  className={inputCls}
                  value={newFaq.category}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, category: e.target.value })
                  }
                >
                  {[
                    "General",
                    "Admissions",
                    "Academics",
                    "Activities",
                    "Fees",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={addFaq}
                disabled={addingFaq}
                className={btnPrimary}
              >
                {addingFaq ? "Adding..." : "Add FAQ"}
              </button>
            </div>
            <div className="space-y-2">
              {faqs.length === 0 ? (
                <p className="text-[#0a1628]/30 text-sm text-center py-8">
                  No FAQs yet
                </p>
              ) : (
                faqs.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-start justify-between p-4 border border-[#0a1628]/10 hover:border-[#c9a84c]/40 transition-colors gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#0a1628] text-sm">
                          {f.question}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-[#c9a84c]/20 text-[#c9a84c] font-bold uppercase rounded-full">
                          {f.category}
                        </span>
                      </div>
                      <p className="text-[#0a1628]/60 text-sm">{f.answer}</p>
                    </div>
                    <button
                      onClick={() => deleteFaq(f.id)}
                      className={btnDanger + " shrink-0"}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── GALLERY ── */}
        {activeTab === "gallery" && (
          <div className="bg-white border border-[#0a1628]/10 p-8 space-y-8">
            {sectionHead("Photo Gallery")}
            <div className="border border-dashed border-[#0a1628]/20 p-6 space-y-4">
              <p className={labelCls}>Upload New Photo</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Title (optional)</label>
                  <input
                    className={inputCls}
                    placeholder="e.g. Sports Day 2024"
                    value={newGalleryTitle}
                    onChange={(e) => setNewGalleryTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select
                    className={inputCls}
                    value={newGalleryCategory}
                    onChange={(e) => setNewGalleryCategory(e.target.value)}
                  >
                    {[
                      "General",
                      "Sports",
                      "Events",
                      "Campus",
                      "Academic",
                      "Cultural",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewGalleryFile(e.target.files?.[0] || null)}
                className="text-sm text-[#0a1628]/60 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[#0a1628] file:text-[#c9a84c] file:text-xs file:font-bold file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-[#c9a84c] hover:file:text-[#0a1628] file:transition-all"
              />
              <button
                onClick={uploadGalleryImage}
                disabled={addingGallery || !newGalleryFile}
                className={btnPrimary}
              >
                {addingGallery ? "Uploading..." : "Upload Photo"}
              </button>
            </div>
            {gallery.length === 0 ? (
              <p className="text-[#0a1628]/30 text-sm text-center py-8">
                No photos yet
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {gallery.map((item) => (
                  <div key={item.id} className="relative group">
                    <img
                      src={item.image_url}
                      alt={item.title || "Gallery"}
                      className="w-full aspect-square object-cover border border-[#0a1628]/10"
                    />
                    <div className="absolute inset-0 bg-[#0a1628]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      {item.title && (
                        <p className="text-white text-xs text-center font-bold">
                          {item.title}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            toggleGallery(item.id, item.is_published)
                          }
                          className="text-[#c9a84c] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                        >
                          {item.is_published ? "Hide" : "Show"}
                        </button>
                        <button
                          onClick={() => deleteGalleryItem(item.id)}
                          className="text-red-400 text-[10px] font-bold uppercase tracking-widest hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {!item.is_published && (
                      <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-[9px] font-bold uppercase px-2 py-0.5">
                        Hidden
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
