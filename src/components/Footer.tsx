import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Settings {
  school_name: string;
  motto: string;
  phone: string;
  email: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    supabase
      .from("school_settings")
      .select("school_name, motto, phone, email")
      .order("id")
      .limit(1)
      .then(({ data }) => setSettings(data?.[0] || null));
  }, []);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 72,
      behavior: "smooth",
    });
  };

  const year = new Date().getFullYear();

  const socials = [
    {
      label: "Facebook",
      href: "https://facebook.com",
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
    },
    {
      label: "Twitter / X",
      href: "https://twitter.com",
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: "https://instagram.com",
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: "https://youtube.com",
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  const navLinks = ["about", "admissions", "events", "downloads", "contact"];

  return (
    <>
      {/* Floating back to top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-24 right-6 z-50 w-9 h-9 bg-[#0a1628] border border-[#c9a84c]/40 text-[#c9a84c] flex items-center justify-center hover:bg-[#c9a84c] hover:text-[#0a1628] transition-all duration-300 shadow-lg ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Back to top"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      <footer className="bg-[#060e1a] text-white">
        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Col 1: School info + socials */}
            <div>
              <div
                className="text-lg font-black text-white mb-0.5"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {settings?.school_name || "Brightside Academy"}
              </div>
              <p className="text-[#c9a84c] text-[10px] tracking-[0.2em] uppercase mb-3">
                {settings?.motto || "Inspiring Limitless Possibilities"}
              </p>
              <div className="flex gap-2 mt-4">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-7 h-7 border border-white/15 text-white/40 flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="text-[#c9a84c] text-[10px] font-bold tracking-[0.25em] uppercase mb-3">
                Quick Links
              </h4>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                {navLinks.map((id) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollTo(id)}
                      className="text-white/50 hover:text-[#c9a84c] text-xs transition-colors capitalize"
                    >
                      {id}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Contact */}
            <div>
              <h4 className="text-[#c9a84c] text-[10px] font-bold tracking-[0.25em] uppercase mb-3">
                Get In Touch
              </h4>
              <div className="space-y-1.5">
                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex items-center gap-2 text-white/50 hover:text-[#c9a84c] text-xs transition-colors"
                  >
                    📞 {settings.phone}
                  </a>
                )}
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-2 text-white/50 hover:text-[#c9a84c] text-xs transition-colors"
                  >
                    ✉️ {settings.email}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 items-center">
            <div>
              <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">
                Technical Support
              </p>
              <a
                href="mailto:timothykaranibrian@gmail.com"
                className="text-[#c9a84c]/50 hover:text-[#c9a84c] text-[10px] transition-colors"
              >
                Contact Developer →
              </a>
            </div>

            <p className="text-white/20 text-[10px] text-center">
              © {year} {settings?.school_name || "Brightside Academy"}. All
              rights reserved.
            </p>

            <div className="flex justify-end">
              <button
                onClick={scrollToTop}
                className="text-white/20 hover:text-[#c9a84c] text-[10px] tracking-widest uppercase transition-colors flex items-center gap-1.5 group"
              >
                Back to Top
                <svg
                  className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
