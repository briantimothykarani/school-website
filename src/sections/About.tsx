export default function About({ settings }: any) {
  const imgUrl =
    settings?.about_image_url ||
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80";

  const pillars = [
    {
      icon: "🎓",
      title: "Academic Excellence",
      desc: "Rigorous curriculum designed to unlock each student's full potential.",
    },
    {
      icon: "🌍",
      title: "Global Citizens",
      desc: "Preparing students to thrive and lead in an interconnected world.",
    },
    {
      icon: "⚽",
      title: "Co-Curricular",
      desc: "Sports, arts and activities that develop the whole child.",
    },
    {
      icon: "🤝",
      title: "Community",
      desc: "A warm, inclusive environment where every student belongs.",
    },
  ];

  return (
    <section id="about" className="bg-[#f8f5ef] py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-bold">
            Who We Are
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          {/* Text */}
          <div>
            <h2
              className="text-4xl md:text-5xl font-black text-[#0a1628] leading-tight mb-6"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              We Are{" "}
              <span className="text-[#c9a84c]">
                {settings?.school_name || "Brightside"}
              </span>
            </h2>
            <p className="text-[#0a1628]/70 text-lg leading-relaxed mb-8">
              {settings?.about ||
                "We foster an environment that encourages our students to be the best they can be. Every student houses within themselves individual dreams, ambitions and aspirations — it is our job to help them achieve them."}
            </p>
            <a
              href="#admissions"
              className="inline-block px-8 py-3 bg-[#0a1628] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#c9a84c] hover:text-[#0a1628] transition-all duration-300"
            >
              Learn More
            </a>
          </div>

          {/* Image with decorative frame */}
          <div className="relative mt-8 md:mt-0">
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#c9a84c]/40" />
            <img
              src={imgUrl}
              alt="About"
              className="w-full h-80 object-cover relative z-10 shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 z-20 bg-[#c9a84c] p-6 shadow-xl">
              <div className="text-[#0a1628] font-black text-3xl">15+</div>
              <div className="text-[#0a1628]/80 text-xs tracking-widest uppercase font-semibold">
                Years of Excellence
              </div>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="bg-white p-6 border border-[#0a1628]/10 hover:border-[#c9a84c] hover:shadow-lg transition-all duration-300 group cursor-default"
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="font-black text-[#0a1628] text-sm tracking-wide uppercase mb-2 group-hover:text-[#c9a84c] transition-colors">
                {p.title}
              </h3>
              <p className="text-[#0a1628]/60 text-sm leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
