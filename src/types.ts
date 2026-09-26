export type PageId = "social" | "content" | "performance" | "web";

export type View =
  | { kind: "index" }
  | { kind: "about"; interest?: PageId }
  | { kind: "pricing" }
  | { kind: "page"; id: PageId }
  | { kind: "notfound" };
