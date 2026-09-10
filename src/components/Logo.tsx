/** Two nodes, one link — a connection. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7.5" cy="12" r="2.35" fill="currentColor" />
      <circle cx="16.5" cy="12" r="2.35" fill="currentColor" />
      <path
        d="M9.85 12h4.3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
