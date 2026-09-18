import type { PageId } from "./types";

export type Locale = "en" | "el";

export type VerseWord =
  | { kind: "stay"; open: string; close?: string }
  | { kind: "go"; open: string }
  | { kind: "come"; close: string };

export type VerseRow = {
  id: string;
  openRow: number;
  closeRow: number;
  openOnly?: boolean;
  words: VerseWord[];
};

export type ServicePoint = {
  name: string;
  detail: string;
  body: string;
};

export type Copy = {
  metaTitle: string;
  metaDescription: string;
  langLabel: string;
  homeAria: string;
  about: string;
  close: string;
  previous: string;
  next: string;
  explore: string;
  zoom: string;
  prevPhoto: string;
  nextPhoto: string;
  gallery: string;
  sections: string;
  rights: string;
  location: string;
  whatWeDo: string;
  howWeRun: string;
  revealShort: string;
  revealFull: string;
  aboutSub: string;
  aboutBody: string;
  landingLede: string;
  startBrief: string;
  contactUs: string;
  homeMobileHeadline: string;
  homeMobileProofKicker: string;
  homeMobileProofStory: string;
  homeMobileClose: string;
  aboutVerse: VerseRow[];
  contactThanks: string;
  contactInterest: string;
  contactName: string;
  contactEmail: string;
  contactCompany: string;
  contactBrief: string;
  contactOptional: string;
  contactPlaceholder: string;
  contactSend: string;
  contactCall: string;
  contactFull: string;
  notFoundTitle: string;
  notFoundBody: string;
  notFoundHome: string;
  pages: Record<
    PageId,
    {
      title: string;
      meta: { label: string; value: string }[];
      proof?: {
        label: string;
        client?: string;
        /** Short case narrative — who, what, outcome */
        story?: string;
        value: string;
        notes?: string[];
        href?: string;
        links?: { label: string; href: string }[];
      };
      points: ServicePoint[];
    }
  >;
  performanceFacts: { place: string; detail: string; body: string }[];
  webWork: { src: string; title: string; detail: string }[];
  socialWork: { src: string; title: string; detail: string }[];
  contentWork: { src: string; title: string; detail: string }[];
  performanceWork: { src: string; title: string; detail: string }[];
};

const aboutVerseEn: VerseRow[] = [
  {
    id: "we",
    openRow: 0,
    closeRow: 0,
    words: [
      { kind: "go", open: "We are\u00A0" },
      { kind: "stay", open: "a\u00A0", close: "A\u00A0" },
      { kind: "stay", open: "focused\u00A0partner" },
    ],
  },
  {
    id: "builds",
    openRow: 1,
    closeRow: 1,
    words: [
      { kind: "stay", open: "that builds\u00A0" },
      { kind: "go", open: "growth" },
      { kind: "come", close: "brands" },
    ],
  },
  {
    id: "with",
    openRow: 2,
    closeRow: 1,
    openOnly: true,
    words: [{ kind: "stay", open: "with clean design" }],
  },
  {
    id: "across",
    openRow: 3,
    closeRow: 1,
    openOnly: true,
    words: [{ kind: "stay", open: "across web, social" }],
  },
  {
    id: "performance",
    openRow: 4,
    closeRow: 1,
    openOnly: true,
    words: [{ kind: "stay", open: "& performance" }],
  },
  {
    id: "outcomes",
    openRow: 5,
    closeRow: 1,
    openOnly: true,
    words: [{ kind: "stay", open: "and measurable ROI" }],
  },
];

