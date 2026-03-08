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
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-3 bg-white border px-6 py-3 rounded-lg shadow hover:bg-gray-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
