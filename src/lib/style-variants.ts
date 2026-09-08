/**
 * Five style foundations for the Open Room landing page. Each one is a
 * complete, self-consistent set of tokens: colour, type, spacing, radius and
 * the rules for buttons and form fields. The /styling page renders them side
 * by side as style tiles so one can be picked and promoted to globals.css.
 *
 * Colour values are hex so the test can check WCAG contrast. Font families
 * are referenced by the CSS variable next/font gives them on the page.
 */

export type Swatch = { name: string; hex: string; note?: string };

export type FontSpec = {
  /** Human name, e.g. "Instrument Serif". */
  family: string;
  /** CSS var set by next/font, e.g. "--font-instrument-serif". */
  cssVar: string;
  /** Fallback stack appended after the var. */
  fallback: string;
  weights: string;
  note: string;
};

export type TypeStep = {
  name: "Display" | "H1" | "H2" | "H3" | "Lead" | "Body" | "Small" | "Caption";
  px: number;
  lineHeight: number;
  weight: number;
  tracking: string;
  font: "display" | "body" | "mono";
  transform?: "uppercase";
  italic?: boolean;
};

export type StyleVariant = {
  id: string;
  index: number;
  name: string;
  premise: string;
  drawsFrom: string;
  mood: string;
  /** Routes where the real hero has been built in this system, if it has. */
  heroLinks?: { label: string; href: string }[];
  colors: {
    bg: string;
    surface: string;
    border: string;
    ink: string;
    muted: string;
    primary: string;
    onPrimary: string;
    secondary: string;
    onSecondary: string;
    accent: string;
    /** Extra tints used for section panels, chips, highlights. */
    tints: Swatch[];
    agents: { teal: string; red: string; purple: string };
  };
  colorNotes: string;
  type: {
    display: FontSpec;
    body: FontSpec;
    scale: TypeStep[];
    notes: string;
  };
  spacing: {
    base: 8;
    steps: number[];
    section: number;
    gutter: number;
    stack: number;
    notes: string;
  };
  radius: { button: number; input: number; card: number };
  controls: {
    height: number;
    fontSize: number;
    fontWeight: number;
    /** A short rule for how buttons behave in this system. */
    buttonRule: string;
    /** A short rule for inputs. */
    inputRule: string;
    /** Named style so the tile CSS can apply a variant-specific treatment. */
    treatment: "flat" | "soft" | "pill" | "glow" | "toy";
  };
};

const mono: FontSpec = {
  family: "Geist Mono",
  cssVar: "--font-geist-mono",
  fallback: "ui-monospace, SFMono-Regular, Menlo, monospace",
  weights: "400, 500",
  note: "Labels, hotkeys and the voice transcript.",
};

export const monoFont = mono;

const spacingSteps = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

