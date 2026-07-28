import React from "react";
import { Megaphone, Users, TrendingUp } from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Section from "../components/common/Section";
import StatCard from "../components/dashboard/influencer/StatCard";
import BrandProfileCard from "../components/dashboard/brand/BrandProfileCard";
import ProfileCompletionBanner from "../components/dashboard/brand/ProfileCompletionBanner";
import CompanyDetailsCard from "../components/dashboard/brand/CompanyDetailsCard";
import TeamMembersList from "../components/dashboard/brand/TeamMembersList";

const companyDetails = {
  companyName: "Nova Retail Co.",
  industry: "E-commerce & Fashion",
  website: "novaretail.com",
  email: "hello@novaretail.com",
  location: "Mumbai, India",
};

const teamMembers = [
  { name: "Aditi Sharma", role: "Marketing Lead" },
  { name: "Rohan Mehta", role: "Campaign Manager" },
  { name: "Priya Nair", role: "Content Reviewer" },
];

export default function BrandDashboard() {
  return (
    <>
      <Navbar />
      <Section className="pt-32">
        <h1 className="text-3xl font-extrabold text-[var(--color-text)]">Brand Profile</h1>
        <p className="mt-2 text-[var(--color-text-light)] max-w-2xl">
          Manage your company details, team access and public presence so creators know
          exactly who they're partnering with.
        </p>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BrandProfileCard
              companyName={companyDetails.companyName}
              industry={companyDetails.industry}
              campaignsRun={12}
              creatorsPartnered={34}
              totalReach="4.8M"
              verified={false}
            />
          </div>
          <ProfileCompletionBanner pct={70} />
        </div>

        <div className="mt-8">
          <h2 className="font-bold text-[var(--color-text)] mb-4">Overview</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            <StatCard icon={<Megaphone size={20} />} label="Active Campaigns" value={3} />
            <StatCard icon={<Users size={20} />} label="Creators Partnered" value={34} />
            <StatCard icon={<TrendingUp size={20} />} label="Total Reach" value="4.8M" suffix="all time" />
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CompanyDetailsCard details={companyDetails} />
          </div>

          <div>
            <TeamMembersList members={teamMembers} />
          </div>
        </div>
      </Section>
    </>
  );
}