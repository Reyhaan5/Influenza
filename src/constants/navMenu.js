import { industries } from "./industries";
import { howItWorksSteps } from "./howItWorks";

export const megaMenu = [
  {
    id: "customers",
    title: "Customers",
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
    id: "resources",
    title: "Resources",
    columns: [
      {
        heading: "Explore",
        items: [
          {
            imageSrc: "/icons/camera.svg",
            title: "Content Gallery",
            description: "Browse real content published by creators on Influenza — no login needed",
            href: "/content-gallery",
            isRoute: true,
          },
          {
            imageSrc: "/icons/users.svg",
            title: "Meet the Creators",
            description: "Explore creators across every niche",
            href: "/categories",
            isRoute: true,
          },
          {
            imageSrc: "/icons/wallet.svg",
            title: "Rate Card Calculator",
            description: "See fair, data-backed pricing for a creator",
            href: "/pricing-calculator",
            isRoute: true,
          },
        ],
      },
      {
        heading: "Discover More",
        items: [
          {
            imageSrc: "/icons/star.svg",
            title: "Success Stories",
            description: "See results from brands using Influenza",
            href: "#",
          },
          {
            imageSrc: "/icons/help.svg",
            title: "Help Center",
            description: "Get your questions answered with our FAQ",
            href: "#faq",
          },
          {
            imageSrc: "/icons/blog.svg",
            title: "Blog",
            description: "Playbooks and updates from the Influenza team",
            href: "#",
          },
          {
            imageSrc: "/icons/mail.svg",
            title: "Contact",
            description: "Get in touch with our team",
            href: "#faq",
          },
        ],
      },
      {
        heading: "Insights & Tools",
        items: [
          {
            imageSrc: "/icons/analytics.svg",
            title: "Business Tools",
            description: "Growth and productivity tools for brands",
            href: "#",
          },
          {
            imageSrc: "/icons/create-campaign.svg",
            title: "Marketing Tools",
            description: "Marketing tools for creators and brands",
            href: "#",
          },
          {
            imageSrc: "/icons/docs.svg",
            title: "Guides",
            description: "Guides for brands and creators",
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
          {
            imageSrc: "/icons/camera.svg",
            title: "Add to Content Gallery",
            description: "Showcase your best work publicly, no brand required",
            href: "/influencer-dashboard",
            isRoute: true,
          },
        ],
      },
    ],
  },
];
