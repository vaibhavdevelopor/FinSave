import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">
      <div className="absolute inset-0">
        <div className="absolute left-[-8%] top-[-4%] h-72 w-72 rounded-full bg-cyan-500/18 blur-3xl" />
        <div className="absolute right-[-8%] top-[8%] h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/16 blur-3xl" />
        <div className="absolute bottom-[-14%] left-[36%] h-80 w-80 rounded-full bg-violet-500/12 blur-3xl" />
        <div className="premium-grid absolute inset-0 opacity-40" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid min-h-[calc(100vh-3rem)] w-full max-w-7xl overflow-hidden rounded-[34px] border border-white/10 bg-[#141417]/90 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]"
        >
          <div className="relative hidden overflow-hidden lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_26%),linear-gradient(160deg,#201a2f_0%,#17131f_38%,#0b0b10_100%)]" />
            <div className="absolute inset-6 flex h-[calc(100%-3rem)] flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)),radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.28),transparent_24%),radial-gradient(circle_at_72%_74%,rgba(14,165,233,0.16),transparent_24%),linear-gradient(180deg,#554b72_0%,#211b2f_40%,#0f0d14_100%)] p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-fuchsia-600 text-lg font-black text-white">
                    F
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.32em] text-white/50">
                      FinSave
                    </p>
                    <p className="text-sm text-white/80">Reward intelligence</p>
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                  Secure access
                </div>
              </div>

              <div className="mt-12 max-w-lg">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-orange-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Premium data layer
                </div>
                <h1 className="mt-6 text-4xl font-black leading-[0.96] tracking-tight text-white xl:text-5xl">
                  Compare cashback with more clarity before every payment.
                </h1>
                <p className="mt-5 max-w-md text-base leading-7 text-white/68">
                  Built for people who want better payment decisions, not just a
                  list of offers.
                </p>
              </div>

              <div className="mt-auto rounded-[28px] border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                      Daily edge
                    </p>
                    <p className="mt-3 text-xl font-black text-white xl:text-2xl">
                      Live offers, ranked for action
                    </p>
                    <p className="mt-3 max-w-md text-sm leading-6 text-white/60">
                      Discover the strongest reward path across wallets, cards,
                      and merchant offers in one premium workspace.
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Sparkles className="h-5 w-5 text-orange-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
            <div className="w-full max-w-lg">
              <div className="mb-10">
                <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">
                  {isSignup ? "Create access" : "Welcome back"}
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                  {isSignup ? "Create account" : "Sign in to FinSave"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  {isSignup
                    ? "Create your account to start tracking live cashback opportunities."
                    : "Access your reward workspace and continue where you left off."}
                </p>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-5">
                <div className="grid gap-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="auth-input h-14 rounded-2xl border border-white/10 bg-[#232329] px-4 outline-none transition placeholder:text-white/35 focus:border-fuchsia-400/40 focus:bg-[#27272f]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="auth-input h-14 w-full rounded-2xl border border-white/10 bg-[#232329] px-4 pr-12 outline-none transition placeholder:text-white/35 focus:border-fuchsia-400/40 focus:bg-[#27272f]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-white/45 transition hover:bg-white/8 hover:text-white/75"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 font-bold text-black shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]"
                >
                  {isSignup ? "Create account" : "Login"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <p className="text-xs uppercase tracking-[0.28em] text-white/35">
                  Continue with
                </p>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <button
                onClick={handleGoogleLogin}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white text-base font-semibold text-zinc-900 transition hover:bg-zinc-100"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                Sign in with Google
              </button>

              <p className="mt-8 text-center text-sm text-white/48">
                {isSignup ? "Already have an account?" : "No account yet?"}{" "}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  {isSignup ? "Login" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
