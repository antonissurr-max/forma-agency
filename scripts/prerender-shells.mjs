import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const origin = "https://omnidot.pages.dev";

/** Keep in sync with EN copy in src/i18n.ts - build-time crawlable shells. */
const shells = [
  {
    path: "/",
    file: "index.html",
    title: "omnidot. - Marketing agency",
    description:
      "omnidot. - marketing agency for social media, content creation, performance marketing and web development.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "omnidot.",
      url: origin,
      description:
        "omnidot. - marketing agency for social media, content creation, performance marketing and web development.",
      email: "antonissur@yahoo.gr",
    },
  },
  {
    path: "/social",
    file: "social/index.html",
    title: "Social Media Management - omnidot.",
    description:
      "Social Media Management - We define how the brand should sound and look online, which themes actually matter, and a calendar that can be kept.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Social Media Management",
      provider: { "@type": "Organization", name: "omnidot.", url: origin },
      areaServed: "GR",
      url: `${origin}/social`,
    },
  },
  {
    path: "/content",
    file: "content/index.html",
    title: "Content Creation - omnidot.",
    description:
      "Content Creation - Before anyone shoots, we lock the idea, the story, and the shots for social, ads and the site.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Content Creation",
      provider: { "@type": "Organization", name: "omnidot.", url: origin },
      areaServed: "GR",
      url: `${origin}/content`,
    },
  },
  {
    path: "/performance",
    file: "performance/index.html",
    title: "Performance Marketing - omnidot.",
    description:
      "Performance Marketing - We set up and run paid social and search so spend has a job: traffic, leads or sales.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Performance Marketing",
      provider: { "@type": "Organization", name: "omnidot.", url: origin },
      areaServed: "GR",
      url: `${origin}/performance`,
    },
  },
  {
    path: "/web",
    file: "web/index.html",
    title: "Web Development - omnidot.",
    description:
      "Web Development - We build sites that load quickly, read clearly, and ask for the right action.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Web Development",
      provider: { "@type": "Organization", name: "omnidot.", url: origin },
      areaServed: "GR",
      url: `${origin}/web`,
    },
  },
  {
    path: "/about",
    file: "about/index.html",
    title: "About - omnidot.",
    description:
      "For founders and local brands that want a clear next step - not another report. From websites and SEO to social and performance.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About",
      url: `${origin}/about`,
      isPartOf: { "@type": "WebSite", name: "omnidot.", url: origin },
    },
  },
];

const template = readFileSync(join(dist, "index.html"), "utf8");

function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function patchHtml(html, shell) {
  const canonical = `${origin}${shell.path === "/" ? "/" : shell.path}`;
  let out = html;
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

  const headExtras = [
    `    <link rel="canonical" href="${canonical}" />`,
    `    <meta property="og:url" content="${canonical}" />`,
    `    <script type="application/ld+json">${JSON.stringify(shell.jsonLd)}</script>`,
  ].join("\n");

  out = out.replace("</head>", `${headExtras}\n  </head>`);
  return out;
}

for (const shell of shells) {
  const outPath = join(dist, shell.file);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, patchHtml(template, shell), "utf8");
  console.log(`prerender: ${shell.file}`);
}
