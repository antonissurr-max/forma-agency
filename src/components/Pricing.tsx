import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "../locale";
import { pathFromView } from "../routing";
import type { PageId } from "../types";

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
  const [active, setActive] = useState(0);
  const plans = t.pricingPlans;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const nodes = Array.from(track.querySelectorAll<HTMLElement>("[data-dot]"));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { index: number; ratio: number } | null = null;
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.dot);
          if (!Number.isFinite(index)) continue;
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { index, ratio: entry.intersectionRatio };
          }
        }
        if (best && best.ratio > 0.45) setActive(best.index);
      },
      {
        root: track,
        threshold: [0.35, 0.5, 0.65, 0.8],
      },
    );

    nodes.forEach((node) => observer.observe(node));

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      track.scrollBy({ left: e.deltaY, behavior: "auto" });
    };
    track.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      observer.disconnect();
      track.removeEventListener("wheel", onWheel);
    };
  }, [plans.length]);

  return (
    <div
      className={`pricing-layer${exiting ? " is-exit" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.pricingTitle}
    >
      <h1 className="sr-only">{t.pricingTitle}</h1>

      <div
        className="pricing-dots"
        ref={trackRef}
        style={{ "--plan-count": plans.length } as CSSProperties}
      >
        <div className="pricing-dots__track">
          <span className="pricing-dots__line" aria-hidden="true" />
          {plans.map((plan, index) => {
            const isActive = index === active;
            const distance = Math.abs(index - active);
            return (
              <article
                key={plan.id}
                data-dot={index}
                className={`pricing-dot${isActive ? " is-active" : ""}`}
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
              onClick={() => {
                const track = trackRef.current;
                const node = track?.querySelector<HTMLElement>(`[data-dot="${index}"]`);
                node?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
