import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const origin = "https://omnidot.pages.dev";
const phone = "+306970862839";

const navEn = [
  { href: "/social", label: "Social Media Management" },
  { href: "/content", label: "Content Creation" },
  { href: "/performance", label: "Performance Marketing" },
  { href: "/web", label: "Web Development" },
  { href: "/about", label: "About / Contact" },
];

const navEl = [
  { href: "/el/social", label: "Διαχείριση Social Media" },
  { href: "/el/content", label: "Δημιουργία Περιεχομένου" },
  { href: "/el/performance", label: "Performance Marketing" },
  { href: "/el/web", label: "Ανάπτυξη Ιστοσελίδων" },
  { href: "/el/about", label: "Σχετικά / Επικοινωνία" },
];

/** Keep in sync with src/i18n.ts — build-time crawlable shells. */
const routeDefs = [
  {
    id: "home",
    enPath: "/",
    elPath: "/el",
    enFile: "index.html",
    elFile: "el/index.html",
    image: `${origin}/images/work-omnidot.jpg`,
    en: {
      title: "omnidot. - Marketing agency",
      description:
        "omnidot. - marketing agency for social media, content creation, performance marketing and web development.",
      h1: "omnidot.",
      body: "Web, SEO, social and performance — one partner for brands that want to grow. Marketing agency in Athens and remote for founders and local brands.",
      story: "",
    },
    el: {
      title: "omnidot. - Διαφημιστική εταιρεία",
      description:
        "omnidot. - διαφημιστική για social media, παραγωγή περιεχομένου, performance marketing και web development.",
      h1: "omnidot.",
      body: "Web, SEO, social και performance — ένας συνεργάτης για brands που θέλουν να μεγαλώσουν. Αθήνα και remote.",
      story: "",
    },
    type: "org",
  },
  {
    id: "social",
    enPath: "/social",
    elPath: "/el/social",
    enFile: "social/index.html",
    elFile: "el/social/index.html",
    image: `${origin}/images/social.jpg`,
    en: {
      title: "Social Media Management - omnidot.",
      description:
        "Social Media Management - We define how the brand should sound and look online, which themes actually matter, and a calendar that can be kept.",
      h1: "Social Media Management",
      body: "Strategy, publishing, growth and monthly reporting from omnidot.",
      story:
        "Europatch sells cold asphalt to B2B buyers — a category that rarely goes viral. We built a steady organic presence around real product use and how-to content. In one year: 4.5M Facebook and 2.5M Instagram views, 100% organic.",
    },
    el: {
      title: "Διαχείριση Social Media - omnidot.",
      description:
        "Διαχείριση Social Media - Ορίζουμε πώς ακούγεται και φαίνεται το brand online, ποια θέματα έχουν ουσία, και ένα ημερολόγιο που κρατιέται.",
      h1: "Διαχείριση Social Media",
      body: "Στρατηγική, δημοσίευση, ανάπτυξη και μηνιαίο reporting από το omnidot.",
      story:
        "Η Europatch πουλάει ψυχρή άσφαλτο σε B2B πελάτες — κατηγορία που σπάνια «παίρνει φωτιά» online. Χτίσαμε σταθερή οργανική παρουσία γύρω από πραγματική χρήση προϊόντος και how-to περιεχόμενο. Σε έναν χρόνο: 4.5 εκ. views στο Facebook και 2.5 εκ. στο Instagram, 100% organic.",
    },
    type: "service",
    serviceName: { en: "Social Media Management", el: "Διαχείριση Social Media" },
  },
  {
    id: "content",
    enPath: "/content",
    elPath: "/el/content",
    enFile: "content/index.html",
    elFile: "el/content/index.html",
    image: `${origin}/images/content.jpg`,
    en: {
      title: "Content Creation - omnidot.",
      description:
        "Content Creation - Before anyone shoots, we lock the idea, the story, and the shots for social, ads and the site.",
      h1: "Content Creation",
      body: "Concept, capture, edit and assets ready to post.",
      story:
        "Same Europatch partnership from the content side: how-to reels on the road, product in use, cuts built for feed and Reels. That library powered the organic reach — including one reel to 397.9K.",
    },
    el: {
      title: "Δημιουργία Περιεχομένου - omnidot.",
      description:
        "Δημιουργία Περιεχομένου - Πριν γυρίσει κάμερα, κλειδώνουμε την ιδέα, την ιστορία και τα πλάνα.",
      h1: "Δημιουργία Περιεχομένου",
      body: "Concept, λήψη, μοντάζ και assets έτοιμα για ανάρτηση.",
      story:
        "Η ίδια συνεργασία Europatch από την πλευρά του content: how-to reels στον δρόμο, προϊόν σε χρήση, cuts για feed και Reels. Αυτή η βιβλιοθήκη στήριξε την οργανική εμβέλεια — με ένα reel στα 397.9K.",
    },
    type: "service",
    serviceName: { en: "Content Creation", el: "Δημιουργία Περιεχομένου" },
  },
  {
    id: "performance",
    enPath: "/performance",
    elPath: "/el/performance",
    enFile: "performance/index.html",
    elFile: "el/performance/index.html",
    image: `${origin}/images/performance.jpg`,
    en: {
      title: "Performance Marketing - omnidot.",
      description:
        "Performance Marketing - We set up and run paid social and search so spend has a job: traffic, leads or sales.",
      h1: "Performance Marketing",
      body: "Meta and Google with clear cost, return and next moves.",
      story:
        "Pyrgiotis OE needed paid acquisition a founder could read without a deck. We ran Meta and Google with tight creative tests and a clean landing path. In 30 days on Meta: 1,791 landing-page views at €0.08 each on €148 spend — plus Google search at 3.23% CTR.",
    },
    el: {
      title: "Performance Marketing - omnidot.",
      description:
        "Performance Marketing - Στήνουμε και τρέχουμε paid social και search ώστε τα λεφτά να έχουν δουλειά: traffic, leads ή πωλήσεις.",
      h1: "Performance Marketing",
      body: "Meta και Google με καθαρό κόστος, απόδοση και επόμενα βήματα.",
      story:
        "Ο Πυργιώτης ΟΕ ήθελε paid acquisition που να διαβάζει ένας founder χωρίς 40σέλιδο deck. Τρέξαμε Meta και Google με σφιχτά creative tests και καθαρό landing path. Σε 30 ημέρες στο Meta: 1.791 landing-page views στα €0,08 το καθένα με €148 spend — και Google search με 3,23% CTR.",
    },
    type: "service",
    serviceName: { en: "Performance Marketing", el: "Performance Marketing" },
  },
  {
    id: "web",
    enPath: "/web",
    elPath: "/el/web",
    enFile: "web/index.html",
    elFile: "el/web/index.html",
    image: `${origin}/images/web.jpg`,
    en: {
      title: "Web Development - omnidot.",
      description:
        "Web Development - We build sites that load quickly, read clearly, and ask for the right action.",
      h1: "Web Development",
      body: "Fast, editorial sites built to convert.",
      story:
        "We built pyrgiotisoe.com for a Greek industrial brand: fast, clear, and ready to convert traffic from ads and organic search — a site that works, not a brochure that decorates.",
    },
    el: {
      title: "Ανάπτυξη Ιστοσελίδων - omnidot.",
      description:
        "Ανάπτυξη Ιστοσελίδων - Φτιάχνουμε sites που φορτώνουν γρήγορα, διαβάζονται καθαρά και ζητούν τη σωστή ενέργεια.",
      h1: "Ανάπτυξη Ιστοσελίδων",
      body: "Γρήγορα, editorial sites φτιαγμένα για conversion.",
      story:
        "Φτιάξαμε το pyrgiotisoe.com για ελληνικό βιομηχανικό brand: γρήγορο, καθαρό και έτοιμο να μετατρέψει traffic από ads και organic search — site που δουλεύει, όχι brochure που στολίζει.",
    },
    type: "service",
    serviceName: { en: "Web Development", el: "Ανάπτυξη Ιστοσελίδων" },
  },
  {
    id: "about",
    enPath: "/about",
    elPath: "/el/about",
    enFile: "about/index.html",
    elFile: "el/about/index.html",
    image: `${origin}/images/work-omnidot.jpg`,
    en: {
      title: "About - omnidot.",
      description:
        "For founders and local brands that want a clear next step - not another report. From websites and SEO to social and performance.",
      h1: "About omnidot.",
      body: "For founders and local brands that want a clear next step — not another report. Start a brief with omnidot.",
      story: "",
    },
    el: {
      title: "Σχετικά - omnidot.",
      description:
        "Για founders και τοπικά brands που θέλουν καθαρό επόμενο βήμα — όχι άλλη αναφορά. Από ιστοσελίδες και SEO μέχρι social και performance.",
      h1: "Σχετικά με το omnidot.",
      body: "Για founders και τοπικά brands που θέλουν καθαρό επόμενο βήμα — όχι άλλη αναφορά. Ξεκίνα ένα brief με το omnidot.",
      story: "",
    },
    type: "about",
  },
];

