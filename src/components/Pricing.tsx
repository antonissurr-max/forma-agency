import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../locale";
import { pathFromView } from "../routing";
import type { PageId } from "../types";

const DOT_TONES = ["blue", "pink", "green", "sand"] as const;
const LOOP_COPIES = 3;
/** Lower = creamier / slower settle */
const SCROLL_EASE = 0.082;
const WHEEL_GAIN = 0.92;
/** Fraction of track height for the active circle center (lower = higher on screen, aligns with title) */
const FOCUS_Y = 0.34;

function offsetInScroller(el: HTMLElement, scroller: HTMLElement) {
  return (
    el.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top +
    scroller.scrollTop
  );
}

export function Pricing({
  ready = true,
  exiting = false,
  onBrief,
}: {
  ready?: boolean;
  exiting?: boolean;
  onClose: () => void;
  onBrief: (interest?: PageId) => void;
}) {
  const { locale, t } = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const zoomedRef = useRef(false);
  const scrollApi = useRef<{
    goTo: (index: number, smooth?: boolean) => void;
  } | null>(null);
  const zoomAnimTimer = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomAnim, setZoomAnim] = useState(false);
  const [enterPhase, setEnterPhase] = useState<
    "pending" | "title" | "await-scroll" | "circles" | "done"
  >("pending");
  const enterPhaseRef = useRef(enterPhase);
  enterPhaseRef.current = enterPhase;
  const plans = t.pricingPlans;
  const activePlan = plans[active];
  const midCopy = Math.floor(LOOP_COPIES / 2);
  const circlesLive = enterPhase === "circles" || enterPhase === "done";

  const revealCircles = useCallback(() => {
    setEnterPhase((phase) => (phase === "await-scroll" ? "circles" : phase));
  }, []);

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
    setZoomAnim(true);
    setZoomed(false);
    if (zoomAnimTimer.current != null) window.clearTimeout(zoomAnimTimer.current);
    zoomAnimTimer.current = window.setTimeout(() => {
      setZoomAnim(false);
      zoomAnimTimer.current = null;
    }, 780);
  }, []);

  const goTo = useCallback((index: number, smooth = true) => {
    scrollApi.current?.goTo(index, smooth);
  }, []);

  const openZoom = useCallback(
    (index: number) => {
      if (index !== activeRef.current) goTo(index, true);
      zoomedRef.current = true;
      setZoomAnim(true);
      // Paint with transition armed, then apply zoom so scale eases in
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setZoomed(true);
        });
      });
      if (zoomAnimTimer.current != null) window.clearTimeout(zoomAnimTimer.current);
      zoomAnimTimer.current = window.setTimeout(() => {
        setZoomAnim(false);
        zoomAnimTimer.current = null;
      }, 780);
    },
    [goTo],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track || plans.length === 0) return;

    let current = track.scrollTop;
    let target = track.scrollTop;
    let raf = 0;
    let touching = false;

    const measureSetSpan = () => {
      const a = track.querySelector<HTMLElement>(`[data-copy="0"][data-dot="0"]`);
      const b = track.querySelector<HTMLElement>(`[data-copy="1"][data-dot="0"]`);
      if (!a || !b) return 0;
      return offsetInScroller(b, track) - offsetInScroller(a, track);
    };

    const wrapPair = () => {
      const setSpan = measureSetSpan();
      if (setSpan <= 0) return;
      while (current < setSpan * 0.45) {
        current += setSpan;
        target += setSpan;
      }
      while (current > setSpan * 1.55) {
        current -= setSpan;
        target -= setSpan;
      }
    };

    const focusY = () => track.clientHeight * FOCUS_Y;

    const applyFocus = () => {
      const nodes = Array.from(track.querySelectorAll<HTMLElement>("[data-dot]"));
      const center = current + focusY();
      let best = activeRef.current;
      let bestDist = Number.POSITIVE_INFINITY;

      for (const node of nodes) {
        const index = Number(node.dataset.dot);
        if (!Number.isFinite(index)) continue;
        const mid = offsetInScroller(node, track) + node.offsetHeight / 2;
        const dist = Math.abs(mid - center);
        const norm = Math.min(1, dist / (node.offsetHeight * 0.9));
        // Softer falloff so neighbors ease in/out instead of flipping
        const focus = Math.pow(1 - norm, 1.35);
        node.style.setProperty("--focus", focus.toFixed(4));
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

    const tick = () => {
      current += (target - current) * SCROLL_EASE;
      wrapPair();
      track.scrollTop = current;
      applyFocus();

      if (Math.abs(target - current) > 0.25) {
        raf = window.requestAnimationFrame(tick);
      } else {
        current = target;
        wrapPair();
        track.scrollTop = current;
        applyFocus();
        raf = 0;
      }
    };

    const kick = () => {
      if (!raf) raf = window.requestAnimationFrame(tick);
    };

    const centerOf = (node: HTMLElement) =>
      offsetInScroller(node, track) + node.offsetHeight / 2 - focusY();

    scrollApi.current = {
      goTo(index: number, smooth = true) {
        const next = ((index % plans.length) + plans.length) % plans.length;
        const node =
          track.querySelector<HTMLElement>(
            `[data-copy="${midCopy}"][data-dot="${next}"]`,
          ) ?? track.querySelector<HTMLElement>(`[data-dot="${next}"]`);
        if (!node) return;
        activeRef.current = next;
        setActive(next);
        const top = centerOf(node);
        if (smooth) {
          target = top;
          kick();
        } else {
          current = top;
          target = top;
          track.scrollTop = top;
          applyFocus();
        }
      },
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const phase = enterPhaseRef.current;
      if (phase === "pending" || phase === "title") return;
      if (phase === "await-scroll") {
        if (Math.abs(e.deltaY) > 2) revealCircles();
        return;
      }
      target += e.deltaY * WHEEL_GAIN;
      const setSpan = measureSetSpan();
      if (setSpan > 0) {
        // Keep target near the live scroll window so wrap stays invisible
        if (target < setSpan * 0.2) target += setSpan;
        if (target > setSpan * 1.8) target -= setSpan;
      }
      kick();
    };

    const onScroll = () => {
      if (enterPhaseRef.current !== "circles" && enterPhaseRef.current !== "done") return;
      if (raf || touching) {
        // During lerp we own scrollTop; during touch, follow native momentum
        if (touching && !raf) {
          current = track.scrollTop;
          target = current;
          wrapPair();
          if (Math.abs(track.scrollTop - current) > 1) track.scrollTop = current;
          applyFocus();
        }
        return;
      }
    };

    const onTouchStart = () => {
      if (enterPhaseRef.current === "await-scroll") {
        revealCircles();
        return;
      }
      if (enterPhaseRef.current !== "circles" && enterPhaseRef.current !== "done") return;
      touching = true;
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
      current = track.scrollTop;
      target = current;
    };

    const onTouchEnd = () => {
      if (enterPhaseRef.current !== "circles" && enterPhaseRef.current !== "done") return;
      touching = false;
      current = track.scrollTop;
      wrapPair();

      const nodes = Array.from(track.querySelectorAll<HTMLElement>("[data-dot]"));
      const center = current + focusY();
      let nearest: HTMLElement | null = null;
      let bestDist = Number.POSITIVE_INFINITY;
      for (const node of nodes) {
        const mid = offsetInScroller(node, track) + node.offsetHeight / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          nearest = node;
        }
      }
      if (nearest) {
        target = centerOf(nearest);
        kick();
      } else {
        target = current;
        applyFocus();
      }
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchend", onTouchEnd, { passive: true });
    track.addEventListener("touchcancel", onTouchEnd, { passive: true });

    requestAnimationFrame(() => {
      scrollApi.current?.goTo(0, false);
    });

    return () => {
      scrollApi.current = null;
      track.removeEventListener("wheel", onWheel);
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchend", onTouchEnd);
      track.removeEventListener("touchcancel", onTouchEnd);
      if (raf) window.cancelAnimationFrame(raf);
      if (zoomAnimTimer.current != null) window.clearTimeout(zoomAnimTimer.current);
    };
  }, [plans.length, midCopy, revealCircles]);

  useEffect(() => {
    if (!ready) {
      setEnterPhase("pending");
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setEnterPhase("done");
      return;
    }
    let titleTimer = 0;
    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setEnterPhase("title");
        titleTimer = window.setTimeout(() => setEnterPhase("await-scroll"), 1100);
      });
    });
    return () => {
      window.cancelAnimationFrame(raf);
      if (titleTimer) window.clearTimeout(titleTimer);
    };
  }, [ready]);

  useEffect(() => {
    if (enterPhase !== "circles") return;
    const timer = window.setTimeout(() => setEnterPhase("done"), 1000);
    return () => window.clearTimeout(timer);
  }, [enterPhase]);

  useEffect(() => {
    if (enterPhase !== "await-scroll") return;
    const layer = trackRef.current?.closest(".pricing-layer") as HTMLElement | null;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) > 2) revealCircles();
    };
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "PageDown" ||
        e.key === " " ||
        e.key === "Enter"
      ) {
        e.preventDefault();
        revealCircles();
      }
    };
    layer?.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey, true);
    return () => {
      layer?.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [enterPhase, revealCircles]);

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
    if (!circlesLive) return;
    const target = e.target as HTMLElement;
    if (target.closest("button, a")) return;
    if (zoomed && index === active) {
      closeZoom();
      return;
    }
    openZoom(index);
  };

  const enterClass =
    enterPhase === "pending"
      ? " is-enter-pending"
      : enterPhase === "title"
        ? " is-enter-title"
        : enterPhase === "await-scroll"
          ? " is-await-scroll"
          : enterPhase === "circles"
            ? " is-circles-in"
            : "";

  return (
    <div
      className={`pricing-layer${exiting ? " is-exit" : ""}${enterClass}${
        zoomed ? " is-zoomed" : ""
      }${zoomAnim ? " is-zoom-anim" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.pricingTitle}
    >
      <aside className="pricing-layer__aside">
        <div className="pricing-layer__aside-inner">
          <div className="pricing-layer__copy">
            <div className={`pricing-layer__copy-panel${zoomed ? " is-out" : " is-in"}`}>
              <h1 className="pricing-layer__title">
                <span className="pricing-layer__title-lead">{t.pricingTitleLead}</span>
                <span className="pricing-layer__title-sub">{t.pricingTitleSub}</span>
              </h1>
              <p className="pricing-layer__note">{t.pricingNote}</p>
            </div>
            <div className={`pricing-layer__copy-panel${zoomed ? " is-in" : " is-out"}`}>
              <h1 className="pricing-layer__title">
                <span className="pricing-layer__title-lead">
                  {activePlan?.name ?? t.pricingTitleLead}
                </span>
                <span className="pricing-layer__title-sub">
                  {activePlan?.price ?? t.pricingTitleSub}
                </span>
              </h1>
              <p className="pricing-layer__note">{activePlan?.blurb ?? t.pricingNote}</p>
            </div>
          </div>
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
          {enterPhase === "await-scroll" ? (
            <p className="pricing-layer__scroll-cue" aria-hidden="true">
              <span className="pricing-layer__scroll-cue-label">{t.pricingScrollCue}</span>
              <span className="pricing-layer__scroll-cue-arrow" />
            </p>
          ) : null}
        </div>
      </aside>

      <div className="pricing-dots" ref={trackRef}>
        <div className="pricing-dots__track">
          {loopItems.map((item, i) => {
            const isActive = item.planIndex === active;
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
              goTo(index, true);
            }}
          />
        ))}
      </div>
    </div>
  );
}
