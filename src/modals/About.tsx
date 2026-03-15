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
  const p = "var(--primary)";

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
      <div className="flex items-center gap-3 mb-10">
        <div className="h-px w-10" style={{ backgroundColor: p }} />
        <span
          className="text-xs tracking-[0.3em] uppercase font-bold"
          style={{ color: p }}
        >
          Our Story
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h1
            className="text-4xl font-black text-[#0a1628] mb-3 leading-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {settings.school_name}
          </h1>
          <p
            className="text-sm font-bold tracking-widest uppercase mb-8 italic"
            style={{ color: p }}
          >
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
          <div className="mt-10 pt-8 border-t border-[#0a1628]/10 space-y-3">
            {[
              {
                href: `tel:${settings.phone}`,
                icon: "📞",
                text: settings.phone,
              },
              {
                href: `mailto:${settings.email}`,
                icon: "✉️",
                text: settings.email,
              },
            ].map(({ href, icon, text }) => (
              <div key={href} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#0a1628] flex items-center justify-center shrink-0">
                  <span className="text-xs" style={{ color: p }}>
                    {icon}
                  </span>
                </div>
                <a
                  href={href}
                  className="text-[#0a1628] font-semibold text-sm transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.color = p)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#0a1628")
                  }
                >
                  {text}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {settings.about_image_url && (
            <img
              src={settings.about_image_url}
              alt={settings.school_name}
              className="w-full aspect-[4/3] object-cover"
              style={{ borderBottom: `4px solid ${p}` }}
            />
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
        </div>
        <div className="aspect-[4/3] bg-[#0a1628]/10" />
      </div>
    </div>
  );
}
