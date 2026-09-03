# Open Room landing page: hero and art direction

Date: 2026-09-03. Status: agreed with Lincoln in conversation, pending review of this note.

Inputs: `copy/company-brain.md` (mined from the app README), style and pose tests under `assets/higgsfield/keyframes/iso-test/`, prompts and job ids in `assets/higgsfield/keyframes/README.md`.

## Decisions already made

- The earlier desk scene with a near-photoreal person is dropped. One art style for everything, no human. In the product the user is the voice, not a character.
- Art direction is an isometric voxel room diorama. Style anchor: `iso-test/iso-v1.png`. Rest state base: `iso-test/pose/rest.png`.
- At rest the mascots face their screens with faces hidden. A mascot faces the viewer only when it is talking to you: a swivel in its chair when called, a hop off the chair when it reports back.
- The whole page uses the same room from the same camera. Each section changes only what its beat needs.
- Hero animation is stills cross-faded in the browser plus text overlays. No video and no audio. A video clip can replace the hero loop later if wanted.
- Primary action is a waitlist email signup. Copy is fixed below.

## Style key

Isometric voxel diorama, stylised 3D render, playful and cosy. A cube room with two back walls and an open front, floating in pure black. Night. Three voxel desks with monitors along the back walls; the screens are the only light. Teal creature with two antennae, red L-shaped creature, purple C-shaped creature, each at its own desk. A wall shelf with books, a plant, a patterned rug, a mug. Tilt-shift depth of field, soft volumetric glow, light film grain. Room in the right two fifths of a 21:9 frame, black on the left.

Every generated still is an edit of the rest frame with the mascot sheet as a second reference, and the prompt describes the complete state of all three creatures. Nothing is chained off a chained frame, so drift is never more than one hop from the base.

Agent colours match the app: teal for Juno, red for Atlas, purple unnamed in the hero. Screens of working agents glow in their agent colour; idle screens stay amber.

## Hero layout

Dark page, the app's near-black. Desktop: text in the left three fifths, room in the right two fifths, vertically centred. Mobile: room on top cropped to the cube, text below.

Top to bottom on the left:

1. Eyebrow: Open Room. A desktop app for Claude Code.
2. Talk line: a monospace line that types itself, with a coloured dot before it, in the shape of the app's overlay pill.
3. Reply lines: the agent's answers appear under the talk line in the agent's colour, prefixed with its name.
4. Pip row: one small pip per working agent, "Atlas · working", in the shape of the app's HUD.
5. Headline: Talk to your agents without leaving your window.
6. Subheadline: Give each Claude Code agent a name, a voice and its own folder. Say hey and the name from wherever you are, and it comes back when it's done or stuck.
7. Email field and button: Tell me when it's ready.
8. Under the button: Free and open source. Uses the Claude Code login you already have.
9. Small trust line at the foot of the hero: Nothing leaves your machine. No keys, no telemetry, speech in and out runs locally.

No navigation. One footer link to the GitHub repo.

## Hero animation script

Roughly eighteen seconds, then loops. The room frame changes only at the marked moments. All text is typed or faded in by the site; nothing is baked into the images.

| Time | Left side | Room frame |
|---|---|---|
| 0.0 | Pip: Atlas · working | F1 rest, Atlas working: all three at screens, red screen red-tinted |
| 1.0 | Types: ● hey Juno, run the tests | |
| on "Juno" | | F2 Juno called: teal swivelled to face viewer, eyes bright, teal desk glow; red at red screen; purple at amber screen |
| 4.0 | Pips: Atlas · working, Juno · working | F3 both working: teal at teal-tinted screen, red at red-tinted screen, purple amber |
| 6.0 | Types: ● hey Atlas, what's the status of my CI pipeline? | |
| on "Atlas" | | F4 Atlas called: red swivelled to face viewer, eyes bright, red desk glow; teal at teal screen; purple amber |
| 9.5 | Reply, red: Atlas: Let me check that for you. | F3 both working |
| 13.5 | Reply, red: Atlas: The CI pipeline ran successfully. Pip Atlas becomes done. | F5 Atlas reports: red hopped off its chair, standing on the rug facing viewer, one arm raised, red floor glow; teal at teal screen; purple amber |
| 17.0 | Hold | |
| 18.0 | Fade text, reset pips | F1, loop |

What the loop demonstrates, in order: address by name, a second agent addressed while the first works, a follow-up question answered immediately mid-task, a completion report later, all without the user going anywhere.

Reduced motion: show F1 with the first talk line already complete and no cycling. Frames are preloaded before the loop starts. Cross-fades are 300 ms.

## Below the hero

Same room, one section per beat, one line of copy each, then the same button.

1. Name your agents. A name, a colour, a voice, a folder and a role in plain text. Frame: the three standing in the middle of the room facing the viewer, a colour dot above each.
2. Build your team. Three of them working at once, each in its own project, asking before anything you told it to ask about. Frame: all three at screens, all three screens tinted in their colours.
3. Command the room. Hey plus the name, a hotkey, or typing. Any name works instantly. A question is never dropped. Frame: reuse F4.
4. Nothing leaves the room. No keys, no telemetry, no server but Anthropic's. Speech in and out runs on your machine. Frame: the room seen from farther away, small and alone in the dark.
5. Final call to action: headline repeated, email field, same button. Frame: reuse F1.

Open Graph image: F1 cropped to 1.91:1 with the headline set over the black.

## Image set

| Id | State | Used |
|---|---|---|
| F1 | rest, Atlas working | hero start, final CTA, OG image |
| F2 | Juno called | hero |
| F3 | Juno and Atlas working | hero |
| F4 | Atlas called | hero, section 3 |
| F5 | Atlas reports | hero |
| S1 | three standing, facing viewer | section 1 |
| S2 | all three working | section 2 |
| S4 | room far away | section 4 |

Eight stills. Nano Banana 2 through the Higgsfield MCP server at 1k for approval, then the approved ones again at 2k for the site. Hero frames first; section frames after this note is reviewed.

## Production notes

- Model: `nano_banana_2`, 21:9, references in order: rest frame job id, mascot sheet media id.
- Pose language that worked: "chair has rotated a full half turn", "entire body, head, chest and both arms face the viewer squarely", "both arms hang down at its sides", "no part of it touches the desk or keyboard". For the hop: "hopped off its chair and stands on the rug", "one arm raised in a small wave". Add "rendered as a 3D voxel figure with visible cube depth" to keep standing poses from flattening.
- Always end with "No text, labels or logos."
- Site: Next.js 16, Tailwind 4, Geist Sans and Geist Mono are already wired in `src/app/layout.tsx`. The hero is one client component that owns the timeline; frames are static images swapped by opacity. Implementation plan to follow separately.

## Open items

- [CONFIRM] Platform line if one is shown: "Windows first, macOS to follow" matches the README today.
- [CONFIRM] Names Juno and Atlas for teal and red. Purple has no name on the page.
- [PROOF NEEDED] One sentence from an early user. The page ships without proof until one exists.
- Optional: a rest frame variant with the purple creature turned three-quarter so its C shape reads from behind. Not needed for the hero.
