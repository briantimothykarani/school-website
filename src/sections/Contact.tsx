export default function Contact({ settings }: any) {
  return (
    <section className="bg-[#f8f5ef] py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-bold">
            Get In Touch
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <div>
            <h2
              className="text-4xl md:text-5xl font-black text-[#0a1628] leading-tight mb-8"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Contact <span className="text-[#c9a84c]">Us</span>
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0a1628] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-[#c9a84c]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                  <div className="text-[#0a1628]/50 text-xs tracking-widest uppercase font-semibold mb-1">
                    Phone
                  </div>
                  <div className="text-[#0a1628] font-bold">
                    {settings?.phone || "+254 000 000 000"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0a1628] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-[#c9a84c]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                  <div className="text-[#0a1628]/50 text-xs tracking-widest uppercase font-semibold mb-1">
                    Email
                  </div>
                  <a
                    href={`mailto:${settings?.email}`}
                    className="text-[#0a1628] font-bold hover:text-[#c9a84c] transition-colors"
                  >
                    {settings?.email || "info@brightside.com"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0a1628] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-[#c9a84c]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-[#0a1628]/50 text-xs tracking-widest uppercase font-semibold mb-1">
                    Location
                  </div>
                  <div className="text-[#0a1628] font-bold">Nairobi, Kenya</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map or CTA */}
          <div>
            {settings?.map_url ? (
              <iframe
                src={settings.map_url}
                className="w-full h-72 border-0 shadow-lg"
                allowFullScreen
                loading="lazy"
                title="School Location"
              />
            ) : (
              <div className="bg-[#0a1628] p-10 text-center">
                <div className="text-[#c9a84c] text-5xl mb-4">✉️</div>
                <h3
                  className="text-white font-black text-xl mb-3"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Ready to Join Us?
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Begin your child's journey with us. Contact our admissions
                  team today.
                </p>
                <a
                  href={`mailto:${settings?.email || "info@brightside.com"}`}
                  className="inline-block px-8 py-3 bg-[#c9a84c] text-[#0a1628] text-xs font-bold tracking-widest uppercase hover:bg-[#e4c06a] transition-all duration-300"
                >
                  Send Us an Email
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-[#0a1628]/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[#0a1628]/50 text-xs tracking-widest uppercase">
          © {new Date().getFullYear()}{" "}
          {settings?.school_name || "Brightside Academy"}. All Rights Reserved.
        </div>
        <a
          href="/login"
          className="text-[#0a1628]/30 text-xs hover:text-[#c9a84c] transition-colors tracking-widest uppercase"
        >
          Admin Portal
        </a>
      </div>
    </section>
  );
}
