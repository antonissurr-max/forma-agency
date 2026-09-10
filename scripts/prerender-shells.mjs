import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const origin = "https://omnidot.pages.dev";

const nav = [
  { href: "/social", label: "Social Media Management" },
  { href: "/content", label: "Content Creation" },
  { href: "/performance", label: "Performance Marketing" },
  { href: "/web", label: "Web Development" },
  { href: "/about", label: "About / Contact" },
];

/** Keep in sync with EN copy in src/i18n.ts - build-time crawlable shells. */
const shells = [
  {
    path: "/",
    file: "index.html",
    title: "omnidot. - Marketing agency",
    description:
      "omnidot. - marketing agency for social media, content creation, performance marketing and web development.",
    image: `${origin}/images/work-omnidot.jpg`,
    h1: "omnidot.",
    body: "Web, SEO, social and performance — one partner for brands that want to grow. Marketing agency in Athens and remote for founders and local brands.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "omnidot.",
      url: origin,
      description:
        "omnidot. - marketing agency for social media, content creation, performance marketing and web development.",
      email: "antonissur@yahoo.gr",
      image: `${origin}/images/work-omnidot.jpg`,
    },
  },
  {
    path: "/social",
    file: "social/index.html",
    title: "Social Media Management - omnidot.",
    description:
      "Social Media Management - We define how the brand should sound and look online, which themes actually matter, and a calendar that can be kept.",
    image: `${origin}/images/social.jpg`,
    h1: "Social Media Management",
    body: "We define how the brand should sound and look online, which themes actually matter, and a calendar that can be kept — not a wish list. Strategy, publishing, growth and monthly reporting from omnidot.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Social Media Management",
      provider: { "@type": "Organization", name: "omnidot.", url: origin },
      areaServed: "GR",
      url: `${origin}/social`,
      image: `${origin}/images/social.jpg`,
    },
  },
  {
    path: "/content",
    file: "content/index.html",
    title: "Content Creation - omnidot.",
    description:
      "Content Creation - Before anyone shoots, we lock the idea, the story, and the shots for social, ads and the site.",
    image: `${origin}/images/content.jpg`,
    h1: "Content Creation",
    body: "Before anyone shoots, we lock the idea, the story, and the shots for social, ads and the site. Content creation by omnidot. for brands that need clarity before production.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Content Creation",
      provider: { "@type": "Organization", name: "omnidot.", url: origin },
      areaServed: "GR",
      url: `${origin}/content`,
      image: `${origin}/images/content.jpg`,
    },
  },
  {
    path: "/performance",
    file: "performance/index.html",
    title: "Performance Marketing - omnidot.",
    description:
      "Performance Marketing - We set up and run paid social and search so spend has a job: traffic, leads or sales.",
    image: `${origin}/images/performance.jpg`,
    h1: "Performance Marketing",
    body: "We set up and run paid social and search so spend has a job: traffic, leads or sales. Performance marketing with clear cost, return and next moves for founders.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Performance Marketing",
      provider: { "@type": "Organization", name: "omnidot.", url: origin },
      areaServed: "GR",
      url: `${origin}/performance`,
      image: `${origin}/images/performance.jpg`,
    },
  },
  {
    path: "/web",
    file: "web/index.html",
    title: "Web Development - omnidot.",
    description:
      "Web Development - We build sites that load quickly, read clearly, and ask for the right action.",
    image: `${origin}/images/web.jpg`,
    h1: "Web Development",
    body: "We build sites that load quickly, read clearly, and ask for the right action. Editorial web design and development from omnidot. — convert, not decorate.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Web Development",
      provider: { "@type": "Organization", name: "omnidot.", url: origin },
      areaServed: "GR",
      url: `${origin}/web`,
      image: `${origin}/images/web.jpg`,
    },
  },
  {
    path: "/about",
    file: "about/index.html",
    title: "About - omnidot.",
    description:
      "For founders and local brands that want a clear next step - not another report. From websites and SEO to social and performance.",
    image: `${origin}/images/work-omnidot.jpg`,
    h1: "About omnidot.",
    body: "For founders and local brands that want a clear next step — not another report. From a premium, fast website and SEO to social strategy and performance campaigns. Start a brief with omnidot.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About",
      url: `${origin}/about`,
      isPartOf: { "@type": "WebSite", name: "omnidot.", url: origin },
    },
  },
];

const template = stripPrior(readFileSync(join(dist, "index.html"), "utf8"));

function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function stripPrior(html) {
  return html
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, "")
    .replace(/<meta\s+property="og:url"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="twitter:title"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="twitter:description"[^>]*>\s*/gi, "")
    .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, "")
    .replace(/<main\s+id="prerender">[\s\S]*?<\/main>\s*/gi, "");
}

function crawlBody(shell) {
  const links = nav
    .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
    .join(" · ");
  return [
    `<main id="prerender">`,
    `<h1>${escapeHtml(shell.h1)}</h1>`,
    `<p>${escapeHtml(shell.body)}</p>`,
    `<nav aria-label="Services">${links}</nav>`,
    `</main>`,
  ].join("");
}

function patchHtml(html, shell) {
  const canonical = `${origin}${shell.path === "/" ? "/" : shell.path}`;
  let out = stripPrior(html);
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(shell.title)}</title>`);
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeAttr(shell.description)}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeAttr(shell.title)}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeAttr(shell.description)}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${escapeAttr(shell.image)}" />`,
  );
  out = out.replace(
    /<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:card" content="summary_large_image" />`,
  );
  out = out.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${escapeAttr(shell.image)}" />`,
  );

  const headExtras = [
    `    <link rel="canonical" href="${canonical}" />`,
    `    <meta property="og:url" content="${canonical}" />`,
    `    <meta name="twitter:title" content="${escapeAttr(shell.title)}" />`,
    `    <meta name="twitter:description" content="${escapeAttr(shell.description)}" />`,
    `    <script type="application/ld+json">${JSON.stringify(shell.jsonLd)}</script>`,
  ].join("\n");

  out = out.replace("</head>", `${headExtras}\n  </head>`);
  out = out.replace(
    '<div id="root"></div>',
    `${crawlBody(shell)}\n    <div id="root"></div>`,
  );
  return out;
}

for (const shell of shells) {
  const outPath = join(dist, shell.file);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, patchHtml(template, shell), "utf8");
  console.log(`prerender: ${shell.file}`);
}
