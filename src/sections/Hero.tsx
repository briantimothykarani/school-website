export default function Hero({ settings }: any) {
  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center text-center text-white overflow-hidden"
      style={{
        backgroundColor: "var(--primary)",
        backgroundImage: settings.hero_bg_url
          ? `url(${settings.hero_bg_url})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay to make text readable if there is a background image */}
      {settings.hero_bg_url && (
        <div className="absolute inset-0 bg-black/40 z-0"></div>
      )}

      <div className="relative z-10 px-6 max-w-4xl">
        {/* 1. Logo First */}
        {settings.logo_url && (
          <img
            src={settings.logo_url}
            className="mx-auto h-24 mb-6 drop-shadow-lg"
            alt="Logo"
          />
        )}

        {/* 2. School Name */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
          {settings.school_name}
        </h1>

        {/* 3. Motto Below */}
        <p className="text-xl md:text-2xl font-medium opacity-90 italic">
          "{settings.motto}"
        </p>
      </div>
    </section>
  );
}
