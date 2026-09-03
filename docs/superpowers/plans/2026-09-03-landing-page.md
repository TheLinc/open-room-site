# Open Room landing page implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the one-page Open Room coming-soon site: a hero with a looping video of the agents typing under a typed text script, four story sections with posed stills, a waitlist form backed by Resend, and an Open Graph image.

**Architecture:** A single Next.js App Router page. Server components render copy and layout. One client component owns a clock and derives the text state from a pure, tested timeline function; the room beside it is a muted looping `<video>` with a poster still. The waitlist is a server action that posts to Resend's contacts API through a small tested module. Stills are cropped from the approved 2k masters by a script into committed WebP files; the loop is encoded from the approved clip by a second script into committed WebM and MP4 files.

**Tech Stack:** Next.js 16.3.4 (App Router, `src/` layout, `@/*` alias), React 19.2, TypeScript 5, Tailwind CSS 4, Geist Sans and Geist Mono via `next/font/google`, Vitest with React Testing Library, `sharp` for the still build script, `ffmpeg` on PATH for the video build script, Resend REST API with `fetch`. Node 22.

**Spec:** `docs/superpowers/specs/2026-09-03-hero-art-direction-design.md`. Copy inputs: `copy/company-brain.md`. Art records: `assets/higgsfield/keyframes/README.md`.

## Global constraints

- Copy is fixed by the spec and lives in one file, `src/lib/copy.ts`. Never retype a string elsewhere.
- Headline: "Talk to your agents without leaving your window." Button: "Tell me when it's ready." Eyebrow: "Open Room. A desktop app for Claude Code."
- No navigation bar. One footer link, to https://github.com/TheLinc/open-room. No analytics, no third-party scripts.
- Page background is `#010206`, the sampled background of the generated frames. Foreground `#ededed`.
- Agent colours: teal `#06b6d4`, red `#f43f5e`, purple `#8b5cf6`. Teal is Juno, red is Atlas, purple is unnamed.
- The hero room is the ambient loop: muted, autoplaying, looping, inline, with the rest frame as poster. Reduced motion shows the rest frame still with the first talk line complete and no cycling.
- Text script is 18000 ms, typing at 45 ms per character, text fade from 17400 ms. All animation text is rendered by the site. No text is baked into the video or images.
- Every still is a square crop centred at three quarters of the source frame width, at most 1440 px, matching the video. Video and stills all fade their outer 6 % on every edge so no encoded black edge ever shows against the page.
- Next 16 deprecates `priority` on `next/image`; use `preload`. Do not read Next docs from memory; the version's docs are in `node_modules/next/dist/docs/`.
- Waitlist: `POST https://api.resend.com/contacts` with `Authorization: Bearer <RESEND_API_KEY>`, body `{ email, unsubscribed: false }` plus `segments: [{ id }]` when `RESEND_SEGMENT_ID` is set.
- `next dev` rewrites the block in `AGENTS.md`. Commit that change with your work rather than reverting it.
- Every task ends with `npm run lint` and `npm test` passing before its commit.

---

## File structure

Create:

- `.env.example`: names of the two Resend variables.
- `vitest.config.mts`: Vitest with jsdom, React plugin, tsconfig paths.
- `scripts/build-room-frames.mjs`: crops the masters into `src/assets/room/*.webp` and `og-room.png`.
- `scripts/build-room-video.mjs`: encodes the loop into `public/room/loop.webm` and `loop.mp4` and writes `src/assets/room/loop.json`.
- `src/assets/room/F1.webp`, `F4.webp`, `S1.webp`, `S2.webp`, `S4.webp`, `og-room.png`, `loop.json`: generated, committed.
- `public/room/loop.webm`, `public/room/loop.mp4`: generated, committed.
- `src/lib/copy.ts`: every string on the page.
- `src/lib/hero-script.ts`: the text timeline and `stateAt(ms)`.
- `src/lib/hero-script.test.ts`
- `src/lib/room-frames.ts`: static imports of the stills.
- `src/lib/room-frames.test.ts`: dimension invariants of the generated files.
- `src/lib/room-loop.test.ts`: invariants of the encoded video.
- `src/lib/waitlist.ts`: email validation and the Resend call, injected `fetch`.
- `src/lib/waitlist.test.ts`
- `src/lib/use-prefers-reduced-motion.ts`: media query hook.
- `src/app/actions.ts`: the `joinWaitlist` server action.
- `src/app/opengraph-image.tsx`: generated OG image.
- `src/components/hero.tsx`: server. Hero section shell, copy, hidden narration, form.
- `src/components/hero-loop.tsx`: client. Owns the clock, lays out the hero grid, renders `TalkPanel` and `RoomLoop`.
- `src/components/talk-panel.tsx`: client, pure render of a `HeroState`.
- `src/components/talk-panel.test.tsx`
- `src/components/room-loop.tsx`: client. The looping video, or the still under reduced motion.
- `src/components/room-loop.test.tsx`
- `src/components/waitlist-form.tsx`: client. `useActionState` form.
- `src/components/waitlist-form.test.tsx`
- `src/components/beat-section.tsx`: server. One story beat: heading, line, still.
- `src/components/final-cta.tsx`: server. Headline repeated, form, rest frame.
- `src/components/site-footer.tsx`: server. One link.

