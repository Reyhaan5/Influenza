// backend/controllers/instagramController.js

import { scrapeInstagram } from "../services/instagram/apifyService.js";
import InstagramCache from "../models/InstagramCache.js";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Pre-seeded fallback data for popular demo handles
const POPULAR_FALLBACKS = {
  leomessi: {
    handle: "@leomessi",
    fullName: "Leo Messi",
    biography: "Bienvenidos a la cuenta oficial de Instagram de Leo Messi",
    verified: true,
    followers: 505000000,
    avgLikes: 3500000,
    avgComments: 28000,
    avgViews: 12000000,
    rawProfilePicUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg",
    topPosts: [
      { id: "post_1", caption: "Campeones del mundo!", likes: 75000000, comments: 2000000, views: 90000000, isVideo: false },
      { id: "post_2", caption: "Family time", likes: 4500000, comments: 35000, views: 15000000, isVideo: false },
      { id: "post_3", caption: "Match day focus", likes: 3800000, comments: 29000, views: 11000000, isVideo: true },
    ],
  },
  "virat.kohli": {
    handle: "@virat.kohli",
    fullName: "Virat Kohli",
    biography: "Carpediem!",
    verified: true,
    followers: 271000000,
    avgLikes: 2100000,
    avgComments: 18000,
    avgViews: 8500000,
    rawProfilePicUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg",
    topPosts: [
      { id: "post_vk1", caption: "Grateful for every single moment on the field.", likes: 4200000, comments: 32000, views: 14000000, isVideo: false },
      { id: "post_vk2", caption: "Training sessions never stop.", likes: 2800000, comments: 19000, views: 9000000, isVideo: true },
      { id: "post_vk3", caption: "Match ready.", likes: 2400000, comments: 16000, views: 7500000, isVideo: false },
    ],
  },
  techburner: {
    handle: "@techburner",
    fullName: "Shlok Srivastava | Tech Burner",
    biography: "Making Tech Simple and Fun! Founder @layers.shop @overlaysclothing",
    verified: true,
    followers: 4800000,
    avgLikes: 260000,
    avgComments: 3500,
    avgViews: 1400000,
    rawProfilePicUrl: "",
    topPosts: [
      { id: "tb_1", caption: "New crazy gadget test!", likes: 320000, comments: 4500, views: 1800000, isVideo: true },
      { id: "tb_2", caption: "Layers drop is live now!", likes: 240000, comments: 2800, views: 1200000, isVideo: false },
      { id: "tb_3", caption: "Future tech is here.", likes: 210000, comments: 3100, views: 1100000, isVideo: true },
    ],
  },
  willsmith: {
    handle: "@willsmith",
    fullName: "Will Smith",
    biography: "Same kid from West Philly.",
    verified: true,
    followers: 69000000,
    avgLikes: 480000,
    avgComments: 5800,
    avgViews: 2200000,
    rawProfilePicUrl: "",
    topPosts: [
      { id: "ws_1", caption: "Behind the scenes madness", likes: 850000, comments: 9200, views: 4100000, isVideo: true },
      { id: "ws_2", caption: "Sunday workout done.", likes: 520000, comments: 6100, views: 2400000, isVideo: false },
      { id: "ws_3", caption: "Classic memories.", likes: 430000, comments: 4900, views: 1900000, isVideo: false },
    ],
  },
  zendaya: {
    handle: "@zendaya",
    fullName: "Zendaya",
    biography: "",
    verified: true,
    followers: 180000000,
    avgLikes: 2400000,
    avgComments: 16000,
    avgViews: 9500000,
    rawProfilePicUrl: "",
    topPosts: [
      { id: "zen_1", caption: "Red carpet moments", likes: 3800000, comments: 24000, views: 15000000, isVideo: false },
      { id: "zen_2", caption: "Vogue cover shoot", likes: 2900000, comments: 19000, views: 11000000, isVideo: false },
      { id: "zen_3", caption: "Challengers press tour", likes: 2100000, comments: 14000, views: 8000000, isVideo: true },
    ],
  },
  therock: {
    handle: "@therock",
    fullName: "Dwayne Johnson",
    biography: "founder @teremana @projectrock @zoaenergy",
    verified: true,
    followers: 395000000,
    avgLikes: 1200000,
    avgComments: 9500,
    avgViews: 6800000,
    rawProfilePicUrl: "",
    topPosts: [
      { id: "rock_1", caption: "Iron Paradise midnight grind.", likes: 1800000, comments: 14000, views: 9000000, isVideo: true },
      { id: "rock_2", caption: "Cheers with Teremana!", likes: 1400000, comments: 11000, views: 7200000, isVideo: false },
      { id: "rock_3", caption: "Mana energy flowing.", likes: 1100000, comments: 8500, views: 5600000, isVideo: true },
    ],
  },
  viraj_ghelani: {
    handle: "@viraj_ghelani",
    fullName: "Viraj Ghelani",
    biography: "Content creator from SoBo—South Borivali 🎬 Comedian & Actor",
    verified: true,
    followers: 1450000,
    avgLikes: 85000,
    avgComments: 1400,
    avgViews: 420000,
    rawProfilePicUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    topPosts: [
      { id: "vg_1", caption: "Gujarati moms when you cough once in the house 😭😂 #Relatable #MumbaiHumor", likes: 125000, comments: 1850, views: 650000, isVideo: true },
      { id: "vg_2", caption: "Taking auto rickshaws in Mumbai rains is an extreme sport 🌧️🚕", likes: 95000, comments: 1320, views: 480000, isVideo: true },
      { id: "vg_3", caption: "On set shooting my next sketch! Big announcements coming soon ✨", likes: 78000, comments: 940, views: 320000, isVideo: false },
    ],
  },
  mostlysane: {
    handle: "@mostlysane",
    fullName: "Prajakta Koli",
    biography: "Creator | Actor (Mismatched, JugJugg Jeeyo) | Author | UNDP Youth Climate Champion",
    verified: true,
    followers: 8700000,
    avgLikes: 280000,
    avgComments: 2900,
    avgViews: 1500000,
    rawProfilePicUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    topPosts: [
      { id: "pk_1", caption: "Dimple Ahuja back on set! Season prep in full swing 🎬☕ #Mismatched", likes: 380000, comments: 4200, views: 2100000, isVideo: false },
      { id: "pk_2", caption: "Types of people at every Mumbai wedding 💃🍛", likes: 310000, comments: 3100, views: 1800000, isVideo: true },
      { id: "pk_3", caption: "Speaking at the UN Youth Forum on sustainable future & youth impact 🌍✨", likes: 240000, comments: 2150, views: 950000, isVideo: false },
    ],
  },
  beerbiceps: {
    handle: "@beerbiceps",
    fullName: "Ranveer Allahbadia",
    biography: "Host of The Ranveer Show (TRS) | Co-Founder @monkentertainment & @levelsupermind",
    verified: true,
    followers: 4200000,
    avgLikes: 160000,
    avgComments: 1800,
    avgViews: 950000,
    rawProfilePicUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    topPosts: [
      { id: "rb_1", caption: "The power of morning cold showers & deep breathwork ⚡🧘‍♂️", likes: 210000, comments: 2400, views: 1200000, isVideo: true },
      { id: "rb_2", caption: "Deep dive with ISRO scientists on TRS Episode 420! 🚀", likes: 185000, comments: 1900, views: 980000, isVideo: false },
      { id: "rb_3", caption: "Consistency beats talent every single time 🦾", likes: 140000, comments: 1350, views: 820000, isVideo: true },
    ],
  },
  sanjyotkeer: {
    handle: "@sanjyotkeer",
    fullName: "Chef Sanjyot Keer",
    biography: "Founder @yourfoodlab | Chef | Forbes Tycoons of Tomorrow",
    verified: true,
    followers: 3400000,
    avgLikes: 110000,
    avgComments: 1200,
    avgViews: 800000,
    rawProfilePicUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop&q=80",
    topPosts: [
      { id: "sk_1", caption: "Street-style Mumbai Pav Bhaji from scratch! 🥘✨ #YFLKitchen", likes: 175000, comments: 1890, views: 1250000, isVideo: true },
      { id: "sk_2", caption: "Crispy Paneer Katsu Burger with spicy sriracha glaze 🍔🔥", likes: 130000, comments: 1450, views: 890000, isVideo: true },
      { id: "sk_3", caption: "Culinary shoot days are the best days. 5 festive dessert recipes! 🍰", likes: 92000, comments: 870, views: 540000, isVideo: false },
    ],
  },
  aashnashroff: {
    handle: "@aashnashroff",
    fullName: "Aashna Shroff",
    biography: "Cosmopolitan Luxury Fashion Influencer of the Year | The Snob Journal | Mumbai",
    verified: true,
    followers: 1050000,
    avgLikes: 55000,
    avgComments: 620,
    avgViews: 310000,
    rawProfilePicUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    topPosts: [
      { id: "as_1", caption: "Golden hour in Paris wearing bespoke silk couture ✨🤍", likes: 82000, comments: 890, views: 450000, isVideo: false },
      { id: "as_2", caption: "5 everyday skincare holy-grails for glass skin in Mumbai weather 🧴💧", likes: 64000, comments: 710, views: 380000, isVideo: true },
      { id: "as_3", caption: "Styling 1 trench coat in 4 different aesthetic silhouettes 🧥👠", likes: 51000, comments: 540, views: 290000, isVideo: true },
    ],
  },
  radhikasethh: {
    handle: "@radhikasethh",
    fullName: "Radhika Seth",
    biography: "Story of a girl who chased the sunset ✨ Mumbai. Clean silhouettes & minimal aesthetic.",
    verified: true,
    followers: 1150000,
    avgLikes: 62000,
    avgComments: 710,
    avgViews: 340000,
    rawProfilePicUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80",
    topPosts: [
      { id: "rs_1", caption: "Sunset strolls through Bandra lanes in vintage denim 🌅🕊️", likes: 79000, comments: 880, views: 410000, isVideo: false },
      { id: "rs_2", caption: "Morning Pilates session followed by iced matcha 🍵🧘‍♀️", likes: 68000, comments: 720, views: 360000, isVideo: true },
      { id: "rs_3", caption: "Campaign shoot preview with Vogue India! ✨", likes: 59000, comments: 640, views: 310000, isVideo: false },
    ],
  },
  salonikukreja: {
    handle: "@salonikukreja",
    fullName: "Saloni Kukreja",
    biography: "Chef | Entrepreneur @induicecream | Forbes 30 Under 30 Asia | Started Food of Mumbai",
    verified: true,
    followers: 1120000,
    avgLikes: 48000,
    avgComments: 530,
    avgViews: 290000,
    rawProfilePicUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
    topPosts: [
      { id: "sl_1", caption: "The crispiest Garlic Butter Chilli Naan Rolls 🧄🌶️", likes: 67000, comments: 740, views: 420000, isVideo: true },
      { id: "sl_2", caption: "Testing our new artisanal ice cream batch at @induicecream 🍨", likes: 54000, comments: 590, views: 310000, isVideo: false },
      { id: "sl_3", caption: "Must-visit hidden food gems across Matunga & Fort Mumbai 🍽️", likes: 46000, comments: 510, views: 260000, isVideo: true },
    ],
  },
  dhananjay_tech: {
    handle: "@dhananjay_tech",
    fullName: "Dhananjay Bhosale",
    biography: "Full-time Tech content creator 📱 Simplifying gadgets & tech for everyone",
    verified: true,
    followers: 710000,
    avgLikes: 32000,
    avgComments: 450,
    avgViews: 240000,
    rawProfilePicUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80",
    topPosts: [
      { id: "db_1", caption: "Top 5 AI tools that will save you 10+ hours every single week 🤖⚡", likes: 49000, comments: 620, views: 390000, isVideo: true },
      { id: "db_2", caption: "Smartphone camera blind test: Flagship vs Midranger in low light! 📸📱", likes: 38000, comments: 510, views: 280000, isVideo: true },
      { id: "db_3", caption: "Desk setup upgrade 2026! Cable management & OLED monitor breakdown 🖥️✨", likes: 31000, comments: 380, views: 190000, isVideo: false },
    ],
  },
  larissa_wlc: {
    handle: "@larissa_wlc",
    fullName: "Larissa D'Sa",
    biography: "Travel. Jewellery. Design. Life. Curious by profession. Founder @beyond.larissa",
    verified: true,
    followers: 815000,
    avgLikes: 42000,
    avgComments: 490,
    avgViews: 260000,
    rawProfilePicUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    topPosts: [
      { id: "ld_1", caption: "Lost in the mountain mist of Himachal 🏔️🎒 Solo travel essentials video is up!", likes: 58000, comments: 630, views: 340000, isVideo: true },
      { id: "ld_2", caption: "Handmade silver jewellery collection drop is finally live at @beyond.larissa 💍✨", likes: 44000, comments: 480, views: 240000, isVideo: false },
      { id: "ld_3", caption: "Sunset kayaking off the Konkan coast 🚣‍♀️🌊 Pure peaceful magic", likes: 39000, comments: 410, views: 210000, isVideo: true },
    ],
  },
  yasminkarachiwala: {
    handle: "@yasminkarachiwala",
    fullName: "Yasmin Karachiwala",
    biography: "Pioneer of Pilates in India | Founder @ykbipilates | Transforming fitness for Bollywood & beyond",
    verified: true,
    followers: 1080000,
    avgLikes: 38000,
    avgComments: 410,
    avgViews: 210000,
    rawProfilePicUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    topPosts: [
      { id: "yk_1", caption: "5 Pilates reformer exercises for deep core activation & postural alignment 🧘‍♀️💪", likes: 52000, comments: 540, views: 310000, isVideo: true },
      { id: "yk_2", caption: "Pre-shoot warmup session with Deepika Padukone at the Bandra studio! ✨⚡", likes: 47000, comments: 490, views: 290000, isVideo: false },
      { id: "yk_3", caption: "Quick 10-minute mobility stretch routine you can do right out of bed 🛌☀️", likes: 35000, comments: 380, views: 180000, isVideo: true },
    ],
  },
  chrissutaria: {
    handle: "@chrissutaria",
    fullName: "Chris Sutaria",
    biography: "Fashion, Grooming & Lifestyle\n📍 Mumbai | Pune\nDM or mail for collabs 📥",
    verified: false,
    followers: 18207,
    avgLikes: 1450,
    avgComments: 45,
    avgViews: 9800,
    rawProfilePicUrl: "/uploads/influencers/chrissutaria.jpg",
    topPosts: [
      { id: "cs_1", caption: "Essential summer linen shirts guide for Mumbai humidity 👕✨", likes: 1850, comments: 52, views: 12400, isVideo: true },
      { id: "cs_2", caption: "3 daily grooming upgrades every guy needs to make in 2026 🧴✂️", likes: 1390, comments: 41, views: 9200, isVideo: true },
    ],
  },
  yourdesiwanderlust: {
    handle: "@yourdesiwanderlust",
    fullName: "Bhavana Choudhary",
    biography: "Finding stories in everyday places ✨\nTravel • Food • Lifestyle\n📍Mumbai / Navi Mumbai\n📩 Collabs: yourdesiwanderlust06@gmail.com",
    verified: false,
    followers: 23670,
    avgLikes: 1300,
    avgComments: 35,
    avgViews: 14000,
    rawProfilePicUrl: "/uploads/influencers/yourdesiwanderlust.jpg",
    topPosts: [
      { id: "ydw_1", caption: "Navi Mumbai’s new cozy brunch spot 🥐☕️", likes: 1249, comments: 26, views: 25959, isVideo: true },
      { id: "ydw_2", caption: "Hidden cafe in Kandivali with coconut cloud matcha 🤌🏻", likes: 98, comments: 12, views: 2788, isVideo: true },
    ],
  },
  mumbaifoodjunkie: {
    handle: "@mumbaifoodjunkie",
    fullName: "Swarali Kulkarni Pendurkar",
    biography: "Showcasing the best of Food, Travel, Culture & Experiences in Mumbai & beyond since 2015 ✈️🧿✨\n📩: mumbaifoodjunkie@gmail.com",
    verified: true,
    followers: 103580,
    avgLikes: 3800,
    avgComments: 85,
    avgViews: 45000,
    rawProfilePicUrl: "/uploads/influencers/mumbaifoodjunkie.jpg",
    topPosts: [
      { id: "mfj_1", caption: "Must-try hidden street food gallis of Old Mumbai 🍲✨", likes: 4500, comments: 92, views: 52000, isVideo: true },
      { id: "mfj_2", caption: "Iconic Dadar breakfast trail: Misal pav to Kothimbir vadi ☕", likes: 3400, comments: 78, views: 39000, isVideo: true },
    ],
  },
  rhea_agrawal: {
    handle: "@rhea_agrawal",
    fullName: "Riya Agrawal",
    biography: "Beauty, fits, football & bits of my life\nSkin positivity, always 🤍\n🎙️ @letsberealwithriya\n📍Mumbai | Raipur",
    verified: true,
    followers: 212293,
    avgLikes: 10500,
    avgComments: 160,
    avgViews: 75000,
    rawProfilePicUrl: "/uploads/influencers/rhea_agrawal.jpg",
    topPosts: [
      { id: "ra_1", caption: "It’s our season 💙❤️ Barcelona fan girl fits", likes: 39495, comments: 75, views: 178448, isVideo: true },
      { id: "ra_2", caption: "Skin positivity & real unfiltered texture in natural sunlight 🤍", likes: 2912, comments: 48, views: 16616, isVideo: false },
    ],
  },
  ruhaaneehiran: {
    handle: "@ruhaaneehiran",
    fullName: "Ruhaanee Hiran",
    biography: "breath of fresh air\n💌 ruhaaneehiran@tistmedia.in\n📍 Mumbai",
    verified: true,
    followers: 110975,
    avgLikes: 4600,
    avgComments: 75,
    avgViews: 38000,
    rawProfilePicUrl: "/uploads/influencers/ruhaaneehiran.jpg",
    topPosts: [
      { id: "rh_1", caption: "Sunday morning coffee & coastal monsoon breeze in Mumbai 🌧️☕", likes: 5200, comments: 84, views: 42000, isVideo: false },
      { id: "rh_2", caption: "Minimalist neutral capsule wardrobe styling 🤍", likes: 4100, comments: 66, views: 34000, isVideo: true },
    ],
  },
  "anmol.duaaa": {
    handle: "@anmol.duaaa",
    fullName: "Anmol Dua",
    biography: "model, actor, creator, hustler\nFashion | Beauty | Travel | Lifestyle 🪩\nBOM | AHM 🇮🇳",
    verified: true,
    followers: 118012,
    avgLikes: 4800,
    avgComments: 80,
    avgViews: 39000,
    rawProfilePicUrl: "/uploads/influencers/anmol_duaaa.jpg",
    topPosts: [
      { id: "ad_1", caption: "Monochrome streetwear shoot in South Mumbai 🏙️⚡", likes: 5400, comments: 95, views: 44000, isVideo: false },
      { id: "ad_2", caption: "Festive men's ethnic styling details 🪩✨", likes: 4200, comments: 72, views: 36000, isVideo: true },
    ],
  },
  angels_world_diaries: {
    handle: "@angels_world_diaries",
    fullName: "Jagruti Poriya",
    biography: "Mom blogger/lifestyle/ parenting/fashion/beauty\nDigital creator Mumbai\nDm for collaboration",
    verified: false,
    followers: 11231,
    avgLikes: 850,
    avgComments: 35,
    avgViews: 7500,
    rawProfilePicUrl: "/uploads/influencers/angels_world_diaries.jpg",
    topPosts: [
      { id: "awd_1", caption: "Easy nutritious tiffin recipes for kids 🍎🥪", likes: 980, comments: 42, views: 8800, isVideo: true },
      { id: "awd_2", caption: "Weekend family day out in Mumbai 🎠✨", likes: 720, comments: 28, views: 6200, isVideo: false },
    ],
  },
  spoonsofmumbai: {
    handle: "@spoonsofmumbai",
    fullName: "Ronak Rathod",
    biography: "Best Pure Veg. & Jain Food + Travel Handle of India 🇮🇳 💪🏻\nDM for Paid Collabs\nUse #spoonsofmumbai",
    verified: true,
    followers: 205782,
    avgLikes: 7800,
    avgComments: 140,
    avgViews: 65000,
    rawProfilePicUrl: "/uploads/influencers/spoonsofmumbai.jpg",
    topPosts: [
      { id: "som_1", caption: "Crispy Cheese Burst Dosa in Ghatkopar Khau Galli 🧀🔥", likes: 9200, comments: 165, views: 82000, isVideo: true },
      { id: "som_2", caption: "Best Pure Jain street food trail across Borivali & Kandivali 🥘", likes: 6400, comments: 115, views: 51000, isVideo: true },
    ],
  },
  shreyakainth: {
    handle: "@shreyakainth",
    fullName: "Shreya Kainth",
    biography: "my personal pinterest board\n🧸🧺💌🍓🫧\n📍 Mumbai",
    verified: true,
    followers: 72868,
    avgLikes: 3200,
    avgComments: 60,
    avgViews: 28000,
    rawProfilePicUrl: "/uploads/influencers/shreyakainth.jpg",
    topPosts: [
      { id: "skk_1", caption: "Romanticizing rainy afternoons in Bandra with matcha & books 🧸📖", likes: 3800, comments: 72, views: 32000, isVideo: true },
      { id: "skk_2", caption: "Vintage thrifted dress styling session 🧺🍓", likes: 2600, comments: 48, views: 24000, isVideo: false },
    ],
  },
};

