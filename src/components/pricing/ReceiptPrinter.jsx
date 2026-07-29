import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Copy, RotateCcw, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import {
  calculatePricing,
  NICHES,
  MARKETS,
  FORMATS,
  saveLastEntry,
  loadLastEntry,
  daysAgo,
  getDeltaPct,
} from "../../utils/pricingEngine";

const QUESTIONS = [
  { key: "handle", type: "text", label: "What's your Instagram handle?", placeholder: "@yourhandle", optional: true, receiptLabel: "HANDLE" },
  { key: "followers", type: "number", label: "How many followers do you have?", placeholder: "15000", receiptLabel: "FOLLOWERS" },
  { key: "avgLikes", type: "number", label: "Average likes per post?", placeholder: "900", receiptLabel: "AVG LIKES" },
  { key: "avgComments", type: "number", label: "Average comments per post?", placeholder: "40", receiptLabel: "AVG COMMENTS" },
  { key: "nicheId", type: "chips", label: "Which best describes your content?", options: NICHES, receiptLabel: "NICHE" },
  { key: "marketId", type: "chips", label: "Which market do you create for?", options: MARKETS, receiptLabel: "MARKET" },
];

const EMPTY_ANSWERS = { handle: "", followers: "", avgLikes: "", avgComments: "", nicheId: "", marketId: "" };

// Given a set of pre-filled answers (e.g. from a saved profile), figure out
// which question to start on. Required fields that already have a value get
// skipped; optional empty fields (like handle) also get skipped rather than
// re-asked. Returns QUESTIONS.length if everything is already filled in.
function getStartStep(initial) {
  if (!initial) return 0;
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    const val = initial[q.key];
    const hasValue = val !== undefined && val !== null && val !== "";
    if (!hasValue && !q.optional) return i;
  }
  return QUESTIONS.length;
}

function TornEdge() {
  return (
    <div className="flex justify-center gap-1 -mb-[8px] overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="w-3.5 h-3.5 bg-zinc-950 rotate-45 -mt-[7px] flex-shrink-0" />
      ))}
    </div>
  );
}