Modify:

- `.gitignore`: ignore draft art and video analysis files, keep masters and the clip.
- `package.json`: scripts and dev dependencies.
- `src/app/globals.css`: dark theme only, agent colour tokens, font variables, the edge fade class.
- `src/app/layout.tsx`: metadata, body classes.
- `src/app/page.tsx`: compose the page.
- `README.md`: env vars and the two build scripts.

---

### Task 1: Keep the art masters and the clip, ignore the drafts

**Files:**
- Modify: `.gitignore`
- Commit: `assets/higgsfield/mascot-sheet.jpg`, `assets/higgsfield/keyframes/README.md`, `assets/higgsfield/keyframes/iso-test/pose/rest.png`, `assets/higgsfield/keyframes/hero/2k/*.png` (including `F1-square.png`), `assets/higgsfield/keyframes/hero/video/loop-test-v1.mp4`, `assets/higgsfield/keyframes/sections/*.png`, `assets/higgsfield/keyframes/sections/2k/*.png`

**Interfaces:**
- Produces: the master files at the paths the build scripts in Task 3 read.

- [ ] **Step 1: Add ignore rules for draft art and analysis output**

Append to `.gitignore`:

```gitignore

# generated art: keep the approved masters, the clip and the README; ignore drafts, tests, rejects and analysis output
assets/higgsfield/keyframes/base/
assets/higgsfield/keyframes/react/
assets/higgsfield/keyframes/iso-test/*.png
assets/higgsfield/keyframes/iso-test/pose/called*
assets/higgsfield/keyframes/hero/*.png
assets/higgsfield/keyframes/hero/video/frames/
assets/higgsfield/keyframes/hero/video/full/
assets/higgsfield/keyframes/hero/video/*.png
assets/higgsfield/keyframes/sections/S4-rejected*
```

- [ ] **Step 2: Check what will be committed**

Run: `git add -n assets .gitignore`
Expected: the list contains `mascot-sheet.jpg`, `keyframes/README.md`, `iso-test/pose/rest.png`, six files under `hero/2k/` (five frames plus `F1-square.png`), `hero/video/loop-test-v1.mp4`, `sections/S1-name-them.png`, `sections/S2-all-working.png`, `sections/S4-far-away.png`, two files under `sections/2k/`. It contains nothing from `base/`, `react/`, no `iso-v*.png`, no `called*`, no `hero/F*.png` at the top level, nothing under `hero/video/frames/` or `hero/video/full/`, no `hero/video/*.png`, no `S4-rejected*`.

- [ ] **Step 3: Commit**

