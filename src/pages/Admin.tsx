/*import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface SchoolSettings {
  id: string;
  school_name: string;
  motto: string;
  about: string;
  phone: string;
  email: string;
  primary_color: string;
  logo_url: string;
}

export default function Admin() {
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [pdfTitle, setPdfTitle] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data, error } = await supabase
      .from<SchoolSettings>("school_settings")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Error fetching settings:", error);
      return;
    }

    setSettings(data?.[0] || null);
  }

  async function saveSettings() {
    if (!settings) return;
    const { error } = await supabase
      .from("school_settings")
      .update(settings)
      .eq("id", settings.id);

    if (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
      return;
    }

    alert("Settings updated!");
  }

  async function uploadLogo(file: File) {
    if (!file || !settings) return;

    const { data, error } = await supabase.storage
      .from("logos")
      .upload(`logo-${Date.now()}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Error uploading logo:", error);
      return;
    }

    const { publicUrl } = supabase.storage
      .from("logos")
      .getPublicUrl(data.path);
    setSettings({ ...settings, logo_url: publicUrl });
  }

  async function uploadPDF(file: File) {
    if (!file || !pdfTitle) return;

    const { data, error } = await supabase.storage
      .from("downloads")
      .upload(`pdf-${Date.now()}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Error uploading PDF:", error);
      return;
    }

    const { publicUrl } = supabase.storage
      .from("downloads")
      .getPublicUrl(data.path);

    const { error: insertError } = await supabase.from("downloads").insert({
      title: pdfTitle,
      file_url: publicUrl,
    });

    if (insertError) {
      console.error("Error inserting PDF record:", insertError);
      return;
    }

    alert("PDF uploaded!");
  }

  //  if (!settings) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Admin Panel</h2>

      <input
        className="border p-2 w-full"
        value={settings.school_name}
        onChange={(e) =>
          setSettings({ ...settings, school_name: e.target.value })
        }
      />

      <input
        type="color"
        value={settings.primary_color}
        onChange={(e) =>
          setSettings({ ...settings, primary_color: e.target.value })
        }
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => uploadLogo(e.target.files![0])}
      />

      <button
        onClick={saveSettings}
        className="bg-[var(--primary)] text-white px-4 py-2"
      >
        Save Settings
      </button>

      <hr />

      <h3 className="font-bold">Upload PDF</h3>

      <input
        className="border p-2 w-full"
        placeholder="PDF Title"
        value={pdfTitle}
        onChange={(e) => setPdfTitle(e.target.value)}
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => uploadPDF(e.target.files![0])}
      />
    </div>
  );
}
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const [settings, setSettings] = useState<any>(null);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [newDownloadTitle, setNewDownloadTitle] = useState("");
  const [newDownloadFile, setNewDownloadFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: s } = await supabase
      .from("school_settings")
      .select("*")
      .limit(1)
      .single();
    setSettings(s);

    const { data: d } = await supabase
      .from("downloads")
      .select("*")
      .order("created_at", { ascending: false });
    setDownloads(d || []);
  };

  const updateSettings = async () => {
    await supabase
      .from("school_settings")
      .update(settings)
      .eq("id", settings.id);
    alert("Settings updated!");
  };

  const uploadDownload = async () => {
    if (!newDownloadFile) return;

    // Upload file to Supabase Storage
    const { data: uploadData, error } = await supabase.storage
      .from("downloads")
      .upload(`downloads/${newDownloadFile.name}`, newDownloadFile, {
        upsert: true,
      });

    if (error) return alert(error.message);

    // Get public URL
    const { publicUrl } = supabase.storage
      .from("downloads")
      .getPublicUrl(uploadData.path);

    await supabase
      .from("downloads")
      .insert([{ title: newDownloadTitle, file_url: publicUrl }]);
    alert("Download added!");
    setNewDownloadTitle("");
    setNewDownloadFile(null);
    fetchData();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Panel</h1>

      <section>
        <h2>School Info</h2>
        <input
          placeholder="School Name"
          value={settings?.school_name || ""}
          onChange={(e) =>
            setSettings({ ...settings, school_name: e.target.value })
          }
        />
        <input
          placeholder="Motto"
          value={settings?.motto || ""}
          onChange={(e) => setSettings({ ...settings, motto: e.target.value })}
        />
        <textarea
          placeholder="About"
          value={settings?.about || ""}
          onChange={(e) => setSettings({ ...settings, about: e.target.value })}
        />
        <button onClick={updateSettings}>Save Settings</button>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Downloads</h2>
        <input
          placeholder="Title"
          value={newDownloadTitle}
          onChange={(e) => setNewDownloadTitle(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setNewDownloadFile(e.target.files?.[0] || null)}
        />
        <button onClick={uploadDownload}>Add Download</button>

        <ul>
          {downloads.map((d) => (
            <li key={d.id}>
              {d.title} - <a href={d.file_url}>View</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
*/

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import imageCompression from "browser-image-compression";

