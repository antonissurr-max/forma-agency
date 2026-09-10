import { copy, type Locale } from "./i18n";
import { phoneHref, site } from "./site";
import { pages } from "./site";
import { SITE_ORIGIN, pathFromView } from "./routing";
import type { PageId, View } from "./types";

export type RouteSeo = {
  title: string;
  description: string;
  path: string;
  canonical: string;
  image: string;
  robots?: string;
  jsonLd: Record<string, unknown>;
};

const DEFAULT_OG = `${SITE_ORIGIN}/images/work-omnidot.jpg`;
const ORG_PHONE = site.phone ? phoneHref(site.phone) : "";

function coverFor(id: PageId): string {
  const page = pages.find((p) => p.id === id);
  return page ? `${SITE_ORIGIN}${page.cover}` : DEFAULT_OG;
}

function serviceDescription(locale: Locale, id: PageId): string {
  const page = copy[locale].pages[id];
  const first = page.points[0];
  return `${page.title} — ${first?.body ?? copy[locale].metaDescription}`;
}

function organizationLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "omnidot.",
    url: SITE_ORIGIN,
    description: copy[locale].metaDescription,
    image: DEFAULT_OG,
    ...(ORG_PHONE ? { telephone: ORG_PHONE } : {}),
    areaServed: "GR",
  };
}

export function getRouteSeo(locale: Locale, view: View): RouteSeo {
  const t = copy[locale];
  const path = pathFromView(view, locale).split("?")[0];
  const canonical = `${SITE_ORIGIN}${path === "/" ? "/" : path}`;

  if (view.kind === "notfound") {
    return {
      title: `${t.notFoundTitle} — omnidot.`,
      description: t.notFoundBody,
      path,
      canonical,
      image: DEFAULT_OG,
      robots: "noindex, follow",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: t.notFoundTitle,
        url: canonical,
      },
    };
  }

  if (view.kind === "about") {
    return {
      title: `${t.about} — omnidot.`,
      description: t.aboutBody.slice(0, 160),
      path,
      canonical,
      image: DEFAULT_OG,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: t.about,
        description: t.aboutBody,
        url: canonical,
        isPartOf: { "@type": "WebSite", name: "omnidot.", url: SITE_ORIGIN },
      },
    };
  }

  if (view.kind === "page") {
    const page = t.pages[view.id];
    const description = serviceDescription(locale, view.id);
    const image = coverFor(view.id);
    const story = page.proof?.story;
    return {
      title: `${page.title} — omnidot.`,
      description: description.slice(0, 170),
      path,
      canonical,
      image,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Service",
        name: page.title,
        description: (story ?? description).slice(0, 300),
        provider: {
          "@type": "Organization",
          name: "omnidot.",
          url: SITE_ORIGIN,
          ...(ORG_PHONE ? { telephone: ORG_PHONE } : {}),
        },
        areaServed: "GR",
        url: canonical,
        image,
      },
    };
  }

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    path,
    canonical,
    image: DEFAULT_OG,
    jsonLd: organizationLd(locale),
  };
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (hreflang) el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(data: Record<string, unknown>) {
  const id = "omnidot-jsonld";
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function applyDocumentSeo(locale: Locale, view: View) {
  const seo = getRouteSeo(locale, view);
  document.title = seo.title;
  document.documentElement.lang = locale === "el" ? "el" : "en";

  upsertMeta("name", "description", seo.description);
  upsertMeta("property", "og:title", seo.title);
  upsertMeta("property", "og:description", seo.description);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:url", seo.canonical);
  upsertMeta("property", "og:image", seo.image);
  upsertMeta("property", "og:locale", locale === "el" ? "el_GR" : "en_US");
  upsertMeta("property", "og:locale:alternate", locale === "el" ? "en_US" : "el_GR");
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", seo.title);
  upsertMeta("name", "twitter:description", seo.description);
  upsertMeta("name", "twitter:image", seo.image);

  if (seo.robots) {
    upsertMeta("name", "robots", seo.robots);
  } else {
    document.head.querySelector('meta[name="robots"]')?.remove();
  }

  upsertLink("canonical", seo.canonical);

  if (view.kind !== "notfound") {
    const enPath = pathFromView(view, "en").split("?")[0];
    const elPath = pathFromView(view, "el").split("?")[0];
    const enUrl = `${SITE_ORIGIN}${enPath === "/" ? "/" : enPath}`;
    const elUrl = `${SITE_ORIGIN}${elPath}`;
    upsertLink("alternate", enUrl, "en");
    upsertLink("alternate", elUrl, "el");
    upsertLink("alternate", enUrl, "x-default");
  }

  upsertJsonLd(seo.jsonLd);
}
