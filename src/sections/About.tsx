export default function About({ settings }: any) {
  return (
    <section className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">About Us</h2>
      <div>
        <p>{settings.about}</p>
      </div>
    </section>
  );
}
