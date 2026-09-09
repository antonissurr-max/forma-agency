export type PageId = "social" | "video" | "performance" | "web";

export type View =
  | { kind: "index" }
  | { kind: "about" }
  | { kind: "page"; id: PageId };
