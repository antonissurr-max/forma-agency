import { useEffect, useRef, useState, type ReactNode } from "react";
import { BoxedTitle } from "./BoxedTitle";
import { ExhibitGallery, mediaIsVideo } from "./ExhibitGallery";
import { pageOrder, type MediaItem, type PageId } from "../site";
import { useLocale } from "../locale";
import type { ProofClient } from "../i18n";

function resolveClients(
  proof:
    | {
        client?: string;
        story?: string;
        value: string;
        notes?: string[];
        links?: { label: string; href: string }[];
        clients?: ProofClient[];
      }
    | undefined,
): ProofClient[] {
  if (!proof) return [];
  if (proof.clients?.length) return proof.clients;
  if (proof.client) {
    return [
      {
        client: proof.client,
        story: proof.story,
        value: proof.value,
        notes: proof.notes,
        links: proof.links,
      },
    ];
  }
  return [];
}

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
  const pageGallery =
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
  const clients = resolveClients(copy.proof);
  const isFolder = clients.length > 0;
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [openClient, setOpenClient] = useState<string | null>(null);
  const exhibitRef = useRef<HTMLDivElement>(null);

  const activeCase = clients.find((c) => c.client === openClient);
  const gallery = !isFolder
    ? pageGallery
    : !openClient
      ? []
      : activeCase?.media !== undefined
        ? activeCase.media
        : pageGallery;
  const mediaCount = gallery.length;
  const showExhibit = mediaCount > 0 && (!isFolder || Boolean(openClient));

  const i = pageOrder.indexOf(id);
  const prev = pageOrder[(i - 1 + pageOrder.length) % pageOrder.length];
  const next = pageOrder[(i + 1) % pageOrder.length];
  const current = gallery[active];

  useEffect(() => {
    setActive(0);
    setLightbox(false);
    setOpenClient(null);
  }, [id]);

  useEffect(() => {
    setActive(0);
  }, [openClient]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightbox) setLightbox(false);
        else if (openClient) setOpenClient(null);
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
  }, [lightbox, openClient, onClose, onNavigate, prev, next, mediaCount, showExhibit]);

  const proofBlock = copy.proof ? (
    <div className={`work__proof${isFolder ? " work__proof--folder" : ""}`}>
      <span className="work__proof-label">{copy.proof.label}</span>
      {clients.length > 0 ? (
        <div className="work__proof-clients">
          {clients.map((item) => {
            const open = openClient === item.client;
            return (
              <div key={item.client} className="work__proof-client">
                <button
                  className="work__proof-name"
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    setOpenClient((cur) => (cur === item.client ? null : item.client))
                  }
                >
                  {item.client}
                </button>
                {open && (
                  <div className="work__proof-lines">
                    {item.story ? <p className="work__proof-story">{item.story}</p> : null}
                    {item.value ? <div className="work__proof-line">{item.value}</div> : null}
                    {item.notes?.map((note) => (
                      <div key={note} className="work__proof-line">
                        {note}
                      </div>
                    ))}
                    {item.links?.map((link) => (
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
                    {item.media && item.media.length === 0 ? (
                      <div className="work__proof-line work__proof-line--muted">
                        {t.mediaSoon}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
        <span>{t.next}</span>
        <span>→</span>
      </button>

      {lightbox && current ? (
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
            <img className="lightbox__media" src={current.src} alt={current.title} />
          )}
          <button
            className="lightbox__close"
            type="button"
            onClick={() => setLightbox(false)}
          >
            {t.close}
          </button>
        </div>
      ) : null}
    </div>
  );
}
