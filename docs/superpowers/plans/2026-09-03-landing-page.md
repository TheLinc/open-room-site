# Open Room landing page implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the one-page Open Room coming-soon site: an animated hero built from eight generated stills and typed text, four story sections, a waitlist form backed by Resend, and an Open Graph image.

**Architecture:** A single Next.js App Router page. Server components render copy and layout. One client component owns a clock and derives the hero state from a pure, tested timeline function; it swaps stacked images by opacity and types text. The waitlist is a server action that posts to Resend's contacts API through a small tested module. Frames are cropped from the approved 2k masters by a script into committed WebP files.

**Tech Stack:** Next.js 16.3.4 (App Router, `src/` layout, `@/*` alias), React 19.2, TypeScript 5, Tailwind CSS 4, Geist Sans and Geist Mono via `next/font/google`, Vitest with React Testing Library, `sharp` for the frame build script, Resend REST API with `fetch`. Node 22.

**Spec:** `docs/superpowers/specs/2026-09-03-hero-art-direction-design.md`. Copy inputs: `copy/company-brain.md`. Art records: `assets/higgsfield/keyframes/README.md`.

## Global constraints

- Copy is fixed by the spec and lives in one file, `src/lib/copy.ts`. Never retype a string elsewhere.
- Headline: "Talk to your agents without leaving your window." Button: "Tell me when it's ready." Eyebrow: "Open Room. A desktop app for Claude Code."
- No navigation bar. One footer link, to https://github.com/TheLinc/open-room. No analytics, no third-party scripts.
- Page background is `#010206`, the sampled background of the generated frames. Foreground `#ededed`.
- Agent colours: teal `#06b6d4`, red `#f43f5e`, purple `#8b5cf6`. Teal is Juno, red is Atlas, purple is unnamed.
- Hero loop is 18000 ms, typing at 45 ms per character, cross-fades 300 ms, text fade from 17400 ms. Reduced motion shows frame F1 with the first talk line complete and no cycling.
- All animation text is rendered by the site. No text is baked into images.
- Next 16 deprecates `priority` on `next/image`; use `preload`. The docs say not to combine `preload` with `loading`, so the first frame gets `preload` and the others get `loading="eager"`. Do not read Next docs from memory; the version's docs are in `node_modules/next/dist/docs/`.
- Waitlist: `POST https://api.resend.com/contacts` with `Authorization: Bearer <RESEND_API_KEY>`, body `{ email, unsubscribed: false }` plus `segments: [{ id }]` when `RESEND_SEGMENT_ID` is set.
- `next dev` rewrites the block in `AGENTS.md`. Commit that change with your work rather than reverting it.
- Every task ends with `npm run lint` and `npm test` passing before its commit.

---

## File structure

Create:

- `.env.example`: names of the two Resend variables.
- `vitest.config.mts`: Vitest with jsdom, React plugin, tsconfig paths.
- `scripts/build-room-frames.mjs`: crops the 2k masters into `src/assets/room/*.webp` and `og-room.png`.
- `src/assets/room/F1.webp` … `F5.webp`, `S1.webp`, `S2.webp`, `S4.webp`, `og-room.png`: generated, committed.
- `src/lib/copy.ts`: every string on the page.
- `src/lib/hero-script.ts`: the timeline and `stateAt(ms)`.
- `src/lib/hero-script.test.ts`
- `src/lib/room-frames.ts`: static imports of the frames keyed by id.
- `src/lib/room-frames.test.ts`: dimension invariants of the generated files.
- `src/lib/waitlist.ts`: email validation and the Resend call, injected `fetch`.
- `src/lib/waitlist.test.ts`
- `src/lib/use-prefers-reduced-motion.ts`: media query hook.
- `src/app/actions.ts`: the `joinWaitlist` server action.
- `src/app/opengraph-image.tsx`: generated OG image.
- `src/components/hero.tsx`: server. Hero section shell, copy, hidden narration, form.
- `src/components/hero-loop.tsx`: client. Owns the clock, lays out the hero grid, renders `TalkPanel` and `RoomScene`.
- `src/components/talk-panel.tsx`: client, pure render of a `HeroState`.
- `src/components/talk-panel.test.tsx`
- `src/components/room-scene.tsx`: client. Five stacked frames, one visible.
- `src/components/waitlist-form.tsx`: client. `useActionState` form.
- `src/components/waitlist-form.test.tsx`
- `src/components/beat-section.tsx`: server. One story beat: heading, line, frame.
- `src/components/final-cta.tsx`: server. Headline repeated, form, frame F1.
- `src/components/site-footer.tsx`: server. One link.

Modify:

- `.gitignore`: ignore draft art, keep masters.
- `package.json`: scripts and dev dependencies.
- `src/app/globals.css`: dark theme only, agent colour tokens, font variables.
- `src/app/layout.tsx`: metadata, body classes.
- `src/app/page.tsx`: compose the page.
- `README.md`: env vars and the frame build script.

---

### Task 1: Keep the art masters, ignore the drafts

**Files:**
- Modify: `.gitignore`
- Commit: `assets/higgsfield/mascot-sheet.jpg`, `assets/higgsfield/keyframes/README.md`, `assets/higgsfield/keyframes/iso-test/pose/rest.png`, `assets/higgsfield/keyframes/hero/2k/*.png`, `assets/higgsfield/keyframes/sections/*.png`, `assets/higgsfield/keyframes/sections/2k/*.png`

**Interfaces:**
- Produces: the master files at the paths the build script in Task 3 reads.

- [ ] **Step 1: Add ignore rules for draft and rejected art**

Append to `.gitignore`:

```gitignore

# generated art: keep the approved masters and the README, ignore drafts, tests and rejects
assets/higgsfield/keyframes/base/
assets/higgsfield/keyframes/react/
assets/higgsfield/keyframes/iso-test/*.png
assets/higgsfield/keyframes/iso-test/pose/called*
assets/higgsfield/keyframes/hero/*.png
assets/higgsfield/keyframes/sections/S4-rejected*
```

