import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please provide your corporate email address.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email: email.trim() });
      const user = res.data.data;

      localStorage.setItem("userId", user.id);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userName", user.name);

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid authentication attempt. Please verify your email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0d14] text-slate-100 flex items-center justify-center p-4 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Decorative Gradients & Mesh Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" 
      />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[500px] h-[300px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="relative w-full max-w-5xl rounded-3xl border border-slate-800/80 bg-slate-900/40 p-3 sm:p-4 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] grid lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* Left Side: Enterprise Visual Context (Hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-slate-950/80 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/30">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">SuppliTrack</span>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block">Enterprise ERP</span>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="space-y-6 my-auto py-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-medium text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
              v2.4 Production Gateway
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-bold tracking-tight text-white leading-snug">
                Unified Governance & Tax Compliance Protocol
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamless role orchestration between procurement requesters and executive auditing boards with automated cross-border validation.
              </p>
            </div>

            {/* Feature Mini Cards */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 shadow-inner">
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-200">195+ Country VAT Validation</p>
                  <p className="text-[10px] text-slate-500">Real-time format & syntax compliance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Capsule */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-4 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              SOC2 Type II Protected
            </span>
            <span className="font-mono text-[10px] text-slate-600">TLS 1.3 Strict</span>
          </div>
        </div>

        {/* Right Side: Interactive Login Form */}
        <div className="lg:col-span-7 flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14">
          <div className="w-full max-w-sm mx-auto space-y-7">
            
            {/* Header */}
            <div className="space-y-1.5 text-left">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Welcome back
              </h2>
              <p className="text-xs text-slate-400">
                Authenticate with your enterprise credentials to access assigned queues.
              </p>
            </div>

            {/* Error Notification Banner */}
            {error && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                <svg className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label 
                  htmlFor="email" 
                  className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 cursor-pointer"
                >
                  Corporate Email
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@enterprise.com"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 p-[1px] font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 mt-2"
              >
                <span className="flex h-10 w-full items-center justify-center rounded-[11px] bg-slate-950/20 px-4 text-xs font-semibold tracking-wide backdrop-blur-xs transition-colors hover:bg-transparent">
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Authenticating session...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Authenticate
                      <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  )}
                </span>
              </button>
            </form>

            {/* Switch to Register */}
            <div className="pt-2 text-center">
              <p className="text-xs text-slate-400">
                Unprovisioned account?{" "}
                <Link
                  to="/register"
                  className="cursor-pointer font-semibold text-indigo-400 transition-colors hover:text-indigo-300 hover:underline underline-offset-4"
                >
                  Create workspace account
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;