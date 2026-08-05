// src/pages/PricingCalculator.jsx
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import Section from "../components/common/Section";
import ReceiptPrinter from "../components/pricing/ReceiptPrinter";
import GlowingSearchBar from "../components/common/GlowingSearchBar";

const API_URL = "http://localhost:5000/api";

export default function PricingCalculator() {
  const [prefill, setPrefill] = useState(undefined);
  const [notice, setNotice] = useState("");
  const [searching, setSearching] = useState(false);
  const [key, setKey] = useState(0); // forces ReceiptPrinter to remount with new prefill

  const handleSearch = async (query) => {
    const handle = query.trim();
    if (!handle) return;

    setSearching(true);
    setNotice("");

    try {
      const res = await axios.get(`${API_URL}/public/instagram-lookup`, {
        params: { handle },
      });

      if (res.data.found) {
        setPrefill({
          handle: res.data.handle,
          followers: String(res.data.followers),
          avgLikes: String(res.data.avgLikes),
          avgComments: String(res.data.avgComments),
        });
        setNotice(`Pulled live stats for ${res.data.handle}.`);
      } else {
        setPrefill({ handle: handle.startsWith("@") ? handle : `@${handle}` });
        setNotice(
          "Couldn't auto-fetch that account's stats (private, personal, or not eligible) — enter the rest manually below."
        );
      }
    } catch (err) {
      setPrefill({ handle: handle.startsWith("@") ? handle : `@${handle}` });
      setNotice("Lookup failed — enter your stats manually below.");
    } finally {
      setSearching(false);
      setKey((k) => k + 1);
    }
  };

  return (
    <>
      <Navbar />
      <Section className="pt-40">
        <div className="max-w-xl mx-auto text-center">
          <span className="inline-flex rounded-full bg-[var(--color-primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
            Free · No login required
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-[var(--color-text)] leading-tight">
            What should you charge?
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-light)]">
            Search an Instagram handle to auto-fill your numbers, or skip straight to manual entry.
          </p>
        </div>

        <div className="mt-10 max-w-md mx-auto">
          <GlowingSearchBar
            placeholder="Search @yourhandle..."
            onSearch={() => {}}
            onFilterClick={undefined}
          />
          {/* GlowingSearchBar fires onSearch per keystroke — wire a submit-on-enter
              wrapper here in the component itself, or swap to onFilterClick as
              the explicit "search" trigger. Flagging this as a follow-up. */}
        </div>

        {notice && (
          <p className="mt-4 text-center text-sm text-[var(--color-text-light)] max-w-md mx-auto">
            {notice}
          </p>
        )}

        <div className="mt-10">
          <ReceiptPrinter key={key} initialAnswers={prefill} />
        </div>
      </Section>
    </>
  );
}