```bash
git add .gitignore assets
git commit -m "chore: keep approved art masters and the hero loop, ignore drafts"
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
  "build:frames": "node scripts/build-room-frames.mjs",
  "build:video": "node scripts/build-room-video.mjs"
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
    "Example: say hey Juno, run the tests. Juno gets to work. Ask Atlas a question while he works and he answers straight away, then reports back when the job is done.",
  roomAlt: "A small dark room where three voxel agents, teal, red and purple, type at their own desks lit by their screens.",
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

### Task 3: Build the stills and the loop from the masters

**Files:**
- Create: `scripts/build-room-frames.mjs`
- Create: `scripts/build-room-video.mjs`
- Create: `src/lib/room-frames.ts`
- Create: `src/lib/room-frames.test.ts`
- Create: `src/lib/room-loop.test.ts`
- Generated: `src/assets/room/F1.webp`, `F4.webp`, `S1.webp`, `S2.webp`, `S4.webp`, `og-room.png`, `loop.json`, `public/room/loop.webm`, `public/room/loop.mp4`

**Interfaces:**
- Consumes: masters and the clip from Task 1. `ffmpeg` and `ffprobe` on PATH (installed on this machine through winget).
- Produces: `restFrame: StaticImageData` and `sectionFrames: Record<BeatId, StaticImageData>` from `@/lib/room-frames`; `loop.json` with `{ width, height, duration, frames, mp4Bytes, webmBytes }`; the two video files at `/room/loop.webm` and `/room/loop.mp4`.

- [ ] **Step 1: Install sharp**

Run: `npm install -D sharp`

- [ ] **Step 2: Write the failing stills test**

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

describe("room stills", () => {
  test("stills cut from the 2k masters are 1440 px squares, matching the loop", async () => {
    for (const file of ["F1.webp", "F4.webp", "S1.webp", "S2.webp"]) {
      expect(await size(file)).toEqual({ width: 1440, height: 1440 });
    }
  });

  test("the far-away still keeps its native square size", async () => {
    expect(await size("S4.webp")).toEqual({ width: 672, height: 672 });
  });

  test("the Open Graph source is a 1200 px square PNG", async () => {
    expect(await size("og-room.png")).toEqual({ width: 1200, height: 1200 });
  });
});
```

- [ ] **Step 3: Write the failing loop test**

Create `src/lib/room-loop.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import loop from "@/assets/room/loop.json";

const MAX_BYTES = 3 * 1024 * 1024;

describe("room loop", () => {
  test("is a five second 1080 px square", () => {
    expect(loop.width).toBe(1080);
    expect(loop.height).toBe(1080);
    expect(loop.duration).toBeGreaterThan(4.9);
    expect(loop.duration).toBeLessThan(5.2);
    expect(loop.frames).toBeGreaterThanOrEqual(120);
  });

  test("both encodes exist and are small enough for a hero", async () => {
    const mp4 = await stat(join(process.cwd(), "public/room/loop.mp4"));
    const webm = await stat(join(process.cwd(), "public/room/loop.webm"));
    expect(mp4.size).toBe(loop.mp4Bytes);
    expect(webm.size).toBe(loop.webmBytes);
    expect(mp4.size).toBeLessThan(MAX_BYTES);
    expect(webm.size).toBeLessThan(MAX_BYTES);
  });
});
```

- [ ] **Step 4: Run both to see them fail**

Run: `npm test -- room-`
Expected: FAIL, input file is missing and cannot find module `@/assets/room/loop.json`.

- [ ] **Step 5: Write the stills script**

Create `scripts/build-room-frames.mjs`:

```js
// Crops the approved masters to a square around the room and writes web-sized files.
// The room sits at three quarters of every source frame's width; the rest is empty
// background that the page draws itself. The same crop is used for the hero video.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const IN = "assets/higgsfield/keyframes";
const OUT = "src/assets/room";

const ROOM_CENTRE_X = 0.75;
const MAX_SIDE = 1440;
const WEBP_QUALITY = 82;

const stills = [
  ["F1", `${IN}/hero/2k/F1-rest-atlas-working.png`],
  ["F4", `${IN}/hero/2k/F4-atlas-called.png`],
  ["S1", `${IN}/sections/2k/S1-name-them.png`],
  ["S2", `${IN}/sections/2k/S2-all-working.png`],
  ["S4", `${IN}/sections/S4-far-away.png`],
];

async function squareRegion(file) {
  const { width, height } = await sharp(file).metadata();
  const side = height;
  const left = Math.round(width * ROOM_CENTRE_X - side / 2);
  if (left < 0 || left + side > width) throw new Error(`${file}: square crop falls outside the frame`);
  return { left, top: 0, width: side, height: side };
}

await mkdir(OUT, { recursive: true });

for (const [id, file] of stills) {
  const r = await squareRegion(file);
  await sharp(file)
    .extract(r)
    .resize({ width: Math.min(r.width, MAX_SIDE) })
    .webp({ quality: WEBP_QUALITY })
    .toFile(`${OUT}/${id}.webp`);
  console.log(id, "from", file, r);
}

// PNG copy of the rest frame for the Open Graph route, which cannot read WebP.
{
  const [, file] = stills[0];
  const r = await squareRegion(file);
  await sharp(file).extract(r).resize({ width: 1200 }).png().toFile(`${OUT}/og-room.png`);
  console.log("og-room.png from", file);
}
```

