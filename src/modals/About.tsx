import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Settings {
  school_name: string;
  motto: string;
  about: string;
  phone: string;
  email: string;
  about_image_url: string;
  map_url: string;
}

export default function About() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("school_settings")
      .select(
        "school_name, motto, about, phone, email, about_image_url, map_url",
      )
      .order("id")
      .limit(1)
      .then(({ data }) => {
        setSettings(data?.[0] || null);
        setLoading(false);
      });
  }, []);

  if (loading) return <ModalSkeleton />;
  if (!settings) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="h-px w-10 bg-[#c9a84c]" />
        <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-bold">
          Our Story
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left: Text */}
        <div>
          <h1
            className="text-4xl font-black text-[#0a1628] mb-3 leading-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {settings.school_name}
          </h1>
          <p className="text-[#c9a84c] text-sm font-bold tracking-widest uppercase mb-8 italic">
            "{settings.motto}"
          </p>

          {settings.about && (
            <div className="space-y-4">
              {settings.about
                .split("\n")
                .filter(Boolean)
                .map((para, i) => (
                  <p
                    key={i}
                    className="text-[#0a1628]/70 leading-relaxed text-[15px]"
                  >
                    {para}
                  </p>
                ))}
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-10 pt-8 border-t border-[#0a1628]/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0a1628] flex items-center justify-center shrink-0">
                <span className="text-[#c9a84c] text-xs">📞</span>
              </div>
              <a
                href={`tel:${settings.phone}`}
                className="text-[#0a1628] font-semibold text-sm hover:text-[#c9a84c] transition-colors"
              >
                {settings.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0a1628] flex items-center justify-center shrink-0">
                <span className="text-[#c9a84c] text-xs">✉️</span>
              </div>
              <a
                href={`mailto:${settings.email}`}
                className="text-[#0a1628] font-semibold text-sm hover:text-[#c9a84c] transition-colors"
              >
                {settings.email}
              </a>
            </div>
          </div>
        </div>

        {/* Right: Image + Map */}
        <div className="space-y-4">
          {settings.about_image_url && (
            <div className="relative">
              <img
                src={settings.about_image_url}
                alt={settings.school_name}
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#c9a84c]" />
            </div>
          )}
          {settings.map_url && (
            <div className="border border-[#0a1628]/10 overflow-hidden">
              <iframe
                src={settings.map_url}
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="School Location"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModalSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse">
      <div className="h-4 w-32 bg-[#0a1628]/10 mb-10" />
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="h-10 w-3/4 bg-[#0a1628]/10" />
          <div className="h-4 w-1/2 bg-[#0a1628]/10" />
          <div className="h-4 w-full bg-[#0a1628]/10" />
          <div className="h-4 w-5/6 bg-[#0a1628]/10" />
          <div className="h-4 w-4/5 bg-[#0a1628]/10" />
        </div>
        <div className="aspect-[4/3] bg-[#0a1628]/10" />
      </div>
    </div>
  );
}
