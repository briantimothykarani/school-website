import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import NoticeBoard from "./components/NoticeBoard";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

export default function App() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // Fetch Global Settings
    supabase
      .from("school_settings")
      .select("*")
      .single()
      .then(({ data }) => setSettings(data));
  }, []);

  if (!settings)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <BrowserRouter>
      <div style={{ "--primary": settings.primary_color } as any}>
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
    </BrowserRouter>
  );
}

/*
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [session, setSession] = useState<any>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (session === undefined) return <div>Loading...</div>;

  return session ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
 */
