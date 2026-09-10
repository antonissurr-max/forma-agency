import { copy, type Locale } from "./i18n";
import { SITE_ORIGIN, pathFromView } from "./routing";
import type { PageId, View } from "./types";

export type RouteSeo = {
  title: string;
  description: string;
  path: string;
  canonical: string;
  jsonLd: Record<string, unknown>;
};

function serviceDescription(locale: Locale, id: PageId): string {
  const page = copy[locale].pages[id];
  const first = page.points[0];
  return `${page.title} — ${first?.body ?? copy[locale].metaDescription}`;
}

export function getRouteSeo(locale: Locale, view: View): RouteSeo {
  const t = copy[locale];
  const path = pathFromView(view).split("?")[0];
  const canonical = `${SITE_ORIGIN}${path === "/" ? "/" : path}`;

  if (view.kind === "about") {
    return {
      title: `${t.about} — omnidot.`,
      description: t.aboutBody.slice(0, 160),
      path,
      canonical,
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
    return {
      title: `${page.title} — omnidot.`,
      description: description.slice(0, 170),
      path,
      canonical,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Service",
        name: page.title,
        description: description.slice(0, 300),
        provider: {
          "@type": "Organization",
          name: "omnidot.",
          url: SITE_ORIGIN,
        },
        areaServed: "GR",
        url: canonical,
      },
    };
  }

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    path: "/",
    canonical: `${SITE_ORIGIN}/`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "omnidot.",
      url: SITE_ORIGIN,
      description: t.metaDescription,
      email: "antonissur@yahoo.gr",
    },
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

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
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
  upsertMeta("property", "og:locale", locale === "el" ? "el_GR" : "en_US");
  upsertLink("canonical", seo.canonical);
  upsertJsonLd(seo.jsonLd);
}