const aboutVerseEl: VerseRow[] = [
  {
    id: "we",
    openRow: 0,
    closeRow: 0,
    words: [
      { kind: "go", open: "Είμαστε\u00A0" },
      { kind: "stay", open: "ένα\u00A0", close: "Ένα\u00A0" },
      { kind: "stay", open: "στούντιο" },
    ],
  },
  {
    id: "builds",
    openRow: 1,
    closeRow: 1,
    words: [
      { kind: "stay", open: "που χτίζει\u00A0" },
      { kind: "go", open: "ανάπτυξη" },
      { kind: "come", close: "brands" },
    ],
  },
  {
    id: "with",
    openRow: 2,
    closeRow: 1,
    openOnly: true,
    words: [{ kind: "stay", open: "με καθαρό design" }],
  },
  {
    id: "across",
    openRow: 3,
    closeRow: 1,
    openOnly: true,
    words: [{ kind: "stay", open: "σε web, social" }],
  },
  {
    id: "performance",
    openRow: 4,
    closeRow: 1,
    openOnly: true,
    words: [{ kind: "stay", open: "και performance" }],
  },
  {
    id: "outcomes",
    openRow: 5,
    closeRow: 1,
    openOnly: true,
    words: [{ kind: "stay", open: "και μετρήσιμο ROI" }],
  },
];

