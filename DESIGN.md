---
name: Open Room
description: A clean product surface in the app's own register, with five pixel agents as the only place pixels live.
colors:
  ground: "#fafafa"
  card: "#ffffff"
  line: "#e4e4e7"
  line-soft: "#f1f1f4"
  ink: "#09090b"
  ink-2: "#3f3f46"
  muted: "#71717a"
  night: "#0a0a0b"
  night-card: "#131316"
  night-line: "#27272a"
  night-muted: "#a1a1aa"
  night-key: "#7fd1d1"
  clawd: "#d87858"
  bit: "#288888"
  terminal: "#488848"
  block: "#cc2828"
  loop: "#682c78"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(40px, 5vw, 64px)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(34px, 3.5vw, 44px)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  small:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  key: "5px"
  sm: "6px"
  md: "8px"
  bar: "10px"
  lg: "12px"
  panel: "14px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "56px"
  3xl: "64px"
  section: "128px"
  section-md: "160px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.ink-2}"
  button-primary-compact:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    typography: "{typography.small}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.ground}"
  chip:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  chip-hover:
    backgroundColor: "{colors.ground}"
  card-panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "16px"
  card-night:
    backgroundColor: "{colors.night-card}"
    textColor: "{colors.line}"
    rounded: "{rounded.panel}"
    padding: "24px"
  bubble-you:
    backgroundColor: "{colors.line-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  thread-row:
    backgroundColor: "{colors.card}"
    borderColor: "{colors.line}"
    textColor: "{colors.ink-2}"
    typography: "{typography.small}"
    rounded: "{rounded.md}"
    height: "32px"
  input-bar:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    rounded: "{rounded.bar}"
    padding: "0 12px"
    height: "44px"
  kbd:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.key}"
    padding: "1px 6px"
---

# Design System: Open Room

## Overview

**Creative North Star: "The Working Window"**

Open Room's page is the app itself, drawn at product-page scale: a white window on a near-white ground, zinc text, hairline borders, one black button. The only colour is the five agents, and the only pixels are the agents. Everything the interface does is smooth and contemporary; everything a character does is stepped and small. The screenshot is not a picture but a scene that plays once, and the visitor's voice is a visible object (the pill in the headline) that travels through a teal pixel field down to the desks.

Density is calm and generous. Sections sit 128 to 160px apart with a hairline or a large heading as their only announcement; no kicker labels, no icon-card grids, no serif, no cream. The category standard (Cursor, Conductor, Linear) executed at full craft, with the crew distributed down the page in the margins and on top of panels. Confirmed rejections: the earlier "Reading lamp" world (cream, serif, warm lamp light), pixel typefaces, retro-game chrome, human presenters.

**Key Characteristics:**

- Zinc neutrals on a #fafafa ground; a single dark band for safety.
- Five agent hues as accents only: tinted text, dots, meters, rings, 6 to 9 percent washes. Never a fill behind text.
- One filled black button per view; every other control is a white card with a hairline.
- Geist at weight 500 for all headings with tight negative tracking; Geist Mono only for paths, keys, captions and the hero under-line.
- Pixel art in exactly three homes: crew faces, crew at desks, the voice pill. The hero field behind them is coarse 12px squares on a canvas.
- Two motion grammars that never mix: characters step, the interface eases.

## Colors

A near-monochrome zinc surface where the five agents supply every hue.

### Primary

- **Ink** (`{colors.ink}`): headings, body, the filled button, the voice pill. The page's one strong colour is black.

### Secondary

The five agent hues. Each belongs to one character and is used only where that character is present or addressed.

