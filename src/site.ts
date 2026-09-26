/** omnidot. — marketing agency site content. */
export const site = {
  brand: "omnidot",
  tagline: "Marketing that shapes brands",
  email: "antonissur@yahoo.gr",
  phone: "6970862839",
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

export type PageId = "social" | "content" | "performance" | "web";

export type MediaItem = {
  src: string;
  title: string;
  detail: string;
  /** Defaults to image; use video for mp4/webm clips */
  kind?: "image" | "video";
  poster?: string;
};

/** Homepage “Trusted by” strip — logos link out (partner backlinks). */
export type Partner = {
  name: string;
  href: string;
  logo: string;
};

export const partners: Partner[] = [
  {
    name: "Europatch",
    href: "https://europatch.gr",
    logo: "/images/partners/europatch.svg",
  },
  {
    name: "Pyrgiotis OE",
    href: "https://pyrgiotisoe.com/",
    logo: "/images/partners/pyrgiotis.svg",
  },
  {
    name: "Nafplio4Sails",
    href: "https://nafplio4sails.com",
    logo: "/images/partners/nafplio4sails.svg",
  },
];

export const pages: {
  id: PageId;
  kicker: string;
  cover: string;
}[] = [
  { id: "social", kicker: "01", cover: "/images/social.jpg" },
  { id: "content", kicker: "02", cover: "/images/content.jpg" },
  { id: "performance", kicker: "03", cover: "/images/performance.jpg" },
  { id: "web", kicker: "04", cover: "/images/web.jpg" },
];

export const pageOrder: PageId[] = pages.map((p) => p.id);
