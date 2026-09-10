/**
 * Every line of copy on the product page. Each claim traces to
 * copy/company-brain.md, which was mined from the app README. Voice: plain,
 * specific, unhurried; second person; no exclamation marks.
 */

export const links = {
  github: "https://github.com/TheLinc/open-room",
  releases: "https://github.com/TheLinc/open-room/releases",
  site: "https://openroom.dev",
} as const;

export const copy = {
  siteName: "Open Room",
  description:
    "Talk to your Claude Code agents without leaving your window. A free desktop app that gives each agent a name, a voice and its own folder.",

  nav: [
    { label: "How it works", href: "#how" },
    { label: "Features", href: "#features" },
    { label: "FAQ", href: "#faq" },
  ],

  hero: {
    /** The first word becomes the voice pill; it stays in the markup for screen readers. */
    headline: "Talk to your agents without leaving your window.",
    lead: "Give each Claude Code agent a name, a voice and its own folder. Say hey and the name from wherever you are, and it comes back when it's done or stuck.",
    download: "Download for Windows",
    source: "View the source",
    under: "macOS soon. Nothing leaves your machine.",
    caption: "An illustration of the app, drawn for this page.",
    narration:
      "Example: you say hey Bit, run the tests. Bit starts working in its own folder. You ask Block about the CI pipeline while Bit works; Block checks, then asks permission to run the deploy command, and you allow it once. Bit reports that the tests passed. You ask Terminal what Block changed, and it asks whether you want the diff. Block reports that staging is live.",
  },

  how: {
    title: "Three moves. No new window.",
    lead: "Each agent is a real Claude Code session in its own folder. You address it by name, from wherever you are.",
    steps: [
      {
        id: "name",
        title: "Name an agent",
        body: "A name, a colour, a voice and a folder. Its role lives in a plain AGENT.md you can read and edit.",
        source: "One AGENT.md and one WORKLOG.md per agent",
      },
      {
        id: "say",
        title: "Say hey and the job",
        body: "Any name works instantly, no training. A push-to-talk hotkey or typing does the same thing.",
        source: "Custom wake words, no training",
      },
      {
        id: "back",
        title: "It comes back",
        body: "A native notification, or its own voice. If it has a question, it asks, and a question is never dropped.",
        source: "Speech queue, native notifications",
      },
    ],
    caption: "Demonstrations drawn for this page, not captures.",
  },

  features: {
    title: "Built for more than one at a time.",
    lead: "Each feature below comes from the app as it is today, not a roadmap.",
    items: [
      {
        id: "voice",
        agent: "bit",
        title: "Address one agent from anywhere",
        body: "Say hey and its name, hold a hotkey, or type. You don't have to switch to its window, or find it.",
        detail: "Wake word · hotkey · typing",
      },
      {
        id: "background",
        agent: "block",
        title: "It finds you when it's done or stuck",
        body: "Agents work in the background and report through a native notification or out loud in their own voice.",
        detail: "Notification · spoken reply",
      },
      {
        id: "permissions",
        agent: "terminal",
        title: "Nothing you didn't agree to",
        body: "Every tool has three states: ask, always allow, never allow. There is no bypass mode in the UI, including from voice.",
        detail: "Ask · always allow · never allow",
      },
      {
        id: "memory",
        agent: "loop",
        title: "It remembers yesterday",
        body: "Conversations persist across restarts, and each agent keeps a WORKLOG.md of what it did.",
        detail: "Persistent sessions · WORKLOG.md",
      },
      {
        id: "cost",
        agent: "clawd",
        title: "You see the cost as it happens",
        body: "Model, effort and permission mode per agent. A banner shows your rate limit; a meter shows context use.",
        detail: "Quota banner · context meter",
      },
    ],
    caption: "Drawn for this page.",
  },

  openSource: {
    title: "Free. Open source. Your own login.",
    body: "MIT licensed. It uses the Claude Code subscription you already pay for, and every turn bills that. Running five agents means five sessions on one account, and the app tells you when you hit the limit.",
    repo: "Open Room on GitHub",
    licence: "MIT licence",
  },

  safety: {
    title: "Nothing leaves your machine.",
    body: "No API keys, no telemetry, no server but Anthropic's. Speech in and out runs locally. Voice input ships off, wake words are a second opt-in, and every tool permission is yours to grant.",
    facts: [
      {
        key: "Keys",
        text: "Uses the Claude Code login you already have. Nothing to paste.",
      },
      { key: "Mic", text: "Off by default. Wake words are a separate opt-in." },
      { key: "Tools", text: "Ask, always allow, never allow. No bypass mode." },
      { key: "Quota", text: "A banner shows your rate limit as it happens." },
    ],
  },

  start: {
    title: "Running in a few minutes.",
    steps: [
      {
        title: "Install",
        body: "Download the Windows installer from the latest release and run it.",
      },
      {
        title: "Sign in",
        body: "Use the Claude Code login you already have. No keys.",
      },
      {
        title: "Name your first agent",
        body: "Pick a name, a folder and a voice. Say hey and the name.",
      },
    ],
    platforms: "Windows today. macOS is configured but not yet run on a Mac.",
  },

  faq: {
    title: "Good questions.",
    items: [
      {
        q: "Does it need my API key?",
        a: "No. It uses the Claude Code login you already have. Each agent is a real Claude Code session, so every turn bills your existing subscription.",
      },
      {
        q: "What does it send, and where?",
        a: "Nothing leaves your machine except Claude Code's own traffic to Anthropic. There is no telemetry and no server of ours. Speech to text and text to speech both run locally.",
      },
      {
        q: "Is an open microphone safe?",
        a: "Voice input ships off. Turning it on is one opt-in; wake words are a second one. A push-to-talk hotkey works without either.",
      },
      {
        q: "Will it eat my quota?",
        a: "Yes, in proportion. Five agents means five sessions on one account. The app shows your rate limit as a banner and your context use as a meter, so you see it as it happens.",
      },
      {
        q: "Can an agent do something I didn't ask for?",
        a: "Permissions are per tool, with three states: ask, always allow, never allow. There is no bypass mode in the UI, including from voice.",
      },
    ],
  },

  /** The waitlist is off the page; its server action still needs these. */
  form: {
    invalid: "That doesn't look like an email address.",
    failed: "Something went wrong. Try again in a moment.",
    done: "You're on the list.",
  },

  footer: {
    licence: "Open Room is free and MIT licensed.",
    github: "GitHub",
    releases: "Releases",
  },
} as const;
