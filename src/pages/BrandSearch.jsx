import React, { useState } from "react";
import axios from "axios";
import { Search as SearchIcon } from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Section from "../components/common/Section";
import BrandNav from "../components/dashboard/brand/BrandNav";
import CreatorSearchCard from "../components/dashboard/brand/CreatorSearchCard";

import { API_URL } from "../config/api";
const PLATFORMS = ["", "Instagram", "YouTube", "Twitter"];

export default function BrandSearch() {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (query) params.q = query;
      if (platform) params.platform = platform;
      if (minFollowers) params.minFollowers = minFollowers;

      const res = await axios.get(`${API_URL}/brand/search-creators`, {
        ...authHeader,
        params,
      });
      setResults(res.data.creators || []);
    } catch (error) {
      console.error(error);
      alert("Failed to search creators.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Section className="pt-32">
        <BrandNav />

        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">Search Creators</h1>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-[var(--shadow-card)] mb-8 flex flex-col md:flex-row gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by handle..."
            className="flex-1 border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm bg-[var(--color-background)]"
          />

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm bg-[var(--color-background)]"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p || "Any platform"}</option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            value={minFollowers}
            onChange={(e) => setMinFollowers(e.target.value)}
            placeholder="Min followers"
            className="border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm bg-[var(--color-background)] w-full md:w-40"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-60"
          >
            <SearchIcon size={16} /> {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {searched && !loading && results.length === 0 && (
          <p className="text-[var(--color-text-light)] text-center py-10">
            No creators matched your search.
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((profile) => (
            <CreatorSearchCard key={profile._id} profile={profile} />
          ))}
        </div>
      </Section>
    </>
  );
}