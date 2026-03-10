function About({ settings }: any) {
  return (
    <>
      <div className="w-120 h-120 rounded bg-white text-center justify-center m-2 block">
        <p className="text-center text-black text-3xl">About us</p>
        <p>x</p>
        <p>{settings.school_name}</p>
        <p>{settings.motto}</p>
        <p>{settings.phone}</p>
        <p>{settings.email}</p>
      </div>
    </>
  );
}
export default About;
