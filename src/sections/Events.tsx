import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  category: string;
}

const categoryColors: Record<string, string> = {
  Sports: "bg-green-500/20 text-green-300 border-green-500/30",
  Academic: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Cultural: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  General: "bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/30",
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(6)
      .then(({ data }) => {
        setEvents(data || []);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      day: d.getDate().toString().padStart(2, "0"),
      month: d.toLocaleString("en", { month: "short" }).toUpperCase(),
      full: d.toLocaleDateString("en-KE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  };

  return (
    <section className="bg-[#0a1628] py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-bold">
            What's On
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <h2
            className="text-4xl md:text-5xl font-black text-white leading-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Upcoming <span className="text-[#c9a84c]">Events</span>
          </h2>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex gap-6 bg-white/5 border border-white/10 p-6 animate-pulse"
              >
                <div className="w-16 h-16 bg-white/10 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No events */}
        {!loading && events.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <div className="text-5xl mb-4">📅</div>
            <p className="text-sm tracking-widest uppercase">
              No upcoming events
            </p>
          </div>
        )}

        {/* Events grid */}
        {!loading && events.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {events.map((e) => {
              const date = formatDate(e.event_date);
              const colorClass =
                categoryColors[e.category] || categoryColors.General;
              return (
                <div
                  key={e.id}
                  className="flex items-start gap-6 bg-white/5 border border-white/10 hover:border-[#c9a84c]/50 hover:bg-white/10 p-6 transition-all duration-300 group"
                >
                  {/* Date block */}
                  <div className="shrink-0 text-center bg-[#c9a84c] px-4 py-3 min-w-[64px]">
                    <div className="text-[#0a1628] font-black text-2xl leading-none">
                      {date.day}
                    </div>
                    <div className="text-[#0a1628]/80 text-[10px] tracking-widest uppercase font-bold mt-1">
                      {date.month}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-white font-bold text-lg group-hover:text-[#c9a84c] transition-colors">
                        {e.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${colorClass}`}
                      >
                        {e.category}
                      </span>
                    </div>
                    {e.description && (
                      <p className="text-white/50 text-sm leading-relaxed mb-2">
                        {e.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-white/30 text-xs">
                      {e.event_time && <span>🕐 {e.event_time}</span>}
                      {e.location && <span>📍 {e.location}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
