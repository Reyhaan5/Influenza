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