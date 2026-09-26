import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../locale";
import { pathFromView } from "../routing";
import type { PageId } from "../types";

const DOT_TONES = ["blue", "pink", "green", "sand"] as const;

function ringDistance(index: number, active: number, length: number) {
  const delta = Math.abs(index - active);
  return Math.min(delta, length - delta);
}

export function Pricing({
  exiting = false,
  onBrief,
}: {
  exiting?: boolean;
  onClose: () => void;
  onBrief: (interest?: PageId) => void;
}) {
  const { locale, t } = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const lockedRef = useRef(false);
  const zoomedRef = useRef(false);
  const unlockTimer = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const plans = t.pricingPlans;
  const activePlan = plans[active];

  const closeZoom = useCallback(() => {
    zoomedRef.current = false;
    setZoomed(false);
  }, []);

  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      if (!track || plans.length === 0) return;
      const next = ((index % plans.length) + plans.length) % plans.length;

      const node = track.querySelector<HTMLElement>(`[data-dot="${next}"]`);
      if (!node) return;

      activeRef.current = next;
      setActive(next);
      lockedRef.current = behavior === "smooth";
      if (unlockTimer.current != null) window.clearTimeout(unlockTimer.current);
      node.scrollIntoView({ behavior, block: "center", inline: "nearest" });
      if (behavior === "smooth") {
        unlockTimer.current = window.setTimeout(() => {
          lockedRef.current = false;
          unlockTimer.current = null;
        }, 480);
      } else {
        lockedRef.current = false;
      }
    },
    [plans.length],
  );

  const openZoom = useCallback(
    (index: number) => {
      if (index !== activeRef.current) goTo(index);
      zoomedRef.current = true;
      setZoomed(true);
    },
    [goTo],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const nodes = Array.from(track.querySelectorAll<HTMLElement>("[data-dot]"));
    if (!nodes.length) return;

    const syncActiveFromScroll = () => {
      const center = track.scrollTop + track.clientHeight / 2;
      let best = activeRef.current;
      let bestDist = Number.POSITIVE_INFINITY;
      for (const node of nodes) {
        const index = Number(node.dataset.dot);
        if (!Number.isFinite(index)) continue;
        const mid = node.offsetTop + node.offsetHeight / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      }
      if (best !== activeRef.current) {
        activeRef.current = best;
        setActive(best);
      }
    };

    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = window.requestAnimationFrame(() => {
        scrollRaf = 0;
        if (!lockedRef.current) syncActiveFromScroll();
      });
    };

    const onWheel = (e: WheelEvent) => {
      // Free continuous scroll always, including zoom mode.
      // Soft loop only at the edges.
      const maxScroll = Math.max(0, track.scrollHeight - track.clientHeight);
      const atEnd = track.scrollTop >= maxScroll - 1;
      const atStart = track.scrollTop <= 1;

      if (e.deltaY > 0 && atEnd) {
        e.preventDefault();
        if (!lockedRef.current) goTo(0);
        return;
      }
      if (e.deltaY < 0 && atStart) {
        e.preventDefault();
        if (!lockedRef.current) goTo(plans.length - 1);
      }
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("wheel", onWheel, { passive: false });
    syncActiveFromScroll();

    return () => {
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("wheel", onWheel);
      if (scrollRaf) window.cancelAnimationFrame(scrollRaf);
      if (unlockTimer.current != null) window.clearTimeout(unlockTimer.current);
    };
  }, [plans.length, goTo]);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeZoom();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [zoomed, closeZoom]);

  const onDotClick = (index: number) => (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, a")) return;
    if (zoomed && index === active) {
      closeZoom();
      return;
    }
    openZoom(index);
  };

  return (
    <div
      className={`pricing-layer${exiting ? " is-exit" : ""}${zoomed ? " is-zoomed" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.pricingTitle}
    >
      <aside className="pricing-layer__aside">
        <div className="pricing-layer__aside-inner">
          <h1 className="pricing-layer__title">
            {zoomed && activePlan ? activePlan.name : t.pricingTitle}
          </h1>
          <p className="pricing-layer__note">
            {zoomed && activePlan ? activePlan.blurb : t.pricingNote}
          </p>
          <div className="pricing-layer__foot">
            {zoomed ? (
              <>
                <button
                  type="button"
                  className="pricing-layer__brief"
                  onClick={() => onBrief(activePlan.id as PageId)}
                >
                  {t.pricingCta} ↗
                </button>
                <button type="button" className="pricing-layer__home" onClick={closeZoom}>
                  {t.close}
                </button>
              </>
            ) : (
              <>
                <button type="button" className="pricing-layer__brief" onClick={() => onBrief()}>
                  {t.startBrief} ↗
                </button>
                <Link
                  className="pricing-layer__home"
                  to={pathFromView({ kind: "index" }, locale)}
                >
                  {t.footerHome}
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>

      <div className="pricing-dots" ref={trackRef}>
        <div className="pricing-dots__track">
          {plans.map((plan, index) => {
            const isActive = index === active;
            const distance = ringDistance(index, active, plans.length);
            const tone = DOT_TONES[index % DOT_TONES.length];
            return (
              <Fragment key={plan.id}>
                {index > 0 ? (
                  <span className="pricing-dots__link" aria-hidden="true" />
                ) : null}
                <article
                  data-dot={index}
                  className={`pricing-dot pricing-dot--${tone}${isActive ? " is-active" : ""}`}
                  style={{ "--dot-distance": String(distance) } as CSSProperties}
                  aria-current={isActive ? "true" : undefined}
                  onClick={onDotClick(index)}
                >
                  <div className="pricing-dot__ring">
                    <div className="pricing-dot__content">
                      <p className="pricing-dot__kicker">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="pricing-dot__name">{plan.name}</h2>
                      <p className="pricing-dot__price">{plan.price}</p>
                      <p className="pricing-dot__blurb">{plan.blurb}</p>
                      <ul className="pricing-dot__list">
                        {plan.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        className="pricing-dot__cta"
                        tabIndex={isActive ? 0 : -1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBrief(plan.id as PageId);
                        }}
                      >
                        {t.pricingCta} ↗
                      </button>
                    </div>
                  </div>
                </article>
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className="pricing-dots__pips" role="tablist" aria-label={t.pricingTitle}>
        {plans.map((plan, index) => (
          <button
            key={plan.id}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={plan.name}
            className={`pricing-dots__pip${index === active ? " is-on" : ""}`}
            onClick={() => {
              if (zoomed) closeZoom();
              goTo(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
