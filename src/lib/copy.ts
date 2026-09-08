export type BeatId = "name" | "team" | "command" | "local";

export const copy = {
  siteName: "Open Room",
  description:
    "Talk to your Claude Code agents without leaving your window. A desktop app that gives each agent a name, a voice and its own folder.",
  eyebrow: "Open Room. A desktop app for Claude Code.",
  headline: "Talk to your agents without leaving your window.",
  subheadline:
    "Give each Claude Code agent a name, a voice and its own folder. Say hey and the name from wherever you are, and it comes back when it's done or stuck.",
  narration:
    "Example: say hey Juno, run the tests. Juno gets to work. Ask Atlas a question while he works and he answers straight away, then reports back when the job is done.",
  roomAlt: "A small dark room where three voxel agents, teal, red and purple, type at their own desks lit by their screens.",
  crew: {
    alt: "Five pixel agents, Clawd, Bit, Terminal, Block and Loop, seen from behind at a row of desks, each typing at its own screen.",
    narration:
      "Example: say hey Bit, run the tests. Bit gets to work. Ask Block a question while it works and it answers straight away, then reports back when the job is done.",
  },
  cta: {
    label: "Email address",
    placeholder: "you@example.com",
    button: "Tell me when it's ready",
    under: "Free and open source. Uses the Claude Code login you already have.",
  },
  trust: "Nothing leaves your machine. No keys, no telemetry, speech in and out runs locally.",
  beats: [
    {
      id: "name",
      title: "Name your agents",
      body: "A name, a colour, a voice, a folder and a role in plain text.",
      alt: "Three small voxel agents, teal, red and purple, standing on a rug in a dark room and facing you.",
    },
    {
      id: "team",
      title: "Build your team",
      body: "Three of them working at once, each in its own project, asking before anything you told it to ask about.",
      alt: "The three agents at their desks, each screen glowing in that agent's colour.",
    },
    {
      id: "command",
      title: "Command the room",
      body: "Hey plus the name, a hotkey, or typing. Any name works instantly. A question is never dropped.",
      alt: "The red agent has turned its chair to face you while the other two keep working.",
    },
    {
      id: "local",
      title: "Nothing leaves the room",
      body: "No keys, no telemetry, no server but Anthropic's. Speech in and out runs on your machine.",
      alt: "The room seen from far away, a small lit cube alone in the dark.",
    },
  ] as const satisfies readonly { id: BeatId; title: string; body: string; alt: string }[],
  footer: {
    githubUrl: "https://github.com/TheLinc/open-room",
    githubLabel: "Open Room on GitHub",
  },
  form: {
    ok: "You're on the list.",
    already: "You're already on the list.",
    invalid: "That doesn't look like an email address.",
    failed: "Something went wrong. Try again in a moment.",
  },
} as const;
