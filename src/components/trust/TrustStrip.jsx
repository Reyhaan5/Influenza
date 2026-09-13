import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, MessageCircle, Share2, Bookmark, Music, MoreVertical, Play, ShoppingBag, ArrowUpRight } from "lucide-react";
import Section from "../common/Section";

export const ugcDeliverables = [
  {
    id: "ugc-1",
    format: "TikTok Mirror Haul",
    brand: "Snitch Apparel",
    creator: "Alyssa Vance",
    handle: "@alyssastyle",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    subtitle: "or date night vibes ✨",
    platform: "tiktok",
    likes: "18.4k",
    comments: "492",
    ctaText: "Shop Now",
    niche: "Fashion & Apparel",
    badgeColor: "#FF006E",
  },
  {
    id: "ugc-2",
    format: "Outdoor Product Demo",
    brand: "Urban Monkey",
    creator: "Henry Ivy",
    handle: "@henryivy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
    subtitle: "Prime 21 Gold",
    platform: "instagram-story",
    likes: "24.1k",
    comments: "680",
    ctaText: "Shop Now",
    niche: "Eyewear & Style",
    badgeColor: "#EAB308",
  },
  {
    id: "ugc-3",
    format: "Unboxing & First Impression",
    brand: "Boat Lifestyle",
    creator: "Dev Gadgets",
    handle: "@devgadgets",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    subtitle: "into the watch.",
    platform: "facebook-ad",
    likes: "12.9k",
    comments: "315",
    ctaText: "Shop Now",
    niche: "Tech & Audio",
    badgeColor: "#3B82F6",
  },
  {
    id: "ugc-4",
    format: "Problem-Solution Skincare",
    brand: "Minimalist",
    creator: "Sara Chen",
    handle: "@saraskin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    subtitle: "Erased dark spots in 7 days 🧴",
    platform: "tiktok",
    likes: "42.8k",
    comments: "1.2k",
    ctaText: "Get 20% Off",
    niche: "Beauty & Skincare",
    badgeColor: "#FF1475",
  },
  {
    id: "ugc-5",
    format: "Jewelry Direct Testimonial",
    brand: "Giva Fine Jewels",
    creator: "Clara Brooks",
    handle: "@clara_jewels",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    subtitle: "I chose the pear-cut diamond ring 💍",
    platform: "tiktok",
    likes: "31.5k",
    comments: "840",
    ctaText: "View Collection",
    niche: "Luxury & Jewelry",
    badgeColor: "#8D64ED",
  },
  {
    id: "ugc-6",
    format: "App Demo & Split Screen",
    brand: "Indmoney",
    creator: "Irene Kate",
    handle: "@irenekate",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
    subtitle: "Hack 1: Automate your savings 📈",
    platform: "instagram-ad",
    likes: "19.3k",
    comments: "520",
    ctaText: "Install App",
    niche: "Fintech & Apps",
    badgeColor: "#10B981",
  },
  {
    id: "ugc-7",
    format: "Healthy Nutrition Taste Test",
    brand: "The Whole Truth",
    creator: "Kabir Fitness",
    handle: "@kabirfit",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80",
    subtitle: "Clean protein, zero added junk 🍫",
    platform: "tiktok",
    likes: "27.6k",
    comments: "710",
    ctaText: "Order Bundle",
    niche: "Food & Nutrition",
    badgeColor: "#F97316",
  },
];

