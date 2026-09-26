import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
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
const LOOP_COPIES = 3;

function ringDistance(index: number, active: number, length: number) {
  const delta = Math.abs(index - active);
  return Math.min(delta, length - delta);
}

function offsetInScroller(el: HTMLElement, scroller: HTMLElement) {
  return (
    el.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top +
    scroller.scrollTop
  );
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
  const wrappingRef = useRef(false);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const plans = t.pricingPlans;
  const activePlan = plans[active];
  const midCopy = Math.floor(LOOP_COPIES / 2);

  const loopItems = useMemo(
    () =>
      Array.from({ length: plans.length * LOOP_COPIES }, (_, slot) => {
        const planIndex = slot % plans.length;
        return {
          slot,
          planIndex,
          copy: Math.floor(slot / plans.length),
          plan: plans[planIndex],
        };
      }),
    [plans],
  );

  const closeZoom = useCallback(() => {
    zoomedRef.current = false;
    setZoomed(false);
  }, []);

  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      if (!track || plans.length === 0) return;
      const next = ((index % plans.length) + plans.length) % plans.length;

      // Prefer the middle copy so infinite wrap stays in the safe zone
      const node =
        track.querySelector<HTMLElement>(
          `[data-copy="${midCopy}"][data-dot="${next}"]`,
        ) ?? track.querySelector<HTMLElement>(`[data-dot="${next}"]`);
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
    [plans.length, midCopy],
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
    if (!track || plans.length === 0) return;

    const measureSetSpan = () => {
      const a = track.querySelector<HTMLElement>(`[data-copy="0"][data-dot="0"]`);
      const b = track.querySelector<HTMLElement>(`[data-copy="1"][data-dot="0"]`);
      if (!a || !b) return 0;
      return offsetInScroller(b, track) - offsetInScroller(a, track);
    };

    const syncActiveFromScroll = () => {
      const nodes = Array.from(track.querySelectorAll<HTMLElement>("[data-dot]"));
      const center = track.scrollTop + track.clientHeight / 2;
      let best = activeRef.current;
      let bestDist = Number.POSITIVE_INFINITY;
      for (const node of nodes) {
        const index = Number(node.dataset.dot);
        if (!Number.isFinite(index)) continue;
        const mid = offsetInScroller(node, track) + node.offsetHeight / 2;
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

    const keepInMiddleCopy = () => {
      if (wrappingRef.current || lockedRef.current) return;
      const setSpan = measureSetSpan();
      if (setSpan <= 0) return;

      // Stay inside the middle copy range for seamless 04→01 / 01→04
      if (track.scrollTop < setSpan * 0.5) {
        wrappingRef.current = true;
        track.scrollTop += setSpan;
        wrappingRef.current = false;
      } else if (track.scrollTop > setSpan * 1.5) {
        wrappingRef.current = true;
        track.scrollTop -= setSpan;
        wrappingRef.current = false;
      }
    };

    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = window.requestAnimationFrame(() => {
        scrollRaf = 0;
        if (wrappingRef.current) return;
        keepInMiddleCopy();
        if (!lockedRef.current) syncActiveFromScroll();
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });

    // Land on middle-copy first package without a visible jump
    requestAnimationFrame(() => {
      goTo(0, "auto");
      syncActiveFromScroll();
    });

    return () => {
      track.removeEventListener("scroll", onScroll);
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
            {zoomed && activePlan ? (
              <>
                <span className="pricing-layer__title-lead">{activePlan.name}</span>
                <span className="pricing-layer__title-sub">{activePlan.price}</span>
              </>
            ) : (
              <>
                <span className="pricing-layer__title-lead">{t.pricingTitleLead}</span>
                <span className="pricing-layer__title-sub">{t.pricingTitleSub}</span>
              </>
            )}
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
          {loopItems.map((item, i) => {
            const isActive = item.planIndex === active;
            const distance = ringDistance(item.planIndex, active, plans.length);
            const tone = DOT_TONES[item.planIndex % DOT_TONES.length];
            return (
              <Fragment key={`${item.copy}-${item.plan.id}`}>
                {i > 0 ? (
                  <span className="pricing-dots__link" aria-hidden="true" />
                ) : null}
                <article
                  data-dot={item.planIndex}
                  data-copy={item.copy}
                  data-slot={item.slot}
                  className={`pricing-dot pricing-dot--${tone}${isActive ? " is-active" : ""}`}
                  style={{ "--dot-distance": String(distance) } as CSSProperties}
                  aria-current={isActive ? "true" : undefined}
                  onClick={onDotClick(item.planIndex)}
                >
                  <div className="pricing-dot__ring">
                    <div className="pricing-dot__content">
                      <p className="pricing-dot__kicker">
                        {String(item.planIndex + 1).padStart(2, "0")}
                      </p>
                      <h2 className="pricing-dot__name">{item.plan.name}</h2>
                      <p className="pricing-dot__price">{item.plan.price}</p>
                      <p className="pricing-dot__blurb">{item.plan.blurb}</p>
                      <ul className="pricing-dot__list">
                        {item.plan.items.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        className="pricing-dot__cta"
                        tabIndex={isActive ? 0 : -1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBrief(item.plan.id as PageId);
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