- **Clawd coral** (`{colors.clawd}`): Clawd's body, face, screen, meters and tinted wake word.
- **Bit teal** (`{colors.bit}`): Bit's hue and, because Bit is the first agent addressed, the page's incidental interface teal: the voice pill bars at rest, the pixel field, focus outlines, selection, the "listening" mic dot.
- **Terminal green** (`{colors.terminal}`): Terminal's hue. Faces darken it to `#2e5c34` for the shaded rows.
- **Block red** (`{colors.block}`): Block's hue. Also the colour of "Never" in the permission switch, the one place a hue carries meaning beyond its agent.
- **Loop plum** (`{colors.loop}`): Loop's hue.

### Neutral

- **Ground** (`{colors.ground}`): page background, the inset input bar, the header at 85 percent behind blur, hover fill on white controls.
- **Card** (`{colors.card}`): panels, the app window, buttons and chips at rest, the raised segment in a switch.
- **Line** (`{colors.line}`): every hairline border, section rules, the window's traffic dots, idle meter bars, the scrollbar. On the night band it doubles as body text.
- **Line soft** (`{colors.line-soft}`): dividers inside a panel and the track of a progress bar.
- **Ink 2** (`{colors.ink-2}`): paragraph body, nav links, the button's hover shade, the window title.
- **Muted** (`{colors.muted}`): leads, captions, mono labels, secondary details, idle status text.
- **Night** (`{colors.night}`): the full-bleed safety band.
- **Night card** (`{colors.night-card}`): cells inside the band.
- **Night line** (`{colors.night-line}`): the band's grid gaps and border.
- **Night muted** (`{colors.night-muted}`): the band's lead paragraph.
- **Night key** (`{colors.night-key}`): the fact keys on the band. Bit's teal lifted to read on `{colors.night-card}`; the agent value itself fails contrast there.

### Named Rules

**The Five Hues Rule.** Colour belongs to the agents. A hue appears only as a character's body, a tinted word or label, a 2 to 7px dot or meter, a ring in the pixel field, a border, or a wash of at most 9 percent (`color-mix(in srgb, hue 6-9%, white)`). It is never a full fill behind text and never a page-level accent detached from an agent.

**The Tinted Wake Word Rule.** In a "You" bubble the wake word is set in the agent's hue as text on the `{colors.line-soft}` field; the rest of the line is ink. The address is coloured, the request is not.

**The One Black Button Rule.** The filled `{colors.ink}` button is Download for Windows and nothing else. Every other action is a white card with a `{colors.line}` hairline, and hover is a shade change (`{colors.ground}` or `{colors.ink-2}`), never a colour.

## Typography

**Display Font:** Geist (with system-ui, sans-serif)
**Body Font:** Geist (with system-ui, sans-serif)
**Label/Mono Font:** Geist Mono (with ui-monospace, monospace)

**Character:** One family at one heading weight. Headings are medium (500), never bold, and draw their authority from size and tight negative tracking. Mono is a functional register, not a decorative one: it marks a path, a key, a status word or a caption that tells you the picture is drawn.

### Hierarchy

- **Display** (500, 40px / 52px at sm / 64px at md, line-height 1.02, tracking -0.035em): the hero headline only, balanced, at most 21ch, with the verb replaced by the voice pill.
- **Headline** (500, 34px / 44px at md, line-height 1.08, tracking -0.03em): every section h2. Left-aligned, at most 40 to 44ch.
- **Title** (500, 19 to 22px, line-height 1.2, tracking -0.01 to -0.02em): step and feature titles, FAQ questions at 17px.
- **Lead** (400, 17px / 19px at md in the hero, line-height 1.5, `{colors.muted}`): the paragraph under each heading, at most 52ch.
- **Body** (400, 15px, line-height 1.55, `{colors.ink-2}`): explanatory copy, at most 46 to 60ch. The open-source and safety paragraphs run at 17px.
- **Small** (400, 13px, `{colors.muted}`): details, section sources, footer text, panel metadata, header chip text.
- **Label** (400, Geist Mono, 10.5 to 13px, `{colors.muted}`): folder paths, `kbd` keys, status words ("working", "listening"), the "You" and agent names above bubbles, the hero under-line, and the illustration captions at 12px.

