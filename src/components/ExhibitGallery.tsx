import { useEffect, useRef } from "react";
import type { MediaItem } from "../site";

function isVideo(item: MediaItem) {
  if (item.kind === "video") return true;
  if (item.kind === "image") return false;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(item.src);
}

function ExhibitMedia({
  item,
  active,
}: {
  item: MediaItem;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      void el.play().catch(() => {
        /* autoplay may be blocked */
      });
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [active]);

  if (isVideo(item)) {
    return (
      <video
        ref={videoRef}
        className="exhibit__media"
        src={item.src}
        poster={item.poster}
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  return <img className="exhibit__media" src={item.src} alt="" draggable={false} />;
}

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
        className={`exhibit__viewer${items.length > 1 ? " has-nav" : ""}`}
      >
        {items.length > 1 ? (
          <button
            type="button"
            className="exhibit__nav-btn exhibit__nav-btn--prev"
            onClick={() => onSelect((active - 1 + items.length) % items.length)}
            aria-label={prevLabel}
          >
            ←
          </button>
        ) : null}

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
                key={`${item.src}-${idx}`}
                type="button"
                className={`exhibit__frame ${role}${isVideo(item) ? " is-video" : ""}`}
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
                <ExhibitMedia
                  item={item}
                  active={idx === active && Math.abs(wrapped) === 0}
                />
              </button>
            );
          })}
        </div>

        {items.length > 1 ? (
          <button
            type="button"
            className="exhibit__nav-btn exhibit__nav-btn--next"
            onClick={() => onSelect((active + 1) % items.length)}
            aria-label={nextLabel}
          >
            →
          </button>
        ) : null}
      </div>

      <div className="exhibit__meta">
        <p className="exhibit__title">{current.title}</p>
        <p className="exhibit__detail">{current.detail}</p>
        {items.length > 1 ? (
          <p className="exhibit__count" aria-hidden="true">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function mediaIsVideo(item: MediaItem) {
  return isVideo(item);
}
