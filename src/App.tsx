import { useCallback, useEffect, useState } from "react";
import { About } from "./components/About";
import { Chrome } from "./components/Chrome";
import { Cursor } from "./components/Cursor";
import { Footer } from "./components/Footer";
import { Preloader } from "./components/Preloader";
import { ServiceList } from "./components/ServicePanel";
import { WorkShow } from "./components/WorkShow";
import { Works } from "./components/Works";
import type { PageId, View } from "./types";

export default function App() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>({ kind: "index" });
  const [aboutRevealed, setAboutRevealed] = useState(false);

  const goIndex = useCallback(() => setView({ kind: "index" }), []);
  const goPage = useCallback((id: PageId) => setView({ kind: "page", id }), []);
  const goAbout = useCallback(
    (interest?: PageId) => setView({ kind: "about", interest }),
    [],
  );
  const toggleAbout = useCallback(() => setAboutRevealed((on) => !on), []);

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
        onGo={setView}
        aboutRevealed={aboutRevealed}
        onToggleAbout={toggleAbout}
      />
      <Works dimmed={view.kind !== "index"} onOpen={goPage} />

      {view.kind === "about" && (
        <About
          revealed={aboutRevealed}
          onClose={goIndex}
          onGo={goPage}
          interest={view.interest}
        />
      )}

      {view.kind === "page" && view.id === "social" && (
        <WorkShow
          id="social"
          onClose={goIndex}
          onNavigate={goPage}
          onBrief={() => goAbout("social")}
        >
          <ServiceList id="social" />
        </WorkShow>
      )}

      {view.kind === "page" && view.id === "content" && (
        <WorkShow
          id="content"
          onClose={goIndex}
          onNavigate={goPage}
          onBrief={() => goAbout("content")}
        >
          <ServiceList id="content" />
        </WorkShow>
      )}

      {view.kind === "page" && view.id === "performance" && (
        <WorkShow
          id="performance"
          onClose={goIndex}
          onNavigate={goPage}
          onBrief={() => goAbout("performance")}
        >
          <ServiceList id="performance" />
        </WorkShow>
      )}

      {view.kind === "page" && view.id === "web" && (
        <WorkShow
          id="web"
          onClose={goIndex}
          onNavigate={goPage}
          onBrief={() => goAbout("web")}
        >
          <ServiceList id="web" />
        </WorkShow>
      )}

      <Footer />
    </div>
  );
}
