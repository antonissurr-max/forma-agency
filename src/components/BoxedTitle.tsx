/** Word-level boxed title — like A M PHOTOGRAPHER */
export function BoxedTitle({ text }: { text: string }) {
  const words = text.toUpperCase().split(/\s+/).filter(Boolean);

  return (
    <h1 className="boxed-title" aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="boxed-title__word"
          style={{ ["--d" as string]: `${i * 80}ms` }}
        >
          {word}
        </span>
      ))}
    </h1>
  );
}
