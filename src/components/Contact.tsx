import { FormEvent, useState } from "react";
import { site } from "../site";
import { useLocale } from "../locale";
import type { PageId } from "../types";

type Status = "idle" | "sent";

const interestIds: (PageId | "full")[] = [
  "social",
  "content",
  "performance",
  "web",
  "full",
];

export function Contact({
  tone = "dark",
  interest,
}: {
  tone?: "dark" | "paper";
  interest?: PageId;
}) {
  const { t, locale } = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const onPaper = tone === "paper";

  function interestLabel(id: PageId | "full") {
    return id === "full" ? t.contactFull : t.pages[id].title;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const interestId = String(form.get("interest") ?? "") as PageId | "full";
    const data = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
      interest: interestLabel(interestId),
      notes: String(form.get("notes") ?? ""),
    };

    const labels =
      locale === "el"
        ? ["Brief έργου — omnidot.", "Όνομα", "Email", "Εταιρεία", "Ενδιαφέρον", "Σημειώσεις"]
        : ["Project brief — omnidot.", "Name", "Email", "Company", "Interest", "Notes"];

    const message = [
      labels[0],
      "",
      `${labels[1]}: ${data.name}`,
      `${labels[2]}: ${data.email}`,
      `${labels[3]}: ${data.company || "—"}`,
      `${labels[4]}: ${data.interest}`,
      data.notes ? `${labels[5]}: ${data.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const subject = `omnidot. — ${data.interest}`;
    const wa = (site.whatsapp || site.phone).replace(/\D/g, "");

    if (wa) {
      const intl = wa.startsWith("30") ? wa : `30${wa}`;
      window.open(
        `https://wa.me/${intl}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
    } else if (site.email) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className={`booking${onPaper ? " booking--on-paper" : ""}`}>
        <p className={`lede${onPaper ? "" : " lede--on-dark"}`}>{t.contactThanks}</p>
      </div>
    );
  }

  return (
    <div className={`booking${onPaper ? " booking--on-paper" : ""}`}>
      <p className={`lede${onPaper ? "" : " lede--on-dark"}`}>{t.contactLede}</p>

      <form
        className={`form${onPaper ? " form--on-paper" : " form--on-dark"}`}
        onSubmit={onSubmit}
        key={interest ?? "full"}
      >
        <label>
          {t.contactInterest}
          <select name="interest" defaultValue={interest ?? "full"} required>
            {interestIds.map((id) => (
              <option key={id} value={id}>
                {interestLabel(id)}
              </option>
            ))}
          </select>
        </label>

        <label>
          {t.contactName}
          <input name="name" type="text" autoComplete="name" required />
        </label>

        <div className="form__row">
          <label>
            {t.contactEmail}
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            {t.contactCompany} <span className="optional">{t.contactOptional}</span>
            <input name="company" type="text" autoComplete="organization" />
          </label>
        </div>

        <label>
          {t.contactBrief} <span className="optional">{t.contactOptional}</span>
          <textarea name="notes" rows={onPaper ? 2 : 3} placeholder={t.contactPlaceholder} />
        </label>

        <button className={`btn${onPaper ? " btn--ink" : " btn--light"}`} type="submit">
          {t.contactSend}
        </button>
        {site.email && (
          <a className="booking__mail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        )}
      </form>
    </div>
  );
}
