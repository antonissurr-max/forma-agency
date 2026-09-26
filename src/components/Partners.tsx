import { partners } from "../site";
import { useLocale } from "../locale";

export function Partners() {
  const { t } = useLocale();

  return (
    <section className="partners" aria-label={t.trustedBy}>
      <div className="partners__inner">
        <header className="partners__head">
          <h2 className="partners__title">{t.trustedBy}</h2>
          <p className="partners__body">{t.trustedByBody}</p>
        </header>
        <ul className="partners__list">
          {partners.map((partner) => (
            <li key={partner.name}>
              <a
                className="partners__link"
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                title={partner.name}
              >
                <img src={partner.logo} alt={partner.name} width={200} height={48} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
