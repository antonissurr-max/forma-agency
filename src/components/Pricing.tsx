import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../locale";
import { pathFromView } from "../routing";
import type { PageId } from "../types";

const DOT_TONES = ["blue", "pink", "green", "sand"] as const;

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
  const unlockTimer = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const plans = t.pricingPlans;

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(plans.length - 1, index));
    if (next === activeRef.current && lockedRef.current) return;

    const node = track.querySelector<HTMLElement>(`[data-dot="${next}"]`);
    if (!node) return;

    activeRef.current = next;
    setActive(next);
    lockedRef.current = true;
    if (unlockTimer.current != null) window.clearTimeout(unlockTimer.current);
    node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    unlockTimer.current = window.setTimeout(() => {
      lockedRef.current = false;
      unlockTimer.current = null;
    }, 640);
  }, [plans.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const nodes = Array.from(track.querySelectorAll<HTMLElement>("[data-dot]"));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (lockedRef.current) return;
        let best: { index: number; ratio: number } | null = null;
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.dot);
          if (!Number.isFinite(index)) continue;
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { index, ratio: entry.intersectionRatio };
          }
        }
        if (best && best.ratio > 0.55 && best.index !== activeRef.current) {
          activeRef.current = best.index;
          setActive(best.index);
        }
      },
      {
        root: track,
        threshold: [0.45, 0.6, 0.75],
      },
    );

    nodes.forEach((node) => observer.observe(node));

    let lastStepAt = 0;
    const onWheel = (e: WheelEvent) => {
      const dominant = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(dominant) < 6) return;
      e.preventDefault();
      const now = performance.now();
      if (lockedRef.current || now - lastStepAt < 560) return;
      lastStepAt = now;
      goTo(activeRef.current + (dominant > 0 ? 1 : -1));
    };

    track.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      observer.disconnect();
      track.removeEventListener("wheel", onWheel);
      if (unlockTimer.current != null) window.clearTimeout(unlockTimer.current);
    };
  }, [plans.length, goTo]);

  return (
    <div
      className={`pricing-layer${exiting ? " is-exit" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.pricingTitle}
    >
      <header className="pricing-layer__head">
        <h1 className="pricing-layer__title">{t.pricingTitle}</h1>
      </header>

      <div className="pricing-dots" ref={trackRef}>
        <div className="pricing-dots__track">
          {plans.map((plan, index) => {
            const isActive = index === active;
            const distance = Math.abs(index - active);
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
                        onClick={() => onBrief(plan.id as PageId)}
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

      <div className="pricing-layer__meta">
        <p className="pricing-layer__note">{t.pricingNote}</p>
        <div className="pricing-layer__foot">
          <button type="button" className="pricing-layer__brief" onClick={() => onBrief()}>
            {t.startBrief} ↗
          </button>
          <Link className="pricing-layer__home" to={pathFromView({ kind: "index" }, locale)}>
            {t.footerHome}
          </Link>
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
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
