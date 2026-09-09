import { pages } from "../site";
import type { PageId } from "../types";

export function Works({
  dimmed,
  onOpen,
}: {
  dimmed: boolean;
  onOpen: (id: PageId) => void;
}) {
  return (
    <section className={`works ${dimmed ? "is-dim" : ""}`} aria-label="Ενότητες">
      {pages.map((page, i) => (
        <button
          key={page.id}
          className="tile"
          type="button"
          style={{
            ["--i" as string]: String(i),
          }}
          onClick={() => onOpen(page.id)}
          aria-label={`${page.kicker} ${page.title}`}
        >
          <span className="tile__kicker">{page.kicker}_</span>
          <span className="tile__media">
            <img src={page.cover} alt="" />
          </span>
          <span className="tile__title">{page.title}</span>
        </button>
      ))}
    </section>
  );
}