- [ ] **Step 2: Check what will be committed**

Run: `git add -n assets .gitignore`
Expected: the list contains `mascot-sheet.jpg`, `keyframes/README.md`, `iso-test/pose/rest.png`, five files under `hero/2k/`, `sections/S1-name-them.png`, `sections/S2-all-working.png`, `sections/S4-far-away.png`, two files under `sections/2k/`. It contains nothing from `base/`, `react/`, no `iso-v*.png`, no `called*`, no `hero/F*.png` at the top level, no `S4-rejected*`.

- [ ] **Step 3: Commit**

```bash
git add .gitignore assets
git commit -m "chore: keep approved art masters, ignore drafts"
```

---

### Task 2: Test tooling and the copy module

**Files:**
- Create: `vitest.config.mts`
- Create: `src/lib/copy.ts`
- Create: `src/lib/copy.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `copy` object from `@/lib/copy`, shape shown below. Every later task imports strings from it.

- [ ] **Step 1: Install dev dependencies**

Run:

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
```

- [ ] **Step 2: Add scripts**

In `package.json`, replace the `scripts` block with:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest",
  "build:frames": "node scripts/build-room-frames.mjs"
}
```

- [ ] **Step 3: Create the Vitest config**

Create `vitest.config.mts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

- [ ] **Step 4: Write the failing copy test**

Create `src/lib/copy.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { copy } from "@/lib/copy";

describe("copy", () => {
  test("headline and button match the spec", () => {
    expect(copy.headline).toBe("Talk to your agents without leaving your window.");
    expect(copy.cta.button).toBe("Tell me when it's ready");
  });

  test("has four beats in spec order", () => {
    expect(copy.beats.map((b) => b.id)).toEqual(["name", "team", "command", "local"]);
  });
});
```

- [ ] **Step 5: Run it to see it fail**

Run: `npm test`
Expected: FAIL, cannot find module `@/lib/copy`.

- [ ] **Step 6: Create the copy module**

Create `src/lib/copy.ts`:

```ts
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
    "Example: say hey Juno, run the tests. Juno turns to you, then gets to work. Ask Atlas a question while he works and he answers straight away, then reports back when the job is done.",
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
```

- [ ] **Step 7: Run tests and lint**

Run: `npm test && npm run lint`
Expected: 2 tests pass, lint clean.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.mts src/lib/copy.ts src/lib/copy.test.ts
git commit -m "chore: vitest setup and page copy module"
```

---

### Task 3: Build the room frames from the masters

**Files:**
- Create: `scripts/build-room-frames.mjs`
- Create: `src/lib/room-frames.ts`
- Create: `src/lib/room-frames.test.ts`
- Generated: `src/assets/room/F1.webp`, `F2.webp`, `F3.webp`, `F4.webp`, `F5.webp`, `S1.webp`, `S2.webp`, `S4.webp`, `og-room.png`

**Interfaces:**
- Consumes: master PNGs from Task 1.
- Produces: `heroFrames: Record<FrameId, StaticImageData>` and `sectionFrames: Record<BeatId, StaticImageData>` from `@/lib/room-frames`; `FrameId` type is defined in Task 4's module, so this task defines it here first and Task 4 re-exports it.

- [ ] **Step 1: Install sharp**

Run: `npm install -D sharp`

- [ ] **Step 2: Write the failing dimensions test**

Create `src/lib/room-frames.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import sharp from "sharp";
import { join } from "node:path";

const dir = join(process.cwd(), "src/assets/room");

async function size(file: string) {
  const meta = await sharp(join(dir, file)).metadata();
  return { width: meta.width, height: meta.height };
}

describe("room frames", () => {
  test("hero frames share one size so the cross-fade never shifts", async () => {
    const sizes = await Promise.all(
      ["F1.webp", "F2.webp", "F3.webp", "F4.webp", "F5.webp"].map(size),
    );
    for (const s of sizes) expect(s).toEqual(sizes[0]);
    // 2544 by 2160 scaled to 1600 wide: 2160 * 1600 / 2544 = 1358.49, sharp rounds to 1358
    expect(sizes[0]).toEqual({ width: 1600, height: 1358 });
  });

  test("section frames exist at the expected sizes", async () => {
    expect(await size("S1.webp")).toEqual({ width: 1600, height: 1358 });
    expect(await size("S2.webp")).toEqual({ width: 1600, height: 1358 });
    expect(await size("S4.webp")).toEqual({ width: 792, height: 672 });
    expect(await size("og-room.png")).toEqual({ width: 1200, height: 1019 });
  });
});
```

- [ ] **Step 3: Run it to see it fail**

Run: `npm test -- room-frames`
Expected: FAIL, input file is missing.

- [ ] **Step 4: Write the build script**

Create `scripts/build-room-frames.mjs`:

```js
// Crops the approved masters to the room half of the frame and writes web-sized files.
// The left half of every master is empty background; the page draws that itself.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const IN = "assets/higgsfield/keyframes";
const OUT = "src/assets/room";

// Fractions of the source frame. The room sits in the right half with glow falloff around it.
const BOX = { left: 0.5, top: 0, width: 0.5, height: 1 };
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;

const frames = [
  ["F1", `${IN}/hero/2k/F1-rest-atlas-working.png`],
  ["F2", `${IN}/hero/2k/F2-juno-called.png`],
  ["F3", `${IN}/hero/2k/F3-both-working.png`],
  ["F4", `${IN}/hero/2k/F4-atlas-called.png`],
  ["F5", `${IN}/hero/2k/F5-atlas-reports.png`],
  ["S1", `${IN}/sections/2k/S1-name-them.png`],
  ["S2", `${IN}/sections/2k/S2-all-working.png`],
  ["S4", `${IN}/sections/S4-far-away.png`],
];

async function region(file) {
  const meta = await sharp(file).metadata();
  return {
    left: Math.round(meta.width * BOX.left),
    top: Math.round(meta.height * BOX.top),
    width: Math.round(meta.width * BOX.width),
    height: Math.round(meta.height * BOX.height),
  };
}