export { POPULAR_FALLBACKS };

// Format profile payload with dynamic image proxy
function formatProfileResponse(profile, req) {
  const rawPic = profile.rawProfilePicUrl || profile.profilePicUrlHD || profile.profilePicUrl || "";
  const host = req.get("host");
  const protocol = req.protocol;
  let profilePicUrl = "";
  if (rawPic) {
    if (rawPic.startsWith("/uploads")) {
      profilePicUrl = `${protocol}://${host}${rawPic}`;
    } else if (rawPic.startsWith("http") && !rawPic.includes("wikimedia") && !rawPic.includes("unsplash")) {
      profilePicUrl = `${protocol}://${host}/api/public/proxy-image?url=${encodeURIComponent(rawPic)}`;
    } else {
      profilePicUrl = rawPic;
    }
  }

  return {
    found: true,
    handle: profile.handle.startsWith("@") ? profile.handle : `@${profile.handle}`,
    fullName: profile.fullName || profile.handle,
    profilePicUrl,
    rawProfilePicUrl: rawPic,
    biography: profile.biography || "",
    verified: Boolean(profile.verified),
    followers: Number(profile.followers) || 0,
    avgLikes: Number(profile.avgLikes) || 0,
    avgComments: Number(profile.avgComments) || 0,
    avgViews: Number(profile.avgViews) || (profile.avgLikes ? profile.avgLikes * 3 : 0),
    topPosts: profile.topPosts || [],
    cached: Boolean(profile.cached),
  };
}

