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
    words: [{ kind: "stay", open: "across web, social & performance" }],
  },
  {
    id: "outcomes",
    openRow: 4,
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
    words: [{ kind: "stay", open: "σε web, social και performance" }],
  },
  {
    id: "outcomes",
    openRow: 4,
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
            body: "We define how the brand should sound and look online, which themes actually matter, and a calendar that can be kept — not a wish list.",
          },
          {
            name: "Publishing",
            detail: "Feed, stories, community",
            body: "We plan, write, design and post with a steady rhythm, and we stay in the comments so the account feels alive, not automated.",
          },
          {
            name: "Growth",
            detail: "Reels, UGC, collaborations",
            body: "We look for formats that travel: short video, creator-style clips, and collabs that bring in people who already care about the category.",
          },
          {
            name: "Reporting",
            detail: "Monthly clarity, not vanity",
            body: "Each month you get a plain read of what moved, what stalled, and what we change next. Reach is useful. Decisions are the point.",
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
            body: "Before anyone shoots, we lock the idea, the story, and the shots. That keeps production fast and the brand consistent across posts and ads.",
          },
          {
            name: "Capture",
            detail: "Photo, video, on-site",
            body: "We film and photograph on location or in a simple setup — product, people, space — so you have material that can live on social, ads and the site.",
          },
          {
            name: "Edit",
            detail: "Cuts for feed, ads, web",
            body: "One shoot becomes a set of cuts: feed, stories, paid, website. Same world, right length for each place.",
          },
          {
            name: "Assets",
            detail: "Stills, carousels, motion",
            body: "We leave you with a library you can actually use — stills, carousels, titles, motion — not a folder of leftovers.",
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
            "Pyrgiotis OE needed paid acquisition a founder could read without a deck. We ran Meta and Google with tight creative tests and a clean landing path. In 30 days on Meta: 1,791 landing-page views at €0.08 each on €148 spend — plus Google search at 3.23% CTR.",
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
            body: "We set up and run paid social and search so spend has a job: traffic, leads or sales — with structure you can scale when a signal is real.",
          },
          {
            name: "Creative testing",
            detail: "Iterate what converts",
            body: "We don't bet on one ad. We rotate hooks, formats and offers, keep what converts, and kill what doesn't — weekly, not once a quarter.",
          },
          {
            name: "Funnel setup",
            detail: "Landing → lead → sale",
            body: "Ads only work if the path after the click is clean. We line up landing, form, follow-up and tracking so interest can become a customer.",
          },
          {
            name: "Analytics",
            detail: "ROAS, CPA, clear next steps",
            body: "You see cost, return and the next move in language a founder can use. If a number doesn't change a decision, we don't parade it.",
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
          label: "Live",
          client: "Pyrgiotis OE",
          story:
            "We built pyrgiotisoe.com for a Greek industrial brand: fast, clear, and ready to convert traffic from ads and organic search — a site that works, not a brochure that decorates.",
          value: "",
          links: [{ label: "pyrgiotisoe.com", href: "https://pyrgiotisoe.com/" }],
        },
        points: [
          {
            name: "Websites",
            detail: "Fast, editorial, conversion-led",
            body: "We build sites that load quickly, read clearly, and ask for the right action. Design is editorial. The job is to convert, not to decorate.",
          },
          {
            name: "SEO",
            detail: "Technical + content that ranks",
            body: "Structure, speed, metadata and pages written for how people search. Technical hygiene plus content that can actually rank.",
          },
          {
            name: "Landing pages",
            detail: "Built for campaigns",
            body: "Campaign pages with one job: turn paid or organic traffic into a lead or a sale, without the noise of a full site.",
          },
          {
            name: "Care",
            detail: "Iterate after launch",
            body: "Launch is the start. We keep iterating copy, layout and performance as the brand and the campaigns move.",
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
            "Η Europatch πουλάει ψυχρή άσφαλτο σε B2B πελάτες — κατηγορία που σπάνια «παίρνει φωτιά» online. Χτίσαμε σταθερή οργανική παρουσία γύρω από πραγματική χρήση προϊόντος και how-to περιεχόμενο. Σε έναν χρόνο: 4.5 εκ. views στο Facebook και 2.5 εκ. στο Instagram, 100% organic.",
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
            body: "Ορίζουμε πώς ακούγεται και φαίνεται το brand online, ποια θέματα έχουν ουσία, και ένα ημερολόγιο που κρατιέται — όχι μια λίστα ευχών.",
          },
          {
            name: "Δημοσίευση",
            detail: "Feed, stories, κοινότητα",
            body: "Σχεδιάζουμε, γράφουμε και ανεβάζουμε με σταθερό ρυθμό, και μένουμε στα σχόλια ώστε ο λογαριασμός να ζει, όχι να αυτοματοποιείται.",
          },
          {
            name: "Ανάπτυξη",
            detail: "Reels, UGC, συνεργασίες",
            body: "Ψάχνουμε φόρμες που ταξιδεύουν: short video, clips σε ύφος creator, και συνεργασίες με ανθρώπους που ήδη νοιάζονται για την κατηγορία.",
          },
          {
            name: "Reporting",
            detail: "Μηνιαία καθαρότητα, όχι vanity",
            body: "Κάθε μήνα παίρνεις μια σκέτη ανάγνωση: τι κινήθηκε, τι κόλλησε, τι αλλάζουμε μετά. Το reach είναι χρήσιμο. Οι αποφάσεις είναι το ζητούμενο.",
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
            body: "Πριν γυρίσει κάμερα, κλειδώνουμε την ιδέα, την ιστορία και τα πλάνα. Έτσι η παραγωγή είναι γρήγορη και το brand σταθερό σε post και διαφημίσεις.",
          },
          {
            name: "Λήψη",
            detail: "Φωτογραφία, video, on-site",
            body: "Γυρίζουμε και φωτογραφίζουμε στον χώρο ή σε απλό σετ — προϊόν, άνθρωποι, χώρος — ώστε να υπάρχει υλικό για social, ads και την ιστοσελίδα.",
          },
          {
            name: "Μοντάζ",
            detail: "Cuts για feed, ads, web",
            body: "Ένα γύρισμα γίνεται σετ από cuts: feed, stories, paid, website. Ίδιος κόσμος, σωστό μήκος για κάθε σημείο.",
          },
          {
            name: "Assets",
            detail: "Stills, carousels, motion",
            body: "Σου μένει μια βιβλιοθήκη που χρησιμοποιείται — stills, carousels, τίτλοι, motion — όχι ένας φάκελος με αποφάγια.",
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
            "Ο Πυργιώτης ΟΕ ήθελε paid acquisition που να διαβάζει ένας founder χωρίς 40σέλιδο deck. Τρέξαμε Meta και Google με σφιχτά creative tests και καθαρό landing path. Σε 30 ημέρες στο Meta: 1.791 landing-page views στα €0,08 το καθένα με €148 spend — και Google search με 3,23% CTR.",
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
            body: "Στήνουμε και τρέχουμε paid social και search ώστε τα λεφτά να έχουν δουλειά: traffic, leads ή πωλήσεις — με δομή που μεγαλώνει όταν το σήμα είναι αληθινό.",
          },
          {
            name: "Creative testing",
            detail: "Επαναλαμβάνουμε ό,τι πουλάει",
            body: "Δεν στοιχηματίζουμε σε μία διαφήμιση. Αλλάζουμε hooks, φόρμες και προσφορές, κρατάμε ό,τι δουλεύει, κόβουμε ό,τι όχι — κάθε εβδομάδα, όχι κάθε τρίμηνο.",
          },
          {
            name: "Funnel",
            detail: "Landing → lead → πώληση",
            body: "Η διαφήμιση πιάνει μόνο αν η διαδρομή μετά το κλικ είναι καθαρή. Δένουμε landing, φόρμα, follow-up και tracking ώστε το ενδιαφέρον να γίνει πελάτης.",
          },
          {
            name: "Analytics",
            detail: "ROAS, CPA, επόμενα βήματα",
            body: "Βλέπεις κόστος, απόδοση και την επόμενη κίνηση σε γλώσσα που χρησιμοποιεί ένας founder. Αν ένας αριθμός δεν αλλάζει απόφαση, δεν τον κάνουμε παράσταση.",
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
          label: "Live",
          client: "Πυργιώτης ΟΕ",
          story:
            "Φτιάξαμε το pyrgiotisoe.com για ελληνικό βιομηχανικό brand: γρήγορο, καθαρό και έτοιμο να μετατρέψει traffic από ads και organic search — site που δουλεύει, όχι brochure που στολίζει.",
          value: "",
          links: [{ label: "pyrgiotisoe.com", href: "https://pyrgiotisoe.com/" }],
        },
        points: [
          {
            name: "Ιστοσελίδες",
            detail: "Γρήγορες, editorial, για conversion",
            body: "Φτιάχνουμε sites που φορτώνουν γρήγορα, διαβάζονται καθαρά και ζητούν τη σωστή ενέργεια. Το design είναι editorial. Η δουλειά είναι να μετατρέπουν, όχι να στολίζουν.",
          },
          {
            name: "SEO",
            detail: "Τεχνικό + περιεχόμενο που rankάρει",
            body: "Δομή, ταχύτητα, metadata και σελίδες γραμμένες για το πώς ψάχνει ο κόσμος. Τεχνική τάξη συν περιεχόμενο που μπορεί να rankάρει.",
          },
          {
            name: "Landing pages",
            detail: "Φτιαγμένες για καμπάνιες",
            body: "Σελίδες καμπάνιας με μία δουλειά: να γυρίσουν paid ή organic traffic σε lead ή πώληση, χωρίς τον θόρυβο ενός ολόκληρου site.",
          },
          {
            name: "Φροντίδα",
            detail: "Iterate μετά το launch",
            body: "Το launch είναι η αρχή. Συνεχίζουμε να αλλάζουμε κείμενα, layout και απόδοση όσο κινούνται το brand και οι καμπάνιες.",
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