export const copy: Record<Locale, Copy> = {
  en: {
    metaTitle: "omnidot. — Marketing agency",
    metaDescription:
      "omnidot. — marketing agency for social media, content creation, performance marketing and web development.",
    langLabel: "Language",
    homeAria: "omnidot — home",
    about: "About",
    close: "Close",
    previous: "Previous",
    next: "Next",
    explore: "Explore",
    zoom: "Enlarge",
    prevPhoto: "Previous photo",
    nextPhoto: "Next photo",
    gallery: "Gallery",
    sections: "Sections",
    rights: "All rights reserved.",
    location: "Athens · Remote",
    whatWeDo: "What we do",
    howWeRun: "How we run it",
    revealShort: "Reveal shorter message",
    revealFull: "Show full message",
    aboutSub:
      "Web, SEO, social and performance — one partner for brands that want to grow.",
    aboutBody:
      "For founders and local brands that want a clear next step — not another report. From a premium, fast website and SEO to social strategy and performance campaigns. We don't believe in noise. We believe in data, clean design, and strategies that turn visitors into loyal customers.",
    landingLede: "Athens · pick a service or start a brief",
    startBrief: "Start a brief",
    contactUs: "Contact us",
    homeMobileHeadline: "We don't sell reports. We sell the next move.",
    homeMobileProofKicker: "Selected work",
    homeMobileProofStory:
      "Europatch — cold asphalt for B2B. Steady organic content turned a quiet category into 4.5M Facebook and 2.5M Instagram views in a year, with zero ads.",
    homeMobileClose: "Ready when you are.",
    aboutVerse: aboutVerseEn,
    contactThanks: "Thanks — we'll get back with next steps.",
    contactInterest: "I'm interested in:",
    contactName: "Name",
    contactEmail: "Email",
    contactCompany: "Company",
    contactBrief: "Brief",
    contactOptional: "optional",
    contactPlaceholder: "Goals, timeline, links…",
    contactSend: "Send brief",
    contactCall: "Or call",
    contactFull: "Full partnership",
    notFoundTitle: "Page not found",
    notFoundBody: "This URL isn’t a page on omnidot. Head home or pick a service.",
    notFoundHome: "Back home",
    pages: {
      social: {
        title: "Social Media Management",
        meta: [
          { label: "Goal", value: "Steady presence" },
          { label: "Channels", value: "IG · TikTok · LinkedIn" },
          { label: "You get", value: "Plan + posts" },
          { label: "Work with us", value: "Monthly" },
        ],
        proof: {
          label: "Selected",
          client: "Europatch",
          story:
            "Europatch sells cold asphalt to B2B buyers — a category that rarely goes viral. We built a steady organic presence around real product use and how-to content. In one year: 4.5M Facebook and 2.5M Instagram views, 100% organic.",
          value: "4.5M Facebook · 2.5M Instagram · 100% organic · 1 year",
          notes: [
            "1.2M unique viewers · 0 from ads",
            "Reel 397.9K · Facebook post 120.8K",
            "Last month: 96% of views from non-followers",
          ],
        },
        points: [
          {
            name: "Strategy",
            detail: "Positioning, pillars, calendar",
            body: "Social media strategy for Instagram, TikTok, Facebook and LinkedIn: brand voice, content pillars, posting calendar and community rules. We plan what to say, where it lives, and how often — so your social media management is consistent, not random posts.",
          },
          {
            name: "Publishing",
            detail: "Feed, stories, community",
            body: "We create and publish feed posts, Reels, Stories and carousels, and we reply in comments and DMs. Copy, visuals and timing stay on-brand so the account feels active and trustworthy to followers and new visitors from search or ads.",
          },
          {
            name: "Growth",
            detail: "Reels, UGC, collaborations",
            body: "Growth through short-form video, Reels, user-generated content and creator collaborations. We test formats that expand reach on Instagram and TikTok and bring in people who already care about your category — organic first, ads when it makes sense.",
          },
          {
            name: "Reporting",
            detail: "Monthly clarity, not vanity",
            body: "Monthly social media reporting with reach, engagement, saves, profile visits and what to change next. Plain language for founders and marketing leads — useful metrics, clear next steps, no vanity dashboards.",
          },
        ],
      },
      content: {
        title: "Content Creation",
        meta: [
          { label: "Formats", value: "Photo · Video · Still" },
          { label: "Look", value: "Clean & editorial" },
          { label: "Used for", value: "Social + ads" },
          { label: "Delivery", value: "Ready to post" },
        ],
        proof: {
          label: "Selected",
          client: "Europatch",
          story:
            "Same Europatch partnership from the content side: how-to reels on the road, product in use, cuts built for feed and Reels. That library powered the organic reach — including one reel to 397.9K.",
          value: "The content behind 4.5M Facebook · 2.5M Instagram",
          notes: ["How-to reels on the road · product in use · one reel to 397.9K"],
        },
        points: [
          {
            name: "Concept",
            detail: "Ideas, scripts, shot lists",
            body: "Content creation starts with concept: creative ideas, scripts, shot lists and brand guidelines before the camera rolls. That keeps photo and video production fast and consistent for social media, ads and the website.",
          },
          {
            name: "Capture",
            detail: "Photo, video, on-site",
            body: "On-location photography and videography — product, people, space. We shoot for Instagram, TikTok, Facebook ads, Google campaigns and your site so one production day feeds every channel.",
          },
          {
            name: "Edit",
            detail: "Cuts for feed, ads, web",
            body: "Editing and post-production for each format: Reels, Stories, feed posts, YouTube cuts, paid ads and web hero videos. Same brand world, right length and aspect ratio for every placement.",
          },
          {
            name: "Assets",
            detail: "Stills, carousels, motion",
            body: "A usable content library: stills, carousels, motion graphics, titles and thumbnails ready to post or run as ads — organized files you can actually use.",
          },
        ],
      },
      performance: {
        title: "Performance Marketing",
        meta: [
          { label: "Goal", value: "More customers" },
          { label: "Channels", value: "Meta · Google" },
          { label: "How", value: "Test, then scale" },
          { label: "You see", value: "Clear numbers" },
        ],
        proof: {
          label: "Selected",
          client: "Pyrgiotis OE",
          story:
            "Pyrgiotis OE wanted ads a business owner could follow without a long presentation. We ran Meta and Google, testing a few creatives and a clear path to the website. In 30 days on Meta: 1,791 page visits at €0.08 each on €148 total — and on Google search, 3.23% of people who saw the ad clicked.",
          value: "Meta €0.08 CPLV · Google 3.23% CTR · 30 days",
          notes: [
            "Meta Ads — 1,791 landing page views · €0.08 · €148 · 30 days",
            "Google Ads — 298 clicks · 9.24K impressions · 3.23% CTR",
          ],
        },
        points: [
          {
            name: "Meta & Google",
            detail: "Acquisition that compounds",
            body: "Performance marketing on Meta Ads (Facebook & Instagram) and Google Ads: campaigns for traffic, leads and sales. Account structure, audiences, keywords and budgets built so you can grow when something clearly works — paid social and search together.",
          },
          {
            name: "Creative testing",
            detail: "Iterate what converts",
            body: "Ongoing A/B tests on hooks, creatives, copy and offers. We keep ads that convert, pause the rest, and refresh weekly so CPA and ROAS improve from data — not from one big launch.",
          },
          {
            name: "Funnel setup",
            detail: "Landing → lead → sale",
            body: "Ads need a clean path after the click: landing page, form, thank-you flow and conversion tracking (pixels, GA4, Google Ads tags). We align creative, landing and CRM follow-up so interest becomes a customer.",
          },
          {
            name: "Analytics",
            detail: "ROAS, CPA, clear next steps",
            body: "Clear reporting on spend, CPA, ROAS, CTR and conversions — in language a founder can use. Each week: what to keep, kill or scale. If a metric does not change a decision, we do not parade it.",
          },
        ],
      },
      web: {
        title: "Web Development",
        meta: [
          { label: "Build", value: "Sites & landings" },
          { label: "SEO", value: "Findable on Google" },
          { label: "Speed", value: "Loads fast" },
          { label: "Ownership", value: "Stays yours" },
        ],
        proof: {
          label: "Some of our websites",
          value: "",
          links: [{ label: "pyrgiotisoe.com", href: "https://pyrgiotisoe.com/" }],
        },
        points: [
          {
            name: "Websites",
            detail: "Corporate sites & brand pages",
            body: "We design and build corporate websites and brand sites that load fast, look clean on mobile and desktop, and guide visitors to contact, quote or purchase. Clear information architecture, strong calls to action, and pages written so Google and people can both understand what you offer.",
          },
          {
            name: "SEO",
            detail: "Technical SEO + content that ranks",
            body: "Search engine optimization from the ground up: site structure, title tags, meta descriptions, headings, internal links, Core Web Vitals, schema markup and crawlable pages. We combine technical SEO with content for the keywords your customers actually search — local SEO included when you serve a place or region.",
          },
          {
            name: "Landing pages",
            detail: "Campaign & ads landing pages",
            body: "Dedicated landing pages for Google Ads, Meta ads and email campaigns — one offer, one path, fast load. Built to turn paid traffic and organic search into leads or sales, with tracking (GA4, pixels) so you see which campaign and keyword convert.",
          },
          {
            name: "Care",
            detail: "Updates, speed & ongoing SEO",
            body: "After launch we keep the site healthy: content updates, performance and speed fixes, SEO improvements, security and small UX changes as campaigns and products evolve. A website is a channel, not a one-off brochure.",
          },
        ],
      },
    },
    performanceFacts: [
      {
        place: "Creative testing",
        detail: "Weekly experiments",
        body: "New hooks and formats go live every week so we learn from the market, not from opinions.",
      },
      {
        place: "Paid social",
        detail: "Meta · TikTok",
        body: "Prospecting and retargeting on the platforms where the audience already scrolls.",
      },
      {
        place: "Search",
        detail: "Google Ads · SEO",
        body: "We catch intent on Google — paid where it converts, organic where the pages can rank.",
      },
      {
        place: "Measurement",
        detail: "GA4 · pixels · CRM",
        body: "Pixels, analytics and, when it exists, CRM — so we know what a click became.",
      },
      {
        place: "Output",
        detail: "Clear weekly decisions",
        body: "A short weekly read: keep, kill, or scale. No 40-page decks.",
      },
    ],
    webWork: [],
    socialWork: [],
    contentWork: [],
    performanceWork: [],
  },
  el: {
    metaTitle: "omnidot. — Διαφημιστική εταιρεία",
    metaDescription:
      "omnidot. — διαφημιστική για social media, παραγωγή περιεχομένου, performance marketing και web development.",
    langLabel: "Γλώσσα",
    homeAria: "omnidot — αρχική",
    about: "Σχετικά",
    close: "Κλείσιμο",
    previous: "Προηγούμενο",
    next: "Επόμενο",
    explore: "Δες περισσότερα",
    zoom: "Μεγέθυνση",
    prevPhoto: "Προηγούμενη φωτογραφία",
    nextPhoto: "Επόμενη φωτογραφία",
    gallery: "Γκαλερί",
    sections: "Ενότητες",
    rights: "Με επιφύλαξη παντός δικαιώματος.",
    location: "Αθήνα · Remote",
    whatWeDo: "Τι κάνουμε",
    howWeRun: "Πώς το τρέχουμε",
    revealShort: "Σύντομο μήνυμα",
    revealFull: "Πλήρες μήνυμα",
    aboutSub:
      "Web, SEO, social και performance — ένα στούντιο για brands που θέλουν να μεγαλώσουν.",
    aboutBody:
      "Για founders και τοπικά brands που θέλουν καθαρό επόμενο βήμα — όχι άλλη αναφορά. Από premium, γρήγορη ιστοσελίδα και SEO μέχρι social strategy και performance campaigns. Δεν πιστεύουμε στον θόρυβο. Πιστεύουμε στα δεδομένα, στο καθαρό design και στις στρατηγικές που μετατρέπουν τους επισκέπτες σε πιστούς πελάτες.",
    landingLede: "Αθήνα · διάλεξε υπηρεσία ή ξεκίνα brief",
    startBrief: "Ξεκίνα ένα brief",
    contactUs: "Επικοινωνία",
    homeMobileHeadline: "Δεν πουλάμε reports. Πουλάμε την επόμενη κίνηση.",
    homeMobileProofKicker: "Επιλεγμένη δουλειά",
    homeMobileProofStory:
      "Europatch — ψυχρή άσφαλτος για B2B. Σταθερό organic content έκανε μια ήσυχη κατηγορία να φτάσει 4.5 εκ. views στο Facebook και 2.5 εκ. στο Instagram σε έναν χρόνο, χωρίς διαφημίσεις.",
    homeMobileClose: "Όποτε είσαι έτοιμος.",
    aboutVerse: aboutVerseEl,
    contactThanks: "Ευχαριστούμε — θα επιστρέψουμε με τα επόμενα βήματα.",
    contactInterest: "Ενδιαφέρομαι για:",
    contactName: "Όνομα",
    contactEmail: "Email",
    contactCompany: "Εταιρεία",
    contactBrief: "Σύντομο brief",
    contactOptional: "προαιρετικό",
    contactPlaceholder: "Στόχοι, χρονοδιάγραμμα, links…",
    contactSend: "Αποστολή",
    contactCall: "Ή κάλεσε",
    contactFull: "Πλήρης συνεργασία",
    notFoundTitle: "Η σελίδα δεν βρέθηκε",
    notFoundBody: "Αυτό το URL δεν αντιστοιχεί σε σελίδα του omnidot. Γύρνα στην αρχική ή διάλεξε υπηρεσία.",
    notFoundHome: "Αρχική",
    pages: {
      social: {
        title: "Διαχείριση Social Media",
        meta: [
          { label: "Στόχος", value: "Σταθερή παρουσία" },
          { label: "Κανάλια", value: "IG · TikTok · LinkedIn" },
          { label: "Παίρνεις", value: "Πλάνο + posts" },
          { label: "Συνεργασία", value: "Μηνιαία" },
        ],
        proof: {
          label: "Επιλεγμένο",
          client: "Europatch",
          story:
            "Η Europatch πουλάει ψυχρή άσφαλτο σε B2B πελάτες — κατηγορία που σπάνια γίνεται viral online. Χτίσαμε σταθερή οργανική παρουσία γύρω από πραγματική χρήση προϊόντος και how-to περιεχόμενο. Σε έναν χρόνο: 4.5 εκ. views στο Facebook και 2.5 εκ. στο Instagram, 100% organic.",
          value: "4.5 εκ. Facebook · 2.5 εκ. Instagram · 100% organic · 1 χρόνος",
          notes: [
            "1.2 εκ. unique viewers · 0 από ads",
            "Reel 397.9K · Facebook post 120.8K",
            "Τελευταίος μήνας: 96% των views από non-followers",
          ],
        },
        points: [
          {
            name: "Στρατηγική",
            detail: "Θέση, πυλώνες, ημερολόγιο",
            body: "Στρατηγική social media για Instagram, TikTok, Facebook και LinkedIn: φωνή brand, πυλώνες περιεχομένου, ημερολόγιο δημοσιεύσεων και κανόνες κοινότητας. Ορίζουμε τι λέμε, πού ανεβαίνει και πόσο συχνά — ώστε η διαχείριση social media να είναι σταθερή, όχι τυχαία posts.",
          },
          {
            name: "Δημοσίευση",
            detail: "Feed, stories, κοινότητα",
            body: "Δημιουργούμε και ανεβάζουμε feed posts, Reels, Stories και carousels, και απαντάμε σε σχόλια και DMs. Κείμενα, εικόνες και timing μένουν on-brand ώστε ο λογαριασμός να φαίνεται ζωντανός σε followers και σε νέους επισκέπτες από αναζήτηση ή διαφημίσεις.",
          },
          {
            name: "Ανάπτυξη",
            detail: "Reels, UGC, συνεργασίες",
            body: "Ανάπτυξη μέσω short video, Reels, user-generated content και συνεργασιών με creators. Δοκιμάζουμε φόρμες που ανοίγουν reach σε Instagram και TikTok και φέρνουν κόσμο που ήδη νοιάζεται για την κατηγορία — πρώτα organic, ads όταν έχει νόημα.",
          },
          {
            name: "Reporting",
            detail: "Μηνιαία καθαρότητα, όχι vanity",
            body: "Μηνιαίο social media reporting με reach, engagement, αποθηκεύσεις, επισκέψεις προφίλ και τι αλλάζουμε μετά. Απλή γλώσσα για founders και marketing — χρήσιμα metrics, καθαρά επόμενα βήματα, χωρίς vanity dashboards.",
          },
        ],
      },
      content: {
        title: "Δημιουργία Περιεχομένου",
        meta: [
          { label: "Μορφές", value: "Φωτο · Video · Still" },
          { label: "Ύφος", value: "Καθαρό & editorial" },
          { label: "Χρήση", value: "Social + διαφημίσεις" },
          { label: "Παράδοση", value: "Έτοιμο για ανάρτηση" },
        ],
        proof: {
          label: "Επιλεγμένο",
          client: "Europatch",
          story:
            "Η ίδια συνεργασία Europatch από την πλευρά του content: how-to reels στον δρόμο, προϊόν σε χρήση, cuts για feed και Reels. Αυτή η βιβλιοθήκη στήριξε την οργανική εμβέλεια — με ένα reel στα 397.9K.",
          value: "Το περιεχόμενο πίσω από 4.5 εκ. Facebook · 2.5 εκ. Instagram",
          notes: ["How-to reels στον δρόμο · προϊόν σε χρήση · ένα reel στα 397.9K"],
        },
        points: [
          {
            name: "Concept",
            detail: "Ιδέες, σενάρια, shot lists",
            body: "Η δημιουργία περιεχομένου ξεκινά από το concept: ιδέες, σενάρια, shot lists και brand guidelines πριν γυρίσει κάμερα. Έτσι η παραγωγή φωτογραφίας και video μένει γρήγορη και σταθερή για social media, διαφημίσεις και την ιστοσελίδα.",
          },
          {
            name: "Λήψη",
            detail: "Φωτογραφία, video, on-site",
            body: "Φωτογράφιση και βιντεοσκόπηση on-location — προϊόν, άνθρωποι, χώρος. Γυρίζουμε για Instagram, TikTok, Facebook ads, Google καμπάνιες και το site σας, ώστε μία μέρα παραγωγής να τροφοδοτεί όλα τα κανάλια.",
          },
          {
            name: "Μοντάζ",
            detail: "Cuts για feed, ads, web",
            body: "Μοντάζ και post-production για κάθε μορφή: Reels, Stories, feed posts, YouTube, paid ads και hero videos για το web. Ίδιος κόσμος brand, σωστό μήκος και αναλογία για κάθε placement.",
          },
          {
            name: "Assets",
            detail: "Stills, carousels, motion",
            body: "Χρήσιμη βιβλιοθήκη περιεχομένου: stills, carousels, motion graphics, τίτλοι και thumbnails έτοιμα για ανάρτηση ή διαφήμιση — τακτοποιημένα αρχεία που χρησιμοποιούνται πραγματικά.",
          },
        ],
      },
      performance: {
        title: "Performance Marketing",
        meta: [
          { label: "Στόχος", value: "Περισσότεροι πελάτες" },
          { label: "Κανάλια", value: "Meta · Google" },
          { label: "Τρόπος", value: "Δοκιμή, μετά scale" },
          { label: "Βλέπεις", value: "Καθαρούς αριθμούς" },
        ],
        proof: {
          label: "Επιλεγμένο",
          client: "Πυργιώτης ΟΕ",
          story:
            "Ο Πυργιώτης ΟΕ ήθελε διαφημίσεις που να καταλαβαίνει εύκολα ο ιδιοκτήτης — χωρίς μακροσκελή παρουσίαση. Τρέξαμε Meta και Google, δοκιμάζοντας λίγες εικόνες/κείμενα και καθαρή διαδρομή προς την ιστοσελίδα. Σε 30 ημέρες στο Meta: 1.791 επισκέψεις στη σελίδα με €0,08 η καθεμία και συνολικά €148 — και στο Google, το 3,23% όσων είδαν την αγγελία πάτησαν.",
          value: "Meta €0,08 CPLV · Google 3,23% CTR · 30 ημέρες",
          notes: [
            "Meta Ads — 1.791 landing page views · €0,08 · €148 · 30 ημέρες",
            "Google Ads — 298 κλικ · 9.24 χιλ. εμφανίσεις · 3,23% CTR",
          ],
        },
        points: [
          {
            name: "Meta & Google",
            detail: "Acquisition που συσσωρεύεται",
            body: "Performance marketing σε Meta Ads (Facebook & Instagram) και Google Ads: καμπάνιες για traffic, leads και πωλήσεις. Δομή λογαριασμών, κοινά, λέξεις-κλειδιά και budgets ώστε να μεγαλώνετε όταν κάτι δουλεύει ξεκάθαρα — paid social και search μαζί.",
          },
          {
            name: "Creative testing",
            detail: "Επαναλαμβάνουμε ό,τι πουλάει",
            body: "Συνεχή A/B tests σε hooks, creatives, κείμενα και προσφορές. Κρατάμε ό,τι μετατρέπει, σταματάμε τα υπόλοιπα και ανανεώνουμε κάθε εβδομάδα ώστε CPA και ROAS να βελτιώνονται από δεδομένα — όχι από ένα μεγάλο launch.",
          },
          {
            name: "Funnel",
            detail: "Landing → lead → πώληση",
            body: "Οι διαφημίσεις χρειάζονται καθαρή διαδρομή μετά το κλικ: landing page, φόρμα, thank-you και conversion tracking (pixels, GA4, Google Ads tags). Δένουμε creative, landing και follow-up ώστε το ενδιαφέρον να γίνει πελάτης.",
          },
          {
            name: "Analytics",
            detail: "ROAS, CPA, επόμενα βήματα",
            body: "Καθαρό reporting σε spend, CPA, ROAS, CTR και conversions — σε γλώσσα που χρησιμοποιεί ένας founder. Κάθε εβδομάδα: τι κρατάμε, κόβουμε ή μεγαλώνουμε. Αν ένας αριθμός δεν αλλάζει απόφαση, δεν τον κάνουμε παράσταση.",
          },
        ],
      },
      web: {
        title: "Ανάπτυξη Ιστοσελίδων",
        meta: [
          { label: "Κατασκευή", value: "Sites & landings" },
          { label: "SEO", value: "Εμφανίσιμο στο Google" },
          { label: "Ταχύτητα", value: "Γρήγορο φόρτωμα" },
          { label: "Ιδιοκτησία", value: "Μένει δικό σου" },
        ],
        proof: {
          label: "Μερικές ιστοσελίδες μας",
          value: "",
          links: [{ label: "pyrgiotisoe.com", href: "https://pyrgiotisoe.com/" }],
        },
        points: [
          {
            name: "Ιστοσελίδες",
            detail: "Εταιρικά sites & brand pages",
            body: "Σχεδιάζουμε και κατασκευάζουμε εταιρικές ιστοσελίδες και brand sites που φορτώνουν γρήγορα, δουλεύουν σωστά σε κινητό και desktop και οδηγούν τον επισκέπτη σε επικοινωνία, προσφορά ή αγορά. Καθαρή δομή σελίδων, δυνατά calls to action και κείμενα γραμμένα ώστε να τα καταλαβαίνουν και οι άνθρωποι και η Google.",
          },
          {
            name: "SEO",
            detail: "Τεχνικό SEO + περιεχόμενο που rankάρει",
            body: "Βελτιστοποίηση για μηχανές αναζήτησης από τη βάση: δομή site, title tags, meta descriptions, επικεφαλίδες, εσωτερικά links, Core Web Vitals, schema markup και σελίδες που το Googlebot διαβάζει εύκολα. Συνδυάζουμε τεχνικό SEO με περιεχόμενο για τις λέξεις-κλειδιά που πραγματικά ψάχνουν οι πελάτες σας — και τοπικό SEO όταν εξυπηρετείτε περιοχή ή πόλη.",
          },
          {
            name: "Landing pages",
            detail: "Σελίδες για καμπάνιες & διαφημίσεις",
            body: "Ξεχωριστές landing pages για Google Ads, Meta ads και email — μία προσφορά, μία διαδρομή, γρήγορο φόρτωμα. Φτιαγμένες να μετατρέπουν paid traffic και organic search σε leads ή πωλήσεις, με μέτρηση (GA4, pixels) ώστε να βλέπετε ποια καμπάνια και ποια λέξη-κλειδί φέρνουν αποτέλεσμα.",
          },
          {
            name: "Φροντίδα",
            detail: "Ενημερώσεις, ταχύτητα & συνεχές SEO",
            body: "Μετά το launch κρατάμε την ιστοσελίδα υγιή: ενημερώσεις περιεχομένου, βελτιώσεις ταχύτητας και απόδοσης, SEO fixes, ασφάλεια και μικρές αλλαγές UX όσο εξελίσσονται προϊόντα και καμπάνιες. Το site είναι κανάλι πωλήσεων, όχι brochure μιας χρήσης.",
          },
        ],
      },
    },
    performanceFacts: [
      {
        place: "Creative testing",
        detail: "Εβδομαδιαία πειράματα",
        body: "Νέα hooks και φόρμες μπαίνουν κάθε εβδομάδα, ώστε να μαθαίνουμε από την αγορά, όχι από γνώμες.",
      },
      {
        place: "Paid social",
        detail: "Meta · TikTok",
        body: "Prospecting και retargeting εκεί που το κοινό ήδη σκρολάρει.",
      },
      {
        place: "Search",
        detail: "Google Ads · SEO",
        body: "Πιάνομε πρόθεση στο Google — paid εκεί που μετατρέπει, organic εκεί που οι σελίδες μπορούν να rankάρουν.",
      },
      {
        place: "Μέτρηση",
        detail: "GA4 · pixels · CRM",
        body: "Pixels, analytics και, όταν υπάρχει, CRM — ώστε να ξέρουμε τι έγινε ένα κλικ.",
      },
      {
        place: "Αποτέλεσμα",
        detail: "Καθαρές εβδομαδιαίες αποφάσεις",
        body: "Σύντομη εβδομαδιαία ανάγνωση: κρατάμε, κόβουμε ή μεγαλώνουμε. Όχι decks 40 σελίδων.",
      },
    ],
    webWork: [],
    socialWork: [],
    contentWork: [],
    performanceWork: [],
  },
};
