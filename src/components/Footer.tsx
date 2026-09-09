import { site } from "../site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-foot">
      <p>
        © {year} {site.brand}. All rights reserved.
      </p>
    </footer>
  );
}
