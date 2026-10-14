import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Sparkles, Building2, Tv } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import CurvedWaveMarquee from "../components/auth/CurvedWaveMarquee";
import { getPasswordStrength, DEMO_LOGINS } from "../components/auth/AuthShared";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [mode, setMode] = useState(location.state?.mode === "signup" ? "signup" : "login");
  const [role, setRole] = useState(location.state?.role || "influencer");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", honeypot: "" });

  const isSignup = mode === "signup";
  const pwdStrength = getPasswordStrength(form.password);
  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); if (error) setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.honeypot) return;
    setError(""); setSuccessMsg("");
    if (isSignup && !agreed) return setError("Please accept the Terms & Conditions to continue.");
    if (isSignup && form.password.length < 8) return setError("Password must be at least 8 characters long.");

    setLoading(true);
    try {
      const payload = isSignup
        ? { name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password, role }
        : { email: form.email.trim().toLowerCase(), password: form.password };
      const { data } = await api.post(isSignup ? "/auth/register" : "/auth/login", payload);
      
      if (rememberMe) localStorage.setItem("remember_email", form.email);
      else localStorage.removeItem("remember_email");

      login(data.token, data.user);
      navigate(isSignup && data.user.role === "influencer" ? "/creator-onboarding" : data.user.role === "brand" ? "/brand-dashboard" : "/influencer-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
    setTimeout(() => {
      setShowResetModal(false); setResetSent(false); setResetEmail("");
      setSuccessMsg("Password recovery link sent! Check your inbox.");
    }, 2000);
  };

  return (
    <div className="w-full max-w-full h-screen max-h-screen overflow-hidden bg-[#F6F7FB] text-zinc-900 flex flex-col lg:flex-row items-stretch selection:bg-purple-100 selection:text-purple-900">
      {/* LEFT FORM COLUMN */}
      <div className="w-full lg:w-[46%] xl:w-[40%] 2xl:w-[36%] min-w-0 h-full flex flex-col justify-between p-4 sm:p-6 lg:p-6 xl:p-8 bg-white border-r border-zinc-200/80 relative z-10 shadow-xs overflow-y-auto">
        <div className="flex items-center justify-between w-full shrink-0 mb-2">
          <motion.button whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/")} aria-label="Back to home" className="p-1.5 rounded-xl bg-zinc-100/90 border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 transition-all flex items-center justify-center cursor-pointer">
            <ArrowLeft size={16} />
          </motion.button>
          <button type="button" onClick={() => { setMode(isSignup ? "login" : "signup"); setError(""); }} className="text-xs font-bold text-zinc-600 hover:text-purple-600 transition-colors cursor-pointer">
            {isSignup ? "Have an account? Sign in" : "New here? Create account"}
          </button>
        </div>

        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-1">
          <div className="mb-3">
            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mb-0.5">{isSignup ? "Create account" : "Welcome back"}</h1>
                <p className="text-xs text-zinc-500 font-medium">{isSignup ? "Join creators & brands scaling verified partnerships" : "Access your account and continue your journey with us"}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick Demo Fill Buttons */}
          {!isSignup && (
            <div className="mb-3 p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-bold text-zinc-700 flex items-center gap-1.5"><Sparkles size={12} className="text-purple-600" /><span>Quick Demo Logins</span></span>
                <span className="text-[10px] font-semibold text-zinc-500 bg-white px-2 py-0.5 rounded-full border border-zinc-200">Password: <code className="text-purple-600 font-bold">password123</code></span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {DEMO_LOGINS.map(({ label, email, Icon, color, hoverBg, hoverBorder, hoverText }) => (
                  <button key={email} type="button" onClick={() => { setForm({ ...form, email, password: "password123" }); setError(""); }} className={`text-left px-2.5 py-1.5 rounded-xl border border-zinc-200 bg-white ${hoverBorder} ${hoverBg} transition-all cursor-pointer group`}>
                    <div className="flex items-center gap-1.5"><Icon size={12} className={`${color} group-hover:scale-110 transition-transform`} /><span className={`text-[11px] font-bold text-zinc-900 ${hoverText}`}>{label}</span></div>
                    <p className="text-[9.5px] text-zinc-400 group-hover:text-zinc-500 font-mono mt-0.5 truncate">{email}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Role selector on signup */}
          <AnimatePresence>
            {isSignup && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }} className="mb-2.5 overflow-hidden">
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">I want to sign up as</label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100/80 border border-zinc-200 rounded-xl">
                  {[{ r: "influencer", label: "Creator", Icon: Tv }, { r: "brand", label: "Brand", Icon: Building2 }].map(({ r, label, Icon }) => (
                    <button key={r} type="button" onClick={() => setRole(r)} className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${role === r ? "bg-white text-zinc-950 shadow-xs border border-zinc-200" : "text-zinc-600 hover:text-zinc-950"}`}>
                      <Icon size={13} className={role === r ? "text-purple-600" : "text-zinc-400"} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-2">
            <input type="text" name="honeypot" value={form.honeypot} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" />

            {isSignup && (
              <div className="space-y-0.5">
                <label className="block text-[11px] font-bold text-zinc-700">Full Name</label>
                <input type="text" name="name" required placeholder="e.g. Alex Morgan" value={form.name} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs sm:text-sm rounded-xl px-3 py-2 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/10 transition-all shadow-2xs" />
              </div>
            )}

            <div className="space-y-0.5">
              <label className="block text-[11px] font-bold text-zinc-700">Email Address</label>
              <input type="email" name="email" required placeholder="Enter your email address" value={form.email} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs sm:text-sm rounded-xl px-3 py-2 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/10 transition-all shadow-2xs" />
            </div>

            <div className="space-y-0.5">
              <label className="block text-[11px] font-bold text-zinc-700">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" required placeholder="Enter your password" value={form.password} onChange={handleChange} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs sm:text-sm rounded-xl pl-3 pr-9 py-2 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/10 transition-all shadow-2xs" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none cursor-pointer" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {isSignup && form.password && (
                <div className="pt-0.5 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-medium"><span>Password Strength</span><span className={`font-bold ${pwdStrength.text}`}>{pwdStrength.label}</span></div>
                  <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden flex gap-1 p-0.5 border border-zinc-200/60">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className={`h-full flex-1 rounded-full transition-all duration-300 ${step <= pwdStrength.score ? pwdStrength.color : "bg-transparent"}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 cursor-pointer select-none group">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-3.5 h-3.5 rounded border-zinc-300 text-purple-600 focus:ring-purple-500/20 cursor-pointer accent-purple-600" />
                <span className="group-hover:text-zinc-950 transition-colors text-[11px]">Keep me signed in</span>
              </label>
              {!isSignup && (
                <button type="button" onClick={() => setShowResetModal(true)} className="text-[11px] font-bold text-purple-600 hover:text-purple-700 hover:underline transition-all cursor-pointer">Reset password</button>
              )}
            </div>

            {isSignup && (
              <label className="flex items-start gap-1.5 text-xs text-zinc-600 cursor-pointer pt-0.5">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-3.5 h-3.5 rounded border-zinc-300 text-purple-600 focus:ring-0 accent-purple-600 cursor-pointer" />
                <span className="text-[10.5px] leading-snug">I agree to the <a href="/terms" target="_blank" className="text-purple-600 font-semibold hover:underline">Terms</a> &amp; <a href="/privacy" target="_blank" className="text-purple-600 font-semibold hover:underline">Privacy</a></span>
              </label>
            )}

            {error && <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" /><span>{error}</span></div>}
            {successMsg && <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2"><CheckCircle2 size={15} className="shrink-0 text-emerald-600" /><span>{successMsg}</span></div>}

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1 cursor-pointer">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : isSignup ? "Create Account" : "Sign In"}
            </motion.button>
          </form>

          <div className="mt-3 text-center text-xs text-zinc-500 font-medium">
            <p>
              {isSignup ? "Already have an account? " : "New to our platform? "}
              <button type="button" onClick={() => { setMode(isSignup ? "login" : "signup"); setError(""); }} className="font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors ml-0.5 cursor-pointer">
                {isSignup ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: MARQUEE */}
      <div className="hidden lg:flex lg:w-[54%] xl:w-[60%] 2xl:w-[64%] min-w-0 h-full p-4 xl:p-6 bg-[#F6F7FB] overflow-hidden">
        <CurvedWaveMarquee />
      </div>

      {/* RESET PASSWORD MODAL */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-900 relative">
              <h3 className="text-xl font-black text-zinc-950 mb-1">Reset Password</h3>
              <p className="text-xs text-zinc-500 font-medium mb-5 leading-relaxed">Enter your registered email address and we will send you secure recovery instructions.</p>
              {resetSent ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3"><CheckCircle2 size={20} className="shrink-0 text-emerald-600" /><span>Recovery link has been dispatched to your email address.</span></div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">Your Email Address</label>
                    <input type="email" required placeholder="name@example.com" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="w-full bg-zinc-50 text-zinc-900 text-sm rounded-xl border border-zinc-200 px-4 py-2.5 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/10 transition-all" />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setShowResetModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer">Cancel</button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer">Send Reset Link</button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
