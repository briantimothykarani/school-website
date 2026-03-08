import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">(
    "loading",
  );

  useEffect(() => {
    async function checkAccess() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setStatus("denied");
        return;
      }

      const { data } = await supabase
        .from("authorized_admins")
        .select("email")
        .eq("email", session.user.email)
        .single();

      if (data) {
        setStatus("allowed");
      } else {
        setStatus("denied");
      }
    }

    checkAccess();
  }, []);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking admin access...
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/login" />;
  }

  return children;
}
