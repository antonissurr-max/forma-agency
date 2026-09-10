import { site } from "../site";
import { useLocale } from "../locale";

export function BrandWord({
  live = false,
  revealed = false,
  onToggle,
}: {
  live?: boolean;
  revealed?: boolean;
  onToggle?: () => void;
}) {
  const { t } = useLocale();

  return (
    <span className={`brand-word${live ? " is-live" : ""}`}>
      <span className="brand-word__name">{site.brand}</span>
      {live ? (
        <button
          className="brand-word__dot"
          type="button"
          aria-pressed={revealed}
          aria-label={revealed ? t.revealFull : t.revealShort}
          onClick={onToggle}
        />
      ) : (
        <span className="brand-word__dot" aria-hidden="true" />
      )}
    </span>
  );
}