export const styleVariants: readonly StyleVariant[] = [
  {
    id: "reading-lamp",
    index: 1,
    name: "Reading lamp",
    premise: "Warm paper, a serif that speaks, one lamp-coloured accent.",
    heroLinks: [
      { label: "Hero, word chips", href: "/styling/reading-lamp" },
      { label: "Hero, stream", href: "/styling/reading-lamp/stream" },
      { label: "Hero, terminal", href: "/styling/reading-lamp/terminal" },
      { label: "Hero, app window", href: "/styling/reading-lamp/app" },
      { label: "Hero, switchboard (still)", href: "/styling/reading-lamp/switchboard" },
      { label: "Hero, chat", href: "/styling/reading-lamp/chat" },
      { label: "Hero, night", href: "/styling/reading-lamp/night" },
    ],
    drawsFrom:
      "Wispr Flow: cream page, oldstyle serif headlines with italic emphasis, a sans body at 500, colour saved for chips.",
    mood: "The page reads like a printed pamphlet left on a desk under a lamp. Type carries the personality; colour is rationed to the amber of the room's monitors and a deep green for links. It says: this is calm, considered software made by people who write.",
    colors: {
      bg: "#FAF6EA",
      surface: "#F1EBD9",
      border: "#DAD2B9",
      ink: "#1C1913",
      muted: "#655E4D",
      primary: "#1C1913",
      onPrimary: "#FAF6EA",
      secondary: "#F3B34A",
      onSecondary: "#1C1913",
      accent: "#1F5A48",
      tints: [
        { name: "Amber", hex: "#F3B34A", note: "chips, highlights" },
        { name: "Moss", hex: "#1F5A48", note: "links, focus" },
        { name: "Lilac", hex: "#E9DDF5", note: "quiet panels" },
        { name: "Coral", hex: "#F0664A", note: "errors, one hot moment" },
      ],
      agents: { teal: "#157F86", red: "#D9472B", purple: "#6E4FC2" },
    },
    colorNotes:
      "Neutrals are warm, never grey. Ink is a soft black so serif hairlines don't sparkle. Agent colours are dropped a step in chroma so they sit on paper instead of glowing.",
    type: {
      display: {
        family: "Instrument Serif",
        cssVar: "--font-instrument-serif",
        fallback: "Georgia, 'Times New Roman', serif",
        weights: "400, 400 italic",
        note: "Single weight. Emphasis comes from italic, never bold.",
      },
      body: {
        family: "Instrument Sans",
        cssVar: "--font-instrument-sans",
        fallback: "system-ui, sans-serif",
        weights: "400, 500, 600",
        note: "Body sits at 400, UI text at 500, buttons at 600.",
      },
      scale: [
        { name: "Display", px: 88, lineHeight: 0.95, weight: 400, tracking: "-0.03em", font: "display" },
        { name: "H1", px: 64, lineHeight: 1.0, weight: 400, tracking: "-0.025em", font: "display" },
        { name: "H2", px: 44, lineHeight: 1.05, weight: 400, tracking: "-0.02em", font: "display" },
        { name: "H3", px: 30, lineHeight: 1.15, weight: 400, tracking: "-0.01em", font: "display" },
        { name: "Lead", px: 20, lineHeight: 1.4, weight: 500, tracking: "0", font: "body" },
        { name: "Body", px: 17, lineHeight: 1.55, weight: 400, tracking: "0", font: "body" },
        { name: "Small", px: 14, lineHeight: 1.5, weight: 500, tracking: "0", font: "body" },
        { name: "Caption", px: 12, lineHeight: 1.4, weight: 500, tracking: "0.08em", font: "body", transform: "uppercase" },
      ],
      notes:
        "Headlines are large and tight, then the body steps way down. The gap between 64 and 20 is the point: it makes the page feel authored, not templated.",
    },
    spacing: {
      base: 8,
      steps: spacingSteps,
      section: 128,
      gutter: 24,
      stack: 16,
      notes: "Airy. Sections breathe at 128 on desktop, 80 on mobile. Text columns cap at 60ch.",
    },
    radius: { button: 10, input: 10, card: 20 },
    controls: {
      height: 48,
      fontSize: 16,
      fontWeight: 600,
      buttonRule: "Primary is ink on paper. Secondary is the amber chip. Both share one radius and one height; hover lifts 1px and deepens the fill.",
      inputRule: "Paper-white field, one hairline border, moss-green focus ring. Placeholder is muted ink, never grey.",
      treatment: "flat",
    },
  },
  {
    id: "front-desk",
    index: 2,
    name: "Front desk",
    premise: "Off-white product page, navy ink, pastel panels for each feature.",
    drawsFrom:
      "Calendly: near-white page, navy text instead of black, a geometric grotesk at 500, big rounded panels tinted per section, 20px soft-pill buttons.",
    mood: "Confident, organised, a little friendly. Every feature gets its own tinted panel like a room in a floor plan, which suits a product about agents at their own desks. It says: this is a real tool with a real team behind it.",
    colors: {
      bg: "#FCFBF8",
      surface: "#F4F2ED",
      border: "#DCDBD4",
      ink: "#0B1A2E",
      muted: "#56636F",
      primary: "#0B1A2E",
      onPrimary: "#FCFBF8",
      secondary: "#CFE4FF",
      onSecondary: "#0B1A2E",
      accent: "#2457E6",
      tints: [
        { name: "Sky", hex: "#CFE4FF", note: "Name your agents" },
        { name: "Lilac", hex: "#DCD0FF", note: "Build your team" },
        { name: "Lime", hex: "#EEF6D3", note: "Command the room" },
        { name: "Peach", hex: "#FFE1CC", note: "Nothing leaves" },
      ],
      agents: { teal: "#0EA5C9", red: "#F0533F", purple: "#7C5CFF" },
    },
    colorNotes:
      "Navy replaces black everywhere text appears; it reads softer at 16px and still hits AAA. Pastels are only ever backgrounds, never text. The one saturated blue is reserved for links and the focus ring.",
    type: {
      display: {
        family: "Bricolage Grotesque",
        cssVar: "--font-bricolage",
        fallback: "system-ui, sans-serif",
        weights: "500, 600 (opsz 96)",
        note: "Optical size axis: the display cut has sharper terminals than the text cut.",
      },
      body: {
        family: "Geist",
        cssVar: "--font-geist-sans",
        fallback: "system-ui, sans-serif",
        weights: "400, 500",
        note: "Already in the project. Neutral enough to let Bricolage do the talking.",
      },
      scale: [
        { name: "Display", px: 80, lineHeight: 1.0, weight: 500, tracking: "-0.035em", font: "display" },
        { name: "H1", px: 64, lineHeight: 1.05, weight: 500, tracking: "-0.03em", font: "display" },
        { name: "H2", px: 48, lineHeight: 1.1, weight: 500, tracking: "-0.025em", font: "display" },
        { name: "H3", px: 28, lineHeight: 1.2, weight: 500, tracking: "-0.01em", font: "display" },
        { name: "Lead", px: 18, lineHeight: 1.5, weight: 400, tracking: "0", font: "body" },
        { name: "Body", px: 16, lineHeight: 1.5, weight: 400, tracking: "0", font: "body" },
        { name: "Small", px: 14, lineHeight: 1.45, weight: 500, tracking: "0", font: "body" },
        { name: "Caption", px: 12, lineHeight: 1.4, weight: 500, tracking: "0.02em", font: "body" },
      ],
      notes:
        "Headlines at 500, never bolder. Lead text is muted grey-blue so the headline owns the contrast. Caption is sentence case, not uppercase.",
    },
    spacing: {
      base: 8,
      steps: spacingSteps,
      section: 112,
      gutter: 24,
      stack: 12,
      notes: "Panels carry 48 of inner padding and a 32 radius. Gaps between panels are 16, so the page reads as one board.",
    },
    radius: { button: 20, input: 12, card: 32 },
    controls: {
      height: 44,
      fontSize: 16,
      fontWeight: 500,
      buttonRule: "Navy fill, soft pill. Secondary is a sky tint with navy text. Outline buttons exist only in the header.",
      inputRule: "White field on the off-white page, 12px radius, grey border, blue 2px ring on focus. Label above, help text below in Small.",
      treatment: "soft",
    },
  },
  {
    id: "quiet-operator",
    index: 3,
    name: "Quiet operator",
    premise: "White, black, one grey, one teal. Pills for every control.",
    drawsFrom:
      "x.ai Grok Bot: pure white page, one grotesk at 400 and 500, grey lead text, full-pill black buttons, colour only in the bot avatars and one teal state colour.",
    mood: "Strict and unhurried. Nothing decorates. Each agent is a coloured dot in an otherwise monochrome interface, which makes the dots feel like the product. It says: serious infrastructure, nothing to hide.",
    colors: {
      bg: "#FFFFFF",
      surface: "#F7F6F3",
      border: "#E6E4DF",
      ink: "#0A0A0A",
      muted: "#6B6F75",
      primary: "#0A0A0A",
      onPrimary: "#FFFFFF",
      secondary: "#ECEBE7",
      onSecondary: "#0A0A0A",
      accent: "#0A7C86",
      tints: [
        { name: "Warm white", hex: "#F7F6F3", note: "alternate sections" },
        { name: "Teal wash", hex: "#EAF8F9", note: "active tab, status" },
        { name: "Graphite", hex: "#252525", note: "code, screenshots" },
      ],
      agents: { teal: "#0A9AA8", red: "#E0452F", purple: "#7A5AF5" },
    },
    colorNotes:
      "Two neutrals and one grey do all the work. Teal is the only state colour: active, listening, success. Agent colours appear at avatar size and never as fills behind text.",
    type: {
      display: {
        family: "Schibsted Grotesk",
        cssVar: "--font-schibsted",
        fallback: "system-ui, sans-serif",
        weights: "400, 500",
        note: "One family for everything. Display cut is the same face at 500 with tight tracking.",
      },
      body: {
        family: "Schibsted Grotesk",
        cssVar: "--font-schibsted",
        fallback: "system-ui, sans-serif",
        weights: "400, 500",
        note: "Body at 400. Nothing on the page is bold.",
      },
      scale: [
        { name: "Display", px: 64, lineHeight: 1.0, weight: 500, tracking: "-0.03em", font: "display" },
        { name: "H1", px: 56, lineHeight: 1.05, weight: 500, tracking: "-0.025em", font: "display" },
        { name: "H2", px: 40, lineHeight: 1.1, weight: 400, tracking: "-0.02em", font: "display" },
        { name: "H3", px: 22, lineHeight: 1.3, weight: 500, tracking: "0", font: "display" },
        { name: "Lead", px: 18, lineHeight: 1.6, weight: 400, tracking: "0", font: "body" },
        { name: "Body", px: 16, lineHeight: 1.6, weight: 400, tracking: "0", font: "body" },
        { name: "Small", px: 14, lineHeight: 1.45, weight: 500, tracking: "0", font: "body" },
        { name: "Caption", px: 12, lineHeight: 1.4, weight: 500, tracking: "0.04em", font: "mono", transform: "uppercase" },
      ],
      notes:
        "The smallest scale of the five. Hierarchy comes from grey versus black rather than size. Captions switch to mono so labels and hotkeys share one voice.",
    },
    spacing: {
      base: 8,
      steps: spacingSteps,
      section: 96,
      gutter: 24,
      stack: 12,
      notes: "Compact and even. Sections at 96, cards at 24 inside, and a 1px rule between rows instead of extra space.",
    },
    radius: { button: 999, input: 12, card: 16 },
    controls: {
      height: 44,
      fontSize: 15,
      fontWeight: 500,
      buttonRule: "Every button is a pill. Primary is black, secondary is the warm grey, tertiary is text with an arrow. Icon buttons are 36px circles.",
      inputRule: "Fields sit on the warm-white surface with no border until focus, then a 1px black outline. Labels are mono caps.",
      treatment: "pill",
    },
  },
  {
    id: "after-hours",
    index: 4,
    name: "After hours",
    premise: "Keep the dark room, add warm light and one amber action colour.",
    drawsFrom:
      "The current site plus lessons from all three: big mid-weight headlines, one action colour, grey lead text, tidy pill and card radii. The room's own lamp light picks the accent.",
    mood: "Night shift. The page is the room turned inside out: near-black, a warm off-white for text, and amber where you can act. Agent colours are allowed to glow here. It says: your agents work while you don't.",
    colors: {
      bg: "#0C0B10",
      surface: "#16151D",
      border: "#2A2833",
      ink: "#F3EFE6",
      muted: "#A29DAF",
      primary: "#F5A623",
      onPrimary: "#1A1206",
      secondary: "#26242F",
      onSecondary: "#F3EFE6",
      accent: "#F5A623",
      tints: [
        { name: "Amber", hex: "#F5A623", note: "actions, focus" },
        { name: "Ember", hex: "#3A2410", note: "amber panel" },
        { name: "Glass", hex: "#1E1C26", note: "pills, bubbles" },
        { name: "Rose", hex: "#FB5B6E", note: "errors" },
      ],
      agents: { teal: "#22D3EE", red: "#FB5B6E", purple: "#A78BFA" },
    },
    colorNotes:
      "Text is warm off-white, not pure white, so it matches the monitor glow in the video. Surfaces step up by lightness only, never by hue. Amber is the single action colour and doubles as the focus ring.",
    type: {
      display: {
        family: "Sora",
        cssVar: "--font-sora",
        fallback: "system-ui, sans-serif",
        weights: "500, 600",
        note: "Slightly squared geometry echoes the voxel room without going pixel.",
      },
      body: {
        family: "Geist",
        cssVar: "--font-geist-sans",
        fallback: "system-ui, sans-serif",
        weights: "400, 500",
        note: "Already in the project. Reads cleanly on dark at 16px.",
      },
      scale: [
        { name: "Display", px: 72, lineHeight: 1.0, weight: 600, tracking: "-0.03em", font: "display" },
        { name: "H1", px: 56, lineHeight: 1.05, weight: 600, tracking: "-0.025em", font: "display" },
        { name: "H2", px: 40, lineHeight: 1.1, weight: 500, tracking: "-0.02em", font: "display" },
        { name: "H3", px: 26, lineHeight: 1.2, weight: 500, tracking: "-0.01em", font: "display" },
        { name: "Lead", px: 19, lineHeight: 1.5, weight: 400, tracking: "0", font: "body" },
        { name: "Body", px: 16, lineHeight: 1.6, weight: 400, tracking: "0", font: "body" },
        { name: "Small", px: 14, lineHeight: 1.5, weight: 400, tracking: "0", font: "body" },
        { name: "Caption", px: 12, lineHeight: 1.4, weight: 500, tracking: "0.06em", font: "mono", transform: "uppercase" },
      ],
      notes:
        "Dark pages need a touch more line height and a lighter body weight, so Body is 16 at 1.6 and never 500. Mono captions match the transcript panel already in the hero.",
    },
    spacing: {
      base: 8,
      steps: spacingSteps,
      section: 96,
      gutter: 24,
      stack: 16,
      notes: "Sections at 96 with a hairline rule between them. Cards carry 24 inside and a 1px border rather than a shadow, since shadows vanish on black.",
    },
    radius: { button: 12, input: 12, card: 20 },
    controls: {
      height: 48,
      fontSize: 15,
      fontWeight: 600,
      buttonRule: "Primary is amber with near-black text and a faint amber glow on hover. Secondary is a glass pill: dark fill, hairline border, blur.",
      inputRule: "Field is darker than the page, hairline border, amber 2px ring on focus. Error state turns the border rose and the help text with it.",
      treatment: "glow",
    },
  },
  {
    id: "toy-box",
    index: 5,
    name: "Toy box",
    premise: "Flat voxel colours, hard ink outlines, chunky rounded controls.",
    drawsFrom:
      "Wispr Flow's loud colour chips and x.ai's per-bot colour avatars, pushed into a toy-like system that matches the mascots instead of the enterprise sites.",
    mood: "Playful and physical. Buttons look pressable because they cast a hard offset shadow. Each agent gets a full-strength colour block, not a dot. It says: three little characters at their desks, and you're the one who talks to them.",
    colors: {
      bg: "#FFF9EE",
      surface: "#FFFFFF",
      border: "#1E1B22",
      ink: "#1E1B22",
      muted: "#5C5763",
      primary: "#FF6B4A",
      onPrimary: "#1E1B22",
      secondary: "#FFC24B",
      onSecondary: "#1E1B22",
      accent: "#0F8F8F",
      tints: [
        { name: "Coral", hex: "#FF6B4A", note: "primary" },
        { name: "Marigold", hex: "#FFC24B", note: "secondary" },
        { name: "Mint", hex: "#BFEBDC", note: "success" },
        { name: "Sky", hex: "#C9E4FF", note: "info panels" },
      ],
      agents: { teal: "#12B5B0", red: "#F2503A", purple: "#8B5CF6" },
    },
    colorNotes:
      "Every fill gets a 2px ink outline, so bright colours still read as one drawing. Ink is a warm near-black. Text never sits on coral or marigold at sizes under 16px.",
    type: {
      display: {
        family: "Gabarito",
        cssVar: "--font-gabarito",
        fallback: "system-ui, sans-serif",
        weights: "600, 700",
        note: "Round, wide, friendly. Set tight so big words read as shapes.",
      },
      body: {
        family: "Onest",
        cssVar: "--font-onest",
        fallback: "system-ui, sans-serif",
        weights: "400, 500, 600",
        note: "Open counters keep it legible next to the loud display face.",
      },
      scale: [
        { name: "Display", px: 80, lineHeight: 0.98, weight: 700, tracking: "-0.03em", font: "display" },
        { name: "H1", px: 60, lineHeight: 1.02, weight: 700, tracking: "-0.025em", font: "display" },
        { name: "H2", px: 44, lineHeight: 1.08, weight: 700, tracking: "-0.02em", font: "display" },
        { name: "H3", px: 28, lineHeight: 1.2, weight: 600, tracking: "-0.01em", font: "display" },
        { name: "Lead", px: 20, lineHeight: 1.45, weight: 500, tracking: "0", font: "body" },
        { name: "Body", px: 17, lineHeight: 1.55, weight: 400, tracking: "0", font: "body" },
        { name: "Small", px: 14, lineHeight: 1.5, weight: 600, tracking: "0", font: "body" },
        { name: "Caption", px: 12, lineHeight: 1.4, weight: 700, tracking: "0.1em", font: "body", transform: "uppercase" },
      ],
      notes:
        "The only variant that uses bold. Small and Caption go heavier than Body so labels look like stickers on the toy.",
    },
    spacing: {
      base: 8,
      steps: spacingSteps,
      section: 80,
      gutter: 24,
      stack: 16,
      notes: "Tighter sections at 80 because the colour blocks already separate them. Cards get 32 inside and a 4px offset shadow that counts as space.",
    },
    radius: { button: 14, input: 14, card: 24 },
    controls: {
      height: 48,
      fontSize: 16,
      fontWeight: 700,
      buttonRule: "2px ink outline, 4px hard shadow. Hover moves the button 2px toward the shadow; active sits flat on it. Primary coral, secondary marigold, ghost is white.",
      inputRule: "White field, 2px ink outline, same radius as buttons. Focus adds the hard shadow. Errors fill the field a pale coral.",
      treatment: "toy",
    },
  },
];

