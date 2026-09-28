import { Layers, Sparkles, Users, Video, CreditCard, Smartphone, Square, Tv } from "lucide-react";

export const STEPS = [
  { id: 1, title: "Core Details", icon: Layers },
  { id: 2, title: "Campaign info", icon: Sparkles },
  { id: 3, title: "Creators", icon: Users },
  { id: 4, title: "Deliverables", icon: Video },
  { id: 5, title: "Payment Terms", icon: CreditCard },
];

export const CAMPAIGN_GOALS = [
  { id: "Multi-Channel UGC", title: "Multi-Channel\nUGC" },
  { id: "Awareness & Reach", title: "Awareness\n& Reach" },
  { id: "Conversions & Sales", title: "Conversions\n& Sales" },
];

export const CAMPAIGN_TYPES_BY_GOAL = {
  "Multi-Channel UGC": [
    {
      id: "User-Generated Content",
      title: "User-Generated Content",
      subtitle:
        "Find creators to produce authentic, fully-licensed UGC, both edited and raw footage, for your marketing channels",
      type: "ugc",
    },
  ],
  "Awareness & Reach": [
    {
      id: "Influencer Posts",
      title: "Influencer Posts",
      subtitle:
        "Collaborate with influencers who resonate with your brand to post content to their audiences",
      type: "influencer",
    },
    {
      id: "Product Seeding",
      title: "Product Seeding",
      subtitle:
        "Send free products to influencers in exchange for genuine reviews and to build new partnerships",
      type: "seeding",
    },
    {
      id: "TikTok Spark Ads",
      title: "TikTok Spark Ads",
      subtitle:
        "Partner with influencers to create engaging posts and turn top-performing content into Spark Ads",
      type: "spark_ads",
    },
    {
      id: "Meta Partnership Ads",
      title: "Meta Partnership Ads",
      subtitle:
        "Use influencers’ handles on Meta to produce authentic in-feed ads, leveraging social proof (formerly known as Whitelisting)",
      type: "meta_ads",
    },
  ],
  "Conversions & Sales": [
    {
      id: "TikTok Shop",
      title: "TikTok Shop",
      subtitle:
        "Work with UGC creators and TikTok influencers to produce UGC for Shop and Spark Ads and drive Shop reviews",
      type: "shop",
      hasAuthButton: true,
    },
    {
      id: "TikTok Spark Ads",
      title: "TikTok Spark Ads",
      subtitle:
        "Partner with influencers to create engaging posts and turn top-performing content into Spark Ads",
      type: "spark_ads",
    },
    {
      id: "Meta Partnership Ads",
      title: "Meta Partnership Ads",
      subtitle:
        "Use influencers’ handles on Meta to produce authentic in-feed ads, leveraging social proof (formerly known as Whitelisting)",
      type: "meta_ads",
    },
  ],
};

export const VISIBILITY_OPTIONS = [
  {
    id: "Visible to matched creators",
    title: "Visible to matched creators",
    subtitle: "Matching creators can apply",
  },
  {
    id: "Invite only",
    title: "Invite only",
    subtitle: "You’ll invite creators yourself",
  },
];

export const SHIPMENT_OPTIONS = [
  {
    id: "No delivery needed",
    title: "No delivery needed",
    subtitle: "Product not needed",
  },
  {
    id: "I’ll reimburse",
    title: "I’ll reimburse",
    subtitle: "Pay creator to buy it",
  },
  {
    id: "I’ll ship the product",
    title: "I’ll ship the product",
    subtitle: "You’ll send it to the creator",
  },
];

export const FORMAT_OPTIONS = [
  { id: "9:16 Vertical", label: "9:16\nVertical", icon: Smartphone },
  { id: "4:5 Vertical", label: "4:5\nVertical", icon: Smartphone },
  { id: "1:1 Square", label: "1:1\nSquare", icon: Square },
  { id: "16:9 Horizontal", label: "16:9\nHorizontal", icon: Tv },
];

export const PRIMARY_CONTENT_TYPES = [
  "Testimonial",
  "Unboxing",
  "Product Demo",
  "Product Review",
  "How-to",
  "Couple content",
];

export const EXTRA_CONTENT_TYPES = [
  "Recipe",
  "ASMR",
  "Podcast",
  "Street interview",
  "Man on the street",
  "Custom",
];

export const DEFAULT_GUIDE_TEMPLATE = `Main content messaging:

Main product features:
Feature 1
Feature 2
Feature 3

Required actions:
Talk directly into the camera, while holding [Product name] with packaging in view, discussing your experience with our product, and show the results. The video content needs to appear authentic & unscripted

Creator must be sure to: (to avoid refilming)
Do #1
Do #2
Do #3

Content examples:
Link #1
Link #2
Link #3`;

export const CREATOR_TIERS = ["<5", "5-10", "10-20", ">20"];

export const defaultDeliverable = () => ({
  mediaType: "Video",
  postingType: "Posting",
  brandTag: "",
  hashtags: "",
  placement: "Reels",
  format: "4:5 Vertical",
  videoMinLength: 15,
  videoMaxLength: 60,
  rawOrReady: "Ready to use Ad",
  contentType: "Testimonial",
  creatorGuide: DEFAULT_GUIDE_TEMPLATE,
  requestHooksAndBRolls: false,
  musicRequirement: "No music",
  whatShouldAvoid: "",
  numberOfPhotos: 1,
  showExtraContentTypes: false,
});
