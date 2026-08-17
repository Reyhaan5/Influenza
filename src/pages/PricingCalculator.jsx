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
  const [key, setKey] = useState(0);

  const handleSearch = async (query) => {
    const handle = query.trim();

    if (!handle) return;

    setSearching(true);
    setNotice("");

    try {
      const response = await axios.get(
        `${API_URL}/public/instagram-lookup`,
        {
          params: {
            handle,
          },
        }
      );

      const data = response.data;

      if (data.found) {
        setPrefill({
          handle: data.handle,
          followers: String(data.followers),
          avgLikes: String(data.avgLikes),
          avgComments: String(data.avgComments),
        });

        setNotice(`Pulled live stats for ${data.handle}.`);
      } else {
        const formattedHandle = handle.startsWith("@")
          ? handle
          : `@${handle}`;

        setPrefill({
          handle: formattedHandle,
        });

        setNotice(
          "Couldn't fetch this Instagram account. You can enter the remaining details manually."
        );
      }
    } catch (error) {
      console.error("Instagram lookup error:", error);

      const formattedHandle = handle.startsWith("@")
        ? handle
        : `@${handle}`;

      setPrefill({
        handle: formattedHandle,
      });

      setNotice(
        "Instagram lookup failed. You can enter your stats manually."
      );
    } finally {
      setSearching(false);

      // Remount ReceiptPrinter so it receives the new values.
      setKey((previousKey) => previousKey + 1);
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
            Search an Instagram handle to auto-fill your numbers, or skip
            straight to manual entry.
          </p>

        </div>

        <div className="mt-10 max-w-md mx-auto">

        <GlowingSearchBar
  placeholder="Search @yourhandle..."
  onSearch={handleSearch}
  onFilterClick={undefined}
/>

        </div>

        {searching && (
          <p className="mt-4 text-center text-sm text-[var(--color-text-light)]">
            Fetching Instagram data...
          </p>
        )}

        {notice && !searching && (
          <p className="mt-4 text-center text-sm text-[var(--color-text-light)] max-w-md mx-auto">
            {notice}
          </p>
        )}

        <div className="mt-10">

          <ReceiptPrinter
            key={key}
            initialAnswers={prefill}
          />

        </div>

      </Section>
    </>
  );
}