- [ ] **Step 6: Write the video script**

Create `scripts/build-room-video.mjs`:

```js
// Encodes the approved loop for the web: H.264 MP4 for everything, VP9 WebM where
// supported, both silent, 1080 px square, and a JSON manifest the site and tests read.
import { execFileSync } from "node:child_process";
import { mkdir, stat, writeFile } from "node:fs/promises";

const SRC = "assets/higgsfield/keyframes/hero/video/loop-test-v1.mp4";
const OUT = "public/room";
const MANIFEST = "src/assets/room/loop.json";
const SIDE = 1080;

await mkdir(OUT, { recursive: true });

const input = ["-y", "-v", "error", "-i", SRC, "-an", "-vf", `scale=${SIDE}:${SIDE}:flags=lanczos`];

execFileSync(
  "ffmpeg",
  [...input, "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${OUT}/loop.mp4`],
  { stdio: "inherit" },
);

execFileSync(
  "ffmpeg",
  [...input, "-c:v", "libvpx-vp9", "-crf", "33", "-b:v", "0", "-row-mt", "1", "-pix_fmt", "yuv420p", `${OUT}/loop.webm`],
  { stdio: "inherit" },
);

const probe = JSON.parse(
  execFileSync("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height,nb_frames,duration",
    "-of", "json",
    `${OUT}/loop.mp4`,
  ]).toString(),
);
const stream = probe.streams[0];

const manifest = {
  width: stream.width,
  height: stream.height,
  duration: Number(stream.duration),
  frames: Number(stream.nb_frames),
  mp4Bytes: (await stat(`${OUT}/loop.mp4`)).size,
  webmBytes: (await stat(`${OUT}/loop.webm`)).size,
};
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(manifest);
```

- [ ] **Step 7: Run both scripts**

Run: `npm run build:frames && npm run build:video`
Expected: six lines from the stills script, then a manifest object with `width: 1080`, `height: 1080`, `duration` near 5.04, `frames: 121`, and both byte counts under 3 MB. `ls src/assets/room public/room` shows five `.webp`, `og-room.png`, `loop.json`, `loop.mp4`, `loop.webm`.

- [ ] **Step 8: Run the tests again**

Run: `npm test -- room-`
Expected: PASS, 5 tests.

- [ ] **Step 9: Create the frames module**

Create `src/lib/room-frames.ts`:

```ts
import type { StaticImageData } from "next/image";
import type { BeatId } from "@/lib/copy";
import F1 from "@/assets/room/F1.webp";
import F4 from "@/assets/room/F4.webp";
import S1 from "@/assets/room/S1.webp";
import S2 from "@/assets/room/S2.webp";
import S4 from "@/assets/room/S4.webp";

// The rest frame: video poster, reduced-motion fallback, final call to action.
export const restFrame: StaticImageData = F1;

