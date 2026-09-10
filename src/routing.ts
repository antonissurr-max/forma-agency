import type { PageId, View } from "./types";

export const SITE_ORIGIN = "https://omnidot.pages.dev";

export const PAGE_IDS: PageId[] = ["social", "content", "performance", "web"];

export const ROUTES = ["/", "/social", "/content", "/performance", "/web", "/about"] as const;

export function pathFromView(view: View): string {
  if (view.kind === "index") return "/";
  if (view.kind === "about") {
    return view.interest ? `/about?interest=${view.interest}` : "/about";
  }
  return `/${view.id}`;
}

export function viewFromLocation(pathname: string, search: string): View {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return { kind: "index" };
  if (path === "/about") {
    const interest = new URLSearchParams(search).get("interest");
    if (interest && PAGE_IDS.includes(interest as PageId)) {
      return { kind: "about", interest: interest as PageId };
    }
    return { kind: "about" };
  }
  const id = path.slice(1) as PageId;
  if (PAGE_IDS.includes(id)) return { kind: "page", id };
  return { kind: "index" };
}
