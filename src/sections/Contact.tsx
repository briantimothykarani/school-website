export default function Contact({ settings }: any) {
  return (
    <section className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Contact</h2>
      <p>{settings.phone}</p>
      <p>{settings.email}</p>
    </section>
  );
}
