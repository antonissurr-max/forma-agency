import { Link } from "react-router-dom";
import { useLocale } from "../locale";
import { pathFromView } from "../routing";
import type { PageId } from "../types";

export function Pricing({
  exiting = false,
  onClose,
  onBrief,
}: {
  exiting?: boolean;
  onClose: () => void;
  onBrief: (interest?: PageId) => void;
}) {
  const { locale, t } = useLocale();

  return (
    <div
      className={`pricing-layer${exiting ? " is-exit" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.pricingTitle}
    >
      <div className="pricing-layer__scroll">
        <header className="pricing-layer__head">
          <p className="pricing-layer__eyebrow">{t.pricing}</p>
          <h1 className="pricing-layer__title">{t.pricingTitle}</h1>
          <p className="pricing-layer__lede">{t.pricingLede}</p>
        </header>

        <div className="pricing-layer__grid">
          {t.pricingPlans.map((plan) => (
            <article key={plan.id} className="pricing-card">
              <h2 className="pricing-card__name">{plan.name}</h2>
              <p className="pricing-card__price">{plan.price}</p>
              <p className="pricing-card__blurb">{plan.blurb}</p>
              <ul className="pricing-card__list">
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button
                type="button"
                className="pricing-card__cta"
                onClick={() => onBrief(plan.id as PageId)}
              >
                {t.pricingCta} ↗
              </button>
            </article>
          ))}
        </div>

        <p className="pricing-layer__note">{t.pricingNote}</p>

        <div className="pricing-layer__foot">
          <button type="button" className="pricing-layer__brief" onClick={() => onBrief()}>
            {t.startBrief} ↗
          </button>
          <Link className="pricing-layer__home" to={pathFromView({ kind: "index" }, locale)}>
            {t.footerHome}
          </Link>
        </div>
      </div>

      <button className="pricing-layer__close" type="button" onClick={onClose}>
        {t.close}
      </button>
    </div>
  );
}
