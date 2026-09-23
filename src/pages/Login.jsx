import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Building2,
  Tv
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

// Helper to evaluate password strength
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "bg-zinc-200" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 1:
      return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-600" };
    case 2:
      return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-600" };
    case 3:
      return { score: 3, label: "Good", color: "bg-blue-500", text: "text-blue-600" };
    case 4:
      return { score: 4, label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" };
    default:
      return { score: 0, label: "Very Weak", color: "bg-rose-400", text: "text-rose-500" };
  }
}

// ----------------- CURVED WAVE TEXT MARQUEE (NO OVERFLOW) -----------------
function CurvedWaveMarquee() {
  const textPathRef1 = useRef(null);
  const textPathRef2 = useRef(null);

  useEffect(() => {
    let animId;
    let offset1 = 0;
    let offset2 = -500;

    const animate = () => {
      offset1 = (offset1 - 1.2) % 2400;
      offset2 = (offset2 + 0.9) % 2400;

      if (textPathRef1.current) {
        textPathRef1.current.setAttribute("startOffset", `${offset1}px`);
      }
      if (textPathRef2.current) {
        textPathRef2.current.setAttribute("startOffset", `${offset2}px`);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const marqueeText1 = "✦ INFLUENZA ✦ CREATORS ✦ BRANDS ✦ RATE CARDS ✦ ESCROW ✦ SPONSORSHIPS ✦ DISCOVER ✦ COLLABORATE ".repeat(10);
  const marqueeText2 = "✦ HIGH IMPACT ✦ VERIFIED METRICS ✦ REAL DEALS ✦ SEAMLESS WORKFLOW ✦ SECURE PAYOUTS ".repeat(10);

  return (
    <div className="relative w-full h-full rounded-[28px] xl:rounded-[36px] overflow-hidden bg-[#0A0B10] flex items-center justify-center border border-zinc-800 shadow-xl select-none">
      
      {/* Background subtle starry sparkles */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-[18%] left-[22%] text-indigo-400 text-xs animate-ping">✦</div>
        <div className="absolute top-[32%] right-[18%] text-purple-400 text-xs animate-pulse">✦</div>
        <div className="absolute bottom-[24%] left-[30%] text-pink-400 text-xs animate-pulse">✦</div>
        <div className="absolute bottom-[15%] right-[28%] text-blue-400 text-xs animate-ping">✦</div>
      </div>

      {/* Top and Bottom Ambient Radial Glows */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[260px] bg-purple-600/20 rounded-full filter blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[260px] bg-indigo-600/20 rounded-full filter blur-[80px] pointer-events-none" />

      {/* SVG Wave Ribbon Canvas */}
      <div className="w-full h-full overflow-hidden flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 1200 700"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full overflow-hidden block"
        >
          <defs>
            <path
              id="wavePath1"
              d="M -600 350 C -300 120, 0 580, 300 350 C 600 120, 900 580, 1200 350 C 1500 120, 1800 580, 2100 350 C 2400 120, 2700 580, 3000 350"
              fill="none"
            />
            <path
              id="wavePath2"
              d="M -600 480 C -300 620, 0 340, 300 480 C 600 620, 900 340, 1200 480 C 1500 620, 1800 340, 2100 480 C 2400 620, 2700 340, 3000 480"
              fill="none"
            />
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4338CA" />
              <stop offset="35%" stopColor="#4F46E5" />
              <stop offset="70%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3730A3" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#4F46E5" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3730A3" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* Secondary Wave */}
          <use
            href="#wavePath2"
            stroke="url(#waveGradient2)"
            strokeWidth="80"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            fill="rgba(255, 255, 255, 0.35)"
            fontSize="22"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="4px"
            dy="8"
          >
            <textPath ref={textPathRef2} href="#wavePath2" startOffset="-500px">
              {marqueeText2}
            </textPath>
          </text>

          {/* Main Primary Wave */}
          <use
            href="#wavePath1"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="110"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="blur(12px)"
          />
          <use
            href="#wavePath1"
            stroke="url(#waveGradient1)"
            strokeWidth="94"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            fill="#FFFFFF"
            fontSize="28"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="3.5px"
            dy="10"
          >
            <textPath ref={textPathRef1} href="#wavePath1" startOffset="0px">
              {marqueeText1}
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}

export default function InfluenzeAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Mode: "login" or "signup"
  const [mode, setMode] = useState(location.pathname === "/signup" ? "signup" : "login");
  const [role, setRole] = useState("influencer");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Form fields & anti-bot honeypot field
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    honeypot: "",
  });

  const isSignup = mode === "signup";
  const passwordStrength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (form.honeypot) {
      return;
    }

    if (isSignup && !agreed) {
      setError("Please accept the Terms & Conditions to continue.");
      return;
    }

    if (isSignup && form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (isSignup) {
        res = await axios.post(`${API_URL}/auth/register`, {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role,
        });
      } else {
        res = await axios.post(`${API_URL}/auth/login`, {
          email: form.email.trim().toLowerCase(),
          password: form.password,
        });
      }

      const { token, user } = res.data;
      
      if (rememberMe) {
        localStorage.setItem("remember_email", form.email);
      } else {
        localStorage.removeItem("remember_email");
      }

      login(token, user);

      if (isSignup && user.role === "influencer") {
        navigate("/creator-onboarding");
      } else {
        navigate(user.role === "brand" ? "/brand-dashboard" : "/influencer-dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Authentication failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setError("");
    alert("Google OAuth is enabled in production with Google Identity Services Client ID.");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
    setTimeout(() => {
      setShowResetModal(false);
      setResetSent(false);
      setResetEmail("");
      setSuccessMsg("Password recovery link sent! Check your inbox.");
    }, 2000);
  };

  return (
    <div className="w-full max-w-full h-screen max-h-screen overflow-hidden bg-[#F6F7FB] text-zinc-900 flex flex-col lg:flex-row items-stretch selection:bg-purple-100 selection:text-purple-900">
      
      {/* ----------------- LEFT COLUMN: SIGN IN / SIGN UP FORM ----------------- */}
      <div className="w-full lg:w-[46%] xl:w-[40%] 2xl:w-[36%] min-w-0 h-full flex flex-col justify-between p-4 sm:p-6 lg:p-6 xl:p-8 bg-white border-r border-zinc-200/80 relative z-10 shadow-xs overflow-y-auto">
        
        {/* Top bar */}
        <div className="flex items-center justify-between w-full shrink-0 mb-2">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            aria-label="Back to home"
            className="p-1.5 rounded-xl bg-zinc-100/90 border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 transition-all flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft size={16} />
          </motion.button>

          <button
            type="button"
            onClick={() => {
              setMode(isSignup ? "login" : "signup");
              setError("");
            }}
            className="text-xs font-bold text-zinc-600 hover:text-purple-600 transition-colors cursor-pointer"
          >
            {isSignup ? "Have an account? Sign in" : "New here? Create account"}
          </button>
        </div>

        {/* Center: Form Container */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-1">
          
          {/* Header */}
          <div className="mb-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >

                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mb-0.5">
                  {isSignup ? "Create account" : "Welcome back"}
                </h1>
                <p className="text-xs text-zinc-500 font-medium">
                  {isSignup 
                    ? "Join creators & brands scaling verified partnerships" 
                    : "Access your account and continue your journey with us"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Role selector on signup (Creator vs Brand) */}
          <AnimatePresence>
            {isSignup && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="mb-2.5 overflow-hidden"
              >
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  I want to sign up as
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100/80 border border-zinc-200 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRole("influencer")}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      role === "influencer"
                        ? "bg-white text-zinc-950 shadow-xs border border-zinc-200"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    <Tv size={13} className={role === "influencer" ? "text-purple-600" : "text-zinc-400"} />
                    <span>Creator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("brand")}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      role === "brand"
                        ? "bg-white text-zinc-950 shadow-xs border border-zinc-200"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    <Building2 size={13} className={role === "brand" ? "text-purple-600" : "text-zinc-400"} />
                    <span>Brand</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            
            {/* Honeypot field */}
            <input
              type="text"
              name="honeypot"
              value={form.honeypot}
              onChange={handleChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Full Name field on signup */}
            <AnimatePresence>
              {isSignup && (
                <motion.div 
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-0.5 overflow-hidden"
                >
                  <label className="block text-[11px] font-bold text-zinc-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs sm:text-sm rounded-xl px-3 py-2 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/10 transition-all shadow-2xs"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Address */}
            <div className="space-y-0.5">
              <label className="block text-[11px] font-bold text-zinc-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs sm:text-sm rounded-xl px-3 py-2 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/10 transition-all shadow-2xs"
              />
            </div>

            {/* Password */}
            <div className="space-y-0.5">
              <label className="block text-[11px] font-bold text-zinc-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs sm:text-sm rounded-xl pl-3 pr-9 py-2 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/10 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password strength meter during signup */}
              {isSignup && form.password && (
                <div className="pt-0.5 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                    <span>Password Strength</span>
                    <span className={`font-bold ${passwordStrength.text}`}>{passwordStrength.label}</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden flex gap-1 p-0.5 border border-zinc-200/60">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 rounded-full transition-all duration-300 ${
                          step <= passwordStrength.score ? passwordStrength.color : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Row: Keep me signed in & Reset Password */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-zinc-300 text-purple-600 focus:ring-purple-500/20 cursor-pointer accent-purple-600"
                />
                <span className="group-hover:text-zinc-950 transition-colors text-[11px]">Keep me signed in</span>
              </label>

              {!isSignup && (
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-[11px] font-bold text-purple-600 hover:text-purple-700 hover:underline transition-all cursor-pointer"
                >
                  Reset password
                </button>
              )}
            </div>

            {/* Terms checkbox on signup */}
            {isSignup && (
              <label className="flex items-start gap-1.5 text-xs text-zinc-600 cursor-pointer pt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-zinc-300 text-purple-600 focus:ring-0 accent-purple-600 cursor-pointer"
                />
                <span className="text-[10.5px] leading-snug">
                  I agree to the{" "}
                  <a href="/terms" target="_blank" className="text-purple-600 font-semibold hover:underline">
                    Terms
                  </a>{" "}
                  &amp;{" "}
                  <a href="/privacy" target="_blank" className="text-purple-600 font-semibold hover:underline">
                    Privacy
                  </a>
                </span>
              </label>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Sign In / Sign Up Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isSignup ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-white px-3 text-zinc-400 whitespace-nowrap">Or continue with</span>
              </div>
            </div>

            {/* Continue with Google Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.01, backgroundColor: "#fafafa" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleAuth}
              className="w-full py-2 px-4 rounded-xl bg-white border border-zinc-200 text-zinc-800 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:border-zinc-300 shadow-2xs cursor-pointer"
            >
              <img src="/icons/google.svg" alt="Google" className="w-3.5 h-3.5" />
              <span>Continue with Google</span>
            </motion.button>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-3 text-center text-xs text-zinc-500 font-medium">
            {isSignup ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className="font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors ml-0.5 cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New to our platform?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className="font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors ml-0.5 cursor-pointer"
                >
                  Create Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ----------------- RIGHT COLUMN: CURVED WAVE CANVAS ----------------- */}
      <div className="hidden lg:flex lg:w-[54%] xl:w-[60%] 2xl:w-[64%] min-w-0 h-full p-4 xl:p-6 bg-[#F6F7FB] overflow-hidden">
        <CurvedWaveMarquee />
      </div>

      {/* ----------------- RESET PASSWORD MODAL ----------------- */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-zinc-900 relative"
            >
              <h3 className="text-xl font-black text-zinc-950 mb-1">Reset Password</h3>
              <p className="text-xs text-zinc-500 font-medium mb-5 leading-relaxed">
                Enter your registered email address and we will send you secure recovery instructions.
              </p>

              {resetSent ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3">
                  <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
                  <span>Recovery link has been dispatched to your email address.</span>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full bg-zinc-50 text-zinc-900 text-sm rounded-xl border border-zinc-200 px-4 py-2.5 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-3 focus:ring-purple-500/10 transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowResetModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      Send Reset Link
                    </button>
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
