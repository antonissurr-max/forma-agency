import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrandWord } from "./BrandWord";
import { Logo } from "./Logo";
import { useLocale } from "../locale";
import { pathForLocale, pathFromView } from "../routing";
import type { View } from "../types";

export function Chrome({
  view,
  onGo,
  aboutRevealed,
  onToggleAbout,
}: {
  view: View;
  onGo: (next: View) => void;
  aboutRevealed: boolean;
  onToggleAbout: () => void;
}) {
  const { locale, t } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const onAbout = view.kind === "about";
  const onIndex = view.kind === "index";
  const BrandTag = onIndex ? "h1" : "p";

  return (
    <header className="chrome">
      <div className="chrome__start">
        <Link
          className="chrome__logo"
          to={pathFromView({ kind: "index" }, locale)}
          aria-label={t.homeAria}
        >
          <Logo />
        </Link>

        <button
          className="chrome__lang"
          type="button"
          onClick={() => {
            const next = locale === "en" ? "el" : "en";
            navigate(pathForLocale(location.pathname, location.search, next));
          }}
          aria-label={t.langLabel}
        >
          {locale === "en" ? "EN" : "EL"}
        </button>
      </div>

      {onAbout ? (
        <button
          className="chrome__about"
          type="button"
          onClick={() => onGo({ kind: "index" })}
        >
          {t.close}
        </button>
      ) : (
        <Link className="chrome__about" to={pathFromView({ kind: "about" }, locale)}>
          {onIndex || view.kind === "notfound" ? t.contactUs : t.about}
        </Link>
      )}

      {(onIndex || onAbout) && (
        <BrandTag className={`chrome__brand${onAbout ? " is-about" : ""}`}>
          <BrandWord
            live={onAbout}
            revealed={aboutRevealed}
            onToggle={onToggleAbout}
          />
        </BrandTag>
      )}
    </header>
  );
}
