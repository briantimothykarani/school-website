import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Downloads from "../sections/Downloads";
import Contact from "../sections/Contact";
import NoticeBoard from "../components/NoticeBoard";
interface SchoolSettings {
  id: string;
  school_name: string;
  motto: string;
  about: string;
  phone: string;
  email: string;
  primary_color: string;
  logo_url: string;
}

export default function Home() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    const { data } = await supabase
      .from("school_settings")
      .select("*")
      .single();
    if (data) {
      document.documentElement.style.setProperty(
        "--primary",
        data.primary_color || "#1e40af",
      );
      setSettings(data);
    }
  }

  if (!settings)
    return <div className="p-20 text-center">Loading portal...</div>;

  return (
    <>
      <Navbar settings={settings} />
      <NoticeBoard settings={settings} />
      <Hero settings={settings} />
      <About settings={settings} />
      <Downloads />
      <Contact settings={settings} />
    </>
  );
}
