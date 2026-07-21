import React from "react";
import Navbar from "../components/layout/Navbar";
import Section from "../components/common/Section";
import FilterSidebar from "../components/dashboard/brand/FilterSidebar";
import InfluencerCard from "../components/dashboard/brand/InfluencerCard";
import RecentSearchItem from "../components/dashboard/brand/RecentSearchItem";
import PopularProfileCard from "../components/dashboard/brand/PopularProfileCard";

const influencers = [
  { name: "Bessie Richards", role: "Social Worker", blurb: "A hendrerit orci tincidunt sed et mi justo sed et mi justo.", tags: ["1975", "Ontario", "Actor", "Cathlic"], reach: "3.3K" },
  { name: "Leslie Warren", role: "Chef", blurb: "Nisl, nunc, vulputate placerat mauris consequat.", tags: ["1975", "Ontario", "Actor", "Cathlic"], reach: "3.3K" },
  { name: "Marvin Steward", role: "Model", blurb: "Sit aliquet neque magna tellus lectus malesuada tortor.", tags: ["1975", "Ontario", "Actor", "Cathlic"], reach: "3.3K" },
  { name: "Francisco Henry", role: "Speaker", blurb: "Nisl ultrices et erat nunc porttitor viverra.", tags: ["1975", "Ontario", "Actor", "Cathlic"], reach: "3.3K" },
];

const recentSearches = [
  { name: "Angel Henry", role: "Actor" },
  { name: "Colleen Lane", role: "Actor" },
  { name: "Scarlett Jones", role: "Actor" },
];

export default function BrandDashboard() {
  return (
    <>
      <Navbar />
      <Section className="pt-32">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-[var(--color-text)]">Showing 14 of 100 Influencers</h1>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--color-text-light)]">Sort by</span>
                <span className="px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-white font-semibold">
                  Relevance
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {influencers.map((inf) => (
                <InfluencerCard key={inf.name} {...inf} />
              ))}
            </div>
          </div>

          <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-8">
            <div>
              <h2 className="font-bold text-[var(--color-text)] mb-2">Recent Search</h2>
              <div className="flex flex-col divide-y divide-[var(--color-border)]/50">
                {recentSearches.map((r) => (
                  <RecentSearchItem key={r.name} {...r} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-bold text-[var(--color-text)] mb-2">Popular Profile</h2>
              <PopularProfileCard name="Jason Statum" role="Actor" location="London, United Kingdom" reach="3.3K" />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}