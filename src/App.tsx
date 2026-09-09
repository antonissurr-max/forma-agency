import { useCallback, useEffect, useState } from "react";
import { About } from "./components/About";
import { Chrome } from "./components/Chrome";
import { Contact } from "./components/Contact";
import { Cursor } from "./components/Cursor";
import { Footer } from "./components/Footer";
import { Preloader } from "./components/Preloader";
import { PerformancePanel, ServiceList } from "./components/ServicePanel";
import { WorkShow } from "./components/WorkShow";
import { Works } from "./components/Works";
import { socialWork, videoWork } from "./site";
import type { PageId, View } from "./types";

export default function App() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>({ kind: "index" });

  const goIndex = useCallback(() => setView({ kind: "index" }), []);
  const goPage = useCallback((id: PageId) => setView({ kind: "page", id }), []);

  useEffect(() => {
    document.body.style.overflow = view.kind === "index" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [view.kind]);

  useEffect(() => {
    if (view.kind !== "about") return;
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
      <Chrome view={view} onGo={setView} />
      <Works dimmed={view.kind !== "index"} onOpen={goPage} />

      {view.kind === "about" && <About onClose={goIndex} onGo={goPage} />}

      {view.kind === "page" && view.id === "social" && (
        <WorkShow id="social" media={socialWork} onClose={goIndex} onNavigate={goPage}>
          <ServiceList id="social" />
        </WorkShow>
      )}

      {view.kind === "page" && view.id === "video" && (
        <WorkShow id="video" media={videoWork} onClose={goIndex} onNavigate={goPage}>
          <ServiceList id="video" />
        </WorkShow>
      )}

      {view.kind === "page" && view.id === "performance" && (
        <WorkShow id="performance" onClose={goIndex} onNavigate={goPage}>
          <ServiceList id="performance" />
          <PerformancePanel />
        </WorkShow>
      )}

      {view.kind === "page" && view.id === "web" && (
        <WorkShow id="web" onClose={goIndex} onNavigate={goPage}>
          <ServiceList id="web" />
          <Contact />
        </WorkShow>
      )}

      <Footer />
    </div>
  );
}
