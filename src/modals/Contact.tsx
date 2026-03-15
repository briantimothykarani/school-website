import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import emailjs from "@emailjs/browser";

interface Settings {
  school_name: string;
  phone: string;
  email: string;
  map_url: string;
}

export default function Contact() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const p = "var(--primary)";

  useEffect(() => {
    supabase
      .from("school_settings")
      .select("school_name, phone, email, map_url")
      .order("id")
      .limit(1)
      .then(({ data }) => {
        setSettings(data?.[0] || null);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message || !settings?.email) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: settings.email,
          reply_to: form.email,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setErrorMsg(
        err?.text || err?.message || "Failed to send. Please try again.",
      );
    }
  };

  if (loading) return <Skeleton />;
  if (!settings) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px w-10" style={{ backgroundColor: p }} />
        <span
          className="text-xs tracking-[0.3em] uppercase font-bold"
          style={{ color: p }}
        >
          Get In Touch
        </span>
      </div>

      <h1
        className="text-4xl font-black text-[#0a1628] mb-10 leading-tight"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        Contact Us
      </h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Contact Details */}
        <div className="space-y-6">
          <p className="text-[#0a1628]/60 text-[15px] leading-relaxed">
            We'd love to hear from you. Reach out via phone, email, or fill in
            the form and we'll respond within 24 hours.
          </p>

          <div className="space-y-4 pt-2">
            {/* Phone */}
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-4 p-4 border border-[#0a1628]/10 hover:bg-[#f8f5ef] transition-all group"
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = `color-mix(in srgb, var(--primary) 50%, transparent)`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(10,22,40,0.1)")
              }
            >
              <div className="w-10 h-10 bg-[#0a1628] flex items-center justify-center transition-colors shrink-0 group-hover:opacity-80">
                <svg
                  className="w-4 h-4 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: p }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[#0a1628]/40 text-[10px] uppercase tracking-widest font-bold mb-0.5">
                  Phone
                </p>
                <p
                  className="text-[#0a1628] font-semibold text-sm transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.color = p)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#0a1628")
                  }
                >
                  {settings.phone}
                </p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-4 p-4 border border-[#0a1628]/10 hover:bg-[#f8f5ef] transition-all group"
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = `color-mix(in srgb, var(--primary) 50%, transparent)`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(10,22,40,0.1)")
              }
            >
              <div className="w-10 h-10 bg-[#0a1628] flex items-center justify-center transition-colors shrink-0 group-hover:opacity-80">
                <svg
                  className="w-4 h-4 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: p }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[#0a1628]/40 text-[10px] uppercase tracking-widest font-bold mb-0.5">
                  Email
                </p>
                <p
                  className="text-[#0a1628] font-semibold text-sm transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.color = p)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#0a1628")
                  }
                >
                  {settings.email}
                </p>
              </div>
            </a>
          </div>

          {settings.map_url && (
            <div className="border border-[#0a1628]/10 overflow-hidden">
              <iframe
                src={settings.map_url}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="School Location"
              />
            </div>
          )}
        </div>

        {/* Right: Form */}
        <div>
          {status === "sent" ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 border border-green-200 bg-green-50/50">
              <div className="w-12 h-12 bg-green-500 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3
                className="text-[#0a1628] font-black text-lg mb-2"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Message Sent!
              </h3>
              <p className="text-[#0a1628]/50 text-sm mb-6">
                We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="px-6 py-2 border border-[#0a1628]/20 text-[#0a1628] text-xs font-bold uppercase tracking-widest transition-all"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = p;
                  e.currentTarget.style.color = p;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(10,22,40,0.2)";
                  e.currentTarget.style.color = "#0a1628";
                }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {status === "error" && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200">
                  <span className="text-red-500 text-lg leading-none">⚠</span>
                  <div>
                    <p className="text-red-700 text-sm font-bold">
                      Failed to send
                    </p>
                    <p className="text-red-500 text-xs mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              {[
                {
                  label: "Your Name",
                  key: "name",
                  type: "text",
                  placeholder: "e.g. John Kamau",
                },
                {
                  label: "Email Address",
                  key: "email",
                  type: "email",
                  placeholder: "e.g. john@example.com",
                },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#0a1628]/50 mb-2">
                    {label}
                  </label>
                  <input
                    type={type}
                    className="w-full border border-[#0a1628]/20 p-3 focus:outline-none transition-colors text-[#0a1628] bg-white text-sm"
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    onFocus={(e) => (e.currentTarget.style.borderColor = p)}
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(10,22,40,0.2)")
                    }
                  />
                </div>
              ))}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#0a1628]/50 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full border border-[#0a1628]/20 p-3 focus:outline-none transition-colors text-[#0a1628] bg-white text-sm resize-none"
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  onFocus={(e) => (e.currentTarget.style.borderColor = p)}
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(10,22,40,0.2)")
                  }
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={
                  status === "sending" ||
                  !form.name ||
                  !form.email ||
                  !form.message
                }
                className="w-full px-6 py-3 bg-[#0a1628] text-xs font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ color: p }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = p;
                  e.currentTarget.style.color = "#0a1628";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0a1628";
                  e.currentTarget.style.color = p;
                }}
              >
                {status === "sending" ? (
                  <>
                    <div
                      className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin"
                      style={{
                        borderColor: `${p} transparent transparent transparent`,
                      }}
                    />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>

              <p className="text-[#0a1628]/30 text-xs text-center">
                Your message goes directly to {settings.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse">
      <div className="h-4 w-32 bg-[#0a1628]/10 mb-8" />
      <div className="h-10 w-1/2 bg-[#0a1628]/10 mb-10" />
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="h-16 bg-[#0a1628]/10" />
          <div className="h-16 bg-[#0a1628]/10" />
          <div className="h-40 bg-[#0a1628]/10" />
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-[#0a1628]/10" />
          <div className="h-12 bg-[#0a1628]/10" />
          <div className="h-28 bg-[#0a1628]/10" />
          <div className="h-12 bg-[#0a1628]/10" />
        </div>
      </div>
    </div>
  );
}
