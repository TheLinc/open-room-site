# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers who already pay for Claude Code and run it in a terminal. The moment: they have two or three tasks that could run in parallel, and the only way today is more terminal windows they have to keep checking. They want to run several agents at once without watching each one, and to be told when something is done or stuck.

Visitors arrive from the GitHub README, developer social posts and word of mouth. They know what Claude Code is (solution-aware); they do not know Open Room.

Pains, working assumptions from the app README, not customer quotes: watching a terminal scroll instead of doing other work; juggling windows to run several agents; forgetting what an agent was doing after a restart. Alternatives tried: more terminals, tmux panes, git worktrees, one agent at a time.

## Product Purpose

Open Room is a free, open-source desktop app for running several named Claude Code agents at once and talking to them, by voice or by typing, while you get on with something else. Success for the site: a visitor understands what the app does, believes it is safe to run, and downloads it.

The site is the product page at https://openroom.dev. It is no longer a coming-soon page. Its job is to explain the product's features and capabilities and lead to a download.

## Positioning

For developers who already use Claude Code and want to run several tasks without babysitting a terminal, Open Room is the desktop app that gives each agent a name and a voice, so you can ask for something and get on with your own work. In the user's words: "I say the name and the job, and it comes and tells me when it is done."

The mechanism a neighbouring product cannot truthfully copy: one point of contact for many real Claude Code sessions, each addressed by its own name, by voice, from anywhere on the desktop, with speech in and out running on the machine.

Real alternative: more terminal windows, checked by hand.

## Operating Context

- Each agent is a real Claude Code session driven through the Agent SDK, in its own workspace folder, with a persistent AGENT.md role file and a WORKLOG.md.
- Address an agent with the wake word "hey <name>", a push-to-talk hotkey, or by typing. Custom wake words need no training; any name works instantly.
- Agents work in the background and report through a native notification or out loud in their own voice. A question from an agent is never dropped from the speech queue.
- Conversations persist across restarts.
- Permissions per tool, three states (ask, always allow, never allow), no bypass mode in the UI, including from voice.
- Session controls in the agent's pane: model, effort, permission mode. A quota banner shows rate limits; a context meter shows usage.
- Billing: uses the user's own Claude Code subscription; every turn bills that. N agents means N sessions on one account.
- Voice input ships off; wake words are a second opt-in.

## Capabilities and Constraints

- Free. MIT licence. No API keys, no telemetry, no server other than Anthropic's. Speech-to-text and text-to-speech run locally.
- Platforms: Windows first. macOS is configured but had not yet been run on a Mac at the time of the app README. Linux status unconfirmed. [OPEN: confirm which installers are on the latest release before naming platforms on the page.]
- Primary action, confirmed 2026-09-08: Download, linked through GitHub's stable redirect (https://github.com/TheLinc/open-room/releases/latest, and .../releases/latest/download/<asset>). Asset names come from electron-builder.yml in the app repo and must be checked against the latest release before hard-coding.
- 2026-09-12: the download is hidden again while Open Room is in early development. `released` in src/lib/release.ts is false, and the header, hero and get-started section show an email signup (Resend contacts, src/app/actions.ts and src/lib/waitlist.ts) in its place. Setting it to true brings the download back.
- Site stack, existing: Next.js 16 App Router, TypeScript, Tailwind CSS v4, Vercel. Node 22.
- Terminology: agent (never assistant or copilot), name, room, talk, by voice or by typing, get on with something else, finds you, your own login, stays on your machine. Avoid: orchestrate, seamless, supercharge, AI-powered, revolutionary, workflow (name the actual task instead).
- Copy in src/lib/copy.ts still carries the coming-soon framing ("Tell me when it's ready") and needs rewriting for the product page.

## Brand Commitments