await mkdir(OUT, { recursive: true });

for (const [id, file] of frames) {
  const r = await region(file);
  await sharp(file)
    .extract(r)
    .resize({ width: Math.min(r.width, MAX_WIDTH) })
    .webp({ quality: WEBP_QUALITY })
    .toFile(`${OUT}/${id}.webp`);
  console.log(id, "from", file, r);
}

// PNG copy of F1 for the Open Graph route, which cannot read WebP.
{
  const [, file] = frames[0];
  const r = await region(file);
  await sharp(file).extract(r).resize({ width: 1200 }).png().toFile(`${OUT}/og-room.png`);
  console.log("og-room.png from", file);
}
```

- [ ] **Step 5: Run the script**

Run: `npm run build:frames`
Expected: nine lines of output, and `ls src/assets/room` shows eight `.webp` files and `og-room.png`. Each hero WebP is under 400 KB (`ls -la src/assets/room`).

- [ ] **Step 6: Run the test again**

Run: `npm test -- room-frames`
Expected: PASS.

- [ ] **Step 7: Create the frames module**

Create `src/lib/room-frames.ts`:

```ts
import type { StaticImageData } from "next/image";
import type { BeatId } from "@/lib/copy";
import F1 from "@/assets/room/F1.webp";
import F2 from "@/assets/room/F2.webp";
import F3 from "@/assets/room/F3.webp";
import F4 from "@/assets/room/F4.webp";
import F5 from "@/assets/room/F5.webp";
import S1 from "@/assets/room/S1.webp";
import S2 from "@/assets/room/S2.webp";
import S4 from "@/assets/room/S4.webp";

export type FrameId = "F1" | "F2" | "F3" | "F4" | "F5";

export const heroFrames: Record<FrameId, StaticImageData> = { F1, F2, F3, F4, F5 };

export const heroFrameIds: FrameId[] = ["F1", "F2", "F3", "F4", "F5"];

export const sectionFrames: Record<BeatId, StaticImageData> = {
  name: S1,
  team: S2,
  command: F4,
  local: S4,
};
```

- [ ] **Step 8: Type-check, lint, test**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: all clean. If `tsc` cannot resolve `*.webp`, confirm `next-env.d.ts` exists at the repo root (it is generated by `next dev` or `next build`; run `npx next build` once if missing).

- [ ] **Step 9: Commit**

```bash
git add scripts/build-room-frames.mjs src/assets/room src/lib/room-frames.ts src/lib/room-frames.test.ts package.json package-lock.json
git commit -m "feat: build web-sized room frames from the approved masters"
```

---

### Task 4: The hero timeline as a pure function

**Files:**
- Create: `src/lib/hero-script.ts`
- Create: `src/lib/hero-script.test.ts`

**Interfaces:**
- Consumes: `FrameId` from `@/lib/room-frames`.
- Produces: `stateAt(elapsedMs: number): HeroState`, `reducedMotionState(): HeroState`, constants `CHAR_MS`, `LOOP_MS`, `FADE_AT_MS`, types `HeroState`, `AgentColor`, `Pip`, `Reply`.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/hero-script.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import {
  CHAR_MS,
  FADE_AT_MS,
  LOOP_MS,
  SCRIPT,
  reducedMotionState,
  stateAt,
} from "@/lib/hero-script";

describe("hero script", () => {
  test("events are sorted by time", () => {
    const times = SCRIPT.map((e) => e.at);
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  test("opens at rest with Atlas already working", () => {
    const s = stateAt(0);
    expect(s.frame).toBe("F1");
    expect(s.talk).toBeNull();
    expect(s.replies).toEqual([]);
    expect(s.pips).toEqual([{ name: "Atlas", color: "red", status: "working" }]);
    expect(s.fading).toBe(false);
  });

  test("types the first line and turns Juno on her name", () => {
    expect(stateAt(1000).talk).toEqual({ color: "teal", typed: "", full: "hey Juno, run the tests" });
    const before = stateAt(1000 + 7 * CHAR_MS);
    expect(before.talk?.typed).toBe("hey Jun");
    expect(before.frame).toBe("F1");
    const onName = stateAt(1000 + 8 * CHAR_MS);
    expect(onName.talk?.typed).toBe("hey Juno");
    expect(onName.frame).toBe("F2");
    expect(stateAt(3000).talk?.typed).toBe("hey Juno, run the tests");
  });

  test("both work at four seconds", () => {
    const s = stateAt(4000);
    expect(s.frame).toBe("F3");
    expect(s.pips.map((p) => p.name)).toEqual(["Atlas", "Juno"]);
  });

  test("asks Atlas and turns him on his name", () => {
    expect(stateAt(6000).talk).toEqual({
      color: "red",
      typed: "",
      full: "hey Atlas, what's the status of my CI pipeline?",
    });
    expect(stateAt(6000).frame).toBe("F3");
    expect(stateAt(6000 + 9 * CHAR_MS).frame).toBe("F4");
  });

  test("Atlas answers immediately, then reports and hops off his chair", () => {
    const answer = stateAt(9500);
    expect(answer.replies).toEqual([{ name: "Atlas", color: "red", text: "Let me check that for you." }]);
    expect(answer.frame).toBe("F3");
    const report = stateAt(13500);
    expect(report.replies.map((r) => r.text)).toEqual([
      "Let me check that for you.",
      "The CI pipeline ran successfully.",
    ]);
    expect(report.frame).toBe("F5");
    expect(report.pips).toEqual([
      { name: "Atlas", color: "red", status: "done" },
      { name: "Juno", color: "teal", status: "working" },
    ]);
  });

  test("fades near the end and wraps", () => {
    expect(stateAt(FADE_AT_MS - 1).fading).toBe(false);
    expect(stateAt(FADE_AT_MS).fading).toBe(true);
    expect(stateAt(LOOP_MS)).toEqual(stateAt(0));
    expect(stateAt(LOOP_MS + 1360)).toEqual(stateAt(1360));
  });

  test("reduced motion shows the rest frame with the first line complete", () => {
    const s = reducedMotionState();
    expect(s.frame).toBe("F1");
    expect(s.talk?.typed).toBe("hey Juno, run the tests");
    expect(s.fading).toBe(false);
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- hero-script`
Expected: FAIL, cannot find module `@/lib/hero-script`.