export const sectionFrames: Record<BeatId, StaticImageData> = {
  name: S1,
  team: S2,
  command: F4,
  local: S4,
};
```

- [ ] **Step 10: Type-check, lint, test**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: all clean. If `tsc` cannot resolve `*.webp`, confirm `next-env.d.ts` exists at the repo root (it is generated by `next dev` or `next build`; run `npx next build` once if missing).

- [ ] **Step 11: Commit**

```bash
git add scripts/build-room-frames.mjs scripts/build-room-video.mjs src/assets/room public/room src/lib/room-frames.ts src/lib/room-frames.test.ts src/lib/room-loop.test.ts package.json package-lock.json
git commit -m "feat: build web stills and the hero loop from the approved masters"
```

---

### Task 4: The text timeline as a pure function

**Files:**
- Create: `src/lib/hero-script.ts`
- Create: `src/lib/hero-script.test.ts`

**Interfaces:**
- Produces: `stateAt(elapsedMs: number): HeroState`, `reducedMotionState(): HeroState`, constants `CHAR_MS`, `LOOP_MS`, `FADE_AT_MS`, `SCRIPT`, types `HeroState`, `AgentColor`, `Pip`, `Reply`, `Talk`.

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

  test("opens with Atlas already working and nothing said", () => {
    const s = stateAt(0);
    expect(s.talk).toBeNull();
    expect(s.replies).toEqual([]);
    expect(s.pips).toEqual([{ name: "Atlas", color: "red", status: "working" }]);
    expect(s.fading).toBe(false);
  });

  test("types the first line at 45 ms per character", () => {
    expect(stateAt(1000).talk).toEqual({ color: "teal", typed: "", full: "hey Juno, run the tests" });
    expect(stateAt(1000 + 7 * CHAR_MS).talk?.typed).toBe("hey Jun");
    expect(stateAt(1000 + 8 * CHAR_MS).talk?.typed).toBe("hey Juno");
    expect(stateAt(3000).talk?.typed).toBe("hey Juno, run the tests");
  });

  test("both work at four seconds", () => {
    expect(stateAt(4000).pips.map((p) => p.name)).toEqual(["Atlas", "Juno"]);
  });

  test("asks Atlas while he works", () => {
    expect(stateAt(6000).talk).toEqual({
      color: "red",
      typed: "",
      full: "hey Atlas, what's the status of my CI pipeline?",
    });
    expect(stateAt(6000).pips).toHaveLength(2);
  });

  test("Atlas answers immediately, then reports", () => {
    expect(stateAt(9500).replies).toEqual([
      { name: "Atlas", color: "red", text: "Let me check that for you." },
    ]);
    const report = stateAt(13500);
    expect(report.replies.map((r) => r.text)).toEqual([
      "Let me check that for you.",
      "The CI pipeline ran successfully.",
    ]);
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

  test("reduced motion shows the first line complete and never fades", () => {
    const s = reducedMotionState();
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
  talk: Talk | null;
  replies: Reply[];
  pips: Pip[];
  fading: boolean;
}

export const CHAR_MS = 45;
export const LOOP_MS = 18000;
export const FADE_AT_MS = 17400;

export type ScriptEvent =
  | { at: number; kind: "pips"; pips: Pip[] }
  | { at: number; kind: "reply"; reply: Reply }
  | { at: number; kind: "talk"; color: AgentColor; text: string };

const atlasWorking: Pip = { name: "Atlas", color: "red", status: "working" };
const junoWorking: Pip = { name: "Juno", color: "teal", status: "working" };
const atlasDone: Pip = { name: "Atlas", color: "red", status: "done" };

// Times in ms from loop start. A talk event replaces the current talk line and types
// it out from that moment; replies accumulate until the loop restarts.
export const SCRIPT: ScriptEvent[] = [
  { at: 0, kind: "pips", pips: [atlasWorking] },
  { at: 1000, kind: "talk", color: "teal", text: "hey Juno, run the tests" },
  { at: 4000, kind: "pips", pips: [atlasWorking, junoWorking] },
  { at: 6000, kind: "talk", color: "red", text: "hey Atlas, what's the status of my CI pipeline?" },
  { at: 9500, kind: "reply", reply: { name: "Atlas", color: "red", text: "Let me check that for you." } },
  {
    at: 13500,
    kind: "reply",
    reply: { name: "Atlas", color: "red", text: "The CI pipeline ran successfully." },
  },
  { at: 13500, kind: "pips", pips: [atlasDone, junoWorking] },
];

export function stateAt(elapsedMs: number): HeroState {
  const t = ((elapsedMs % LOOP_MS) + LOOP_MS) % LOOP_MS;
  let pips: Pip[] = [];
  let talk: Talk | null = null;
  const replies: Reply[] = [];

  for (const ev of SCRIPT) {
    if (ev.at > t) break;
    switch (ev.kind) {
      case "pips":
        pips = ev.pips;
        break;
      case "reply":
        replies.push(ev.reply);
        break;
      case "talk": {
        const chars = Math.min(ev.text.length, Math.floor((t - ev.at) / CHAR_MS));
        talk = { color: ev.color, typed: ev.text.slice(0, chars), full: ev.text };
        break;
      }
    }
  }

  return { talk, replies, pips, fading: t >= FADE_AT_MS };
}

export function reducedMotionState(): HeroState {
  return { ...stateAt(3000), fading: false };
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- hero-script`
Expected: 8 tests pass.

