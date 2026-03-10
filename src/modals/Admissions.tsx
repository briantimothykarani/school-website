function Admissions() {
  return (
    <>
      <div className="w-120 h-120 rounded bg-white text-center justify-center m-2 block">
        <p className="text-center text-black text-3xl">Admissions </p>
        <p>x</p>
        <p>please download these admission documents</p>
        <p>{settings.title}</p>
        <p>{settings.file_url}</p>
      </div>
    </>
  );
}
export default Admissions;
