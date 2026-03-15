import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

interface ProtectedRouteProps {
  children:React.ReactElement;
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
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/login" />;
  }

  return children;
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
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
