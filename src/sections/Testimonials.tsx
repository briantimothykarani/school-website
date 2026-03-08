export default function Testimonials() {
  const reviews = [
    {
      name: "Mrs. Kamau",
      text: "The best school in Kahawa West! My kids love the teachers.",
    },
    {
      name: "Mr. Otieno",
      text: "Very professional staff and excellent extra-curricular activities.",
    },
  ];

  return (
    <section className="py-16 bg-blue-50">
      <h2 className="text-center text-3xl font-bold mb-10">
        What Our Parents Say
      </h2>
      <div className="flex flex-wrap justify-center gap-6 px-4">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm max-w-sm border-t-4 border-[var(--primary)]"
          >
            <p className="italic text-gray-700 mb-4">"{r.text}"</p>
            <p className="font-bold text-[var(--primary)]">- {r.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
