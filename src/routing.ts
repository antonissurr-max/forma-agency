import type { Locale } from "./i18n";
import type { PageId, View } from "./types";

export const SITE_ORIGIN = "https://omnidot.pages.dev";

export const PAGE_IDS: PageId[] = ["social", "content", "performance", "web"];

export function localeFromPathname(pathname: string): Locale {
  const path = pathname.replace(/\/+$/, "") || "/";
  return path === "/el" || path.startsWith("/el/") ? "el" : "en";
}

/** Path without /el prefix. */
export function stripLocalePrefix(pathname: string): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/el") return "/";
  if (path.startsWith("/el/")) {
    const rest = path.slice(3);
    return rest ? rest : "/";
  }
  return path;
}

export function pathFromView(view: View, locale: Locale = "en"): string {
  const prefix = locale === "el" ? "/el" : "";

  if (view.kind === "index" || view.kind === "notfound") {
    return prefix || "/";
  }

  if (view.kind === "about") {
    const base = `${prefix}/about`;
    return view.interest ? `${base}?interest=${view.interest}` : base;
  }

  return `${prefix}/${view.id}`;
}

export function viewFromLocation(pathname: string, search: string): View {
  const bare = stripLocalePrefix(pathname);
  if (bare === "/") return { kind: "index" };
  if (bare === "/about") {
    const interest = new URLSearchParams(search).get("interest");
    if (interest && PAGE_IDS.includes(interest as PageId)) {
      return { kind: "about", interest: interest as PageId };
    }
    return { kind: "about" };
  }
  const id = bare.slice(1) as PageId;
  if (PAGE_IDS.includes(id)) return { kind: "page", id };
  return { kind: "notfound" };
}

/** Switch language while staying on the same logical page. */
export function pathForLocale(
  pathname: string,
  search: string,
  locale: Locale,
): string {
  const view = viewFromLocation(pathname, search);
  if (view.kind === "notfound") {
    return locale === "el" ? "/el" : "/";
  }
  return pathFromView(view, locale);
}
