import { useEffect, useRef, useState } from "react";
import { pages, site } from "../site";
import { Logo } from "./Logo";

const STORAGE_KEY = "omnidot-intro-seen";

export function shouldShowIntro(isHome: boolean): boolean {
  if (typeof window === "undefined") return false;
  if (!isHome) return false;
  try {
    if (window.localStorage.getItem(STORAGE_KEY) === "1") return false;
  } catch {
    return false;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return true;
}

function markIntroSeen() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore quota / private mode */
  }
}

function preloadCovers() {
  pages.forEach((page) => {
    const img = new Image();
    img.src = page.cover;
  });
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);
  const finished = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    markIntroSeen();
    onDoneRef.current();
  };

  useEffect(() => {
    preloadCovers();

    const exitAt = window.setTimeout(() => setExiting(true), 1280);
    const doneAt = window.setTimeout(finish, 1780);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setExiting(true);
        window.setTimeout(finish, 320);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(exitAt);
      window.clearTimeout(doneAt);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      className={`preloader${exiting ? " is-exit" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={site.brand}
      onClick={() => {
        setExiting(true);
        window.setTimeout(finish, 320);
      }}
    >
      <div className="preloader__stage">
        <Logo className="preloader__mark" />
        <p className="preloader__brand">
          {site.brand}
          <span className="preloader__dot">.</span>
        </p>
      </div>
    </div>
  );
}
