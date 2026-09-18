import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { pages, phoneHref, site } from "../site";
import { useLocale } from "../locale";
import { pathFromView } from "../routing";
import { Logo } from "./Logo";

export function Works({ dimmed }: { dimmed: boolean }) {
  const { locale, t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const proof = t.pages.social.proof;
  const callHref = phoneHref(site.phone);

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

  return (
    <section
      ref={sectionRef}
      className={`works ${dimmed ? "is-dim" : ""}`}
      aria-label={t.sections}
    >
      <header className="home-mobile">
        <Logo className="home-mobile__mark" />
        <p className="home-mobile__brand">
          {site.brand}
          <span className="home-mobile__dot">.</span>
        </p>
        <p className="home-mobile__headline">{t.homeMobileHeadline}</p>
        <p className="home-mobile__lede">{t.aboutSub}</p>
        <div className="home-mobile__cta">
          <Link
            className="home-mobile__btn"
            to={pathFromView({ kind: "about" }, locale)}
          >
            {t.startBrief} ↗
          </Link>
          {callHref ? (
            <a className="home-mobile__link" href={`tel:${callHref}`}>
              {t.contactCall}
            </a>
          ) : null}
        </div>
      </header>

      <div className="works__intro">
        <p className="works__pitch">{t.aboutSub}</p>
      </div>

      <p className="home-mobile__section">{t.whatWeDo}</p>

      {pages.map((page, i) => {
        const title = t.pages[page.id].title;
        return (
          <Link
            key={page.id}
            className={`tile tile--${i}`}
            to={pathFromView({ kind: "page", id: page.id }, locale)}
            style={{
              ["--i" as string]: String(i),
            }}
            aria-label={`${page.kicker} ${title}`}
          >
            <span className="tile__kicker">{page.kicker}_</span>
            <span className="tile__media">
              <img src={page.cover} alt="" />
            </span>
            <span className="tile__title">{title}</span>
          </Link>
        );
      })}

      {proof ? (
        <aside className="home-mobile__proof">
          <p className="home-mobile__section">{t.homeMobileProofKicker}</p>
          <p className="home-mobile__proof-client">{proof.client ?? "Europatch"}</p>
          <p className="home-mobile__proof-value">{proof.value}</p>
          <p className="home-mobile__proof-story">{t.homeMobileProofStory}</p>
          <Link
            className="home-mobile__link"
            to={pathFromView({ kind: "page", id: "social" }, locale)}
          >
            {t.pages.social.title} ↗
          </Link>
        </aside>
      ) : null}

      <footer className="home-mobile__close">
        <p className="home-mobile__headline home-mobile__headline--sm">
          {t.homeMobileClose}
        </p>
        <Link
          className="home-mobile__btn"
          to={pathFromView({ kind: "about" }, locale)}
        >
          {t.startBrief} ↗
        </Link>
        <p className="home-mobile__place">{t.location}</p>
      </footer>
    </section>
  );
}
