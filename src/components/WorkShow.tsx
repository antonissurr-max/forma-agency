import { useEffect, useRef, useState, type ReactNode } from "react";
import { BoxedTitle } from "./BoxedTitle";
import { ExhibitGallery, mediaIsVideo } from "./ExhibitGallery";
import { pageOrder, type MediaItem, type PageId } from "../site";
import { useLocale } from "../locale";

export function WorkShow({
  id,
  media,
  children,
  exiting = false,
  onClose,
  onNavigate,
  onBrief,
}: {
  id: PageId;
  media?: MediaItem[];
  children?: ReactNode;
  exiting?: boolean;
  onClose: () => void;
  onNavigate: (id: PageId) => void;
  onBrief: () => void;
}) {
  const { t } = useLocale();
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
            : id === "web"
              ? t.webWork
              : [];
  const isFolder = Boolean(copy.proof?.client);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const exhibitRef = useRef<HTMLDivElement>(null);

  const i = pageOrder.indexOf(id);
  const prev = pageOrder[(i - 1 + pageOrder.length) % pageOrder.length];
  const next = pageOrder[(i + 1) % pageOrder.length];
  const current = gallery[active];
  const mediaCount = gallery.length;
  const showExhibit = mediaCount > 0 && (!isFolder || folderOpen);

  useEffect(() => {
    setActive(0);
    setLightbox(false);
    setFolderOpen(false);
  }, [id]);

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
      if (showExhibit && mediaCount > 1 && e.key === "ArrowUp") {
        e.preventDefault();
        setActive((n) => (n - 1 + mediaCount) % mediaCount);
      }
      if (showExhibit && mediaCount > 1 && e.key === "ArrowDown") {
        e.preventDefault();
        setActive((n) => (n + 1) % mediaCount);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, folderOpen, onClose, onNavigate, prev, next, mediaCount, showExhibit]);

  const proofBlock = copy.proof ? (
    <div className={`work__proof${copy.proof.client ? " work__proof--folder" : ""}`}>
      <span className="work__proof-label">{copy.proof.label}</span>
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
            <div className="work__proof-lines">
              {copy.proof.story ? (
                <p className="work__proof-story">{copy.proof.story}</p>
              ) : null}
              {copy.proof.value ? (
                <div className="work__proof-line">{copy.proof.value}</div>
              ) : null}
              {copy.proof.notes?.map((note) => (
                <div key={note} className="work__proof-line">
                  {note}
                </div>
              ))}
              {copy.proof.links?.map((link) => (
                <a
                  key={link.href}
                  className="work__proof-line"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </>
      ) : copy.proof.links && copy.proof.links.length > 0 ? (
        <div className="work__proof-lines">
          {copy.proof.links.map((link) => (
            <a
              key={link.href}
              className="work__proof-line"
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : copy.proof.href ? (
        <a className="work__proof-line" href={copy.proof.href} target="_blank" rel="noreferrer">
          {copy.proof.value}
        </a>
      ) : (
        <strong className="work__proof-line">{copy.proof.value}</strong>
      )}
    </div>
  ) : null;

  const exhibit = showExhibit ? (
    <div className="work__exhibit" ref={exhibitRef} aria-label={t.gallery}>
      <ExhibitGallery
        items={gallery}
        active={active}
        onSelect={setActive}
        onZoom={(idx) => {
          setActive(idx);
          setLightbox(true);
        }}
        zoomLabel={t.zoom}
        prevLabel={t.prevPhoto}
        nextLabel={t.nextPhoto}
      />
    </div>
  ) : null;

  return (
    <div
      className={`work is-open${gallery.length === 0 ? " work--text" : ""}${
        exiting ? " is-exit" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
    >
      <div className="work__scroll" key={id}>
        <header className="work__head">
          <div className="work__lead">
            <BoxedTitle text={copy.title} />

            <div className="work__meta">
              {copy.meta.map((item) => (
                <div key={item.label} className="work__meta-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
              {mediaCount > 1 && !isFolder && (
                <button
                  className="work__explore"
                  type="button"
                  onClick={() =>
                    exhibitRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                >
                  {t.explore} ↗
                </button>
              )}
            </div>
          </div>
          {proofBlock}

          <button className="work__brief" type="button" onClick={onBrief}>
            {t.startBrief} ↗
          </button>
        </header>

        {exhibit}

        {children && <div className="work__body">{children}</div>}
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
          {mediaIsVideo(current) ? (
            <video
              className="lightbox__media"
              src={current.src}
              poster={current.poster}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              className="lightbox__media"
              src={current.src}
              alt={current.title}
              onClick={(e) => e.stopPropagation()}
            />
          )}
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
