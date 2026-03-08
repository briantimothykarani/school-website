export default function Events() {
  const events = [
    { date: "March 15", title: "Sports Day" },
    { date: "April 02", title: "Parent-Teacher Meeting" },
  ];

  return (
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
      <div className="grid gap-4">
        {events.map((e, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-white p-4 rounded-xl border-l-8 border-yellow-500 shadow-sm"
          >
            <div className="text-center bg-gray-100 p-2 rounded min-w-[80px]">
              <span className="block font-bold text-lg leading-none">
                {e.date.split(" ")[1]}
              </span>
              <span className="text-xs uppercase">{e.date.split(" ")[0]}</span>
            </div>
            <p className="font-bold text-xl">{e.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
