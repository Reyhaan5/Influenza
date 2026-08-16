import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

import Navbar from "../components/layout/Navbar";
import Section from "../components/common/Section";
import PublicCreatorCard from "../components/creators/PublicCreatorCard";
import { API_URL } from "../config/api";

export default function CategoryResults() {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category || "");

  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get(`${API_URL}/public/creators-by-category`, { params: { category: decodedCategory } })
      .then((res) => setCreators(res.data.creators || []))
      .catch(() => setError("Unable to load creators for this category."))
      .finally(() => setLoading(false));
  }, [decodedCategory]);

  return (
    <>
      <Navbar />
      <Section className="pt-32">
        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary-hover)] hover:underline mb-6"
        >
          <ArrowLeft size={15} /> All categories
        </Link>

        <h1 className="text-3xl font-bold text-[var(--color-text)]">{decodedCategory}</h1>
        <p className="mt-2 text-[var(--color-text-light)]">
          Creators on Influenza who list {decodedCategory} as one of their niches.
        </p>

        <div className="mt-10">
          {loading ? (
            <p className="text-[var(--color-text-light)]">Loading creators...</p>
          ) : error ? (
            <p className="text-[var(--color-danger)]">{error}</p>
          ) : creators.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-2xl">
              <p className="text-[var(--color-text-light)]">
                No creators have added "{decodedCategory}" to their profile yet.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {creators.map((c) => (
                <PublicCreatorCard key={c._id} profile={c} />
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
