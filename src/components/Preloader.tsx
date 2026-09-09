import { useEffect, useRef, useState } from "react";
import { socialWork } from "../site";
import { Logo } from "./Logo";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      done.current();
      return;
    }

    const images = socialWork.map((w) => {
      const img = new Image();
      img.src = w.src;
      return img;
    });

    let current = 0;
    const tick = window.setInterval(() => {
      const loaded = images.filter((img) => img.complete).length;
      const fromImages = Math.round((loaded / images.length) * 100);
      current = Math.min(100, current + 4);
      const next = Math.min(100, Math.max(current, fromImages));
      setPct(next);
      if (next >= 100) {
        window.clearInterval(tick);
        window.setTimeout(() => done.current(), 240);
      }
    }, 36);

    return () => window.clearInterval(tick);
  }, []);

  return (
    <div className="preloader" role="status" aria-live="polite">
      <Logo className="preloader__mark" />
      <span className="preloader__pct">{pct}</span>
    </div>
  );
}