export default function Admin() {
  const [settings, setSettings] = useState<any>(null);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [newDownloadTitle, setNewDownloadTitle] = useState("");
  const [newDownloadFile, setNewDownloadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();

    window.location.href = "/";
  };

  const fetchData = async () => {
    const { data: s } = await supabase
      .from("school_settings")
      .select("*")
      .single();
    setSettings(s);
    const { data: d } = await supabase
      .from("downloads")
      .select("*")
      .order("created_at", { ascending: false });
    setDownloads(d || []);
  };

  // NEW: Image Compression & Upload Logic
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const path = `public/${Date.now()}_${file.name}`;
      await supabase.storage.from("school-images").upload(path, compressedFile);
      const {
        data: { publicUrl },
      } = supabase.storage.from("school-images").getPublicUrl(path);

      await supabase
        .from("school_settings")
        .update({ [field]: publicUrl })
        .eq("id", settings.id);
      setSettings({ ...settings, [field]: publicUrl });
      alert("Image optimized and saved!");
    } catch (err) {
      alert("Error processing image");
    } finally {
      setUploading(false);
    }
  };

  const updateSettings = async () => {
    await supabase
      .from("school_settings")
      .update(settings)
      .eq("id", settings.id);
    alert("Settings updated!");
  };

  // ... (keep your existing uploadDownload function) ...

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">School Admin Panel</h1>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-red-500 underline text-sm"
        >
          Logout
        </button>
      </div>

      {/* Notice Board Section */}
      <section className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
        <h2 className="font-bold text-yellow-800 mb-2">
          Notice Board (Yellow Bar)
        </h2>
        <div className="flex gap-4 mb-4">
          <input
            type="checkbox"
            checked={settings?.show_notice}
            onChange={(e) =>
              setSettings({ ...settings, show_notice: e.target.checked })
            }
          />
          <label>Enable Notice</label>
        </div>
        <textarea
          className="w-full p-3 border rounded mb-2"
          value={settings?.notice_text || ""}
          onChange={(e) =>
            setSettings({ ...settings, notice_text: e.target.value })
          }
        />
        <input
          type="datetime-local"
          className="border p-2 rounded"
          value={settings.notice_expires_at || ""}
          onChange={(e) =>
            setSettings({ ...settings, notice_expires_at: e.target.value })
          }
        />
      </section>

      {/* Visual Settings Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <h2 className="font-bold mb-2">Hero Background Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "hero_bg_url")}
            disabled={uploading}
          />
        </div>
        <div className="border p-4 rounded-lg bg-white shadow-sm">
          <h2 className="font-bold mb-2">About Section Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "about_image_url")}
            disabled={uploading}
          />
        </div>
      </section>

      {/* Original Settings Fields */}
      <section className="space-y-4">
        <h2>School Info</h2>
        <input
          className="w-full border p-2"
          placeholder="School Name"
          value={settings?.school_name || ""}
          onChange={(e) =>
            setSettings({ ...settings, school_name: e.target.value })
          }
        />
        <textarea
          className="w-full border p-2"
          placeholder="About"
          value={settings?.about || ""}
          onChange={(e) => setSettings({ ...settings, about: e.target.value })}
        />
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded"
          onClick={updateSettings}
        >
          Save All Changes
        </button>
      </section>
      <section style={{ marginTop: "2rem" }}>
        <h2>Downloads</h2>
        <input
          placeholder="Title"
          value={newDownloadTitle}
          onChange={(e) => setNewDownloadTitle(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setNewDownloadFile(e.target.files?.[0] || null)}
        />
        <button onClick={uploadDownload}>Add Download</button>
        <button onClick={logout} className="text-red-500 underline">
          Logout
        </button>

        <ul>
          {downloads.map((d) => (
            <li key={d.id}>
              {d.title} - <a href={d.file_url}>View</a>
            </li>
          ))}
        </ul>
      </section>

      {/* Downloads Section (Same as your original) */}
      {/* ... */}
    </div>
  );
}
