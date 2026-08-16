import { industries } from "./industries";
import { howItWorksSteps } from "./howItWorks";

export const megaMenu = [
  {
    id: "platform",
    title: "Platform",
    columns: [
      {
        heading: "Features",
        items: [
          {
            imageSrc: "/icons/search.svg",
            title: "Creator Discovery",
            description: "Find micro to mega influencers fast",
            href: "#product",
          },
          {
            imageSrc: "/icons/users.svg",
            title: "Campaign Workspace",
            description: "Plan, launch and manage every collaboration",
            href: "#product",
          },
          {
            imageSrc: "/icons/analytics.svg",
            title: "Analytics",
            description: "Measure reach, engagement and ROI live",
            href: "#product",
          },
        ],
      },
      {
        heading: "Channels",
        items: [
          {
            imageSrc: "/icons/instagram.svg",
            title: "Instagram",
            description: "Live — build and grow your presence today",
            href: "#",
          },
          {
            imageSrc: "/icons/youtube.svg",
            title: "YouTube",
            description: "Planned as the platform grows",
            href: "#",
          },
          {
            imageSrc: "/icons/facebook.svg",
            title: "Facebook",
            description: "Planned as the platform grows",
            href: "#",
          },
          {
            imageSrc: "/icons/linkedin.svg",
            title: "LinkedIn",
            description: "Planned as the platform grows",
            href: "#",
          },
        ],
      },
      {
        heading: "Match Intelligence",
        items: [
          {
            imageSrc: "/icons/match.svg",
            title: "Match Score",
            description: "See campaign compatibility before you reach out",
            href: "#product",
          },
        ],
      },
    ],
  },
  {
    id: "brands",
    title: "For Brands",
    columns: [
      {
        heading: "Get Started",
        items: [
          {
            imageSrc: "/icons/create-campaign.svg",
            title: "Create Campaign",
            description: "Define campaign objectives, budget, audience and creator preferences from a single workspace.",
            href: "#how-it-works",
          },
          {
            imageSrc: "/icons/intelligent-analysis.svg",
            title: "Intelligent Analysis",
            description: "Our platform evaluates audience quality, campaign compatibility, pricing intelligence and performance indicators to recommend the most suitable creators.",
            href: "#how-it-works",
          },
          {
            imageSrc: "/icons/launch-track.svg",
            title: "Launch & Track",
            description: "Collaborate with creators, monitor campaign progress and measure performance through one centralized dashboard.",
            href: "#how-it-works",
          },
        ],
      },
      {
        heading: "By Industry",
        items: industries.slice(0, 4).map((industry) => ({
          emoji: industry.icon,
          title: industry.title,
          description: `Reach ${industry.title.toLowerCase()} audiences with matched creators`,
          href: "#",
        })),
      },
    ],
  },
  {
    id: "influencers",
    title: "For Influencers",
    columns: [
      {
        items: [
          {
            imageSrc: "/icons/camera.svg",
            title: "Track Collaborations",
            description: "See your completed collabs and campaign history",
            href: "/influencer-dashboard",
            isRoute: true,
          },
          {
            imageSrc: "/icons/star.svg",
            title: "Build Your Reputation",
            description: "Grow your rating with every campaign you complete",
            href: "/influencer-dashboard",
            isRoute: true,
          },
          {
            imageSrc: "/icons/wallet.svg",
            title: "Rate Card Calculator",
            description: "Get a fair, data-backed price for your next post",
            href: "/pricing-calculator",
            isRoute: true,
          },
        ],
      },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    columns: [
      {
        items: [
          {
            imageSrc: "/icons/search.svg",
            title: "Browse by Category",
            description: "Explore creators across every niche",
            href: "/categories",
            isRoute: true,
          },
          {
            imageSrc: "/icons/blog.svg",
            title: "Blog",
            description: "Playbooks and updates from the Influenza team",
            href: "#",
          },
          {
            imageSrc: "/icons/docs.svg",
            title: "Documentation",
            description: "Guides for brands and influencers",
            href: "#",
          },
          {
            imageSrc: "/icons/help.svg",
            title: "Help Center",
            description: "Get your questions answered fast",
            href: "#",
          },
          {
            imageSrc: "/icons/api.svg",
            title: "API",
            description: "Build on top of the Influenza platform",
            href: "#",
          },
        ],
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing",
    columns: [
      {
        items: [
          {
            imageSrc: "/icons/plans.svg",
            title: "Plans",
            description: "See plans for brands and teams",
            href: "#pricing",
          },
          {
            imageSrc: "/icons/wallet.svg",
            title: "Rate Calculator",
            description: "Estimate creator pricing instantly",
            href: "/pricing-calculator",
            isRoute: true,
          },
        ],
      },
    ],
  },
];  
