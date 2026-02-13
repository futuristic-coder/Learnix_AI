import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContent";
import authService from "../../services/authService";
import { BrainCircuit, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

// Override browser autofill styling for dark mode
const autofillStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px rgba(30, 41, 59, 1) inset !important;
    -webkit-text-fill-color: rgba(241, 245, 249, 1) !important;
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const{token,user} = await authService.login(email, password);
      login(user, token);
      toast.success("Login Successful");
      navigate("/dashboard");
    }catch (error) {
      setError(error.messaage || "Failed to login. Please try again.");
      toast.error(error.messaage || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <style>{autofillStyles}</style>
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)]">
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-8 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <img src="/ai.png" alt="Learnix AI" className="h-8 w-8 rounded-lg" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-white/80">
                  Learnix
                </p>
                <p className="text-xl font-semibold">AI</p>
              </div>
            </div>
            <h2 className="mt-8 text-3xl font-semibold leading-tight">
                Learn smarter with personalized study tools.
            </h2>
            <p className="mt-4 text-white/85">
              Summaries, quizzes, and flashcards built from your documents.
            </p>
          </div>
          <div className="text-sm text-white/80">Secure sign-in · January 31, 2026</div>
        </div>

        <div className="p-8 sm:p-10">
            <div className="mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 lg:hidden">
              <img src="/ai.png" alt="Learnix AI" className="h-8 w-8 rounded-lg" />
            </div>
            <h1 className="mt-5 text-3xl font-semibold text-slate-900 dark:text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Sign in to continue your journey
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <div className="relative">
                  <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === "email" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}
                  >
                  <Mail className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-12 py-3 text-base text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 shadow-sm transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900"
                  placeholder="test@gmail.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                  <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${focusedField === "password" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}
                  >
                  <Lock className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-12 pr-12 py-3 text-xl text-slate-900 dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400 shadow-sm transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900"
                  placeholder="**********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={2} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                <p>{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 transition group-hover:opacity-100" />
            </button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 dark:text-indigo-400 transition hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                  Sign Up
              </Link>
            </p>
          </div>

          <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
              By continuing, you agree to our Terms & Privacy
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default LoginPage;
