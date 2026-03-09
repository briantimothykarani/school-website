import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Downloads from "../sections/Downloads";
import Contact from "../sections/Contact";
import NoticeBoard from "../components/NoticeBoard";
import Events from "../sections/Events";
import Testimonials from "../sections/Testimonials";
import Gallery from "../sections/Gallery";
import FAQSection from "../sections/FAQSection";

interface SchoolSettings {
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

function WhatsAppButton({ phone }: { phone: string }) {
  const cleaned = phone?.replace(/\D/g, "") || "254700000000";
  const message = encodeURIComponent(
    "Hello, I would like to know more about the school.",
  );
  return (
    <a
      href={`https://wa.me/${cleaned}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 py-3 rounded-full shadow-xl transition-all duration-300 hover:scale-105 font-bold text-sm"
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      WhatsApp
    </a>
  );
}

export default function Home() {
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data, error } = await supabase
      .from("school_settings")
      .select("*")
      .order("id")
      .limit(1);

    if (error) {
      setError(error.message);
      return;
    }

    const row = data?.[0];
    if (row) {
      document.documentElement.style.setProperty(
        "--primary",
        row.primary_color || "#0a1628",
      );
      setSettings(row);
    }
  }

  if (error)
    return (
      <div className="p-20 text-center text-red-500">
        <p className="font-bold mb-2">Failed to load site</p>
        <p className="text-sm mb-4">{error}</p>
        <button
          onClick={fetchSettings}
          className="px-6 py-2 bg-[#0a1628] text-white text-sm font-bold uppercase tracking-widest"
        >
          Retry
        </button>
      </div>
    );

  if (!settings)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#0a1628]/50 text-sm tracking-widest uppercase">
            Loading portal...
          </p>
        </div>
      </div>
    );

  return (
    <>
      <Navbar settings={settings} />
      <NoticeBoard settings={settings} />
      <Hero settings={settings} />
      <Events />
      <About settings={settings} />
      <Gallery />
      <Testimonials />
      <FAQSection />
      <Downloads />
      <Contact settings={settings} />
      <WhatsAppButton phone={settings.phone} />
    </>
  );
}
