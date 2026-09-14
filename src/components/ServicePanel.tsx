import { useState } from "react";
import { useLocale } from "../locale";
import type { PageId } from "../types";

function FactRow({
  index,
  title,
  detail,
  body,
}: {
  index: number;
  title: string;
  detail: string;
  body: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <li className={`facts__item${open ? " is-open" : ""}`}>
      <button
        className="facts__hit"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((on) => !on)}
      >
        <span className="facts__index">{String(index).padStart(2, "0")}</span>
        <span className="facts__copy">
          <span className="facts__line">
            <strong>{title}</strong>
            <span className="facts__detail"> — {detail}</span>
          </span>
          <span className="facts__body">
            <span>{body}</span>
          </span>
        </span>
        <span className="facts__chev" aria-hidden="true" />
      </button>
    </li>
  );
}

export function ServiceList({ id }: { id: PageId }) {
  const { t } = useLocale();
  const items = t.pages[id].points;

  return (
    <div className="about about--compact">
      <h3 className="about__sub">{t.whatWeDo}</h3>
      <ol className="facts facts--on-dark">
        {items.map((item, i) => (
          <FactRow
            key={item.name}
            index={i + 1}
            title={item.name}
            detail={item.detail}
            body={item.body}
          />
        ))}
      </ol>
    </div>
  );
}