- [ ] **Step 3: Implement the script**

Create `src/lib/hero-script.ts`:

```ts
import type { FrameId } from "@/lib/room-frames";

export type { FrameId };
export type AgentColor = "teal" | "red";
export type PipStatus = "working" | "done";

export interface Pip {
  name: string;
  color: AgentColor;
  status: PipStatus;
}

export interface Reply {
  name: string;
  color: AgentColor;
  text: string;
}

export interface Talk {
  color: AgentColor;
  typed: string;
  full: string;
}

export interface HeroState {
  frame: FrameId;
  talk: Talk | null;
  replies: Reply[];
  pips: Pip[];
  fading: boolean;
}

export const CHAR_MS = 45;
export const LOOP_MS = 18000;
export const FADE_AT_MS = 17400;

export type ScriptEvent =
  | { at: number; kind: "frame"; frame: FrameId }
  | { at: number; kind: "pips"; pips: Pip[] }
  | { at: number; kind: "reply"; reply: Reply }
  | {
      at: number;
      kind: "talk";
      color: AgentColor;
      text: string;
      nameChars: number;
      frameOnName: FrameId;
    };

const atlasWorking: Pip = { name: "Atlas", color: "red", status: "working" };
const junoWorking: Pip = { name: "Juno", color: "teal", status: "working" };
const atlasDone: Pip = { name: "Atlas", color: "red", status: "done" };

// Times in ms from loop start. Frame changes on a name happen when the name's last
// character is typed, so they are derived from the talk event rather than listed.
export const SCRIPT: ScriptEvent[] = [
  { at: 0, kind: "frame", frame: "F1" },
  { at: 0, kind: "pips", pips: [atlasWorking] },
  {
    at: 1000,
    kind: "talk",
    color: "teal",
    text: "hey Juno, run the tests",
    nameChars: "hey Juno".length,
    frameOnName: "F2",
  },
  { at: 4000, kind: "frame", frame: "F3" },
  { at: 4000, kind: "pips", pips: [atlasWorking, junoWorking] },
  {
    at: 6000,
    kind: "talk",
    color: "red",
    text: "hey Atlas, what's the status of my CI pipeline?",
    nameChars: "hey Atlas".length,
    frameOnName: "F4",
  },
  { at: 9500, kind: "reply", reply: { name: "Atlas", color: "red", text: "Let me check that for you." } },
  { at: 9500, kind: "frame", frame: "F3" },
  {
    at: 13500,
    kind: "reply",
    reply: { name: "Atlas", color: "red", text: "The CI pipeline ran successfully." },
  },
  { at: 13500, kind: "frame", frame: "F5" },
  { at: 13500, kind: "pips", pips: [atlasDone, junoWorking] },
];

export function stateAt(elapsedMs: number): HeroState {
  const t = ((elapsedMs % LOOP_MS) + LOOP_MS) % LOOP_MS;
  let frame: FrameId = "F1";
  let pips: Pip[] = [];
  let talk: Talk | null = null;
  const replies: Reply[] = [];

  for (const ev of SCRIPT) {
    if (ev.at > t) break;
    switch (ev.kind) {
      case "frame":
        frame = ev.frame;
        break;
      case "pips":
        pips = ev.pips;
        break;
      case "reply":
        replies.push(ev.reply);
        break;
      case "talk": {
        const chars = Math.min(ev.text.length, Math.floor((t - ev.at) / CHAR_MS));
        talk = { color: ev.color, typed: ev.text.slice(0, chars), full: ev.text };
        if (chars >= ev.nameChars) frame = ev.frameOnName;
        break;
      }
    }
  }

  return { frame, talk, replies, pips, fading: t >= FADE_AT_MS };
}

export function reducedMotionState(): HeroState {
  return { ...stateAt(3000), frame: "F1", fading: false };
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- hero-script`
Expected: 8 tests pass.

- [ ] **Step 5: Lint and commit**

Run: `npm run lint`

```bash
git add src/lib/hero-script.ts src/lib/hero-script.test.ts
git commit -m "feat: hero timeline as a pure function"
```

---

### Task 5: Theme, metadata and body

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: Tailwind colour utilities `agent-teal`, `agent-red`, `agent-purple` (as `text-agent-teal`, `bg-agent-red`, and so on), `font-sans` and `font-mono` bound to Geist.

- [ ] **Step 1: Replace globals.css**

Replace the whole of `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --background: #010206;
  --foreground: #ededed;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-agent-teal: #06b6d4;
  --color-agent-red: #f43f5e;
  --color-agent-purple: #8b5cf6;
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

html {
  color-scheme: dark;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Update the layout metadata and body**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { copy } from "@/lib/copy";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://openroom.dev"),
  title: copy.siteName,
  description: copy.description,
  openGraph: {
    title: copy.headline,
    description: copy.description,
    url: "https://openroom.dev",
    siteName: copy.siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: copy.headline,
    description: copy.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Check it renders**

Run: `npm run dev` and open http://localhost:3000.
Expected: near-black page with the placeholder "Open Room" heading in Geist. Stop the dev server. `git status` shows `AGENTS.md` modified by `next dev`; keep it.

- [ ] **Step 4: Lint, test, commit**

Run: `npm run lint && npm test`

```bash
git add src/app/globals.css src/app/layout.tsx AGENTS.md
git commit -m "feat: dark theme, agent colour tokens and site metadata"
```

---

### Task 6: Room scene, talk panel and the hero loop

**Files:**
- Create: `src/lib/use-prefers-reduced-motion.ts`
- Create: `src/components/room-scene.tsx`
- Create: `src/components/talk-panel.tsx`
- Create: `src/components/talk-panel.test.tsx`
- Create: `src/components/hero-loop.tsx`

**Interfaces:**
- Consumes: `stateAt`, `reducedMotionState`, `HeroState`, `AgentColor` from `@/lib/hero-script`; `heroFrames`, `heroFrameIds` from `@/lib/room-frames`; `copy.eyebrow`.
- Produces: `HeroLoop({ children })` client component that renders the hero grid: eyebrow, talk panel and `children` in the left column, the room in the right column. `TalkPanel({ state })` and `RoomScene({ frame })` are internal but exported for tests.

- [ ] **Step 1: Write the failing talk panel test**

Create `src/components/talk-panel.test.tsx`:

```tsx
import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { TalkPanel } from "@/components/talk-panel";
import { stateAt } from "@/lib/hero-script";