function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function stripPrior(html) {
  return html
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, "")
    .replace(/<link\s+rel="alternate"[^>]*>\s*/gi, "")
    .replace(/<meta\s+property="og:url"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="twitter:title"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="twitter:description"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="robots"[^>]*>\s*/gi, "")
    .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, "")
    .replace(/<main\s+id="prerender">[\s\S]*?<\/main>\s*/gi, "");
}

function jsonLdFor(def, locale) {
  const copy = def[locale];
  const path = locale === "el" ? def.elPath : def.enPath;
  const url = `${origin}${path === "/" ? "/" : path}`;
  if (def.type === "org") {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "omnidot.",
      url: origin,
      description: copy.description,
      image: def.image,
      telephone: phone,
      areaServed: "GR",
    };
  }
  if (def.type === "about") {
    return {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: locale === "el" ? "Σχετικά" : "About",
      url,
      isPartOf: { "@type": "WebSite", name: "omnidot.", url: origin },
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: def.serviceName[locale],
    description: (copy.story || copy.body).slice(0, 300),
    provider: {
      "@type": "Organization",
      name: "omnidot.",
      url: origin,
      telephone: phone,
    },
    areaServed: "GR",
    url,
    image: def.image,
  };
}

function crawlBody(def, locale) {
  const copy = def[locale];
  const nav = locale === "el" ? navEl : navEn;
  const links = nav
    .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
    .join(" · ");
  const story = copy.story
    ? `<p class="prerender-story">${escapeHtml(copy.story)}</p>`
    : "";
  return [
    `<main id="prerender">`,
    `<h1>${escapeHtml(copy.h1)}</h1>`,
    `<p>${escapeHtml(copy.body)}</p>`,
    story,
    `<nav aria-label="Services">${links}</nav>`,
    `</main>`,
  ].join("");
}