### Named Rules

**The Mono Boundary Rule.** Geist Mono is allowed for paths, keys, status words, captions and the hero under-line. It never sets a heading, a lead, a button or body copy.

**The Medium Heading Rule.** Headings are weight 500 with negative tracking that tightens as size grows (-0.01em at 20px, -0.03em at 44px, -0.035em at 64px). No bold, no uppercase, no kicker above.

## Layout

One centred column, 1120px wide, with 24px side padding. The app window in the hero is narrower at 1040px so the crew can perch on its top edge and overhang the column. The header is sticky, 56px tall, ground at 85 percent with backdrop blur and a `{colors.line}` bottom rule.

Sections are separated by 128px of top padding (160px from md) and announce themselves with a headline only; the open-source section adds a hairline rule above its grid. Two-column sections use a 1fr / 1fr grid with a 64px gutter from md (40px stacked below); the FAQ uses 1fr / 2fr. The feature tour pins its left panel at `top: 112px` while the right list scrolls, switching the panel's contents to match the item nearest the viewport centre. Lists inside a section are rows divided by `{colors.line}` hairlines with 24 to 40px of vertical padding, never boxed cards.

The safety band is the one full-bleed element: `{colors.night}` edge to edge, 96px vertical padding (128px from md), with the crew's desk row sitting on its top edge at the right. The pixel field behind the hero is 680px tall, fades to nothing over the bottom 28 percent so it is gone before the window, and fades at the sides over a fixed span of cells so phones keep a field and wide screens keep clear margins.

Spacing inside components follows a 4px step: 4, 8, 10, 12, 16, 20, 24, 32. Between blocks: 56 to 64px. Breakpoints are Tailwind's defaults, sm 640px, md 768px, lg 1024px. Below md the pinned feature panel is replaced by each feature's demo inline under its text, the app window's agent rail is hidden, and nav anchors and the star chip disappear leaving wordmark and download button.

## Elevation & Depth

Depth is mostly tonal: white panels on a `{colors.ground}` page, hairlines for edges, `{colors.ground}` insets for inputs and code, `{colors.line-soft}` for interior dividers. Where a panel is meant to float (the app window, a notification card) it carries one diffuse two-part shadow with a tight contact layer and a long soft cast. Nothing else on the interface has a shadow. On the night band depth is carried entirely by `{colors.night-card}` cells inside a `{colors.night-line}` grid.

### Shadow Vocabulary

