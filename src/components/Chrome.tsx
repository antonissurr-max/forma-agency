import { Logo } from "./Logo";
import { site } from "../site";
import type { View } from "../types";

export function Chrome({
  view,
  onGo,
}: {
  view: View;
  onGo: (next: View) => void;
}) {
  const onAbout = view.kind === "about";

  return (
    <header className="chrome">
      <button
        className="chrome__logo"
        type="button"
        onClick={() => onGo({ kind: "index" })}
        aria-label={`${site.brand} — αρχική`}
      >
        <Logo />
      </button>

      {!onAbout && (
        <button
          className="chrome__about"
          type="button"
          onClick={() => onGo({ kind: "about" })}
        >
          About
        </button>
      )}

      {view.kind === "index" && (
        <p className="chrome__brand" aria-hidden="true">
          {site.brand}
        </p>
      )}
    </header>
  );
}
