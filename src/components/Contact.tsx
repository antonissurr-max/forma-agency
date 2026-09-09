import { FormEvent, useState } from "react";
import { site } from "../site";

type Status = "idle" | "sent";

function buildMessage(data: Record<string, string>) {
  return [
    "Project brief — FORMA",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company: ${data.company || "—"}`,
    `Interest: ${data.interest}`,
    data.notes ? `Notes: ${data.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
      interest: String(form.get("interest") ?? ""),
      notes: String(form.get("notes") ?? ""),
    };

    const message = buildMessage(data);
    const subject = `FORMA — ${data.interest}`;
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
      <div className="booking">
        <p className="lede lede--on-dark">
          Thanks — we&apos;ll get back with next steps.
        </p>
      </div>
    );
  }

  return (
    <div className="booking">
      <p className="lede lede--on-dark">
        Tell us what you need. We reply with a clear plan — no fluff.
      </p>

      <form className="form form--on-dark" onSubmit={onSubmit}>
        <label>
          Interest
          <select name="interest" defaultValue="Web & SEO" required>
            <option>Social</option>
            <option>Video</option>
            <option>Performance</option>
            <option>Web & SEO</option>
            <option>Full partnership</option>
          </select>
        </label>

        <label>
          Name
          <input name="name" type="text" autoComplete="name" required />
        </label>

        <div className="form__row">
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Company <span className="optional">optional</span>
            <input name="company" type="text" autoComplete="organization" />
          </label>
        </div>

        <label>
          Brief <span className="optional">optional</span>
          <textarea name="notes" rows={3} placeholder="Goals, timeline, links…" />
        </label>

        <button className="btn btn--light" type="submit">
          Send brief
        </button>
      </form>
    </div>
  );
}
