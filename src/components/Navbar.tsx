export default function Navbar({ settings }: any) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any>({ files: [], sections: [] });
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleSearch = async (val: string) => {
    setSearch(val);
    if (val.length < 2) return setResults({ files: [], sections: [] });

    const [filesRes, secRes] = await Promise.all([
      supabase.from("downloads").select("*").ilike("title", `%${val}%`),
      supabase.from("site_sections").select("*").ilike("title", `%${val}%`),
    ]);

    setResults({ files: filesRes.data || [], sections: secRes.data || [] });
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--primary)] text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">{settings.school_name}</div>

      {/* Search Input */}
      <div className="relative">
        <input
          className="rounded-full px-4 py-1 text-black text-sm w-48 focus:w-64 transition-all"
          placeholder="Search site..."
          onChange={(e) => handleSearch(e.target.value)}
        />
        {search.length > 1 && (
          <div className="absolute top-full mt-2 bg-white text-black p-4 rounded shadow-xl w-80">
            {/* Map through results here */}
          </div>
        )}
      </div>

      <div className="space-x-4">
        <button onClick={() => setActiveModal("contact")}>Contact</button>
        <button onClick={() => setActiveModal("admissions")}>Admissions</button>
      </div>

      {/* MODAL OVERLAY */}
      {activeModal && (
        <Modal
          slug={activeModal}
          close={() => setActiveModal(null)}
          settings={settings}
        />
      )}
    </nav>
  );
}
