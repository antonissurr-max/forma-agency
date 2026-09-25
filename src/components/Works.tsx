import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { pages } from "../site";
import { useLocale } from "../locale";
import { pathFromView } from "../routing";

export function Works({ dimmed }: { dimmed: boolean }) {
  const { locale, t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const proof = t.pages.social.proof;
  const proofFeature = "/images/europatch-bags.webp";

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

  /* Desktop: scroll progress drives circle carousel (center sharp, sides blurred) */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const desktop = window.matchMedia("(min-width: 900px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tiles = () =>
      Array.from(root.querySelectorAll<HTMLElement>(".works__carousel .tile"));

    const reset = () => {
      root.style.removeProperty("--scroll");
      root.style.removeProperty("--active");
      tiles().forEach((tile) => {
        tile.style.removeProperty("--dist");
        tile.style.removeProperty("--abs");
        tile.classList.remove("is-active");
      });
    };

    const update = () => {
      if (!desktop.matches) {
        reset();
        return;
      }

      const list = tiles();
      const last = Math.max(list.length - 1, 1);

      if (reduce.matches) {
        root.style.setProperty("--scroll", "1");
        root.style.setProperty("--active", "0");
        list.forEach((tile, i) => {
          const dist = i;
          tile.style.setProperty("--dist", String(dist));
          tile.style.setProperty("--abs", String(Math.abs(dist)));
          tile.classList.toggle("is-active", i === 0);
        });
        return;
      }

      const total = root.offsetHeight - window.innerHeight;
      const scrolled = Math.min(
        Math.max(-root.getBoundingClientRect().top, 0),
        Math.max(total, 0),
      );
      const p = total > 0 ? scrolled / total : 0;
      const active = p * last;
      root.style.setProperty("--scroll", p.toFixed(4));
      root.style.setProperty("--active", active.toFixed(4));

      list.forEach((tile, i) => {
        const dist = i - active;
        const abs = Math.abs(dist);
        tile.style.setProperty("--dist", dist.toFixed(4));
        tile.style.setProperty("--abs", abs.toFixed(4));
        tile.classList.toggle("is-active", abs < 0.45);
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    desktop.addEventListener("change", onScroll);
    reduce.addEventListener("change", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      desktop.removeEventListener("change", onScroll);
      reduce.removeEventListener("change", onScroll);
      reset();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`works ${dimmed ? "is-dim" : ""}`}
      aria-label={t.sections}
    >
      <div className="works__pin">
        <header ref={heroRef} className="home-mobile home-mobile--hero">
          <h1 className="home-mobile__display">{t.homeMobileHeadline}</h1>
          <p className="home-mobile__lede">{t.homeMobileAboutBody}</p>
          <Link
            className="home-mobile__cta-line"
            to={pathFromView({ kind: "about" }, locale)}
          >
            <span>{t.startBrief}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </header>

        <div className="works__intro">
          <p className="works__pitch">{t.aboutSub}</p>
        </div>

        <div className="home-mobile home-mobile--services-head">
          <h2 className="home-mobile__title home-mobile__title--light">
            {t.whatWeDo}
          </h2>
        </div>

        <div className="works__carousel">
          {pages.map((page, i) => {
            const title = t.pages[page.id].title;
            return (
              <Link
                key={page.id}
                className={`tile tile--${i}`}
                to={pathFromView({ kind: "page", id: page.id }, locale)}
                style={{ ["--i" as string]: String(i) }}
                aria-label={title}
              >
                <span className="tile__media">
                  <img src={page.cover} alt="" />
                </span>
                <span className="tile__title">{title}</span>
              </Link>
            );
          })}
        </div>

        {proof ? (
          <aside className="home-mobile home-mobile--proof">
            <p className="home-mobile__eyebrow">{t.homeMobileProofKicker}</p>
            <h2 className="home-mobile__title">{proof.client ?? "Europatch"}</h2>
            <p className="home-mobile__proof-value">{proof.value}</p>
            <div className="home-mobile__feature">
              <img src={proofFeature} alt="" />
            </div>
            <p className="home-mobile__body">{t.homeMobileProofStory}</p>
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
        </footer>
      </div>
    </section>
  );
}
