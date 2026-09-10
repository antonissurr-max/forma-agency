import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { About } from "./components/About";
import { Chrome } from "./components/Chrome";
import { Cursor } from "./components/Cursor";
import { Footer } from "./components/Footer";
import { Preloader } from "./components/Preloader";
import { ServiceList } from "./components/ServicePanel";
import { WorkShow } from "./components/WorkShow";
import { Works } from "./components/Works";
import { useLocale } from "./locale";
import { pathFromView, viewFromLocation } from "./routing";
import { applyDocumentSeo } from "./seo";
import type { PageId, View } from "./types";

export default function App() {
  const [ready, setReady] = useState(false);
  const [aboutRevealed, setAboutRevealed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { locale } = useLocale();

  const view = viewFromLocation(location.pathname, location.search);

  const goView = useCallback(
    (next: View) => {
      navigate(pathFromView(next));
    },
    [navigate],
  );
  const goIndex = useCallback(() => navigate("/"), [navigate]);
  const goPage = useCallback((id: PageId) => navigate(`/${id}`), [navigate]);
  const goAbout = useCallback(
    (interest?: PageId) => {
      navigate(interest ? `/about?interest=${interest}` : "/about");
    },
    [navigate],
  );
  const toggleAbout = useCallback(() => setAboutRevealed((on) => !on), []);

  useEffect(() => {
    applyDocumentSeo(locale, viewFromLocation(location.pathname, location.search));
  }, [locale, location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = view.kind === "index" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
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

  const stage =
    view.kind === "index"
      ? "is-index"
      : view.kind === "about"
        ? "is-about"
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
          onClose={goIndex}
          onGo={goPage}
          interest={view.interest}
        />
      )}

      {view.kind === "page" && (
        <WorkShow
          id={view.id}
          onClose={goIndex}
          onNavigate={goPage}
          onBrief={() => goAbout(view.id)}
        >
          <ServiceList id={view.id} />
        </WorkShow>
      )}

      <Footer />
    </div>
  );
}
