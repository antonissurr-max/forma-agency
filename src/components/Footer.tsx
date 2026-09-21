import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { formatPhoneDisplay, pages, phoneHref, site } from "../site";
import { useLocale } from "../locale";
import { pathFromView } from "../routing";

function IconPin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.5c-3.4 0-6.2 2.7-6.2 6.1 0 4.4 5.4 11.2 5.7 11.5a.7.7 0 0 0 1 0c.3-.3 5.7-7.1 5.7-11.5 0-3.4-2.8-6.1-6.2-6.1Zm0 8.4a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6Z"
      />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.2 3.6c.4-.4 1-.5 1.5-.3l2.2 1c.5.2.8.7.8 1.2v2.3c0 .4-.2.8-.6 1l-1.3.7a11.4 11.4 0 0 0 5.1 5.1l.7-1.3c.2-.4.6-.6 1-.6h2.3c.5 0 1 .3 1.2.8l1 2.2c.2.5.1 1.1-.3 1.5l-1.2 1.2c-.4.4-1 .6-1.6.5-3.3-.4-6.4-2.2-8.8-4.6S4.1 9.4 3.7 6.1c-.1-.6.1-1.2.5-1.6l1-1Z"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Zm2.2.5 5.3 3.7c.3.2.7.2 1 0L18 7H6.2Zm12.3 1.7-5.5 3.8a2.2 2.2 0 0 1-2.4 0L5.1 8.7V17c0 .3.2.5.5.5h13c.3 0 .5-.2.5-.5V8.7Z"
      />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { locale, t } = useLocale();
  const callHref = site.phone ? phoneHref(site.phone) : "";
  const callLabel = site.phone ? formatPhoneDisplay(site.phone) : "";

  return (
    <footer className="site-foot">
      <div className="site-foot__inner">
        <div className="site-foot__brand">
          <Link
            className="site-foot__mark"
            to={pathFromView({ kind: "index" }, locale)}
            aria-label={t.homeAria}
          >
            <Logo className="site-foot__logo" />
            <span className="site-foot__name">
              {site.brand}
              <span className="site-foot__dot">.</span>
            </span>
          </Link>
          <p className="site-foot__tag">{t.footerStudio}</p>
          <p className="site-foot__blurb">{t.aboutSub}</p>
        </div>

        <div className="site-foot__col">
          <h3 className="site-foot__heading">{t.footerMenu}</h3>
          <nav className="site-foot__list" aria-label={t.footerMenu}>
            <Link to={pathFromView({ kind: "index" }, locale)}>
              {t.footerHome}
            </Link>
            <Link to={pathFromView({ kind: "about" }, locale)}>{t.about}</Link>
            <Link to={pathFromView({ kind: "about" }, locale)}>
              {t.startBrief}
            </Link>
          </nav>
        </div>

        <div className="site-foot__col">
          <h3 className="site-foot__heading">{t.footerServices}</h3>
          <nav className="site-foot__list" aria-label={t.footerServices}>
            {pages.map((page) => (
              <Link
                key={page.id}
                to={pathFromView({ kind: "page", id: page.id }, locale)}
              >
                {t.pages[page.id].title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="site-foot__col">
          <h3 className="site-foot__heading">{t.footerContact}</h3>
          <ul className="site-foot__contact">
            <li>
              <span className="site-foot__icon" aria-hidden="true">
                <IconPin />
              </span>
              <span>{t.location}</span>
            </li>
            {callHref ? (
              <li>
                <span className="site-foot__icon" aria-hidden="true">
                  <IconPhone />
                </span>
                <a href={`tel:${callHref}`}>{callLabel}</a>
              </li>
            ) : null}
            {site.email ? (
              <li>
                <span className="site-foot__icon" aria-hidden="true">
                  <IconMail />
                </span>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <p className="site-foot__copy">
        © {year} {site.brand}. {t.rights}
      </p>
    </footer>
  );
}