- Name: Open Room. Logo: src/assets/brand/logo.png (a light grey mark made for a dark ground; recolour as needed).
- The five mascots are binding, confirmed 2026-09-08: Clawd (salmon), Bit (teal), Terminal (green), Block (red), Loop (purple), as in assets/higgsfield/keyframes/row/crew-reference.jpg. Names and colours stay. Hex values in src/lib/crew.ts; traced desk sprites in src/lib/crew-sprites.ts; hand-drawn front-facing faces in src/lib/crew-faces.ts.
- Voice: plain, specific, unhurried. Short sentences, second person, contractions fine, light humour fine, no exclamation marks. Honest about limits.
- Visual constraint, binding, 2026-09-08: the "Reading lamp" system explored earlier (cream paper, Instrument Serif and Sans, amber and moss) is rejected and must not be used or proposed. It exists only on the git branch hero-exploration as history.
- Standing preference, binding, 2026-09-08: the site is a clean, modern product surface consistent with the app, which is built on shadcn. Pixel art belongs to the characters only (and at most one signature element such as the voice meter); type, panels, buttons and layout are clean and contemporary, no pixel typefaces, no retro-game chrome. Direction round outcome: the category standard, executed at full craft, to sit alongside Cursor (cursor.com), Conductor (conductor.build) and Linear (linear.app); their craft level is the bar. The five mascot colours are the accent system on a neutral ground.
- Reference signals, 2026-09-08. Three sites the owner likes, each for one named quality. They bind that quality as a direction the page should achieve in its own way; they do not pin the sites' palettes, fonts or layouts. Inspected in a browser on 2026-09-08.
  - Strawberry Browser (https://strawberrybrowser.com/): the placement of characters across the page. Small looping mascot clips sit on the top edge of the product screenshot in the hero, flanking it; a trio types beside a section heading; a pair stands inside a "get started" card; one reads beside the FAQ. Characters live in the margins and on top of the product, never inside the copy column, and each has an idle behaviour (sitting, typing, thinking, reading). The quality wanted: fun, characters distributed down the whole page.
  - Calendly (https://calendly.com/): the way sections are built and their scroll motion. The hero is a pinned panel, a large rounded card, whose wide product strip pans horizontally as the visitor scrolls, with four product tabs switching as it goes. Lower down, a section pins its visual on the right while a list of features scrolls past on the left, each item fading in and out. Motion is scroll-driven and tied to reading, not decorative. The quality wanted: sections that build as you scroll, one idea per panel.
  - Cofounder (https://cofounder.co/): the hero is a full-bleed 8-bit scene (a pixel-art meadow, tree and laptop as a looping video behind the copy) while the type, buttons and task cards are modern. The quality wanted: a pixel world as the hero backdrop, which for Open Room should be far more minimal and should include the crew.
  - React Bits Pixel Blast (https://reactbits.dev/backgrounds/pixel-blast): a WebGL background (three.js plus postprocessing) of coarse pixel squares with pattern scale and density, jitter, ripples on click, a liquid wobble, edge fade and a single tint colour. The quality wanted: pixelated depth behind a clean page as a more minimal alternative to a drawn scene.
  - Wispr Flow (https://wisprflow.ai/): speech bubbles and edge-to-edge graphics. A text ribbon (GSAP motion path) loops round the hero copy and into a waveform pill; a dark green full-width band follows the light hero immediately; full-width illustrated scenes and large rounded stat cards run edge to edge rather than inside the text column. The quality wanted: speech as a visible object, and graphics that break the margins.

## Evidence on Hand

- Real app screenshots and a screen recording can be provided by the owner; none are in this repo yet. Until they land, any product imagery is illustration and must read as such, never as a capture.
- GitHub repo and live star count may be shown: https://github.com/TheLinc/open-room. [OPEN: current star count.]
- Generated art from the earlier direction, reusable: isometric voxel room stills and a 5 s typing loop under assets/higgsfield/keyframes/ and public/room/; the desk-row stills of the five mascots under assets/higgsfield/keyframes/row/; the mascot sheet assets/higgsfield/mascot-sheet.jpg. Prompts and job ids in assets/higgsfield/keyframes/README.md.
- No testimonials, metrics, press, logos, awards or case studies. Do not fabricate any.
- Company brain: copy/company-brain.md. Earlier art-direction spec: docs/superpowers/specs/2026-09-03-hero-art-direction-design.md (superseded direction, useful for facts).

## Product Principles

- Show the mechanism, not the category: a name routes a spoken request to one of several real agents, and the answer comes back to you.
- Every claim traces to the company brain or the app README. Known limits are stated, not hidden.
- The visitor is the voice, not a character. Nothing on the page should imply a human presenter.
- Safety is a feature to demonstrate: nothing leaves the machine, permissions are explicit, voice is opt-in.
- The action is download, and it should be reachable from the first viewport.
