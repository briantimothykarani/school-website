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

const CATEGORY_COLORS: Record<string, string> = {
  Sports: "bg-blue-100 text-blue-700",
  Academic: "bg-purple-100 text-purple-700",
  Cultural: "bg-orange-100 text-orange-700",
  Meeting: "bg-gray-100 text-gray-600",
  General: "",
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const p = "var(--primary)";

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .order("event_date", { ascending: true })
      .then(({ data }) => {
        setEvents(data || []);
        setLoading(false);
      });
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(events.map((e) => e.category))),
  ];
  const filtered =
    filter === "All" ? events : events.filter((e) => e.category === filter);
  const isUpcoming = (date: string) =>
    new Date(date) >= new Date(new Date().toDateString());
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString("en-KE", { day: "numeric" }),
      month: d.toLocaleDateString("en-KE", { month: "short" }),
      year: d.toLocaleDateString("en-KE", { year: "numeric" }),
    };
  };

  if (loading) return <ModalSkeleton />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px w-10" style={{ backgroundColor: p }} />
        <span
          className="text-xs tracking-[0.3em] uppercase font-bold"
          style={{ color: p }}
        >
          What's On
        </span>
      </div>
      <h1
        className="text-4xl font-black text-[#0a1628] mb-8 leading-tight"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        Upcoming Events
      </h1>
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition-all duration-200"
              style={
                filter === cat
                  ? { backgroundColor: "#0a1628", color: p }
                  : {
                      border: "1px solid rgba(10,22,40,0.15)",
                      color: "rgba(10,22,40,0.5)",
                    }
              }
              onMouseEnter={(e) => {
                if (filter !== cat) e.currentTarget.style.borderColor = p;
              }}
              onMouseLeave={(e) => {
                if (filter !== cat)
                  e.currentTarget.style.borderColor = "rgba(10,22,40,0.15)";
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#0a1628]/15">
          <p className="text-[#0a1628]/30 text-sm">No events found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ev) => {
            const date = formatDate(ev.event_date);
            const upcoming = isUpcoming(ev.event_date);
            const catColor = CATEGORY_COLORS[ev.category];
            return (
              <div
                key={ev.id}
                className={`flex gap-5 p-5 border transition-all duration-200 ${upcoming ? "border-[#0a1628]/10 hover:bg-[#f8f5ef]" : "border-[#0a1628]/5 opacity-50"}`}
                onMouseEnter={(e) => {
                  if (upcoming)
                    e.currentTarget.style.borderColor = `color-mix(in srgb, var(--primary) 40%, transparent)`;
                }}
                onMouseLeave={(e) => {
                  if (upcoming)
                    e.currentTarget.style.borderColor = "rgba(10,22,40,0.1)";
                }}
              >
                <div className="shrink-0 w-14 text-center">
                  <div
                    className="bg-[#0a1628] text-2xl font-black leading-none py-2"
                    style={{ color: p }}
                  >
                    {date.day}
                  </div>
                  <div
                    className="text-[#0a1628] text-[10px] font-black uppercase tracking-widest py-1"
                    style={{ backgroundColor: p }}
                  >
                    {date.month}
                  </div>
                  <div className="text-[#0a1628]/30 text-[9px] font-bold pt-1">
                    {date.year}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-[#0a1628] font-bold text-base leading-snug">
                      {ev.title}
                    </h3>
                    <span
                      className={`shrink-0 text-[10px] px-2 py-0.5 font-bold uppercase rounded-full ${catColor || ""}`}
                      style={
                        !catColor
                          ? {
                              backgroundColor: `color-mix(in srgb, var(--primary) 15%, transparent)`,
                              color: p,
                            }
                          : {}
                      }
                    >
                      {ev.category}
                    </span>
                  </div>
                  {ev.description && (
                    <p className="text-[#0a1628]/55 text-sm leading-relaxed mb-2">
                      {ev.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {ev.event_time && (
                      <span className="text-[#0a1628]/40 text-xs">
                        🕐 {ev.event_time}
                      </span>
                    )}
                    {ev.location && (
                      <span className="text-[#0a1628]/40 text-xs">
                        📍 {ev.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ModalSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse space-y-4">
      <div className="h-4 w-32 bg-[#0a1628]/10" />
      <div className="h-10 w-1/2 bg-[#0a1628]/10" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-5">
          <div className="w-14 h-20 bg-[#0a1628]/10 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 bg-[#0a1628]/10" />
            <div className="h-4 w-full bg-[#0a1628]/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
