import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Downloads() {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    const { data } = await supabase.from("downloads").select("*");
    if (data) setFiles(data);
  }

  return (
    <section className="p-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Downloads</h2>
      <div className="space-y-2">
        {files.map((file) => (
          <a
            key={file.id}
            href={file.file_url}
            target="_blank"
            className="block text-blue-600 underline"
          >
            {file.title}
          </a>
        ))}
      </div>
    </section>
  );
}
