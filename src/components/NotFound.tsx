import { Link } from "react-router-dom";
import { useLocale } from "../locale";
import { pathFromView } from "../routing";

export function NotFound() {
  const { locale, t } = useLocale();

  return (
    <div className="notfound" role="status">
      <p className="notfound__code">404</p>
      <h1 className="notfound__title">{t.notFoundTitle}</h1>
      <p className="notfound__body">{t.notFoundBody}</p>
      <Link className="notfound__home" to={pathFromView({ kind: "index" }, locale)}>
        {t.notFoundHome} ↗
      </Link>
    </div>
  );
}