export default function ReceiptPrinter({ initialAnswers, onComplete }) {
  const startStep = useMemo(() => getStartStep(initialAnswers), [initialAnswers]);

  const [step, setStep] = useState(startStep);
  const [answers, setAnswers] = useState({ ...EMPTY_ANSWERS, ...(initialAnswers || {}) });
  const [inputValue, setInputValue] = useState("");
  const [printing, setPrinting] = useState(false);
  const [prevEntry, setPrevEntry] = useState(null);
  const [showReprintPrompt, setShowReprintPrompt] = useState(false);
  const [result, setResult] = useState(null);

  // The "reprint last entry" prompt only makes sense for the standalone,
  // no-login calculator — when a profile already supplied initialAnswers,
  // that pre-fill takes priority instead.
  useEffect(() => {
    if (initialAnswers) return;
    const saved = loadLastEntry();
    if (saved) {
      setPrevEntry(saved);
      setShowReprintPrompt(true);
    }
  }, [initialAnswers]);

  // If a profile already supplied everything the calculator needs,
  // skip straight to the printed result instead of showing an empty form.
  useEffect(() => {
    if (initialAnswers && startStep === QUESTIONS.length) {
      finish({ ...EMPTY_ANSWERS, ...initialAnswers });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFinal = step === QUESTIONS.length;
  const currentQuestion = QUESTIONS[step];

  const printedLines = useMemo(
    () =>
      QUESTIONS.slice(0, step).filter((q) => {
        const val = answers[q.key];
        return val !== "" && val !== undefined && val !== null;
      }),
    [step, answers]
  );

  function formatAnswer(question, value) {
    if (question.type === "number") return Number(value).toLocaleString();
    if (question.type === "chips") {
      const opt = question.options.find((o) => o.id === value);
      return opt ? opt.label : value;
    }
    return value;
  }

  function commitAnswer(value) {
    const key = currentQuestion.key;
    setAnswers((a) => ({ ...a, [key]: value }));
    setInputValue("");
    if (step + 1 === QUESTIONS.length) {
      finish({ ...answers, [key]: value });
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleSkip() {
    setInputValue("");
    setStep((s) => s + 1);
  }

  function handleBack() {
    setResult(null);
    setStep((s) => Math.max(0, s - 1));
  }

  function finish(finalAnswers) {
    setPrinting(true);
    setTimeout(() => {
      const computed = calculatePricing({
        followers: Number(finalAnswers.followers) || 0,
        avgLikes: Number(finalAnswers.avgLikes) || 0,
        avgComments: Number(finalAnswers.avgComments) || 0,
        nicheId: finalAnswers.nicheId || "lifestyle",
        marketId: finalAnswers.marketId || "india",
      });
      setResult(computed);
      setStep(QUESTIONS.length);
      setPrinting(false);
      saveLastEntry({ ...finalAnswers, rates: computed.rates });
      if (onComplete) onComplete({ ...finalAnswers, rates: computed.rates });
    }, 650);
  }

  function useReprint() {
    setAnswers(prevEntry);
    setShowReprintPrompt(false);
    finish(prevEntry);
  }

  function startFresh() {
    setShowReprintPrompt(false);
  }

  function startOver() {
    setAnswers({ ...EMPTY_ANSWERS, ...(initialAnswers || {}) });
    setResult(null);
    setStep(getStartStep(initialAnswers));
  }

  function handleCopy() {
    if (!result) return;
    const lines = FORMATS.map((f) => `${f.label.padEnd(12, " ")} ${result.market.symbol}${result.rates[f.id].toLocaleString()}`);
    const text = [`RATE CARD — ${answers.handle || "@yourhandle"}`, `Tier: ${result.tier.label} · Engagement: ${result.engagementRatePct}%`, "—".repeat(28), ...lines].join("\n");
    navigator.clipboard.writeText(text);
  }

  const deltaPct = result && prevEntry?.rates ? getDeltaPct(prevEntry.rates.post, result.rates.post) : null;

  return (
    <div className="max-w-md mx-auto">
      {/* Printer Housing */}
      <div className="relative rounded-t-[32px] bg-gradient-to-b from-zinc-800/90 via-zinc-900 to-zinc-950 border border-white/10 p-6 pt-7 pb-8 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="absolute -top-12 inset-x-0 h-28 pointer-events-none" style={{ background: "var(--color-primary)", opacity: 0.2, filter: "blur(48px)" }} />

        <div className="flex items-center justify-between gap-2 mb-5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--color-success)", boxShadow: "0 0 8px var(--color-success)" }} />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--color-primary-light)" }} /> Rate Printer
            </span>
          </div>
        </div>

        {showReprintPrompt ? (
          <div className="rounded-2xl p-5 bg-zinc-900/80 border border-white/10 backdrop-blur-md text-white relative z-10 shadow-lg">
            <p className="text-sm font-semibold text-zinc-200">
              You last printed a rate card{" "}
              <span className="font-bold" style={{ color: "var(--color-primary-light)" }}>
                {daysAgo(prevEntry.savedAt)} day{daysAgo(prevEntry.savedAt) === 1 ? "" : "s"} ago
              </span>.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <button
                onClick={useReprint}
                className="w-full py-2.5 rounded-xl text-white text-sm font-bold transition-colors shadow-md"
                style={{ backgroundColor: "var(--color-primary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary)")}
              >
                Reprint with saved numbers
              </button>
              <button
                onClick={startFresh}
                className="w-full py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 text-sm font-semibold border border-white/5 transition-all"
              >
                Start fresh instead
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-5 min-h-[140px] flex flex-col justify-center bg-zinc-900/80 border border-white/10 backdrop-blur-md text-white relative z-10 shadow-lg">
            <AnimatePresence mode="wait">
              {printing ? (
                <motion.p key="printing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-sm font-semibold text-center" style={{ color: "var(--color-primary-light)" }}>
                  Printing your rate card...
                </motion.p>
              ) : isFinal ? (
                <motion.p key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-sm font-semibold text-center" style={{ color: "var(--color-success)" }}>
                  ✓ Card printed successfully
                </motion.p>
              ) : (
                <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                  <p className="font-mono text-xs font-bold mb-2" style={{ color: "var(--color-primary-light)" }}>
                    {String(step + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
                  </p>
                  <p className="text-sm font-bold text-white mb-3">{currentQuestion.label}</p>

                  {currentQuestion.type === "chips" ? (
                    <div className="flex flex-wrap gap-2">
                      {currentQuestion.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => commitAnswer(opt.id)}
                          className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-zinc-800 border border-white/10 text-zinc-200 transition-colors hover:text-white"
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (inputValue !== "" || currentQuestion.optional) commitAnswer(inputValue);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        autoFocus
                        type={currentQuestion.type}
                        min="0"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={currentQuestion.placeholder}
                        className="flex-1 bg-transparent border-b-2 pb-1 text-sm font-bold outline-none text-white placeholder:text-zinc-500 transition-colors"
                        style={{ borderColor: "color-mix(in srgb, var(--color-primary) 40%, transparent)" }}
                      />
                      <button type="submit" className="p-2 rounded-xl text-white flex-shrink-0 transition-colors" style={{ backgroundColor: "var(--color-primary)" }}>
                        <ArrowRight size={14} />
                      </button>
                    </form>
                  )}

                  <div className="flex gap-4 mt-3">
                    {currentQuestion.optional && (
                      <button onClick={handleSkip} className="text-xs font-semibold text-zinc-400 hover:text-white underline">
                        Skip
                      </button>
                    )}
                    {step > 0 && (
                      <button onClick={handleBack} className="text-xs font-semibold text-zinc-400 hover:text-white underline">
                        ‹ Back
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Printed Paper */}
      <div className="bg-zinc-900 border-x border-white/10 px-7 pt-6 pb-4 relative z-10 text-zinc-200">
        <p className="font-mono text-xs text-zinc-500 text-center mb-4">{answers.handle || "@yourhandle"}</p>

        <div className="space-y-3 font-mono text-sm">
          <AnimatePresence>
            {printedLines.map((q) => (
              <motion.div
                key={q.key}
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="flex items-baseline justify-between"
              >
                <span className="text-zinc-400 text-xs">{q.receiptLabel}</span>
                <span className="font-bold text-white">{formatAnswer(q, answers[q.key])}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {result && (
            <>
              <div className="border-t border-dashed border-zinc-700 my-4" />
              {FORMATS.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * i, type: "spring", stiffness: 300, damping: 22 }}
                  className="flex items-baseline justify-between text-base"
                >
                  <span className="text-zinc-400 text-sm">{f.label}</span>
                  <span className="font-extrabold" style={{ color: "var(--color-primary-light)" }}>
                    {result.market.symbol}
                    {result.rates[f.id].toLocaleString()}
                  </span>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="pt-3 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  {result.tier.label} · {result.engagementRatePct}% engagement
                </span>
                {deltaPct !== null && deltaPct !== 0 && (
                  <span className="flex items-center gap-1 text-xs font-bold" style={{ color: deltaPct > 0 ? "var(--color-success)" : "var(--color-danger)" }}>
                    {deltaPct > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {deltaPct > 0 ? "+" : ""}
                    {deltaPct}% since last print
                  </span>
                )}
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-[10px] text-zinc-500 pt-1 text-center">
                Printed {new Date().toLocaleDateString()} — reprint whenever your numbers change
              </motion.p>
            </>
          )}
        </div>
      </div>

      <TornEdge />

      {result && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold transition-colors shadow-lg"
            style={{ backgroundColor: "var(--color-primary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-primary)")}
          >
            <Copy size={15} /> Copy rate card
          </button>
          <button onClick={startOver} className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/10 transition-all">
            <RotateCcw size={15} />
          </button>
        </div>
      )}
    </div>
  );
}