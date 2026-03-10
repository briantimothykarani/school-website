function Contact() {
  return (
    <>
      <div className="w-120 h-120 rounded bg-white text-center justify-center m-2 block">
        <p className="text-center text-black text-3xl">Contact us</p>
        <p>{settings.email}</p>
        <p>{settings.phone}</p>
      </div>
    </>
  );
}
export default Contact;
