import { useEffect, useRef } from "react";
import { Contact } from "./Contact";
import { useLocale } from "../locale";
import type { PageId } from "../types";
import type { VerseWord } from "../i18n";

function VerseWordView({ word, revealed }: { word: VerseWord; revealed: boolean }) {
  if (word.kind === "stay") {
    const same = !word.close || word.close === word.open;
    if (same) {
      return <span className="about-verse__word about-verse__word--stay">{word.open}</span>;
    }
    return (
      <span className="about-verse__word about-verse__word--stay">
        <span className="about-verse__swap about-verse__swap--open">{word.open}</span>
        <span className="about-verse__swap about-verse__swap--close">{word.close}</span>
      </span>
    );
  }

  if (word.kind === "go") {
    return <span className="about-verse__word about-verse__word--go">{word.open}</span>;
  }

  return (
    <span className="about-verse__word about-verse__word--come" aria-hidden={!revealed}>
      {word.close}
    </span>
  );
}

export function About({
  revealed,
  onGo,
  interest,
}: {
  revealed: boolean;
  onClose: () => void;
  onGo: (id: PageId) => void;
  interest?: PageId;
}) {
  const { t } = useLocale();
  const pageIds = ["social", "content", "performance", "web"] as const;
  const layerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const scroller = scrollRef.current;
    const stage = layer?.closest(".stage");
    if (!layer || !scroller || !stage) return;

    const mq = window.matchMedia("(max-width: 899px)");

    const update = () => {
      if (!mq.matches) {
        stage.classList.remove("is-about-end");
        return;
      }
      const atEnd =
        scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 56;
      stage.classList.toggle("is-about-end", atEnd);
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    mq.addEventListener("change", update);

    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", update);
      stage.classList.remove("is-about-end");
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className="about-layer"
      role="dialog"
      aria-modal="true"
      aria-label={t.about}
    >
      <div ref={scrollRef} className="about-layer__scroll">
        <div className={`about-layer__center ${revealed ? "is-revealed" : ""}`}>
          <div className="about-layer__intro">
            <h2 className="about-layer__title">
              <span className="about-verse" aria-live="polite">
                {t.aboutVerse.map((row) => (
                  <span
                    key={row.id}
                    className={`about-verse__row${row.openOnly ? " about-verse__row--open-only" : ""}`}
                    style={{
                      ["--row-open" as string]: String(row.openRow),
                      ["--row-close" as string]: String(row.closeRow),
                    }}
                  >
                    {row.words.map((word, i) => (
                      <VerseWordView key={`${row.id}-${i}`} word={word} revealed={revealed} />
                    ))}
                  </span>
                ))}
              </span>
            </h2>

            <p className="about-layer__body">{t.aboutBody}</p>

            <ul className="about-layer__links">
              {pageIds.map((id) => (
                <li key={id}>
                  <button type="button" onClick={() => onGo(id)}>
                    {t.pages[id].title} ↗
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <Contact tone="paper" interest={interest} />
        </div>
      </div>
    </div>
  );
}
