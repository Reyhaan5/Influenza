import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormField from "../components/auth/FormField";
import PasswordField from "../components/auth/PasswordField";
import SegmentedToggle from "../components/auth/SegmentedToggle";
import AuthSidebar from "../components/auth/AuthSidebar";
import SocialButton from "../components/auth/SocialButton";

const EmailIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 text-[var(--color-text)]/40 transition-colors group-focus-within:text-[var(--color-primary)]"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

export default function InfluenzeAuth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("signup");
  const [agreed, setAgreed] = useState(false);

  const isSignup = mode === "signup";

  return (
    <main className="min-h-screen w-screen flex items-stretch justify-center bg-[var(--color-background)] overflow-x-hidden selection:bg-[var(--color-primary)] selection:text-white">
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[var(--color-surface)]">
        
        {/* Left Side: Brand Panel */}
        <AuthSidebar />

        {/* Right Side: Interactive Form */}
        <div className="w-full flex flex-col justify-center items-center px-6 sm:px-[clamp(2rem,6vw,4rem)] py-12 relative">
          
          <div className="w-full max-w-[26rem] flex flex-col gap-6 animate-fadeIn">
            
            {/* Top Bar: Back Button & Mobile Logo */}
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                aria-label="Go back"
                onClick={() => navigate("/")}
                className="group w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text)] transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] hover:-translate-x-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 shadow-sm"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="transition-transform duration-200 group-hover:-translate-x-0.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>

              {/* Mobile Header Logo */}
              <div className="lg:hidden flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--color-primary)] animate-pulse" />
                <span className="text-[var(--color-primary-hover)] font-black text-xl tracking-tight">
                  Influenze
                </span>
              </div>
            </div>

            {/* Content Headers */}
            <div className="flex flex-col gap-1.5 pt-2">
              <h1 className="text-[clamp(1.85rem,3vw,2.4rem)] font-black text-[var(--color-text)] tracking-tight leading-tight">
                {isSignup ? "Create an account" : "Welcome back"}
              </h1>
              <p className="text-sm text-[var(--color-text)]/70 font-medium">
                {isSignup ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setMode(isSignup ? "login" : "signup")}
                  className="text-[var(--color-primary-hover)] font-bold underline underline-offset-4 decoration-[var(--color-primary-hover)]/30 hover:decoration-[var(--color-primary-hover)] transition-all focus:outline-none"
                >
                  {isSignup ? "Log in" : "Sign up"}
                </button>
              </p>
            </div>

            {/* Segmented Switch Container */}
            <SegmentedToggle value={mode} onChange={setMode} />

            {/* Main Form Fields */}
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              
              {/* Dynamic First & Last Name Fields */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isSignup
                    ? "grid-rows-[1fr] opacity-100 mb-0"
                    : "grid-rows-[0fr] opacity-0 pointer-events-none -mb-4"
                }`}
              >
                <div className="overflow-hidden flex flex-col sm:flex-row gap-4 p-0.5">
                  <FormField label="First Name" placeholder="John" />
                  <FormField label="Last Name" placeholder="Doe" />
                </div>
              </div>

              {/* Email Address Field */}
              <FormField
                label="Email Address"
                type="email"
                icon={<EmailIcon />}
                placeholder="you@influenze.com"
              />

              {/* Password Field */}
              <PasswordField placeholder="••••••••" />

              {/* Password Help / Forgot Password Row */}
              {!isSignup && (
                <div className="flex justify-end -mt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs font-bold text-[var(--color-primary-hover)] hover:underline focus:outline-none"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Terms Checkbox */}
              {isSignup && (
                <div className="flex items-start gap-3 pt-1 select-none group cursor-pointer" onClick={() => setAgreed(!agreed)}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={agreed}
                    aria-label="Agree to Terms & Conditions"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAgreed((a) => !a);
                    }}
                    className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 ${
                      agreed
                        ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white scale-105"
                        : "bg-[var(--color-surface)] border-[var(--color-border)] group-hover:border-[var(--color-primary)]"
                    }`}
                  >
                    {agreed && (
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={4}
                        stroke="currentColor"
                        className="animate-in zoom-in-50 duration-150"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                  <span className="text-xs sm:text-sm text-[var(--color-text)]/70 leading-relaxed font-medium">
                    I agree to the{" "}
                    <a
                      href="#terms"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[var(--color-primary-hover)] font-bold underline decoration-[var(--color-primary-hover)]/30 hover:decoration-[var(--color-primary-hover)] transition-all"
                    >
                      Terms &amp; Conditions
                    </a>
                  </span>
                </div>
              )}

              {/* Action Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 text-sm font-bold text-white bg-[var(--color-primary)] rounded-xl mt-2 transition-all duration-200 shadow-md hover:shadow-lg hover:bg-[var(--color-primary-hover)] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/30 min-h-[3.25rem] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSignup ? "Create Account" : "Log In"}</span>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>

              {/* Decorative Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-[var(--color-border)]" />
                <span className="text-[10px] text-[var(--color-text)]/40 font-black uppercase tracking-widest">
                  or continue with
                </span>
                <div className="h-px flex-1 bg-[var(--color-border)]" />
              </div>

              {/* Social Login Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <SocialButton
                  icon={
                    <img
                      src="/Google.svg"
                      alt="Google"
                      className="w-[18px] h-[18px] transition-transform group-hover:scale-110"
                    />
                  }
                >
                  Google
                </SocialButton>
                <SocialButton
                  icon={
                    <img
                      src="/Facebook.svg"
                      alt="Facebook"
                      className="w-[18px] h-[18px] transition-transform group-hover:scale-110"
                    />
                  }
                >
                  Facebook
                </SocialButton>
              </div>

            </form>
          </div>
        </div>

      </div>
    </main>
  );
}