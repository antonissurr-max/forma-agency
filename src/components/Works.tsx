import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { pages, phoneHref, site } from "../site";
import { useLocale } from "../locale";
import { pathFromView } from "../routing";
import { Logo } from "./Logo";

export function Works({ dimmed }: { dimmed: boolean }) {
  const { locale, t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const proof = t.pages.social.proof;
  const callHref = phoneHref(site.phone);
  // Unique images across mobile home (service covers only appear in tiles)
  const aboutTall = "/images/living.jpg";
  const aboutSquare = "/images/kitchen.jpg";
  const proofFeature = "/images/exterior.jpg";
  const proofSquare = "/images/hero.jpg";
  const proofTall = "/images/attic.jpg";

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const tiles = root.querySelectorAll<HTMLElement>(".tile");
    const mq = window.matchMedia("(max-width: 899px)");
    let observer: IntersectionObserver | null = null;

    const clear = () => {
      tiles.forEach((tile) => tile.classList.remove("is-inview"));
    };

    const setup = () => {
      observer?.disconnect();
      observer = null;
      if (!mq.matches) {
        clear();
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            entry.target.classList.toggle("is-inview", entry.isIntersecting);
          }
        },
        { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
      );
      tiles.forEach((tile) => observer!.observe(tile));
    };

    setup();
    mq.addEventListener("change", setup);
    return () => {
      mq.removeEventListener("change", setup);
      observer?.disconnect();
      clear();
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const stage = hero?.closest(".stage");
    if (!hero || !stage) return;

    const mq = window.matchMedia("(max-width: 899px)");
    let observer: IntersectionObserver | null = null;

    const setup = () => {
      observer?.disconnect();
      observer = null;
      stage.classList.remove("is-mobile-hero");
      if (!mq.matches) return;

      observer = new IntersectionObserver(
        ([entry]) => {
          stage.classList.toggle(
            "is-mobile-hero",
            Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.35),
          );
        },
        { threshold: [0.35, 0.55] },
      );
      observer.observe(hero);
    };

    setup();
    mq.addEventListener("change", setup);
    return () => {
      mq.removeEventListener("change", setup);
      observer?.disconnect();
      stage.classList.remove("is-mobile-hero");
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`works ${dimmed ? "is-dim" : ""}`}
      aria-label={t.sections}
    >
      <header ref={heroRef} className="home-mobile home-mobile--hero">
        <Logo className="home-mobile__mark" />
        <p className="home-mobile__brand">
          {site.brand}
          <span className="home-mobile__dot">.</span>
        </p>
        <h2 className="home-mobile__display">{t.homeMobileHeadline}</h2>
        <p className="home-mobile__lede">{t.aboutSub}</p>
        <Link
          className="home-mobile__cta-line"
          to={pathFromView({ kind: "about" }, locale)}
        >
          <span>{t.contactUs}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </header>

      <div className="works__intro">
        <p className="works__pitch">{t.aboutSub}</p>
      </div>

      <section className="home-mobile home-mobile--about">
        <p className="home-mobile__eyebrow">{t.about}</p>
        <h2 className="home-mobile__title">{t.homeMobileAboutTitle}</h2>
        <p className="home-mobile__body">{t.homeMobileAboutBody}</p>
        <Link
          className="home-mobile__cta-line home-mobile__cta-line--ink"
          to={pathFromView({ kind: "about" }, locale)}
        >
          <span>{t.startBrief}</span>
          <span aria-hidden="true">→</span>
        </Link>
        <div className="home-mobile__duo" aria-hidden="true">
          <img src={aboutTall} alt="" className="home-mobile__duo-tall" />
          <img src={aboutSquare} alt="" className="home-mobile__duo-square" />
        </div>
      </section>

      <div className="home-mobile home-mobile--services-head">
        <p className="home-mobile__eyebrow">{t.whatWeDo}</p>
        <h2 className="home-mobile__title home-mobile__title--light">
          {t.homeMobileServicesTitle}
        </h2>
      </div>

      {pages.map((page, i) => {
        const title = t.pages[page.id].title;
        return (
          <Link
            key={page.id}
            className={`tile tile--${i}`}
            to={pathFromView({ kind: "page", id: page.id }, locale)}
            style={{ ["--i" as string]: String(i) }}
            aria-label={`${page.kicker} ${title}`}
          >
            <span className="tile__kicker">
              <span className="tile__kicker-id">{page.kicker}_</span>
              <span className="tile__kicker-step">
                {String(i + 1).padStart(2, "0")}/04
              </span>
            </span>
            <span className="tile__media">
              <img src={page.cover} alt="" />
            </span>
            <span className="tile__title">{title}</span>
          </Link>
        );
      })}

      {proof ? (
        <aside className="home-mobile home-mobile--proof">
          <p className="home-mobile__eyebrow">{t.homeMobileProofKicker}</p>
          <h2 className="home-mobile__title">{proof.client ?? "Europatch"}</h2>
          <p className="home-mobile__proof-value">{proof.value}</p>
          <div className="home-mobile__feature">
            <img src={proofFeature} alt="" />
          </div>
          <p className="home-mobile__body">{t.homeMobileProofStory}</p>
          <div className="home-mobile__duo home-mobile__duo--tight" aria-hidden="true">
            <img src={proofSquare} alt="" className="home-mobile__duo-square" />
            <img src={proofTall} alt="" className="home-mobile__duo-tall" />
          </div>
          <Link
            className="home-mobile__cta-line home-mobile__cta-line--ink"
            to={pathFromView({ kind: "page", id: "social" }, locale)}
          >
            <span>{t.pages.social.title}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </aside>
      ) : null}

      <footer className="home-mobile home-mobile--close">
        <h2 className="home-mobile__display home-mobile__display--sm">
          {t.homeMobileClose}
        </h2>
        <Link
          className="home-mobile__cta-line"
          to={pathFromView({ kind: "about" }, locale)}
        >
          <span>{t.startBrief}</span>
          <span aria-hidden="true">→</span>
        </Link>
        {callHref ? (
          <a className="home-mobile__ghost" href={`tel:${callHref}`}>
            {t.contactCall}
          </a>
        ) : null}
        <p className="home-mobile__place">{t.location}</p>
      </footer>
    </section>
  );
}
