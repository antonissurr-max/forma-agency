import { useEffect, useRef, useState, type ReactNode } from "react";
import { BoxedTitle } from "./BoxedTitle";
import { pageOrder, pages, type MediaItem, type PageId } from "../site";

export function WorkShow({
  id,
  media,
  children,
  onClose,
  onNavigate,
}: {
  id: PageId;
  media?: MediaItem[];
  children?: ReactNode;
  onClose: () => void;
  onNavigate: (id: PageId) => void;
}) {
  const page = pages.find((p) => p.id === id)!;
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const i = pageOrder.indexOf(id);
  const prev = pageOrder[(i - 1 + pageOrder.length) % pageOrder.length];
  const next = pageOrder[(i + 1) % pageOrder.length];
  const current = media?.[active];
  const mediaCount = media?.length ?? 0;

  const stepPhoto = (dir: -1 | 1) => {
    if (mediaCount < 2) return;
    setActive((n) => (n + dir + mediaCount) % mediaCount);
  };

  useEffect(() => {
    setActive(0);
    setLightbox(false);
  }, [id]);

  useEffect(() => {
    const thumb = thumbsRef.current?.querySelector<HTMLElement>(".work__thumb.is-on");
    thumb?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox) setLightbox(false);
        else onClose();
        return;
      }
      if (lightbox) return;
      if (e.key === "ArrowLeft") onNavigate(prev);
      if (e.key === "ArrowRight") onNavigate(next);
      if (mediaCount > 1 && e.key === "ArrowUp") {
        e.preventDefault();
        setActive((n) => (n - 1 + mediaCount) % mediaCount);
      }
      if (mediaCount > 1 && e.key === "ArrowDown") {
        e.preventDefault();
        setActive((n) => (n + 1) % mediaCount);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, onClose, onNavigate, prev, next, mediaCount]);

  return (
    <div className="work is-open" role="dialog" aria-modal="true" aria-label={page.title}>
      <div className="work__scroll">
        <header className="work__head">
          <p className="work__kicker">{page.kicker}_</p>
          <BoxedTitle text={page.title} />

          <div className="work__meta">
            {page.meta.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
            {media && media.length > 0 && (
              <button
                className="work__explore"
                type="button"
                onClick={() =>
                  stackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                Explore ↗
              </button>
            )}
          </div>
        </header>

        {current && (
          <div className="work__stage">
            <button
              className="work__hero"
              type="button"
              onClick={() => setLightbox(true)}
              aria-label={`Μεγέθυνση: ${current.title}`}
            >
              <img src={current.src} alt={current.title} />
            </button>

            <div className="work__rail">
              {mediaCount > 1 && (
                <button
                  className="work__rail-nav is-up"
                  type="button"
                  onClick={() => stepPhoto(-1)}
                  aria-label="Προηγούμενη φωτογραφία"
                >
                  ↑
                </button>
              )}

              <div className="work__thumbs" ref={thumbsRef} aria-label="Μίνι γκαλερί">
                {media!.map((item, idx) => (
                  <button
                    key={item.src}
                    className={`work__thumb ${idx === active ? "is-on" : ""}`}
                    type="button"
                    onClick={() => setActive(idx)}
                    aria-label={item.title}
                    aria-current={idx === active ? "true" : undefined}
                  >
                    <img src={item.src} alt="" />
                  </button>
                ))}
              </div>

              {mediaCount > 1 && (
                <button
                  className="work__rail-nav is-down"
                  type="button"
                  onClick={() => stepPhoto(1)}
                  aria-label="Επόμενη φωτογραφία"
                >
                  ↓
                </button>
              )}
            </div>
          </div>
        )}

        {children && <div className="work__body">{children}</div>}

        {media && media.length > 1 && (
          <div className="work__stack" ref={stackRef}>
            {media.map((item, idx) => {
              if (idx === active) return null;
              return (
                <figure key={item.src} className="work__shot">
                  <button
                    type="button"
                    onClick={() => {
                      setActive(idx);
                      setLightbox(true);
                    }}
                  >
                    <img src={item.src} alt={item.title} loading="lazy" />
                  </button>
                  <figcaption>
                    <span>{item.title}</span>
                    <span>{item.detail}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </div>

      <button
        className="work__edge is-prev"
        type="button"
        onClick={() => onNavigate(prev)}
        aria-label={`Προηγούμενο: ${prev}`}
      >
        <span>←</span>
        <span>Previous</span>
      </button>
      <button
        className="work__edge is-next"
        type="button"
        onClick={() => onNavigate(next)}
        aria-label={`Επόμενο: ${next}`}
      >
        <span>→</span>
        <span>Next</span>
      </button>

      {lightbox && current && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onClick={() => setLightbox(false)}
        >
          <img
            src={current.src}
            alt={current.title}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox__close"
            type="button"
            onClick={() => setLightbox(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
