import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { About } from "./components/About";
import { Chrome } from "./components/Chrome";
import { Cursor } from "./components/Cursor";
import { Footer } from "./components/Footer";
import { NotFound } from "./components/NotFound";
import { Partners } from "./components/Partners";
import { Preloader, shouldShowIntro } from "./components/Preloader";
import { Pricing } from "./components/Pricing";
import { ServiceList } from "./components/ServicePanel";
import { WorkShow } from "./components/WorkShow";
import { Works } from "./components/Works";
import { useLocale } from "./locale";
import { pathFromView, viewFromLocation } from "./routing";
import { applyDocumentSeo } from "./seo";
import type { PageId, View } from "./types";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { locale } = useLocale();

  const view = viewFromLocation(location.pathname, location.search);
  const [ready, setReady] = useState(
    () => !shouldShowIntro(viewFromLocation(location.pathname, location.search).kind === "index"),
  );
  const [aboutRevealed, setAboutRevealed] = useState(false);
  const [panelExit, setPanelExit] = useState(false);
  const panelExitTimer = useRef<number | null>(null);

  const goView = useCallback(
    (next: View) => {
      navigate(pathFromView(next, locale));
    },
    [navigate, locale],
  );
  const goIndex = useCallback(() => {
    const fromPanel =
      view.kind === "page" || view.kind === "about" || view.kind === "pricing";
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!fromPanel || reduce) {
      navigate(pathFromView({ kind: "index" }, locale));
      return;
    }

    if (panelExitTimer.current != null) return;
    setPanelExit(true);
    panelExitTimer.current = window.setTimeout(() => {
      panelExitTimer.current = null;
      setPanelExit(false);
      navigate(pathFromView({ kind: "index" }, locale));
    }, 340);
  }, [navigate, locale, view.kind]);
  const goPage = useCallback(
    (id: PageId) => {
      setPanelExit(false);
      if (panelExitTimer.current != null) {
        window.clearTimeout(panelExitTimer.current);
        panelExitTimer.current = null;
      }
      navigate(pathFromView({ kind: "page", id }, locale));
    },
    [navigate, locale],
  );
  const goAbout = useCallback(
    (interest?: PageId) => {
      setPanelExit(false);
      if (panelExitTimer.current != null) {
        window.clearTimeout(panelExitTimer.current);
        panelExitTimer.current = null;
      }
      navigate(pathFromView({ kind: "about", interest }, locale));
    },
    [navigate, locale],
  );
  const toggleAbout = useCallback(() => setAboutRevealed((on) => !on), []);

  useEffect(() => {
    return () => {
      if (panelExitTimer.current != null) {
        window.clearTimeout(panelExitTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    applyDocumentSeo(locale, viewFromLocation(location.pathname, location.search));
  }, [locale, location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow =
      view.kind === "index" || view.kind === "notfound" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [view.kind]);

  useEffect(() => {
    const stage = document.querySelector(".stage");
    const foot = document.querySelector(".site-foot");
    if (!stage || !foot || view.kind !== "index") {
      stage?.classList.remove("is-foot-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        stage.classList.toggle(
          "is-foot-visible",
          Boolean(entry?.isIntersecting),
        );
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(foot);
    return () => {
      observer.disconnect();
      stage.classList.remove("is-foot-visible");
    };
  }, [view.kind]);

  useEffect(() => {
    if (view.kind !== "about") {
      setAboutRevealed(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") goIndex();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view.kind, goIndex]);

  useEffect(() => {
    if (view.kind !== "pricing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") goIndex();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view.kind, goIndex]);

  const stage =
    view.kind === "index"
      ? "is-index"
      : view.kind === "about"
        ? "is-about"
        : view.kind === "pricing"
          ? "is-pricing"
          : view.kind === "notfound"
            ? "is-notfound"
            : "is-work";

  return (
    <div className={`stage ${stage} ${ready ? "is-ready" : ""}`}>
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <Cursor />
      <Chrome
        view={view}
        onGo={goView}
        aboutRevealed={aboutRevealed}
        onToggleAbout={toggleAbout}
      />
      <Works dimmed={view.kind !== "index"} />

      {view.kind === "about" && (
        <About
          revealed={aboutRevealed}
          exiting={panelExit}
          onClose={goIndex}
          onGo={goPage}
          onToggleReveal={toggleAbout}
          interest={view.interest}
        />
      )}

      {view.kind === "pricing" && (
        <Pricing
          ready={ready}
          exiting={panelExit}
          onClose={goIndex}
          onBrief={goAbout}
        />
      )}

      {view.kind === "page" && (
        <WorkShow
          id={view.id}
          exiting={panelExit}
          onClose={goIndex}
          onNavigate={goPage}
          onBrief={() => goAbout(view.id)}
        >
          <ServiceList id={view.id} />
        </WorkShow>
      )}

      {view.kind === "notfound" && <NotFound />}

      <Partners />
      <Footer />
    </div>
  );
}
