import { useState } from "react";
import { site } from "../site";
import type { PageId } from "../types";

type StayWord = { kind: "stay"; open: string; close?: string };
type GoWord = { kind: "go"; open: string };
type ComeWord = { kind: "come"; close: string };
type Word = StayWord | GoWord | ComeWord;

type VerseRow = {
  id: string;
  openRow: number;
  closeRow: number;
  openOnly?: boolean;
  words: Word[];
};

const verseRows: VerseRow[] = [
  {
    id: "we",
    openRow: 0,
    closeRow: 0,
    words: [
      { kind: "go", open: "We are\u00A0" },
      { kind: "stay", open: "a\u00A0", close: "A\u00A0" },
      { kind: "stay", open: "studio" },
    ],
  },
  {
    id: "builds",
    openRow: 1,
    closeRow: 1,
    words: [
      { kind: "stay", open: "that builds\u00A0" },
      { kind: "go", open: "campaigns" },
      { kind: "come", close: "brands" },
    ],
  },
  {
    id: "with",
    openRow: 2,
    closeRow: 1,
    openOnly: true,
    words: [{ kind: "stay", open: "with clarity" }],
  },
  {
    id: "across",
    openRow: 3,
    closeRow: 1,
    openOnly: true,
    words: [{ kind: "stay", open: "across channels" }],
  },
  {
    id: "outcomes",
    openRow: 4,
    closeRow: 1,
    openOnly: true,
    words: [{ kind: "stay", open: "and real outcomes" }],
  },
];

function VerseWord({ word, revealed }: { word: Word; revealed: boolean }) {
  if (word.kind === "stay") {
    const same = !word.close || word.close === word.open;
    if (same) {
      return <span className="about-verse__word about-verse__word--stay">{word.open}</span>;
    }
    return (
      <span className="about-verse__word about-verse__word--stay">
        <span className="about-verse__swap about-verse__swap--open">{word.open}</span>
        <span className="about-verse__swap about-verse__swap--close">{word.close}</span>
      </span>
    );
  }

  if (word.kind === "go") {
    return <span className="about-verse__word about-verse__word--go">{word.open}</span>;
  }

  return (
    <span className="about-verse__word about-verse__word--come" aria-hidden={!revealed}>
      {word.close}
    </span>
  );
}

export function About({
  onClose,
  onGo,
}: {
  onClose: () => void;
  onGo: (id: PageId) => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="about-layer" role="dialog" aria-modal="true" aria-label="About">
      <button className="about-layer__close" type="button" onClick={onClose}>
        Close
      </button>

      <div className={`about-layer__center ${revealed ? "is-revealed" : ""}`}>
        <h2 className="about-layer__title">
          <span className="about-verse" aria-live="polite">
            {verseRows.map((row) => (
              <span
                key={row.id}
                className={`about-verse__row${row.openOnly ? " about-verse__row--open-only" : ""}`}
                style={{
                  ["--row-open" as string]: String(row.openRow),
                  ["--row-close" as string]: String(row.closeRow),
                }}
              >
                {row.words.map((word, i) => (
                  <VerseWord key={`${row.id}-${i}`} word={word} revealed={revealed} />
                ))}
              </span>
            ))}
          </span>
        </h2>

        <p className="about-layer__sub">
          Social, video, performance, websites and SEO — one system for brands that want to move.
          <br />
          {site.location}
        </p>

        <ul className="about-layer__links">
          <li>
            <button type="button" onClick={() => onGo("social")}>
              Social ↗
            </button>
          </li>
          <li>
            <button type="button" onClick={() => onGo("video")}>
              Video ↗
            </button>
          </li>
          <li>
            <button type="button" onClick={() => onGo("performance")}>
              Performance ↗
            </button>
          </li>
          <li>
            <button type="button" onClick={() => onGo("web")}>
              Web &amp; SEO ↗
            </button>
          </li>
        </ul>

        <button
          type="button"
          className="about-layer__dot"
          onClick={() => setRevealed((on) => !on)}
          aria-label={revealed ? "Show full message" : "Reveal shorter message"}
          aria-pressed={revealed}
        />
      </div>
    </div>
  );
}
