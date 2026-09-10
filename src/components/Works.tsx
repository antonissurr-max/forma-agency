import { useEffect, useRef } from "react";
import { pages } from "../site";
import { useLocale } from "../locale";
import type { PageId } from "../types";

export function Works({
  dimmed,
  onOpen,
}: {
  dimmed: boolean;
  onOpen: (id: PageId) => void;
}) {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const tiles = root.querySelectorAll<HTMLElement>(".tile");
    const mq = window.matchMedia("(max-width: 899px)");
    let observer: IntersectionObserver | null = null;

    const clear = () => {
      tiles.forEach((tile) => tile.classList.remove("is-inview"));
    };

    const setup = () => {
      observer?.disconnect();
      observer = null;
      if (!mq.matches) {
        clear();
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            entry.target.classList.toggle("is-inview", entry.isIntersecting);
          }
        },
        { threshold: 0.4, rootMargin: "0px 0px -10% 0px" },
      );
      tiles.forEach((tile) => observer!.observe(tile));
    };

    setup();
    mq.addEventListener("change", setup);
    return () => {
      mq.removeEventListener("change", setup);
      observer?.disconnect();
      clear();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`works ${dimmed ? "is-dim" : ""}`}
      aria-label={t.sections}
    >
      {pages.map((page, i) => {
        const title = t.pages[page.id].title;
        return (
          <button
            key={page.id}
            className="tile"
            type="button"
            style={{
              ["--i" as string]: String(i),
            }}
            onClick={() => onOpen(page.id)}
            aria-label={`${page.kicker} ${title}`}
          >
            <span className="tile__kicker">{page.kicker}_</span>
            <span className="tile__media">
              <img src={page.cover} alt="" />
            </span>
            <span className="tile__title">{title}</span>
          </button>
        );
      })}
    </section>
  );
}
