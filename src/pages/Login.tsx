import { supabase } from "../lib/supabase";

export default function Login() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/admin",
      },
    });
    if (error) {
      alert("Google login failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle, #c9a84c 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Gold top bar */}
        <div className="h-1 bg-[#c9a84c] w-full" />

        <div className="bg-white px-10 py-12 text-center shadow-2xl">
          {/* Logo placeholder */}
          <div className="w-16 h-16 bg-[#0a1628] flex items-center justify-center mx-auto mb-6">
            <span
              className="text-[#c9a84c] text-2xl font-black"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              A
            </span>
          </div>

          {/* Label */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-bold">
              Admin Portal
            </span>
            <div className="h-px w-8 bg-[#c9a84c]" />
          </div>

          <h1
            className="text-3xl font-black text-[#0a1628] mb-2"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Welcome Back
          </h1>
          <p className="text-[#0a1628]/50 text-sm mb-10">
            Sign in to manage your school website
          </p>

          {/* Google Sign In */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex  items-center justify-center gap-3 border-2 border-[#0a1628]/10 hover:border-[#c9a84c] px-6 py-4 transition-all duration-300 group"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="Google"
            />
            <span className="text-[#0a1628] font-bold cursor-pointer text-sm tracking-wider uppercase group-hover:text-[#c9a84c] transition-colors">
              Sign in with Google
            </span>
          </button>

          <p className="text-[#0a1628]/30 text-xs mt-8 leading-relaxed">
            Access is restricted to authorized administrators only.
            <br />
            Contact your system administrator if you need access.
          </p>
        </div>

        {/* Bottom link back to site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-white/30 hover:text-[#c9a84c] text-xs tracking-widest uppercase transition-colors"
          >
            ← Back to School Website
          </a>
        </div>
      </div>
    </div>
  );
}