- **Panel float** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 12px 30px -16px rgb(0 0 0 / 0.25)`): a notification or reply card presented as a floating object.
- **Window float** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.04), 0 30px 60px -30px rgb(0 0 0 / 0.25)`): the app window in the hero.
- **Raised segment** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.08)`): the selected segment of a switch, white on a `{colors.ground}` track.
- **Listening halo** (`box-shadow: 0 0 0 3px rgb(40 136 136 / 0.2)`): the mic dot while a line is being heard.

### Named Rules

**The Diffuse Only Rule.** Interface shadows are soft, low-alpha and cast downward; a floating panel is the only thing that earns one. No hard offset shadows on any interface element.

## Shapes

Gently rounded, tighter as the element gets smaller. Panels and the app window use the panel radius (14px); buttons, chips, list rows and inset fields use 8px; speech bubbles use 12px with the corner nearest the speaker cut to 4px; the mic bar is 10px; small segments and `kbd` keys are 5 to 6px; status dots, colour swatches and the voice pill are full circles. The pinned feature panel is the one larger radius on the page (18px) because it is the largest card.

Borders are always 1px `{colors.line}` (or `{colors.night-line}` on the band). A `kbd` gets a 2px bottom border so the key reads as a key. Pixel elements are the exception to every curve: the crew faces, desk sprites and pixel field are square cells rendered with `image-rendering: pixelated` and `shape-rendering: crispEdges`, never anti-aliased or rounded.

## Components

### Buttons

Quiet and product-like: the filled one is the call to action, the outlined one is an equal-height sibling.

- **Shape:** rounded (8px)
- **Primary:** `{colors.ink}` fill, white text, weight 500; 44px tall with 20px side padding and 15px text at hero and closing size, 36px tall with 14px padding and 14px text in the header. Leads with the 15px Windows glyph from the page's own icon set.
- **Hover / Focus:** background shifts to `{colors.ink-2}` over a colour transition; focus is the global 2px `{colors.bit}` outline offset 3px with a 6px radius.
- **Secondary:** `{colors.card}` fill, `{colors.line}` hairline, `{colors.ink}` text, same height; hover fills `{colors.ground}`.

### Chips

- **Style:** `{colors.card}` fill, `{colors.line}` hairline, 8px radius, 12 to 13px text. The header star chip carries the GitHub mark, a `{colors.muted}` star and a tabular-nums count; the crew chip carries a 20px pixel face with 4px left padding and the agent's name.
- **State:** hover fills `{colors.ground}`. Status chips ("working") set a 7px dot and a mono word in the agent's hue.

### Cards / Containers

- **Corner Style:** panel radius (14px)
- **Background:** `{colors.card}`; the feature tour's pinned panel washes the active agent's hue at 6 percent into card and transitions over 500ms as the agent changes.
- **Shadow Strategy:** none unless the card is presented as floating (see Elevation & Depth).
- **Border:** 1px `{colors.line}`
- **Internal Padding:** 12 to 16px for demo panels, 32px for the pinned panel, 24px for night cells.

### Inputs / Fields

- **Style:** `{colors.ground}` inset inside a `{colors.line}` hairline; 8px radius at 32px tall for a text field, 10px radius at 44px for the mic bar. Placeholder text is `{colors.muted}` at 13px; a right-aligned `kbd` names the hotkey.
- **Focus:** global outline (2px `{colors.bit}`, 3px offset). The mic bar shows listening as five 2px `{colors.bit}` bars of stepped heights replacing the `{colors.line}` idle bars, transitioning over 300ms.
- **Switch:** a `{colors.ground}` track with a 6px radius holding 11px segments; the selected segment is white with the raised-segment shadow, coloured in the agent's hue for "Always" and `{colors.block}` for "Never".

### Navigation

- **Style:** sticky 56px header. Wordmark is the logo at 22px tall, brightness zero, beside the name at 15px semibold, tracking -0.01em. Anchors are 14px `{colors.ink-2}`, hover `{colors.ink}`, hidden below sm. The footer repeats the pattern at 13px `{colors.muted}` on a `{colors.line}` top rule.

### Speech bubbles and thread rows

The page's model of a conversation follows the app's light theme. It is reused in the hero window, the how-it-works step and the feature panel.

- **You:** `{colors.line-soft}` field, `{colors.ink}` 13 to 15px text, 12px radius, right-aligned to 80 percent width. The wake word is the addressed agent's hue, medium weight, never wrapped. In the hero the line types into the composer first, with the mic icon in Bit's teal, and lands in the thread as a bubble when it is complete.
- **Agent:** plain `{colors.ink}` text with no bubble and no avatar, as the app renders replies. A spoken reply appends a four-bar meter in the agent's hue.
- **Thread rows:** 32px hairline rows with a muted icon and 12px text for the collapsed steps the app shows: "Thinking", the tool name in mono ("Bash", "Read"), and "Turn complete · n turns · $cost" when the agent finishes.
- **Permission card:** when an agent needs approval, an amber card (`#fffbeb` fill, `#e6c46a` border, `#b58a1e` shield) titled "Block wants to use Bash", the command in a mono inset, "This command requires approval", and three actions: "Allow once" (ink fill), "Allow for this session" (hairline), "Decline" (text). Once allowed it collapses to a tool row marked "allowed once".
- **Agent header:** above every thread, the agent's colour dot, name, conversation title with a chevron, and a status line ("Not running", "Working · 3 turns", "Ready · 5 turns · $0.1219"), with the model chip and an Edit button on the right.