// GET /api/public/instagram-lookup?handle=someuser
export const lookupInstagramHandle = async (req, res) => {
  const rawHandle = (req.query.handle || "")
    .trim()
    .replace(/^@/, "")
    .toLowerCase();

  if (!rawHandle) {
    return res.status(400).json({
      found: false,
      message: "No handle provided.",
    });
  }

  // 1. Check MongoDB Cache first
  let cachedDoc = null;
  try {
    cachedDoc = await InstagramCache.findOne({ handle: rawHandle });
    if (cachedDoc) {
      const ageMs = Date.now() - new Date(cachedDoc.lastFetchedAt).getTime();
      if (ageMs < CACHE_TTL_MS) {
        console.log(`[Instagram Lookup] Serving @${rawHandle} from MongoDB cache (${Math.round(ageMs / 60000)}m old)`);
        return res.json(formatProfileResponse({ ...cachedDoc.toObject(), cached: true }, req));
      }
    }
  } catch (cacheErr) {
    console.warn("[Instagram Lookup] Cache check error (continuing):", cacheErr.message);
  }

  // 2. Try scraping via Apify
  try {
    console.log(`[Instagram Lookup] Fetching live Instagram data for @${rawHandle}`);
    const profile = await scrapeInstagram(rawHandle);

    if (!profile || (!profile.followersCount && !profile.username && !profile.fullName)) {
      // If scrape returned empty, fallback to cached record if present
      if (cachedDoc) {
        return res.json(formatProfileResponse({ ...cachedDoc.toObject(), cached: true }, req));
      }
      if (POPULAR_FALLBACKS[rawHandle]) {
        return res.json(formatProfileResponse(POPULAR_FALLBACKS[rawHandle], req));
      }

      return res.json({
        found: false,
        message: `Instagram profile @${rawHandle} not found. Please verify the handle.`,
      });
    }

    const followers = profile.followersCount ?? profile.followers ?? 0;
    const latestPosts = profile.latestPosts ?? [];
    const posts = latestPosts.slice(0, 12);

    const avgLikes = posts.length
      ? Math.round(
          posts.reduce((sum, post) => sum + (post.likesCount ?? post.likeCount ?? 0), 0) / posts.length
        )
      : 0;

    const avgComments = posts.length
      ? Math.round(
          posts.reduce((sum, post) => sum + (post.commentsCount ?? post.commentCount ?? 0), 0) / posts.length
        )
      : 0;

    const avgViews = posts.length
      ? Math.round(
          posts.reduce(
            (sum, post) =>
              sum +
              (post.videoViewCount ?? post.viewCount ?? post.playCount ?? (post.likesCount ? post.likesCount * 3 : 0)),
            0
          ) / posts.length
        )
      : 0;

    const topPosts = posts
      .map((p) => ({
        id: p.id || p.shortCode,
        caption: p.caption || "Instagram Post",
        likes: p.likesCount ?? p.likeCount ?? 0,
        comments: p.commentsCount ?? p.commentCount ?? 0,
        views: p.videoViewCount ?? p.viewCount ?? p.playCount ?? (p.likesCount ? p.likesCount * 3 : 0),
        url: p.url || `https://instagram.com/p/${p.shortCode || ""}`,
        displayUrl: p.displayUrl || "",
        isVideo: p.isVideo || p.type === "Video",
      }))
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);

    const fullName = profile.fullName ?? profile.name ?? rawHandle;
    const rawPic = profile.profilePicUrlHD ?? profile.profilePicUrl ?? "";
    const verified = Boolean(profile.verified ?? profile.isVerified);
    const biography = profile.biography ?? profile.bio ?? "";

    const profileData = {
      handle: rawHandle,
      fullName,
      rawProfilePicUrl: rawPic,
      biography,
      verified,
      followers,
      avgLikes,
      avgComments,
      avgViews,
      topPosts,
      lastFetchedAt: new Date(),
    };

    // Save/Update MongoDB Cache in background
    InstagramCache.findOneAndUpdate(
      { handle: rawHandle },
      { $set: profileData },
      { upsert: true, new: true }
    ).catch((err) => console.warn("[Instagram Cache] Save failed:", err.message));

    return res.json(formatProfileResponse(profileData, req));

  } catch (error) {
    console.error("Instagram lookup failed:", error.message);

    // 3. Graceful Fallback if Apify is rate-limited / expired / out of credits
    if (cachedDoc) {
      console.log(`[Instagram Lookup] Using stale cache for @${rawHandle}`);
      return res.json(formatProfileResponse({ ...cachedDoc.toObject(), cached: true }, req));
    }

    if (POPULAR_FALLBACKS[rawHandle]) {
      console.log(`[Instagram Lookup] Using fallback profile for @${rawHandle}`);
      const fallback = POPULAR_FALLBACKS[rawHandle];
      InstagramCache.findOneAndUpdate(
        { handle: rawHandle },
        { $set: { ...fallback, handle: rawHandle, lastFetchedAt: new Date() } },
        { upsert: true }
      ).catch(() => {});
      return res.json(formatProfileResponse(fallback, req));
    }

    return res.json({
      found: false,
      message: `Could not retrieve live Instagram profile for @${rawHandle}: ${error.message}`,
    });
  }
};

// GET /api/public/proxy-image?url=https://...
export const proxyInstagramImage = async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send("No image URL provided.");
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return res.status(response.status).send("Failed to load image from Instagram CDN.");
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    const arrayBuffer = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("Image proxy error:", err.message);
    return res.status(500).send("Image proxy failed.");
  }
};
