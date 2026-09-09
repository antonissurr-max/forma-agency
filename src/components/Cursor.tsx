import { useEffect, useState } from "react";

export function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [on, setOn] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      setOn(true);
      setPos({ x: e.clientX, y: e.clientY });
      const t = e.target;
      setHot(t instanceof Element && Boolean(t.closest("a, button, .tile")));
    };
    window.addEventListener("pointermove", move);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
    };
  }, []);

  if (!on) return null;

  return (
    <div
      className={`cursor ${hot ? "is-hot" : ""}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      aria-hidden="true"
    />
  );
}
