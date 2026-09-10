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

  return (
    <section className={`works ${dimmed ? "is-dim" : ""}`} aria-label={t.sections}>
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
