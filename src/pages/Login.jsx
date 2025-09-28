import { useState } from "react";
import { motion } from "framer-motion";
import { auth, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--bg)]">
      {/* aurora blobs */}
      <div className="absolute -top-24 -left-16 w-80 h-80 bg-cyan-500/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-16 w-96 h-96 bg-purple-600/40 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[400px] p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleEmailAuth} className="grid gap-3">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 rounded-xl bg-white/15 border border-white/20 outline-none focus:ring-2 focus:ring-cyan-400"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded-xl bg-white/15 border border-white/20 outline-none focus:ring-2 focus:ring-purple-400"
            value={password} onChange={(e) => setPassword(e.target.value)} required
          />
          <button
            type="submit"
            className="mt-1 py-2 rounded-xl font-extrabold text-black bg-gradient-to-r from-cyan-300 to-purple-400 hover:opacity-90"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full py-2 rounded-xl bg-white text-gray-900 font-semibold flex items-center justify-center gap-2 hover:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google" className="w-5 h-5"
          />
          Sign in with Google
        </button>

        <p className="text-center text-white/70 mt-6">
          {isSignup ? "Already have an account?" : "No account yet?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-cyan-300 hover:underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