### Voice pill

The single pixel-style element outside the characters. An ink pill sized to the headline's cap height (0.72em tall, 0.22em side padding, full radius) holding seven 0.06em bars in `{colors.bit}` at rest (`--amp` 0.7). While a line is said they rise (`--amp` 1.9, eased over 500ms) and take the hue of the agent the line is addressed to (`--voice`, colour eased over 300ms), the same hue the ripple carries down to that desk; they ease back to teal when the line ends. The replaced word stays in the DOM for screen readers.

### Pixel crew

Faces are SVG rects at cell resolution, one hue per agent with white eyes and a darker shade for terminal; they appear at 20 to 40px beside names, in list rows, on panel corners and next to the FAQ heading. The desk row is a sprite sheet of the five agents at their screens in fixed order (Clawd, Bit, Terminal, Block, Loop), perched on top of the hero window and the safety band. Screens light in the agent's hue when addressed, hands type in 460ms two-frame steps with a per-agent delay and a 230ms right-hand offset, output lines appear in 420ms steps, and a done agent rests its hands.

### Pixel field

Pixel Blast from React Bits (`src/components/pixel-blast.tsx`, MIT, Three.js), mounted by `hero-field.tsx` after a short deferral so hydration finishes first, never server-rendered, and skipped entirely under reduced motion or without WebGL. Square variant, 6px cells with 0.5 size jitter, pattern scale 3 and density 0.8, in zinc (#d4d4d8) a few steps off the ground so it reads as depth rather than colour, which leaves the voice pill as the only teal in the first viewport, drifting slowly (speed 0.6) with edge fade 0.25 and a CSS mask that clears the bottom before the app window. Pointer clicks start its own ripples; it is not tied to the hero script. When a wake word is said the addressed agent glances over its shoulder 700ms later and its screen turns on: the pale idle tint goes dark in the agent's hue (30 percent of the hue into #1c1913) with output lines and a cursor in the idle tint, so the head in front of it stays a clear silhouette.

## Do's and Don'ts

### Do:

- **Do** use `{colors.ink}` for the one filled button and every other control as a white card with a 1px `{colors.line}` border.
- **Do** carry agent colour as tinted text (55 percent into white on ink, the raw hue on white), a 2 to 7px dot or bar, a border, or a 6 to 9 percent wash. Lift a hue for dark ground the way `{colors.night-key}` lifts Bit's teal.
- **Do** set every heading in Geist at weight 500 with negative tracking and no label above it.
- **Do** keep character motion in `steps(1)` and interface motion on `cubic-bezier(0.16, 1, 0.3, 1)`; the rise entrance is 640ms from 14px below, opacity from 0, and every element renders visible by default so reduced motion and no-JavaScript show the finished state.
- **Do** draw icons in the page's own stroke set (`icons.tsx`) and put pixel art only on the crew faces, the desk sprites, the voice pill and the hero field.
- **Do** caption product imagery in 12px mono `{colors.muted}`: the hero window as an illustration, the section captures as captures from the app. Captures are cut to the element they show, at 2x, from the Windows build in its light theme, and sit in a white hairline panel.

### Don't:

- **Don't** fill a surface with an agent hue and set text on it; the ceiling behind text is a 9 percent wash.
- **Don't** add a second filled button, a coloured button, or a button whose hover changes hue rather than shade.
- **Don't** set headings, leads, buttons or body in Geist Mono, and don't use a pixel or serif face anywhere.
- **Don't** put a kicker or eyebrow label above a heading, or lay out a section as a grid of same-size icon cards.
- **Don't** give interface elements a hard offset shadow, retro window chrome, or cream and warm-lamp tones from the rejected world.
- **Don't** ease a character or step the interface; the two grammars never share a keyframe.
