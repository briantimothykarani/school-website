import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("Login failed: " + error.message);
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-white p-6 shadow rounded space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
}
