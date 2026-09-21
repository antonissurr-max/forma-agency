import { useRef } from "react";
import type { MediaItem } from "../site";

export function ExhibitGallery({
  items,
  active,
  onSelect,
  onZoom,
  zoomLabel,
  prevLabel,
  nextLabel,
}: {
  items: MediaItem[];
  active: number;
  onSelect: (index: number) => void;
  onZoom: (index: number) => void;
  zoomLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const touchX = useRef<number | null>(null);

  if (items.length === 0) return null;

  const current = items[active];

  return (
    <div className="exhibit" aria-roledescription="carousel">
      <div
        className="exhibit__stage"
        onTouchStart={(e) => {
          touchX.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchX.current;
          const end = e.changedTouches[0]?.clientX;
          touchX.current = null;
          if (start == null || end == null) return;
          const delta = end - start;
          if (Math.abs(delta) < 40) return;
          if (delta < 0) onSelect((active + 1) % items.length);
          else onSelect((active - 1 + items.length) % items.length);
        }}
      >
        {items.map((item, idx) => {
          const offset = idx - active;
          const wrapped =
            offset > items.length / 2
              ? offset - items.length
              : offset < -items.length / 2
                ? offset + items.length
                : offset;
          const role =
            wrapped === 0
              ? "is-active"
              : wrapped === -1
                ? "is-prev"
                : wrapped === 1
                  ? "is-next"
                  : wrapped === -2
                    ? "is-near is-near-prev"
                    : wrapped === 2
                      ? "is-near is-near-next"
                      : "is-far";

          return (
            <button
              key={item.src}
              type="button"
              className={`exhibit__frame ${role}`}
              onClick={() => {
                if (idx === active) onZoom(idx);
                else onSelect(idx);
              }}
              aria-label={
                idx === active ? `${zoomLabel}: ${item.title}` : item.title
              }
              aria-current={idx === active ? "true" : undefined}
              tabIndex={Math.abs(wrapped) <= 1 ? 0 : -1}
            >
              <img src={item.src} alt="" draggable={false} />
            </button>
          );
        })}
      </div>

      <div className="exhibit__meta">
        <p className="exhibit__title">{current.title}</p>
        <p className="exhibit__detail">{current.detail}</p>
      </div>

      {items.length > 1 ? (
        <div className="exhibit__nav">
          <button
            type="button"
            className="exhibit__nav-btn"
            onClick={() => onSelect((active - 1 + items.length) % items.length)}
            aria-label={prevLabel}
          >
            ←
          </button>
          <span className="exhibit__count" aria-hidden="true">
            {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            className="exhibit__nav-btn"
            onClick={() => onSelect((active + 1) % items.length)}
            aria-label={nextLabel}
          >
            →
          </button>
        </div>
      ) : null}
    </div>
  );
}
