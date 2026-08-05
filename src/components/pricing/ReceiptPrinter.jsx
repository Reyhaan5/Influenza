// src/components/pricing/ReceiptPrinter.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Copy, RotateCcw, TrendingUp, TrendingDown } from "lucide-react";
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

// Deterministic pseudo-barcode: bar widths come from the actual quoted
// price digits, so every printed barcode is unique to that rate card
// rather than decorative filler.
function barsFromValue(value) {
  const digits = String(value).replace(/\D/g, "").split("").map(Number);
  if (digits.length === 0) return [2, 1, 3, 1, 2];
  return digits.map((d) => (d % 3) + 1);
}

function PerforationStrip() {
  return (
    <div className="relative h-4 bg-[var(--color-surface)] border-x border-[var(--color-border)] overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="w-2 h-2 rounded-full bg-[var(--color-background)]" />
        ))}
      </div>
    </div>
  );
}

function TornEdge() {
  return (
    <div className="flex justify-center gap-1 -mb-[7px] overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="w-3.5 h-3.5 bg-[var(--color-background)] rotate-45 -mt-[7px] flex-shrink-0" />
      ))}
    </div>
  );
}

function Barcode({ value }) {
  const bars = useMemo(() => barsFromValue(value), [value]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
      animate={{ opacity: 1, scale: 1, rotate: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.5 }}
      className="flex items-end gap-[2px] h-9 w-fit mx-auto"
    >
      {bars.map((w, i) => (
        <div key={i} style={{ width: `${w * 2}px` }} className="h-full bg-[var(--color-text)]" />
      ))}
    </motion.div>
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

  useEffect(() => {
    if (initialAnswers) return;
    const saved = loadLastEntry();
    if (saved) {
      setPrevEntry(saved);
      setShowReprintPrompt(true);
    }
  }, [initialAnswers]);

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
      {/* Print slot — the one saturated moment on the page */}
      <div className="relative rounded-t-[28px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] px-6 py-3.5 flex items-center gap-2 shadow-[var(--shadow-card)]">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-white/90">
          Rate Printer
        </span>
      </div>

      {/* Interactive question surface */}
      <div className="bg-[var(--color-surface)] border-x border-[var(--color-border)] px-6 py-6 shadow-sm min-h-[150px] flex flex-col justify-center">
        {showReprintPrompt ? (
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">
              You last printed a rate card{" "}
              <span className="font-bold text-[var(--color-primary-hover)]">
                {daysAgo(prevEntry.savedAt)} day{daysAgo(prevEntry.savedAt) === 1 ? "" : "s"} ago
              </span>.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <button
                onClick={useReprint}
                className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-bold transition-colors shadow-md"
              >
                Reprint with saved numbers
              </button>
              <button
                onClick={startFresh}
                className="w-full py-2.5 rounded-xl bg-[var(--color-background)] hover:bg-[var(--color-border)]/40 text-[var(--color-text)] text-sm font-semibold border border-[var(--color-border)] transition-all"
              >
                Start fresh instead
              </button>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {printing ? (
              <motion.div key="printing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                <div className="relative w-40 h-1 rounded-full bg-[var(--color-background)] overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full w-8 rounded-full bg-[var(--color-primary)]"
                    animate={{ x: [0, 128, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <p className="font-mono text-xs font-semibold text-[var(--color-text-light)]">
                  Printing your rate card...
                </p>
              </motion.div>
            ) : isFinal ? (
              <motion.p
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-sm font-semibold text-center text-[var(--color-success)]"
              >
                ✓ Card printed successfully
              </motion.p>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                <p className="font-mono text-xs font-bold mb-2 text-[var(--color-primary-hover)]">
                  {String(step + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
                </p>
                <p className="text-sm font-bold text-[var(--color-text)] mb-3">{currentQuestion.label}</p>

                {currentQuestion.type === "chips" ? (
                  <div className="flex flex-wrap gap-2">
                    {currentQuestion.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => commitAnswer(opt.id)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]"
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
                      className="flex-1 bg-transparent border-b-2 border-[var(--color-border)] focus:border-[var(--color-primary)] pb-1 text-sm font-bold outline-none text-[var(--color-text)] placeholder-[var(--color-text)]/40 transition-colors"
                    />
                    <button type="submit" className="p-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white flex-shrink-0 transition-colors">
                      <ArrowRight size={14} />
                    </button>
                  </form>
                )}

                <div className="flex gap-4 mt-3">
                  {currentQuestion.optional && (
                    <button onClick={handleSkip} className="text-xs font-semibold text-[var(--color-text-light)] hover:text-[var(--color-primary-hover)] underline">
                      Skip
                    </button>
                  )}
                  {step > 0 && (
                    <button onClick={handleBack} className="text-xs font-semibold text-[var(--color-text-light)] hover:text-[var(--color-primary-hover)] underline">
                      ‹ Back
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <PerforationStrip />

      {/* Printed paper */}
      <motion.div
        layout
        className="bg-[var(--color-surface)] border-x border-[var(--color-border)] px-7 pt-6 pb-4 font-mono text-[var(--color-text)]"
      >
        <p className="text-xs text-[var(--color-text-light)] text-center mb-4">
          {answers.handle || "@yourhandle"}
        </p>

        <div className="space-y-3 text-sm">
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
                <span className="text-[var(--color-text-light)] text-xs">{q.receiptLabel}</span>
                <span className="font-bold text-[var(--color-text)]">{formatAnswer(q, answers[q.key])}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {result && (
            <>
              <div className="border-t border-dashed border-[var(--color-border)] my-4" />
              {FORMATS.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * i, type: "spring", stiffness: 300, damping: 22 }}
                  className="flex items-baseline justify-between text-base"
                >
                  <span className="text-[var(--color-text-light)] text-sm">{f.label}</span>
                  <span className="font-extrabold text-[var(--color-primary-hover)]">
                    {result.market.symbol}
                    {result.rates[f.id].toLocaleString()}
                  </span>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="pt-3 flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-light)]">
                  {result.tier.label} · {result.engagementRatePct}% engagement
                </span>
                {deltaPct !== null && deltaPct !== 0 && (
                  <span
                    className="flex items-center gap-1 text-xs font-bold"
                    style={{ color: deltaPct > 0 ? "var(--color-success)" : "var(--color-danger)" }}
                  >
                    {deltaPct > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {deltaPct > 0 ? "+" : ""}
                    {deltaPct}% since last print
                  </span>
                )}
              </motion.div>

              <div className="pt-5 flex flex-col items-center gap-2">
                <Barcode value={result.rates.post} />
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-[10px] text-[var(--color-text-light)]">
                  Printed {new Date().toLocaleDateString()} — reprint whenever your numbers change
                </motion.p>
              </div>
            </>
          )}
        </div>
      </motion.div>

      <TornEdge />

      {result && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-bold transition-colors shadow-lg"
          >
            <Copy size={15} /> Copy rate card
          </button>
          <button
            onClick={startOver}
            className="p-3 rounded-xl bg-[var(--color-background)] hover:bg-[var(--color-border)]/40 text-[var(--color-text)] border border-[var(--color-border)] transition-all"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      )}
    </div>
  );
}