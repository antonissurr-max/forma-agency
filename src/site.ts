/** FORMA — marketing agency site content. */
export const site = {
  brand: "FORMA",
  tagline: "Marketing that shapes brands",
  email: "",
  phone: "",
  whatsapp: "",
  location: "Athens · Remote",
};

export function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("30") ? `+${digits}` : `+30${digits}`;
}

export function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "").replace(/^30/, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
}

export type PageId = "social" | "video" | "performance" | "web";

export type MediaItem = {
  src: string;
  title: string;
  detail: string;
};

export const socialWork: MediaItem[] = [
  { src: "/images/hero.jpg", title: "Campaign grid", detail: "Instagram" },
  { src: "/images/living.jpg", title: "Story system", detail: "Content" },
  { src: "/images/exterior.jpg", title: "Brand feed", detail: "Social" },
  { src: "/images/view.jpg", title: "Launch series", detail: "Launch" },
  { src: "/images/kitchen.jpg", title: "Community", detail: "Engagement" },
  { src: "/images/bedroom.jpg", title: "Product cuts", detail: "UGC style" },
];

export const videoWork: MediaItem[] = [
  { src: "/images/living.jpg", title: "Brand film", detail: "Hero" },
  { src: "/images/hero.jpg", title: "Reels pack", detail: "Shorts" },
  { src: "/images/exterior.jpg", title: "Ad creatives", detail: "Paid" },
  { src: "/images/attic.jpg", title: "Behind scenes", detail: "Social" },
  { src: "/images/bathroom.jpg", title: "Motion idents", detail: "Identity" },
  { src: "/images/view.jpg", title: "Event recap", detail: "Edit" },
];

export const servicePoints: Record<PageId, { name: string; detail: string }[]> = {
  social: [
    { name: "Strategy", detail: "Positioning, pillars, calendar" },
    { name: "Content", detail: "Feed, stories, carousels" },
    { name: "Community", detail: "Replies, UGC, listening" },
    { name: "Reporting", detail: "Monthly clarity, not vanity" },
  ],
  video: [
    { name: "Concept", detail: "Scripts & shot lists" },
    { name: "Production", detail: "Film & on-site capture" },
    { name: "Edit", detail: "Cuts for feed, ads, web" },
    { name: "Motion", detail: "Titles, idents, packshots" },
  ],
  performance: [
    { name: "Meta & Google", detail: "Acquisition that compounds" },
    { name: "Creative testing", detail: "Iterate what converts" },
    { name: "Funnel setup", detail: "Landing → lead → sale" },
    { name: "Analytics", detail: "ROAS, CPA, clear next steps" },
  ],
  web: [
    { name: "Websites", detail: "Fast, editorial, conversion-led" },
    { name: "SEO", detail: "Technical + content that ranks" },
    { name: "Landing pages", detail: "Built for campaigns" },
    { name: "Care", detail: "Iterate after launch" },
  ],
};

export const performanceFacts = [
  { place: "Creative testing", detail: "Weekly experiments" },
  { place: "Paid social", detail: "Meta · TikTok" },
  { place: "Search", detail: "Google Ads · SEO" },
  { place: "Measurement", detail: "GA4 · pixels · CRM" },
  { place: "Output", detail: "Clear weekly decisions" },
];

export const pages: {
  id: PageId;
  title: string;
  kicker: string;
  cover: string;
  meta: { label: string; value: string }[];
}[] = [
  {
    id: "social",
    title: "Social",
    kicker: "01",
    cover: "/images/hero.jpg",
    meta: [
      { label: "Focus", value: "Brand presence" },
      { label: "Channels", value: "IG · TikTok · LI" },
      { label: "Output", value: "Systems" },
      { label: "Cadence", value: "Ongoing" },
    ],
  },
  {
    id: "video",
    title: "Video",
    kicker: "02",
    cover: "/images/living.jpg",
    meta: [
      { label: "Formats", value: "Film · Reels · Ads" },
      { label: "Style", value: "Editorial" },
      { label: "Use", value: "Organic + paid" },
      { label: "Delivery", value: "Ready-to-run" },
    ],
  },
  {
    id: "performance",
    title: "Performance",
    kicker: "03",
    cover: "/images/view.jpg",
    meta: [
      { label: "Goal", value: "Efficient growth" },
      { label: "Channels", value: "Meta · Google" },
      { label: "Method", value: "Test · scale" },
      { label: "Proof", value: "Numbers" },
    ],
  },
  {
    id: "web",
    title: "Web",
    kicker: "04",
    cover: "/images/exterior.jpg",
    meta: [
      { label: "Build", value: "Sites & landings" },
      { label: "SEO", value: "Technical + content" },
      { label: "Speed", value: "Core web vitals" },
      { label: "Owner", value: "You keep it" },
    ],
  },
];

export const pageOrder: PageId[] = pages.map((p) => p.id);
