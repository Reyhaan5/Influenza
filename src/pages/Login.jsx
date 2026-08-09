// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";

import { API_URL } from "../config/api";

function PillField({ icon: Icon, ...props }) {
  return (
    <div className="relative w-full flex items-center">
      <Icon size={16} className="absolute left-4 text-[var(--color-text)]/40 pointer-events-none" />
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 rounded-full bg-[var(--color-background)] text-sm text-[var(--color-text)] placeholder-[var(--color-text)]/40 outline-none border border-transparent focus:border-[var(--color-primary)] transition-colors"
      />
    </div>
  );
}

function SocialRow() {
  return (
    <div className="flex items-center justify-center gap-3 mt-5">
      {[
        { key: "google", node: <img src="/icons/google.svg" alt="Google" className="w-4 h-4" /> },
        { key: "facebook", node: <img src="/icons/facebook.svg" alt="Facebook" className="w-4 h-4" /> },
        { key: "twitter", node: <img src="/icons/twitter.svg" alt="Twitter" className="w-4 h-4" /> },
        { key: "linkedin", node: <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-4 h-4" /> },
      ].map((s) => (
        <button
          key={s.key}
          type="button"
          className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:border-[var(--color-primary)] hover:-translate-y-0.5 transition-all"
        >
          {s.node}
        </button>
      ))}
    </div>
  );
}

function AuthFields({
  mode,
  form,
  role,
  agreed,
  loading,
  error,
  onChange,
  onRoleChange,
  onAgreeToggle,
  onSubmit,
  onForgot,
}) {
  const isSignup = mode === "signup";

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.form
        key={mode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onSubmit={onSubmit}
        className="w-full flex flex-col items-center gap-3.5"
      >
        <h2 className="text-2xl font-black text-[var(--color-text)] mb-1 self-start">
          {isSignup ? "Sign up" : "Sign in"}
        </h2>

        {isSignup && (
          <PillField
            icon={User}
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={onChange}
            required
          />
        )}

        <PillField
          icon={Mail}
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />

        <PillField
          icon={Lock}
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
        />

        {isSignup && (
          <div className="w-full flex gap-2">
            {["influencer", "brand"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onRoleChange(r)}
                className={`flex-1 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  role === r
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-text)]/70"
                }`}
              >
                {r === "influencer" ? "Influencer" : "Brand"}
              </button>
            ))}
          </div>
        )}

        {!isSignup && (
          <button
            type="button"
            onClick={onForgot}
            className="self-end text-xs font-semibold text-[var(--color-primary-hover)] hover:underline -mt-1.5"
          >
            Forgot password?
          </button>
        )}

        {isSignup && (
          <label className="w-full flex items-start gap-2 text-[11px] text-[var(--color-text)]/60 leading-snug cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={onAgreeToggle}
              className="mt-0.5 accent-[var(--color-primary)]"
            />
            I agree to the Terms &amp; Conditions
          </label>
        )}

        {error && (
          <p className="w-full text-xs font-medium text-[var(--color-danger)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 px-10 py-3 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-bold uppercase tracking-wide shadow-md transition-colors disabled:opacity-60"
        >
          {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="text-[11px] text-[var(--color-text)]/50">Or continue with</p>
        <SocialRow />
      </motion.form>
    </AnimatePresence>
  );
}

export default function InfluenzeAuth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [agreed, setAgreed] = useState(false);
  const [role, setRole] = useState("influencer");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup && !agreed) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (isSignup) {
        res = await axios.post(`${API_URL}/auth/register`, {
          name: form.name,
          email: form.email,
          password: form.password,
          role,
        });
      } else {
        res = await axios.post(`${API_URL}/auth/login`, {
          email: form.email,
          password: form.password,
        });
      }

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.role === "brand" ? "/brand-dashboard" : "/influencer-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const curvePanelStyle = {
    background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
    borderRadius: isSignup
      ? "50% 0 0 50% / 50% 0 0 50%"
      : "0 50% 50% 0 / 0 50% 50% 0",
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] relative">
      <button
        type="button"
        aria-label="Go back"
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md hover:bg-white/25 transition-colors"
      >
        <img  
          src="/icons/arrow-left.svg" 
          alt="Back" 
          className="w-[18px] h-[18px]" 
        />
      </button>

      {/* Desktop: sliding curve card */}
      <div className="hidden md:block relative w-full max-w-4xl min-h-[600px] bg-[var(--color-surface)] rounded-[32px] shadow-2xl overflow-hidden">
        <motion.div
          className="absolute inset-y-0 w-1/2 flex items-center justify-center text-center px-12"
          animate={{ left: isSignup ? "50%" : "0%" }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
          style={curvePanelStyle}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode + "-cta"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex flex-col items-center gap-4 text-white max-w-xs"
            >
              <h3 className="text-2xl font-black">{isSignup ? "One of us?" : "New here?"}</h3>
              <p className="text-sm text-white/85 leading-relaxed">
                {isSignup
                  ? "Welcome back! Sign in to continue your journey with us."
                  : "Join us today and discover a world of possibilities. Create your account in seconds!"}
              </p>
              <button
                type="button"
                onClick={() => setMode(isSignup ? "login" : "signup")}
                className="px-8 py-2.5 rounded-full border-2 border-white text-white text-xs font-bold uppercase tracking-wide hover:bg-white hover:text-[var(--color-primary)] transition-colors"
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="absolute inset-y-0 w-1/2 flex items-center justify-center px-10 lg:px-14"
          animate={{ left: isSignup ? "0%" : "50%" }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
        >
          <AuthFields
            mode={mode}
            form={form}
            role={role}
            agreed={agreed}
            loading={loading}
            error={error}
            onChange={handleChange}
            onRoleChange={setRole}
            onAgreeToggle={() => setAgreed((a) => !a)}
            onSubmit={handleSubmit}
            onForgot={() => navigate("/forgot-password")}
          />
        </motion.div>
      </div>

      {/* Mobile: simple stacked card */}
      <div className="md:hidden w-full max-w-sm bg-[var(--color-surface)] rounded-[28px] shadow-2xl p-7">
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
          <span className="text-[var(--color-primary-hover)] font-black text-lg tracking-tight">Influenza</span>
        </div>

        <AuthFields
          mode={mode}
          form={form}
          role={role}
          agreed={agreed}
          loading={loading}
          error={error}
          onChange={handleChange}
          onRoleChange={setRole}
          onAgreeToggle={() => setAgreed((a) => !a)}
          onSubmit={handleSubmit}
          onForgot={() => navigate("/forgot-password")}
        />

        <p className="text-center text-xs text-[var(--color-text)]/60 mt-5">
          {isSignup ? "Already have an account? " : "New here? "}
          <button
            type="button"
            onClick={() => setMode(isSignup ? "login" : "signup")}
            className="font-bold text-[var(--color-primary-hover)] underline underline-offset-2"
          >
            {isSignup ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </main>
  );
}