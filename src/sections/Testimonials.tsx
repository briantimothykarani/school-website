import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  avatar_url: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTestimonials(data || []);
        setLoading(false);
      });
  }, []);

  if (!loading && testimonials.length === 0) return null;

  return (
    <section className="bg-[#0a1628] py-24 px-6 md:px-16 relative overflow-hidden">
      {/* Decorative quote */}
      <div
        className="absolute top-8 right-12 text-[#c9a84c]/10 text-[200px] font-black leading-none select-none pointer-events-none"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        "
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-bold">
            Testimonials
          </span>
        </div>

        <h2
          className="text-4xl md:text-5xl font-black text-white mb-14"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          What Our <span className="text-[#c9a84c]">Community</span> Says
        </h2>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-8 space-y-4 animate-pulse"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-white/10 rounded" />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 bg-white/10 rounded-full" />
                  <div className="space-y-1">
                    <div className="h-3 bg-white/10 rounded w-24" />
                    <div className="h-2 bg-white/10 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials grid */}
        {!loading && (
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white/5 border border-white/10 hover:border-[#c9a84c]/40 p-8 transition-all duration-300 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <span
                      key={j}
                      className={`text-sm ${j < t.rating ? "text-[#c9a84c]" : "text-white/20"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-white/70 leading-relaxed mb-6 italic flex-1">
                  "{t.message}"
                </p>

                <div className="flex items-center gap-3">
                  {t.avatar_url ? (
                    <img
                      src={t.avatar_url}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#c9a84c]/30"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[#c9a84c] flex items-center justify-center font-black text-[#0a1628] shrink-0">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-white/40 text-xs tracking-wider uppercase">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
