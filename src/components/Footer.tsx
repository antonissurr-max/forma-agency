import { site } from "../site";
import { useLocale } from "../locale";

export function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLocale();

  return (
    <footer className="site-foot">
      <p>
        © {year} {site.brand}. {t.rights}
      </p>
    </footer>
  );
}
