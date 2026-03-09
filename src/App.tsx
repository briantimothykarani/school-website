import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import NoticeBoard from "./components/NoticeBoard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

interface ProtectedRouteProps {
  children: JSX.Element;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">(
    "loading",
  );

  useEffect(() => {
    async function checkAccess() {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        setStatus("denied");
        return;
      }

      const { data } = await supabase
        .from("authorized_admins")
        .select("email")
        .eq("email", session.user.email)
        .single();

      setStatus(data ? "allowed" : "denied");
    }
    checkAccess();
  }, []);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Checking admin access...
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/login" />;
  }

  return children;
}

export default function App() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase
      .from("school_settings")
      .select("*")
      .order("id")
      .limit(1)
      .then(({ data }) => {
        const row = data?.[0];
        if (row) {
          document.documentElement.style.setProperty(
            "--primary",
            row.primary_color || "#1e40af",
          );
          setSettings(row);
        }
      });
  }, []);

  if (!settings) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div style={{ "--primary": settings.primary_color } as React.CSSProperties}>
      <Navbar settings={settings} />
      <NoticeBoard settings={settings} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero settings={settings} />
              <About settings={settings} />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin settings={settings} setSettings={setSettings} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