- [ ] **Step 5: Lint and commit**

Run: `npm run lint`

```bash
git add src/lib/hero-script.ts src/lib/hero-script.test.ts
git commit -m "feat: hero text timeline as a pure function"
```

---

### Task 5: Theme, metadata and body

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: Tailwind colour utilities `agent-teal`, `agent-red`, `agent-purple` (as `text-agent-teal`, `bg-agent-red`, and so on), `font-sans` and `font-mono` bound to Geist, and the `room-fade` class that fades every edge of a room image or video into the page.

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

/* Fades the outer 6% of a room still or video on every edge, so an encoded or
   compressed black never shows as a box against the page background. The room
   itself starts 7% in from each edge of the square crop. */
.room-fade {
  mask-image:
    linear-gradient(to right, transparent, black 6%, black 94%, transparent),
    linear-gradient(to bottom, transparent, black 6%, black 94%, transparent);
  mask-composite: intersect;
  -webkit-mask-composite: source-in;
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
git commit -m "feat: dark theme, agent colour tokens, edge fade and site metadata"
```

---

### Task 6: Room loop, talk panel and the hero loop

**Files:**
- Create: `src/lib/use-prefers-reduced-motion.ts`
- Create: `src/components/room-loop.tsx`
- Create: `src/components/room-loop.test.tsx`
- Create: `src/components/talk-panel.tsx`
- Create: `src/components/talk-panel.test.tsx`
- Create: `src/components/hero-loop.tsx`

**Interfaces:**
- Consumes: `stateAt`, `reducedMotionState`, `HeroState`, `AgentColor` from `@/lib/hero-script`; `restFrame` from `@/lib/room-frames`; `copy.eyebrow`, `copy.roomAlt`.
- Produces: `HeroLoop({ children })` client component that renders the hero grid: eyebrow, talk panel and `children` in the left column, the room in the right column. `TalkPanel({ state })` and `RoomLoop({ reduced })` are exported for tests.

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

- [ ] **Step 2: Write the failing room loop test**

Create `src/components/room-loop.test.tsx`:

```tsx
import { describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("@/lib/room-frames", () => ({
  restFrame: { src: "/F1.webp", width: 1440, height: 1440 },
}));

import { RoomLoop } from "@/components/room-loop";

describe("RoomLoop", () => {
  test("plays the loop muted, looping and inline with both encodes", () => {
    const { container } = render(<RoomLoop reduced={false} />);
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video!.muted).toBe(true);
    expect(video!.loop).toBe(true);
    expect(video!.hasAttribute("playsinline")).toBe(true);
    expect(video!.getAttribute("poster")).toBe("/F1.webp");
    const sources = Array.from(container.querySelectorAll("source")).map((s) => s.getAttribute("src"));
    expect(sources).toEqual(["/room/loop.webm", "/room/loop.mp4"]);
  });

  test("shows the rest frame instead under reduced motion", () => {
    const { container } = render(<RoomLoop reduced={true} />);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("img")).not.toBeNull();
  });
});
```

- [ ] **Step 3: Run both to see them fail**

Run: `npm test -- talk-panel room-loop`
Expected: FAIL, cannot find module `@/components/talk-panel` and `@/components/room-loop`.

- [ ] **Step 4: Create the talk panel**

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

- [ ] **Step 5: Create the room loop**

Create `src/components/room-loop.tsx`:

```tsx
"use client";

import Image from "next/image";
import { copy } from "@/lib/copy";
import { restFrame } from "@/lib/room-frames";