/** Shared findings from the three reference sites, shown above the tiles. */
export const referenceFindings = [
  {
    site: "Wispr Flow",
    url: "https://wisprflow.ai/",
    bg: "#FFFFEB",
    ink: "#1A1A1A",
    accents: ["#F0D7FF", "#034F46", "#FFA946", "#FF6C4C"],
    display: "EB Garamond 400",
    body: "Figtree 500",
    h1: "96px, -0.03em",
    body16: "20px lead, 16px body",
    button: "8px radius, 16px 600",
    takeaway:
      "A cream page with a large oldstyle serif and italic emphasis. Sans body at 500 keeps it crisp. Colour is rationed to chips and CTAs; the primary button is a pale lilac, not a dark fill.",
  },
  {
    site: "Calendly",
    url: "https://calendly.com/",
    bg: "#FCFBF8",
    ink: "#071A31",
    accents: ["#C3DFFE", "#D4C2FF", "#F2F8DE", "#6BB1FF"],
    display: "Calendly Sans 500",
    body: "Geist 400",
    h1: "72px, -2px",
    body16: "18px lead, 16px body, grey #5F6D77",
    button: "20px radius, 16px 500, navy fill",
    takeaway:
      "Navy instead of black for all text. Headline at 500 weight. Grey lead copy. Sections are nested rounded panels tinted with pastels, and each product gets its own tint.",
  },
  {
    site: "x.ai Grok Bot",
    url: "https://x.ai/bot",
    bg: "#FFFFFF",
    ink: "#0A0A0A",
    accents: ["#F9F8F6", "#0093A3", "#252525"],
    display: "Universal Sans Display 500",
    body: "Universal Sans 400",
    h1: "60px, -0.02em",
    body16: "18px lead grey #7D8187, 16px body",
    button: "9999px pill, 16px 400, black fill",
    takeaway:
      "Almost no colour. One grotesk at two weights. Pills everywhere. The only colour on the page is the bots' avatars and one teal state colour, which makes each bot feel like a character.",
  },
] as const;

export const sharedPatterns = [
  "All three are light pages. None of them uses a dark theme for the landing.",
  "Headlines are large (60 to 96px), tight (-0.02 to -0.03em), and mid-weight (400 to 500). Nobody uses bold.",
  "Lead copy is a step down and a shade lighter: 18 to 20px in grey, so the headline owns the contrast.",
  "One primary button fill, one radius, repeated verbatim in the hero, mid-page and the footer.",
  "Colour is scarce and assigned: a tint per feature (Calendly), per chip (Wispr), per bot (x.ai).",
  "Product screenshots or demos appear inside a large rounded panel with generous padding, never edge to edge.",
] as const;
