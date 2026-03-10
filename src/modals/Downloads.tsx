function Downloads() {
  return (
    <>
      <div className="w-120 h-120 rounded bg-white text-center justify-center m-2 block">
        <p className="text-center text-black text-3xl">Downloads</p>
              {downloads.length === 0 ? (
              ) : (
                downloads.map((d) => (
                  <div
                    key={d.id}
                  >
                        {d.title}
                       {d.file_url}
                  </div>
             

    </div>
    </>
  );
}
export default Downloads;