function patchHtml(html, def, locale) {
  const copy = def[locale];
  const path = locale === "el" ? def.elPath : def.enPath;
  const file = locale === "el" ? def.elFile : def.enFile;
  const canonical = `${origin}${path === "/" ? "/" : path}`;
  const enUrl = `${origin}${def.enPath === "/" ? "/" : def.enPath}`;
  const elUrl = `${origin}${def.elPath}`;
  let out = stripPrior(html);

  out = out.replace(/<html[^>]*>/, `<html lang="${locale === "el" ? "el" : "en"}">`);
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(copy.title)}</title>`);
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeAttr(copy.description)}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeAttr(copy.title)}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeAttr(copy.description)}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${escapeAttr(def.image)}" />`,
  );
  out = out.replace(
    /<meta\s+property="og:locale"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:locale" content="${locale === "el" ? "el_GR" : "en_US"}" />`,
  );
  out = out.replace(
    /<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:card" content="summary_large_image" />`,
  );
  out = out.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${escapeAttr(def.image)}" />`,
  );

  const headExtras = [
    `    <link rel="canonical" href="${canonical}" />`,
    `    <link rel="alternate" hreflang="en" href="${enUrl}" />`,
    `    <link rel="alternate" hreflang="el" href="${elUrl}" />`,
    `    <link rel="alternate" hreflang="x-default" href="${enUrl}" />`,
    `    <meta property="og:url" content="${canonical}" />`,
    `    <meta name="twitter:title" content="${escapeAttr(copy.title)}" />`,
    `    <meta name="twitter:description" content="${escapeAttr(copy.description)}" />`,
    `    <script type="application/ld+json">${JSON.stringify(jsonLdFor(def, locale))}</script>`,
  ].join("\n");

  out = out.replace("</head>", `${headExtras}\n  </head>`);
  out = out.replace(
    '<div id="root"></div>',
    `${crawlBody(def, locale)}\n    <div id="root"></div>`,
  );
  return { file, html: out };
}

function patch404(html) {
  let out = stripPrior(html);
  out = out.replace(/<title>[^<]*<\/title>/, `<title>Page not found - omnidot.</title>`);
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="This URL is not a page on omnidot." />`,
  );
  const extras = [
    `    <meta name="robots" content="noindex, follow" />`,
    `    <link rel="canonical" href="${origin}/" />`,
  ].join("\n");
  out = out.replace("</head>", `${extras}\n  </head>`);
  out = out.replace(
    '<div id="root"></div>',
    `<main id="prerender"><h1>Page not found</h1><p>This URL isn’t a page on omnidot.</p><nav><a href="/">Home</a> · <a href="/el">Αρχική</a></nav></main>\n    <div id="root"></div>`,
  );
  return out;
}

const template = stripPrior(readFileSync(join(dist, "index.html"), "utf8"));

for (const def of routeDefs) {
  for (const locale of ["en", "el"]) {
    const { file, html } = patchHtml(template, def, locale);
    const outPath = join(dist, file);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, "utf8");
    console.log(`prerender: ${file}`);
  }
}

writeFileSync(join(dist, "404.html"), patch404(template), "utf8");
console.log("prerender: 404.html");
