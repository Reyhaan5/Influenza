// src/pages/InsiderRateCalculator.jsx  — new dedicated page
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Section from "../components/common/Section";

const API_URL = "http://localhost:5000/api";
const FORMAT_LABELS = { post: "Feed Post", reel: "Reel", story: "Story" };

export default function InsiderRateCalculator() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API_URL}/influencer/insider-rate`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Something went wrong."))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Section className="pt-32 max-w-2xl">
        <span className="inline-flex rounded-full bg-[var(--color-primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
          Members only
        </span>
        <h1 className="mt-6 text-4xl font-extrabold text-[var(--color-text)]">Your Insider Rate</h1>
        <p className="mt-3 text-[var(--color-text-light)]">
          Built from your actual track record on Influenza — not just your follower count.
        </p>

        {loading && <p className="mt-10 text-[var(--color-text-light)]">Loading...</p>}

        {error && (
          <div className="mt-8 text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {data && (
          <div className="mt-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 text-[var(--color-primary-hover)] font-bold">
              <TrendingUp size={18} />
              <span>{Math.round((data.multiplier - 1) * 100)}% above your base rate</span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {Object.entries(data.adjustedRates).map(([format, value]) => (
                <div key={format} className="rounded-xl bg-[var(--color-background)] p-4 text-center">
                  <p className="text-xs font-semibold uppercase text-[var(--color-text-light)]">
                    {FORMAT_LABELS[format] || format}
                  </p>
                  <p className="mt-1 text-xl font-bold text-[var(--color-text)]">
                    {value.toLocaleString()}
                  </p>
                  <p className="text-xs text-[var(--color-text-light)] line-through">
                    {data.baseRates[format].toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-[var(--color-text)] mb-3">What's driving this</h3>
              <div className="flex flex-col gap-2">
                {data.breakdown.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm bg-[var(--color-background)] rounded-lg px-4 py-2.5"
                  >
                    <span className="text-[var(--color-text)]">{item.label}</span>
                    <span className="font-bold text-[var(--color-primary-hover)]">{item.impact}</span>
                  </div>
                ))}
                {data.breakdown.length === 0 && (
                  <p className="text-sm text-[var(--color-text-light)]">
                    Complete a few collaborations to start earning a track-record bonus.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}