import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormField from "../components/auth/FormField";
import PasswordField from "../components/auth/PasswordField";
import SegmentedToggle from "../components/auth/SegmentedToggle";
import AuthSidebar from "../components/auth/AuthSidebar";
import SocialButton from "../components/auth/SocialButton";

const EmailIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4c-7.4 0-13.7 4.2-17.7 10.7z" />
    <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.3 26.9 36 24 36c-5.2 0-9.7-3.4-11.3-8l-6.6 5.1C9.9 39.6 16.4 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.6 5.4C41.5 35.9 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z" />
  </svg>
);

export default function InfluenzeAuth() {
  const navigate = useNavigate();
    
  const [mode, setMode] = useState("signup");
  const [agreed, setAgreed] = useState(false);

  const isSignup = mode === "signup";

  return (
    <main className="min-h-screen w-screen flex items-stretch justify-center bg-[var(--color-background)] overflow-x-hidden">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[var(--color-surface)]">
        
        {/* Left Side: Brand Panel */}
        <AuthSidebar />

        {/* Right Side: Interactive Form */}
        <div className="w-full flex flex-col justify-center items-center px-6 sm:px-[clamp(2rem,6vw,4rem)] py-12">
          <div className="w-full max-w-[24rem] flex flex-col gap-6">
            
            {/* Back Button */}
            <button
              type="button"
              aria-label="Go back"
              onClick={() => navigate("/")}
              className="self-start w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-all duration-200 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] hover:-translate-x-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>

            {/* Mobile Header Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
              <span className="text-[var(--color-primary-hover)] font-bold text-lg tracking-tight">
                Influenze
              </span>
            </div>

            {/* Content Headers */}
            <div className="flex flex-col gap-1.5">
              <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold text-[var(--color-text)] tracking-tight leading-tight">
                {isSignup ? "Create an account" : "Welcome back"}
              </h1>
              <p className="text-sm text-[color:rgba(74,74,74,.7)] font-medium">
                {isSignup ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setMode(isSignup ? "login" : "signup")}
                  className="text-[var(--color-primary-hover)] font-bold underline decoration-[var(--color-primary-hover)]/30 hover:decoration-[var(--color-primary-hover)] focus:outline-none"
                >
                  {isSignup ? "Log in" : "Sign up"}
                </button>
              </p>
            </div>

            {/* Segmented Switch Container */}
            <SegmentedToggle value={mode} onChange={setMode} />

            {/* Main Form Fields */}
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              {isSignup && (
                <div className="w-full flex flex-col sm:flex-row gap-4">
                  <FormField label="First Name" placeholder="John" />
                  <FormField label="Last Name" placeholder="Doe" />
                </div>
              )}

              <FormField
                label="Email Address"
                type="email"
                icon={<EmailIcon />}
                placeholder="you@influenze.com"
              />

              <PasswordField placeholder="••••••••" />

              {isSignup && (
                <div className="flex items-start gap-3 pt-1 select-none">
                  <button
                    type="button"
                    onClick={() => setAgreed((a) => !a)}
                    aria-pressed={agreed}
                    className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-lg border flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 ${
                      agreed
                        ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                        : "bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]"
                    }`}
                  >
                    {agreed && (
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                  <span className="text-sm text-[color:rgba(74,74,74,.7)] leading-relaxed font-medium">
                    I agree to the{" "}
                    <span className="text-[var(--color-primary-hover)] font-bold underline decoration-[var(--color-primary-hover)]/30 cursor-pointer">
                      Terms &amp; Conditions
                    </span>
                  </span>
                </div>
              )}

              {/* Action Submit Button */}
              <button
                type="submit"
                className="w-full py-4 px-6 text-sm font-bold text-white bg-[var(--color-primary)] rounded-xl mt-2 transition-all duration-200 shadow-[var(--shadow-card)] hover:bg-[var(--color-primary-hover)] hover:shadow-lg active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/30 min-h-[3.25rem] flex items-center justify-center"
              >
                {isSignup ? "Create Account" : "Log In"}
              </button>

              {/* Decorative Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-[var(--color-border)]" />
                <span className="text-xs text-[var(--color-text)]/50 font-bold uppercase tracking-wider">or</span>
                <div className="h-px flex-1 bg-[var(--color-border)]" />
              </div>

              {/* Social Login Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <SocialButton icon={
                                    <img
                                      src="/Google.svg"
                                      alt="Google"
                                      className="w-[18px] h-[18px]"
                                    />
                                  }>Google</SocialButton>
                <SocialButton icon={
                                    <img
                                      src="/Facebook.svg"
                                      alt="Facebook"
                                      className="w-[18px] h-[18px]"
                                    />
                                  }>Facebook</SocialButton>
              </div>
            </form>
          </div>
        </div>

      </div>
    </main>
  );
}