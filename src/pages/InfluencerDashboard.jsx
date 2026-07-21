import React from "react";
import { Camera, Star, Gift } from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Section from "../components/common/Section";
import ProfileCard from "../components/dashboard/influencer/ProfileCard";
import ConnectBanner from "../components/dashboard/influencer/ConnectBanner";
import StatCard from "../components/dashboard/influencer/StatCard";
import ChallengeCard from "../components/dashboard/influencer/ChallengeCard";
import TrophyList from "../components/dashboard/influencer/TrophyList";

const challenges = [
  {
    title: "Response time",
    description: "Respond to messages in less than 2 days to reach level 1.",
    note: "Not available.",
    progress: 0,
    total: 1,
    bonus: 25,
  },
  {
    title: "Gifted collaborations",
    description: "Complete one gifted collaboration to achieve level 1.",
    note: "You haven't completed any gifted collaborations in the past month.",
    progress: 0,
    total: 1,
    bonus: 25,
  },
  {
    title: "Daily streak",
    description: "Apply to campaigns for 7 days in a row to achieve level 1.",
    note: "You haven't applied to campaigns consistently.",
    progress: 0,
    total: 1,
    bonus: 25,
  },
  {
    title: "Content turnaround time",
    description: "Upload content in less than 10 days to reach level 1.",
    note: "Not available.",
    progress: 0,
    total: 1,
    bonus: 25,
  },
];

export default function InfluencerDashboard() {
  return (
    <>
      <Navbar />
      <Section className="pt-32">
        <h1 className="text-3xl font-extrabold text-[var(--color-text)]">Dashboard</h1>
        <p className="mt-2 text-[var(--color-text-light)] max-w-2xl">
          Earn from your influence through gifted and paid collabs. Boost your rates by completing
          challenges and earning trophies. Verified accounts command higher prices.
        </p>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProfileCard handle="@reyhaan_ansari" posts="N/A" followers={21} following={17} approved={false} />
          </div>
          <ConnectBanner />
        </div>

        <div className="mt-10">
          <h2 className="font-bold text-[var(--color-text)] mb-1">Highlighted content (0 of 10)</h2>
          <p className="text-sm text-[var(--color-text-light)]">
            Add your best work to your{" "}
            <span className="text-[var(--color-primary-hover)] font-semibold cursor-pointer hover:underline">
              Social Cat Portfolio
            </span>{" "}
            to improve your chances of getting collaborations.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="font-bold text-[var(--color-text)] mb-4">My Stats</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <StatCard icon={<Camera size={20} />} label="Collaborations Completed" value={0} />
            <StatCard icon={<Star size={20} />} label="Rating" value={0} suffix="out of 0 reviews" />
            <StatCard icon={<Gift size={20} />} label="Trophies" value={0} suffix="out of 5" />
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-bold text-[var(--color-text)] mb-1">Challenges</h2>
            <p className="text-sm text-[var(--color-text-light)] mb-4">
              Complete the challenges below to unlock the ability to bid more on paid collaborations.
            </p>
            <div className="flex flex-col gap-4">
              {challenges.map((c, i) => (
                <ChallengeCard key={i} {...c} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold text-[var(--color-text)] mb-4">Trophies</h2>
            <TrophyList trophies={["Top content", "Most liked"]} />
          </div>
        </div>
      </Section>
    </>
  );
}