function PhoneMockupCard({ item }) {
  return (
    <div className="relative w-[215px] sm:w-[235px] md:w-[250px] h-[380px] sm:h-[415px] md:h-[440px] rounded-[30px] sm:rounded-[34px] bg-zinc-950 border-[3.5px] border-zinc-900 shadow-2xl shadow-zinc-950/25 overflow-hidden flex-shrink-0 select-none group transition-transform duration-300 hover:scale-[1.03] hover:border-[#FF1475]/60 hover:shadow-pink-500/15">
      {/* Background Image / Video Still */}
      <img
        src={item.image}
        alt={item.subtitle}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        loading="lazy"
      />

      {/* Subtle Vignette & Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/55 pointer-events-none" />

      {/* Top Phone Speaker / Pill Camera Notch */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-3 bg-black/80 rounded-full flex items-center justify-center z-30 pointer-events-none">
        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
      </div>

      {/* Top Header info (Platform style) */}
      <div className="absolute top-7 left-3.5 right-3.5 flex items-center justify-between z-20 text-white text-[11px] font-semibold">
        <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
          <img
            src={item.avatar}
            alt={item.creator}
            className="w-4 h-4 rounded-full object-cover ring-1 ring-white"
          />
          <span className="truncate max-w-[85px] text-[10px] font-bold tracking-tight">
            {item.brand}
          </span>
          <span className="text-[9px] text-zinc-400 font-normal">Sponsored</span>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/20">
          {item.niche.split("&")[0]}
        </span>
      </div>

      {/* Floating Subtitle / Sticker in Center (Like real TikTok/Story captions) */}
      <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 z-20 flex justify-center text-center pointer-events-none">
        {item.platform === "instagram-story" ? (
          <div className="bg-[#FEF08A] text-zinc-950 px-3.5 py-1.5 rounded-md font-black text-xs sm:text-sm tracking-tight shadow-xl border border-yellow-400 -rotate-1">
            {item.subtitle}
          </div>
        ) : item.platform === "facebook-ad" ? (
          <div className="bg-black/70 text-white backdrop-blur-md px-3 py-1 rounded-lg font-bold text-xs shadow-lg border border-white/20">
            {item.subtitle}
          </div>
        ) : (
          <div className="bg-black/80 text-white backdrop-blur-md px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-[13px] tracking-tight shadow-xl border border-white/20 leading-tight">
            "{item.subtitle}"
          </div>
        )}
      </div>

      {/* Right Engagement Sidebar (TikTok / Reels style) */}
      <div className="absolute right-2.5 bottom-16 sm:bottom-18 z-20 flex flex-col items-center gap-3 text-white">
        {/* Creator Avatar with follow plus */}
        <div className="relative">
          <img
            src={item.avatar}
            alt={item.creator}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white shadow-md"
          />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#FF1475] text-white flex items-center justify-center text-[9px] font-black">
            +
          </span>
        </div>

        {/* Likes */}
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white hover:text-pink-500 transition-colors cursor-pointer">
            <Heart size={14} className="fill-current text-white/90" />
          </div>
          <span className="text-[9px] font-bold text-white/90 mt-0.5">{item.likes}</span>
        </div>

        {/* Comments */}
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white cursor-pointer">
            <MessageCircle size={14} className="fill-current text-white/90" />
          </div>
          <span className="text-[9px] font-bold text-white/90 mt-0.5">{item.comments}</span>
        </div>

        {/* Share */}
        <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white cursor-pointer">
          <Share2 size={13} />
        </div>
      </div>

      {/* Bottom Creator Info & Call to Action Button */}
      <div className="absolute bottom-3 left-3 right-3 z-20">
        <div className="pr-10 mb-2">
          <h4 className="text-white text-xs font-bold truncate">
            {item.handle}
          </h4>
          <p className="text-zinc-300 text-[10px] truncate mt-0.5 font-normal">
            Official Brand Partner on Influenza
          </p>
        </div>

        {/* Platform CTA Button */}
        <div className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FF2A85] hover:brightness-110 text-white flex items-center justify-between shadow-lg shadow-pink-600/30 transition-all cursor-pointer">
          <span className="text-[11px] font-extrabold tracking-tight flex items-center gap-1.5">
            <ShoppingBag size={12} />
            {item.ctaText}
          </span>
          <ArrowUpRight size={13} className="stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
}

function TrustStrip() {
  return (
    <Section className="!py-16 sm:!py-22 overflow-hidden">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 border border-pink-200/80 px-4 py-1.5 text-xs font-bold text-[#FF1475] shadow-xs">
          <Sparkles size={13} className="text-[#FF1475]" />
          Real Deliverables Produced on Influenza
        </div>

        <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
          High-Converting UGC Formats That{" "}
          <span className="bg-gradient-to-r from-[#FF1475] to-purple-600 bg-clip-text text-transparent">
            Drive Real Sales
          </span>
        </h2>

        <p className="mt-3.5 max-w-2xl mx-auto text-sm sm:text-base text-zinc-600 font-medium leading-relaxed">
          From TikTok Shop trend videos to aesthetic unboxings and direct-response problem-solution ads — see the authentic creator deliverables generated across our community.
        </p>
      </div>

      {/* Marquee Keyframes */}
      <style>{`
        @keyframes scroll-ugc {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ugc-marquee {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: scroll-ugc 32s linear infinite;
        }
        .ugc-marquee-container:hover .animate-ugc-marquee {
          animation-play-state: paused;
        }
      `}</style>

      {/* Marquee Track with Smooth Left & Right Gradient Fade Masks */}
      <div className="mt-12 sm:mt-14 relative w-full overflow-hidden ugc-marquee-container [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
        <div className="animate-ugc-marquee py-3">
          {[...ugcDeliverables, ...ugcDeliverables, ...ugcDeliverables].map((item, idx) => (
            <PhoneMockupCard key={`${item.id}-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </Section>
  );
}

export default TrustStrip;