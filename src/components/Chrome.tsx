import { BrandWord } from "./BrandWord";
import { Logo } from "./Logo";
import { useLocale } from "../locale";
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
  const { locale, setLocale, t } = useLocale();
  const onAbout = view.kind === "about";

  return (
    <header className="chrome">
      <div className="chrome__start">
        <button
          className="chrome__logo"
          type="button"
          onClick={() => onGo({ kind: "index" })}
          aria-label={t.homeAria}
        >
          <Logo />
        </button>

        <button
          className="chrome__lang"
          type="button"
          onClick={() => setLocale(locale === "en" ? "el" : "en")}
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
        <button
          className="chrome__about"
          type="button"
          onClick={() => onGo({ kind: "about" })}
        >
          {view.kind === "index" ? t.contactUs : t.about}
        </button>
      )}

      {view.kind === "index" && <p className="chrome__lede">{t.landingLede}</p>}

      {(view.kind === "index" || onAbout) && (
        <p className={`chrome__brand${onAbout ? " is-about" : ""}`}>
          <BrandWord
            live={onAbout}
            revealed={aboutRevealed}
            onToggle={onToggleAbout}
          />
        </p>
      )}
    </header>
  );
}