// The hero room. A silent five second loop of the agents typing, cut to the same
// square as the stills. Under reduced motion it is the rest frame instead.
export function RoomLoop({ reduced }: { reduced: boolean }) {
  if (reduced) {
    return (
      <div className="room-fade aspect-square w-full">
        <Image
          src={restFrame}
          alt={copy.roomAlt}
          preload
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="h-auto w-full"
        />
      </div>
    );
  }

  return (
    <div className="room-fade aspect-square w-full">
      <video
        className="h-full w-full object-contain"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={restFrame.src}
        aria-label={copy.roomAlt}
      >
        <source src="/room/loop.webm" type="video/webm" />
        <source src="/room/loop.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
```

- [ ] **Step 6: Run the tests**

Run: `npm test -- talk-panel room-loop`
Expected: 5 tests pass.

- [ ] **Step 7: Create the reduced motion hook**

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

- [ ] **Step 8: Create the hero loop**

Create `src/components/hero-loop.tsx`:

```tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { copy } from "@/lib/copy";
import { reducedMotionState, stateAt, type HeroState } from "@/lib/hero-script";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { RoomLoop } from "@/components/room-loop";
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
        <RoomLoop reduced={reduced} />
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Type-check, lint, test**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: clean. If lint objects to the `▍` character or to `JSON.stringify` comparison, keep them; they are deliberate.

- [ ] **Step 10: Commit**

```bash
git add src/lib/use-prefers-reduced-motion.ts src/components/room-loop.tsx src/components/room-loop.test.tsx src/components/talk-panel.tsx src/components/talk-panel.test.tsx src/components/hero-loop.tsx
git commit -m "feat: hero loop with the room video and talk panel"
```

---

### Task 7: Waitlist module and server action

**Files:**
- Create: `src/lib/waitlist.ts`
- Create: `src/lib/waitlist.test.ts`
- Create: `src/app/actions.ts`
- Create: `.env.example`
- Modify: `.gitignore`

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

1. The room video starts on its own, silent, and loops with no visible jump at the wrap. Its edges dissolve into the page with no box outline. Watch at least three loops.
2. The talk line types "hey Juno, run the tests" about one second in, then two pips at four seconds.
3. "hey Atlas, what's the status of my CI pipeline?" from six seconds, then the two red replies, and the Atlas pip reading "done" at the second reply.
4. The text fades just before it restarts at eighteen seconds. The headline does not move when replies appear.
5. Enable reduced motion in the OS or the DevTools rendering panel and reload: a still room, the first line complete, no cycling, no video element in the DOM.
6. Narrow the window below 1024 px: room on top, text below. On a phone-sized viewport the video still autoplays (it is muted and inline).
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
- Consumes: `copy.beats`, `sectionFrames`, `restFrame`, `WaitlistForm`.
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
      <div className={`room-fade ${flip ? "lg:order-1" : ""}`}>
        <Image
          src={image}
          alt={alt}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-auto w-full"
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
import { restFrame } from "@/lib/room-frames";

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
      <div className="room-fade lg:col-span-2">
        <Image
          src={restFrame}
          alt=""
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="h-auto w-full"
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

Run: `npm run dev`, open http://localhost:3000, scroll. Expected: four sections alternating text and image sides, the four titles in order, the room the same size and shape in every still as in the hero video, the far-away room in the fourth section, then the headline and form again, then the footer with one GitHub link. No horizontal scrollbar at 375 px wide. Stop the server.

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
- Consumes: `src/assets/room/og-room.png` from Task 3 (1200 by 1200), `copy`.
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
        {/* Room on the right. og-room.png is a 1200 px square; at 700 tall it is 700 wide. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room}
          alt=""
          style={{ position: "absolute", right: -40, top: -35, height: 700 }}
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

Run: `npm run start`, open http://localhost:3000, and repeat Task 8 Step 7 items 1 to 4 and Task 9 Step 5. Confirm in the network panel that the browser fetched `loop.webm` (Chromium, Firefox) or `loop.mp4` (Safari), not both. Stop the server.

- [ ] **Step 3: Update the README**

In `README.md`, replace the `## Assets` section with:

```markdown
## Assets

The room on the page comes from generated masters under `assets/higgsfield/keyframes/`. Two scripts turn them into web files, and both the masters and the outputs are committed, so the scripts only need to run again when a master changes:

- `npm run build:frames` crops the stills to a square around the room and writes `src/assets/room/*.webp` and `og-room.png`. Needs nothing beyond `npm install`.
- `npm run build:video` encodes the hero loop to `public/room/loop.webm` and `loop.mp4` and writes `src/assets/room/loop.json`. Needs `ffmpeg` and `ffprobe` on PATH.

Prompts, job ids and the art direction are in `assets/higgsfield/keyframes/README.md` and `docs/superpowers/specs/2026-09-03-hero-art-direction-design.md`.

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
- Try the hybrid: dissolve from the loop to the "Juno called" still on her name and back. Needs the F2 still recut to the square crop and a check that the video never drifts from it.
- The two open items in the spec stay open: no platform line is shown, and there is no proof quote yet.