describe("TalkPanel", () => {
  test("shows the typed line, replies and pips at the report beat", () => {
    render(<TalkPanel state={stateAt(13500)} />);
    expect(screen.getByText("hey Atlas, what's the status of my CI pipeline?")).toBeDefined();
    expect(screen.getByText("Let me check that for you.")).toBeDefined();
    expect(screen.getByText("The CI pipeline ran successfully.")).toBeDefined();
    expect(screen.getByText("Atlas · done")).toBeDefined();
    expect(screen.getByText("Juno · working")).toBeDefined();
  });

  test("shows a caret only while typing", () => {
    const { rerender } = render(<TalkPanel state={stateAt(1500)} />);
    expect(screen.queryByTestId("caret")).not.toBeNull();
    rerender(<TalkPanel state={stateAt(3000)} />);
    expect(screen.queryByTestId("caret")).toBeNull();
  });

  test("is hidden from assistive tech and fades at the end", () => {
    const { container } = render(<TalkPanel state={stateAt(17500)} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(root.className).toContain("opacity-0");
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- talk-panel`
Expected: FAIL, cannot find module `@/components/talk-panel`.

- [ ] **Step 3: Create the talk panel**

Create `src/components/talk-panel.tsx`:

```tsx
"use client";

import type { AgentColor, HeroState } from "@/lib/hero-script";

const textColor: Record<AgentColor, string> = {
  teal: "text-agent-teal",
  red: "text-agent-red",
};

const dotColor: Record<AgentColor, string> = {
  teal: "bg-agent-teal",
  red: "bg-agent-red",
};

export function TalkPanel({ state }: { state: HeroState }) {
  const typing = state.talk !== null && state.talk.typed.length < state.talk.full.length;

  return (
    <div
      aria-hidden="true"
      className={`min-h-32 font-mono text-sm transition-opacity duration-500 md:text-base ${
        state.fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="flex min-h-6 items-center gap-2 text-foreground">
        {state.talk ? (
          <>
            <span className={`inline-block size-2 shrink-0 rounded-full ${dotColor[state.talk.color]}`} />
            <span>{state.talk.typed}</span>
            {typing ? (
              <span data-testid="caret" className="animate-pulse text-zinc-500">
                ▍
              </span>
            ) : null}
          </>
        ) : null}
      </p>

      <ul className="mt-2 space-y-1">
        {state.replies.map((r) => (
          <li key={r.text} className={textColor[r.color]}>
            {r.name}: <span className="text-zinc-300">{r.text}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-3 flex flex-wrap gap-2">
        {state.pips.map((p) => (
          <li
            key={p.name}
            className="flex items-center gap-1.5 rounded-full border border-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
          >
            <span
              className={`inline-block size-1.5 rounded-full ${dotColor[p.color]} ${
                p.status === "working" ? "animate-pulse" : ""
              }`}
            />
            {`${p.name} · ${p.status}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- talk-panel`
Expected: 3 tests pass.

- [ ] **Step 5: Create the reduced motion hook**

Create `src/lib/use-prefers-reduced-motion.ts`:

```ts
import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

- [ ] **Step 6: Create the room scene**

Create `src/components/room-scene.tsx`:

```tsx
"use client";

import Image from "next/image";
import type { FrameId } from "@/lib/hero-script";
import { heroFrameIds, heroFrames } from "@/lib/room-frames";

// Five frames stacked in one box; only the active one is visible. All five are the same
// size (tested in room-frames.test.ts), so the room never moves between frames.
export function RoomScene({ frame }: { frame: FrameId }) {
  return (
    <div
      className="relative aspect-[1600/1358] w-full [mask-image:linear-gradient(to_right,transparent,black_12%)]"
      data-frame={frame}
    >
      {heroFrameIds.map((id) => (
        <Image
          key={id}
          src={heroFrames[id]}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          preload={id === "F1"}
          loading={id === "F1" ? undefined : "eager"}
          className={`object-contain transition-opacity duration-300 ${
            id === frame ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Create the hero loop**

Create `src/components/hero-loop.tsx`:

```tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { copy } from "@/lib/copy";
import { reducedMotionState, stateAt, type HeroState } from "@/lib/hero-script";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { RoomScene } from "@/components/room-scene";
import { TalkPanel } from "@/components/talk-panel";

function same(a: HeroState, b: HeroState) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function HeroLoop({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState<HeroState>(() => stateAt(0));

  useEffect(() => {
    if (reduced) {
      setState(reducedMotionState());
      return;
    }
    const start = performance.now();
    let last = stateAt(0);
    let raf = 0;
    const tick = (now: number) => {
      const next = stateAt(now - start);
      if (!same(last, next)) {
        last = next;
        setState(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-8">
      <div className="order-2 flex flex-col gap-6 lg:order-1 lg:col-span-3">
        <p className="text-sm text-zinc-400">{copy.eyebrow}</p>
        <TalkPanel state={state} />
        {children}
      </div>
      <div className="order-1 lg:order-2 lg:col-span-2">
        <RoomScene frame={state.frame} />
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Type-check, lint, test**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: clean. If lint objects to the `▍` character or to `JSON.stringify` comparison, keep them; they are deliberate.

- [ ] **Step 9: Commit**

```bash
git add src/lib/use-prefers-reduced-motion.ts src/components/room-scene.tsx src/components/talk-panel.tsx src/components/talk-panel.test.tsx src/components/hero-loop.tsx
git commit -m "feat: hero loop with room scene and talk panel"
```

---

### Task 7: Waitlist module and server action

**Files:**
- Create: `src/lib/waitlist.ts`
- Create: `src/lib/waitlist.test.ts`
- Create: `src/app/actions.ts`
- Create: `.env.example`

**Interfaces:**
- Consumes: `copy.form` strings.
- Produces: `addToWaitlist(email, deps): Promise<WaitlistResult>` and `WaitlistResult` from `@/lib/waitlist`; `joinWaitlist(prev, formData)` server action from `@/app/actions` with the `useActionState` signature.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/waitlist.test.ts`:

```ts
import { describe, expect, test, vi } from "vitest";
import { addToWaitlist, isValidEmail } from "@/lib/waitlist";
import { copy } from "@/lib/copy";

function fetchReturning(status: number, body = "") {
  return vi.fn(async () => new Response(body, { status })) as unknown as typeof fetch;
}

const deps = (f: typeof fetch, segmentId?: string) => ({
  apiKey: "re_test",
  segmentId,
  fetch: f,
});

describe("isValidEmail", () => {
  test("accepts a plain address and rejects junk", () => {
    expect(isValidEmail("lincoln@example.com")).toBe(true);
    expect(isValidEmail("  lincoln@example.com ")).toBe(true);
    expect(isValidEmail("lincoln")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("addToWaitlist", () => {
  test("rejects an invalid email without calling the API", async () => {
    const f = fetchReturning(200);
    expect(await addToWaitlist("nope", deps(f))).toEqual({ status: "error", message: copy.form.invalid });
    expect(f).not.toHaveBeenCalled();
  });

  test("fails cleanly when the API key is missing", async () => {
    const f = fetchReturning(200);
    const result = await addToWaitlist("a@example.com", { apiKey: undefined, fetch: f });
    expect(result).toEqual({ status: "error", message: copy.form.failed });
    expect(f).not.toHaveBeenCalled();
  });

  test("posts the contact to Resend and reports ok", async () => {
    const f = fetchReturning(200, JSON.stringify({ id: "c_1" }));
    expect(await addToWaitlist(" A@Example.com ", deps(f, "seg_1"))).toEqual({ status: "ok" });
    expect(f).toHaveBeenCalledTimes(1);
    const [url, init] = (f as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/contacts");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer re_test");
    expect(JSON.parse(init.body as string)).toEqual({
      email: "a@example.com",
      unsubscribed: false,
      segments: [{ id: "seg_1" }],
    });
  });

  test("omits segments when no segment id is configured", async () => {
    const f = fetchReturning(200);
    await addToWaitlist("a@example.com", deps(f));
    const [, init] = (f as unknown as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({ email: "a@example.com", unsubscribed: false });
  });

  test("treats an existing contact as already on the list", async () => {
    expect(await addToWaitlist("a@example.com", deps(fetchReturning(409)))).toEqual({ status: "already" });
    const f = fetchReturning(422, JSON.stringify({ message: "Contact already exists" }));
    expect(await addToWaitlist("a@example.com", deps(f))).toEqual({ status: "already" });
  });

  test("reports other failures and network errors", async () => {
    expect(await addToWaitlist("a@example.com", deps(fetchReturning(500)))).toEqual({
      status: "error",
      message: copy.form.failed,
    });
    const boom = vi.fn(async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    expect(await addToWaitlist("a@example.com", deps(boom))).toEqual({
      status: "error",
      message: copy.form.failed,
    });
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- waitlist`
Expected: FAIL, cannot find module `@/lib/waitlist`.

- [ ] **Step 3: Implement the module**

Create `src/lib/waitlist.ts`:

```ts
import { copy } from "@/lib/copy";

export type WaitlistResult =
  | { status: "idle" }
  | { status: "ok" }
  | { status: "already" }
  | { status: "error"; message: string };

export interface WaitlistDeps {
  apiKey: string | undefined;
  segmentId?: string;
  fetch: typeof fetch;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL.test(email.trim());
}

export async function addToWaitlist(email: string, deps: WaitlistDeps): Promise<WaitlistResult> {
  const clean = email.trim().toLowerCase();
  if (!isValidEmail(clean)) return { status: "error", message: copy.form.invalid };

  if (!deps.apiKey) {
    console.error("RESEND_API_KEY is not set; waitlist signups cannot be stored");
    return { status: "error", message: copy.form.failed };
  }

  const body: { email: string; unsubscribed: boolean; segments?: { id: string }[] } = {
    email: clean,
    unsubscribed: false,
  };
  if (deps.segmentId) body.segments = [{ id: deps.segmentId }];

  let res: Response;
  try {
    res = await deps.fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${deps.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("waitlist request failed", err);
    return { status: "error", message: copy.form.failed };
  }

  if (res.ok) return { status: "ok" };

  const text = await res.text().catch(() => "");
  if (res.status === 409 || /already/i.test(text)) return { status: "already" };

  console.error("waitlist rejected", res.status, text);
  return { status: "error", message: copy.form.failed };
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- waitlist`
Expected: 7 tests pass.

- [ ] **Step 5: Create the server action**

Create `src/app/actions.ts`:

```ts
"use server";

import { addToWaitlist, type WaitlistResult } from "@/lib/waitlist";

export async function joinWaitlist(
  _previous: WaitlistResult,
  formData: FormData,
): Promise<WaitlistResult> {
  const email = String(formData.get("email") ?? "");
  return addToWaitlist(email, {
    apiKey: process.env.RESEND_API_KEY,
    segmentId: process.env.RESEND_SEGMENT_ID,
    fetch,
  });
}
```

- [ ] **Step 6: Document the env vars**

Create `.env.example`:

```bash
# Resend API key with permission to create contacts. https://resend.com/api-keys
RESEND_API_KEY=
# Optional. A Resend segment id to add every signup to.
RESEND_SEGMENT_ID=
```

`.env*` is already ignored by `.gitignore`, so add an exception line right after the `.env*` line:

```gitignore
!.env.example
```

- [ ] **Step 7: Lint, test, commit**

Run: `npm run lint && npm test`

```bash
git add src/lib/waitlist.ts src/lib/waitlist.test.ts src/app/actions.ts .env.example .gitignore
git commit -m "feat: waitlist signup through Resend contacts"
```

---

### Task 8: Waitlist form and the hero section

**Files:**
- Create: `src/components/waitlist-form.tsx`
- Create: `src/components/waitlist-form.test.tsx`
- Create: `src/components/hero.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `joinWaitlist` from `@/app/actions`, `WaitlistResult` from `@/lib/waitlist`, `HeroLoop` from `@/components/hero-loop`, `copy`.
- Produces: `WaitlistForm()` client component, `Hero()` server component.

- [ ] **Step 1: Write the failing form test**

Create `src/components/waitlist-form.test.tsx`:

```tsx
import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { copy } from "@/lib/copy";

vi.mock("@/app/actions", () => ({
  joinWaitlist: vi.fn(async () => ({ status: "ok" })),
}));

import { WaitlistForm } from "@/components/waitlist-form";

describe("WaitlistForm", () => {
  test("renders the email field, the button and the line under it", () => {
    render(<WaitlistForm />);
    expect(screen.getByLabelText(copy.cta.label)).toBeDefined();
    expect(screen.getByRole("button", { name: copy.cta.button })).toBeDefined();
    expect(screen.getByText(copy.cta.under)).toBeDefined();
  });
});
```

- [ ] **Step 2: Run to see it fail**

Run: `npm test -- waitlist-form`
Expected: FAIL, cannot find module `@/components/waitlist-form`.

- [ ] **Step 3: Create the form**

Create `src/components/waitlist-form.tsx`:

```tsx
"use client";

import { useActionState } from "react";
import { joinWaitlist } from "@/app/actions";
import { copy } from "@/lib/copy";
import type { WaitlistResult } from "@/lib/waitlist";

const initial: WaitlistResult = { status: "idle" };

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initial);

  if (state.status === "ok" || state.status === "already") {
    return (
      <p role="status" className="text-base text-zinc-200">
        {state.status === "ok" ? copy.form.ok : copy.form.already}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="email" className="sr-only">
          {copy.cta.label}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={copy.cta.placeholder}
          className="h-11 flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-base text-foreground placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-md bg-foreground px-4 text-base font-medium text-background disabled:opacity-60"
        >
          {copy.cta.button}
        </button>
      </div>
      <p aria-live="polite" className={`text-sm ${state.status === "error" ? "text-agent-red" : "text-zinc-400"}`}>
        {state.status === "error" ? state.message : copy.cta.under}
      </p>
    </form>
  );
}
```

- [ ] **Step 4: Run the test**

Run: `npm test -- waitlist-form`
Expected: PASS.

- [ ] **Step 5: Create the hero**

Create `src/components/hero.tsx`:

```tsx
import { HeroLoop } from "@/components/hero-loop";
import { WaitlistForm } from "@/components/waitlist-form";
import { copy } from "@/lib/copy";

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:min-h-svh lg:py-24">
      <p className="sr-only">{copy.narration}</p>
      <HeroLoop>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {copy.headline}
        </h1>
        <p className="max-w-xl text-lg text-zinc-300">{copy.subheadline}</p>
        <div className="max-w-xl">
          <WaitlistForm />
        </div>
        <p className="text-xs text-zinc-500">{copy.trust}</p>
      </HeroLoop>
    </section>
  );
}
```

- [ ] **Step 6: Put the hero on the page**

Replace `src/app/page.tsx` with:

```tsx
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
    </main>
  );
}
```

- [ ] **Step 7: Check it in the browser**

Run: `npm run dev` and open http://localhost:3000. Check, in order:

1. Eyebrow, then the talk line typing "hey Juno, run the tests" about one second in, the teal creature turning to face you when "Juno" lands, then turning back with two pips at four seconds.
2. "hey Atlas, what's the status of my CI pipeline?" from six seconds, the red creature turning on "Atlas", the two red replies, then the red creature standing on the rug with the Atlas pip reading "done".
3. The text fading just before the loop restarts at eighteen seconds. The room never jumps between frames.
4. The headline does not move when replies appear (the panel reserves height).
5. Enable reduced motion in the OS or DevTools rendering panel, reload: static room, first line complete, no cycling.
6. Narrow the window below 1024 px: room on top, text below.
7. Submit the form with no `RESEND_API_KEY` set: the red failure line appears and nothing crashes.

Stop the dev server.

- [ ] **Step 8: Lint, test, commit**

Run: `npm run lint && npm test`

```bash
git add src/components/waitlist-form.tsx src/components/waitlist-form.test.tsx src/components/hero.tsx src/app/page.tsx AGENTS.md
git commit -m "feat: hero section with waitlist form"
```

---

### Task 9: Story sections, final call to action and footer

**Files:**
- Create: `src/components/beat-section.tsx`
- Create: `src/components/final-cta.tsx`
- Create: `src/components/site-footer.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `copy.beats`, `sectionFrames`, `heroFrames`, `WaitlistForm`.
- Produces: `BeatSection({ id, title, body, alt, image, flip })`, `FinalCta()`, `SiteFooter()`.

- [ ] **Step 1: Create the beat section**

Create `src/components/beat-section.tsx`:

```tsx
import Image, { type StaticImageData } from "next/image";

export function BeatSection({
  id,
  title,
  body,
  alt,
  image,
  flip = false,
}: {
  id: string;
  title: string;
  body: string;
  alt: string;
  image: StaticImageData;
  flip?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-16 lg:grid-cols-2 lg:gap-12"
    >
      <div className={`flex flex-col gap-3 ${flip ? "lg:order-2" : ""}`}>
        <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="max-w-md text-lg text-zinc-300">{body}</p>
      </div>
      <div className={flip ? "lg:order-1" : ""}>
        <Image
          src={image}
          alt={alt}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-auto w-full [mask-image:linear-gradient(to_right,transparent,black_12%)]"
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create the final call to action**

Create `src/components/final-cta.tsx`:

```tsx
import Image from "next/image";
import { WaitlistForm } from "@/components/waitlist-form";
import { copy } from "@/lib/copy";
import { heroFrames } from "@/lib/room-frames";

export function FinalCta() {
  return (
    <section
      aria-labelledby="final-title"
      className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 lg:grid-cols-5 lg:gap-8"
    >
      <div className="flex flex-col gap-6 lg:col-span-3">
        <h2 id="final-title" className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {copy.headline}
        </h2>
        <div className="max-w-xl">
          <WaitlistForm />
        </div>
      </div>
      <div className="lg:col-span-2">
        <Image
          src={heroFrames.F1}
          alt=""
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="h-auto w-full [mask-image:linear-gradient(to_right,transparent,black_12%)]"
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create the footer**

Create `src/components/site-footer.tsx`:

```tsx
import { copy } from "@/lib/copy";

export function SiteFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-10 text-sm text-zinc-500">
      <span>{copy.siteName}</span>
      <a
        href={copy.footer.githubUrl}
        className="underline-offset-4 hover:text-zinc-300 hover:underline"
        rel="noopener"
      >
        {copy.footer.githubLabel}
      </a>
    </footer>
  );
}
```

- [ ] **Step 4: Compose the page**

Replace `src/app/page.tsx` with:

```tsx
import { BeatSection } from "@/components/beat-section";
import { FinalCta } from "@/components/final-cta";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { copy } from "@/lib/copy";
import { sectionFrames } from "@/lib/room-frames";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      {copy.beats.map((beat, index) => (
        <BeatSection
          key={beat.id}
          id={beat.id}
          title={beat.title}
          body={beat.body}
          alt={beat.alt}
          image={sectionFrames[beat.id]}
          flip={index % 2 === 1}
        />
      ))}
      <FinalCta />
      <SiteFooter />
    </main>
  );
}
```

- [ ] **Step 5: Check in the browser**

Run: `npm run dev`, open http://localhost:3000, scroll. Expected: four sections alternating text and image sides, the four titles in order, the far-away room in the last one, then the headline and form again, then the footer with one GitHub link. No horizontal scrollbar at 375 px wide. Stop the server.

- [ ] **Step 6: Lint, test, commit**

Run: `npm run lint && npm test`

```bash
git add src/components/beat-section.tsx src/components/final-cta.tsx src/components/site-footer.tsx src/app/page.tsx AGENTS.md
git commit -m "feat: story sections, final call to action and footer"
```

---

### Task 10: Open Graph image

**Files:**
- Create: `src/app/opengraph-image.tsx`

**Interfaces:**
- Consumes: `src/assets/room/og-room.png` from Task 3, `copy`.
- Produces: `/opengraph-image` at 1200 by 630, plus the `og:image` tags Next adds from the file convention.

- [ ] **Step 1: Create the route**

Create `src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { copy } from "@/lib/copy";

export const alt = copy.headline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const png = await readFile(join(process.cwd(), "src/assets/room/og-room.png"));
  const room = `data:image/png;base64,${png.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#010206",
          color: "#ededed",
        }}
      >
        {/* Room on the right. og-room.png is 1200 by 1019; at 700 tall it is 824 wide. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room}
          alt=""
          style={{ position: "absolute", right: -60, top: -35, height: 700 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 24,
            padding: 64,
            width: 560,
          }}
        >
          <div style={{ fontSize: 22, color: "#a1a1aa" }}>{copy.eyebrow}</div>
          <div style={{ fontSize: 54, fontWeight: 600, lineHeight: 1.1 }}>{copy.headline}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Step 2: Check it renders**

Run: `npm run dev` and open http://localhost:3000/opengraph-image.
Expected: a 1200 by 630 PNG, room on the right, eyebrow and headline on the left, no overlap between the headline and the room's left wall. The text uses the default font that ships with the image renderer. Then view the page source of http://localhost:3000 and confirm `og:image` and `twitter:image` meta tags point at `/opengraph-image`. Stop the server.

- [ ] **Step 3: Lint, test, commit**

Run: `npm run lint && npm test`

```bash
git add src/app/opengraph-image.tsx AGENTS.md
git commit -m "feat: open graph image"
```

---

### Task 11: Production build, README, final checks

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build succeeds with `/` and `/opengraph-image` listed as static. Fix any type or lint error it reports before continuing.

- [ ] **Step 2: Run the production server and repeat the hero checks**

Run: `npm run start`, open http://localhost:3000, and repeat Task 8 Step 7 items 1 to 3 and Task 9 Step 5. Stop the server.

- [ ] **Step 3: Update the README**

In `README.md`, replace the `## Assets` section with:

```markdown
## Assets

The room frames on the page are cropped from the approved masters under `assets/higgsfield/keyframes/` by `npm run build:frames`, which writes `src/assets/room/*.webp` and `og-room.png`. Both the masters and the outputs are committed, so the script only needs to run again when a master changes. Prompts, job ids and the art direction are in `assets/higgsfield/keyframes/README.md` and `docs/superpowers/specs/2026-09-03-hero-art-direction-design.md`.

## Waitlist

Signups go to Resend as contacts. Set `RESEND_API_KEY`, and optionally `RESEND_SEGMENT_ID`, in `.env.local` for development and in the Vercel project settings for deployments. See `.env.example`.
```

- [ ] **Step 4: Full verification and commit**

Run: `npm run lint && npm test && npm run build`
Expected: all clean.

```bash
git add README.md AGENTS.md
git commit -m "docs: assets pipeline and waitlist configuration"
```

---

## Follow-ups outside this plan

- Deploy to Vercel and set the two Resend variables there. The user has the `deploy-to-vercel` skill for this.
- Create the Resend segment and paste its id into `RESEND_SEGMENT_ID`.
- The two open items in the spec stay open: no platform line is shown, and there is no proof quote yet.
