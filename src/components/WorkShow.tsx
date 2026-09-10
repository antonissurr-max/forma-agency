import { useEffect, useRef, useState, type ReactNode } from "react";
import { BoxedTitle } from "./BoxedTitle";
import { pageOrder, pages, type MediaItem, type PageId } from "../site";
import { useLocale } from "../locale";

export function WorkShow({
  id,
  media,
  children,
  onClose,
  onNavigate,
  onBrief,
}: {
  id: PageId;
  media?: MediaItem[];
  children?: ReactNode;
  onClose: () => void;
  onNavigate: (id: PageId) => void;
  onBrief: () => void;
}) {
  const { t } = useLocale();
  const page = pages.find((p) => p.id === id)!;
  const copy = t.pages[id];
  const gallery =
    media && media.length > 0
      ? media
      : id === "social"
        ? t.socialWork
        : id === "content"
          ? t.contentWork
          : id === "performance"
            ? t.performanceWork
            : [];
  const isFolder = Boolean(copy.proof?.client);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const i = pageOrder.indexOf(id);
  const prev = pageOrder[(i - 1 + pageOrder.length) % pageOrder.length];
  const next = pageOrder[(i + 1) % pageOrder.length];
  const current = gallery[active];
  const mediaCount = gallery.length;

  const stepPhoto = (dir: -1 | 1) => {
    if (mediaCount < 2) return;
    setActive((n) => (n + dir + mediaCount) % mediaCount);
  };

  useEffect(() => {
    setActive(0);
    setLightbox(false);
    setFolderOpen(false);
  }, [id]);

  useEffect(() => {
    const thumb = thumbsRef.current?.querySelector<HTMLElement>(".work__thumb.is-on");
    thumb?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox) setLightbox(false);
        else if (folderOpen) setFolderOpen(false);
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
  }, [lightbox, folderOpen, onClose, onNavigate, prev, next, mediaCount]);

  return (
    <div
      className={`work is-open${gallery.length === 0 ? " work--text" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
    >
      <div className="work__scroll">
        <header className="work__head">
          <p className="work__kicker">{page.kicker}_</p>
          <BoxedTitle text={copy.title} />

          <div className="work__meta">
            {copy.meta.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
            {mediaCount > 1 && !isFolder && (
              <button
                className="work__explore"
                type="button"
                onClick={() =>
                  stackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                {t.explore} ↗
              </button>
            )}
          </div>
          {copy.proof && (
            <p className={`work__proof${copy.proof.client ? " work__proof--folder" : ""}`}>
              <span>{copy.proof.label}</span>
              {copy.proof.client ? (
                <>
                  <button
                    className="work__proof-name"
                    type="button"
                    aria-expanded={folderOpen}
                    onClick={() => setFolderOpen((on) => !on)}
                  >
                    {copy.proof.client}
                  </button>
                  {folderOpen && (
                    <span className="work__proof-lines">
                      {copy.proof.value ? <span>{copy.proof.value}</span> : null}
                      {copy.proof.notes?.map((note) => (
                        <span key={note}>{note}</span>
                      ))}
                    </span>
                  )}
                </>
              ) : copy.proof.href ? (
                <a href={copy.proof.href} target="_blank" rel="noreferrer">
                  {copy.proof.value}
                </a>
              ) : (
                <strong>{copy.proof.value}</strong>
              )}
            </p>
          )}

          {isFolder && folderOpen && gallery.length > 0 && (
            <div className="work__grid" aria-label={t.gallery}>
              {gallery.map((item, idx) => (
                <figure key={item.src} className="work__cell">
                  <button
                    type="button"
                    onClick={() => {
                      setActive(idx);
                      setLightbox(true);
                    }}
                    aria-label={`${t.zoom}: ${item.title}`}
                  >
                    <img src={item.src} alt={item.title} />
                  </button>
                  <figcaption>
                    <span>{item.title}</span>
                    <span>{item.detail}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          <button className="work__brief" type="button" onClick={onBrief}>
            {t.startBrief} ↗
          </button>
        </header>

        {current && !isFolder && (
          <div className={`work__stage${mediaCount < 2 ? " work__stage--solo" : ""}`}>
            <button
              className="work__hero"
              type="button"
              onClick={() => setLightbox(true)}
              aria-label={`${t.zoom}: ${current.title}`}
            >
              <img src={current.src} alt={current.title} />
            </button>

            {mediaCount > 1 && (
              <div className="work__rail">
                <button
                  className="work__rail-nav is-up"
                  type="button"
                  onClick={() => stepPhoto(-1)}
                  aria-label={t.prevPhoto}
                >
                  ↑
                </button>

                <div className="work__thumbs" ref={thumbsRef} aria-label={t.gallery}>
                  {gallery.map((item, idx) => (
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

                <button
                  className="work__rail-nav is-down"
                  type="button"
                  onClick={() => stepPhoto(1)}
                  aria-label={t.nextPhoto}
                >
                  ↓
                </button>
              </div>
            )}
          </div>
        )}

        {children && <div className="work__body">{children}</div>}

        {mediaCount > 1 && !isFolder && (
          <div className="work__stack" ref={stackRef}>
            {gallery.map((item, idx) => {
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
        aria-label={`${t.previous}: ${t.pages[prev].title}`}
      >
        <span>←</span>
        <span>{t.previous}</span>
      </button>
      <button
        className="work__edge is-next"
        type="button"
        onClick={() => onNavigate(next)}
        aria-label={`${t.next}: ${t.pages[next].title}`}
      >
        <span>→</span>
        <span>{t.next}</span>
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
            {t.close}
          </button>
        </div>
      )}
    </div>
  );
}
