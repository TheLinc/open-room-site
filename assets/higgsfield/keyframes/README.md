# Hero key frames

Stills for the landing hero clip. Generated 2026-09-03 through the Higgsfield MCP server with Nano Banana 2 (billed as `nano_banana_flash`, 1.5 credits per image), 21:9, 1k (1584x672). Reference for the creature designs is `../mascot-sheet.jpg` (Higgsfield media id `9024a8c6-6a6c-49f3-a9b6-7f19ef203d9c`, uploaded the same day; re-upload if it expires).

Pipeline: base frame first, then each reaction frame is an edit of the chosen base so the room, person and camera stay identical. For video, use the base as the start frame and a reaction frame as the end frame of the same clip.

## Base frame

Chosen: `base/base-v3.png` (job `f862ae5a-4b94-4e68-9a02-8fec9715c3bd`). Alternates worth keeping: `base-v0.png` (person with long hair, mascots facing camera) and `base-v2.png` (most empty space on the left, mascots smaller). `base-v1.png` pulled all five sheet mascots in and is rejected.

Job ids: v0 `37dae3ea-e82f-456a-99f8-d1adec46fbd9`, v1 `db351343-a343-4bb8-bc0a-d2e908b8cf7e`, v2 `7c546d3f-a56d-4141-b7d5-23b40ac91f56`, v3 `f862ae5a-4b94-4e68-9a02-8fec9715c3bd`.

Prompt:

```
Ultra-wide cinematic still, stylised 3D render, low-key night scene. A dim home studio, almost black. The left two thirds of the frame are a bare matte dark wall in deep shadow with nothing on it, reserved as empty space. On the right third, a desk with a single monitor whose screen glows warm amber like a campfire, the only light source in the room. A person sits at the desk seen from behind at a three-quarter angle, silhouetted, edges lit by the screen glow. Gathered on the desk around the screen, warming themselves like campers at a fire, are three small voxel creatures built from cubes, matching the designs on the reference sheet: the teal one with two antennae, the red L-shaped one, and the purple C-shaped one. Small white pixel eyes catch the screen light. Soft volumetric glow, gentle rim light, subtle film grain, shallow depth of field. The screen shows only soft warm light. No text, labels or logos anywhere in the image.
```

## Reaction frames

Each uses the base job id as `image_references`. One per mascot so the site can pick any two.

| File | Mascot | Job id |
|---|---|---|
| `react/react-teal-v2.png` | teal, two antennae (use this one) | `a33737d7-bb9c-4027-9600-db29380ee20c` |
| `react/react-teal.png` | teal, first pass, creature drifted left off the screen edge | `69e0db01-90fc-4cd3-9424-9bd63c8996b2` |
| `react/react-red.png` | red L-shape | `cfcbdb04-587c-4bc0-b928-4f8656c2b987` |
| `react/react-purple.png` | purple C-shape | `10f47ccd-09f5-407c-a538-b73fbb79e554` |

Prompt (teal v2 shown, swap the creature and colour words for the others; the "do not move or resize anything" line is what fixed the drift):

```
Keep the reference image exactly as it is: same room, same desk, same person, same camera framing, same warm screen glow, same three voxel creatures in exactly the same positions and sizes. Do not move or resize anything. Change only the lighting on one creature: the teal creature with two antennae, standing in front of the left edge of the screen, is reacting to being called. Its white pixel eyes glow noticeably brighter, and a soft ring of teal light pulses around its body, casting a faint teal glow onto the desk surface around its feet. The red creature and the purple creature stay calm and unchanged. No text, labels or logos.
```

## Next step

Image-to-video, one clip per chosen mascot: start image = base job, end image = that mascot's reaction job. Kling 3.0 and Seedance 2.0 both accept start and end frames. Motion prompt should only describe the change (eyes brighten, ring pulses outward, faint screen flicker), not the scene.

## Direction change, 2026-09-03 (later the same day)

Lincoln rejected the desk scene: the near-photoreal person clashed with the voxel mascots and had no role in the product. New direction is an isometric voxel room diorama with no human. The base and react frames above are superseded and kept only for reference.

Style test stills in `iso-test/`, same model and settings, mascot sheet as reference:

| File | Job id | Note |
|---|---|---|
| `iso-test/iso-v0.png` | `cb5554c4-010f-410c-aa82-4ef569f53dbf` | brighter room, most readable |
| `iso-test/iso-v1.png` | `2bd723c1-e299-4e24-a928-21d4d821c522` | darker, warmer, best mood |
| `iso-test/iso-v2.png` | `c2453982-d7a5-4880-8dc8-dc84ef865fe5` | rejected: green sheet mascot replaced purple, four screens |

Prompt:

```
Isometric voxel diorama, stylised 3D render, playful and cosy. A tiny cube-shaped studio room floating in a pure black void, seen from above at a classic isometric angle: two back walls and a floor, the front open so the viewer looks inside. Night. Along the two back walls stand three small voxel desks, each with a monitor glowing warm amber; the screens are the only light in the scene. At each desk sits one small voxel creature built from cubes, matching the reference sheet designs: the teal one with two antennae, the red L-shaped one, and the purple C-shaped one. Small white pixel eyes catch the screen light. Cosy details built from voxels: a rug, a potted plant, a mug, a wall shelf with books. Soft volumetric glow, gentle ambient occlusion, subtle film grain, tilt-shift depth of field. The room occupies the right third of the ultra-wide frame; the left two thirds are empty black. No text, labels or logos.
```

### Pose tests, `iso-test/pose/`

Both use two references: `iso-v1` job id first (scene anchor), mascot sheet second (creature designs). The room, camera and props stayed identical across both edits.

| File | Job id | Result |
|---|---|---|
| `pose/rest.png` | `b4fc548a-b281-4868-91ef-17f1325ef687` | all three face their screens, faces hidden. Works. Purple C is least recognisable from behind. |
| `pose/called-teal.png` | `ef0298e3-1fcf-4f91-8055-f004c911d284` | red and purple face screens, teal swivelled to face viewer, eyes bright, teal glow on desk and floor. Works. |

Rest prompt:

```
Use the first reference image as the exact scene: same isometric voxel room, same camera, same desks, screens, shelf, plant and rug, same warm screen light, black void, room on the right, left two thirds empty black. Change only the three creatures' poses: each one now faces its own screen, seen from behind at a three-quarter back angle, arms on the keyboard, its face and eyes hidden from the viewer. Their shapes stay recognisable from the second reference sheet: teal with two antennae, red L-shaped, purple C-shaped. Quiet, focused mood, all three screens the same soft amber. No text, labels or logos.
```

Called prompt (teal; swap creature and colour for the others):

```
Use the first reference image as the exact scene: same isometric voxel room, same camera, same desks, screens, shelf, plant and rug, black void, room on the right, left two thirds empty black. The red L-shaped creature and the purple C-shaped creature face their own screens, seen from behind, faces hidden, arms on their keyboards, their desks dim amber. The teal creature with two antennae has swivelled its chair around to face the viewer directly, its white pixel eyes glowing bright, and its desk and the floor around it are lit with a soft teal glow. Creature designs match the second reference sheet. No text, labels or logos.
```

For the real set, chain the called frames off the approved rest frame rather than off `iso-v1`, so rest and called share the exact same base.

Teal called fix (Lincoln spotted one arm still on the desk in `called-teal.png`). Both chained off the rest frame `b4fc548a` plus the sheet:

| File | Job id | Pose |
|---|---|---|
| `pose/called-teal-v2-seated.png` | `2bcf6976-175f-4e2d-a66c-98ad49eb8f75` | chair rotated a half turn, both hands on lap |
| `pose/called-teal-v3-standing.png` | `6a3e44e6-a702-4d4a-a116-de1bdee392c3` | hopped off the chair, standing on the rug facing viewer, one arm waving |

## Hero frames, `hero/`

Per the design note in `docs/superpowers/specs/2026-09-03-hero-art-direction-design.md`. Every frame is an edit of the rest frame `b4fc548a` with the mascot sheet as second reference. Prompts describe the full state of all three creatures and end with "No text, labels or logos."

| Frame | File | Job id | Result |
|---|---|---|---|
| F1 | `hero/F1-rest-atlas-working.png` | `6bd3fb40-3511-4c88-9785-f9a1af74e045` | rejected: tinted the teal desk screen red instead of the red creature's |
| F1 retry | `hero/F1-rest-atlas-working.png` | `4e257c4d-125a-43fb-a8b2-0d286843a944` | good. Prompt names the desks left, middle, right. Rejected version kept as `F1-rejected-wrong-screen.png` |
| F2 | `hero/F2-juno-called.png` | `79a31c3d-ae72-4418-97d5-d220760f15fe` | good |
| F3 | `hero/F3-both-working.png` | `8a8a07a5-2abb-41c1-bff6-92c3019c256b` | rejected: background came out white |
| F3 retry | `hero/F3-both-working.png` | `0d726e40-6a0b-46f2-bbbb-ca9b51f4bc79` | good. Prompt repeats "pure black" twice. Rejected version kept as `F3-rejected-white-bg.png` |
| F4 | `hero/F4-atlas-called.png` | `d5f521a3-69c3-4908-89aa-0c9297d2a327` | good |
| F5 | `hero/F5-atlas-reports.png` | `a10e581c-17a4-457e-b09d-c0a3d2f017d9` | good |

Lessons: name desks by position (left, middle, right) as well as by creature, and restate the black background whenever a prompt changes screen colours, or the model may relight the whole scene.

## Section frames, `sections/`

| Frame | File | Job id | Result |
|---|---|---|---|
| S1 | `sections/S1-name-them.png` | `4f903765-f349-4128-9934-7a3087669ea7` | good: three standing on the rug facing viewer, empty chairs, amber screens |
| S2 | `sections/S2-all-working.png` | `92db74f1-e1dc-45b8-b09e-47bfd976fb2e` | good: teal, red and violet screens |
| S4 | `sections/S4-rejected-no-zoom.png` | `0a8930ef-2763-4497-8365-5ad0909d7740` | rejected: the model ignored the camera pull-back and returned the room at full size |
| S4 | `sections/S4-far-away.png` | none | built in post: `pose/rest.png` scaled to 45% on its own background colour, room centre kept at the same x |

Lesson: with a strong scene reference the model will not change camera distance. Scale in post instead; the background is flat so it composites cleanly.

## 2k finals

Upscaled with `bytedance_image_upscale` at 2k, 2 credits each, from the approved 1k job ids, so the pixels match the approved frames. Stored under `hero/2k/` and `sections/2k/`.

## Hero ambient loop, `hero/video/`

Direction change after the plan was written: the hero uses one looping clip of the agents typing instead of five cross-faded stills. The story stays in the typed text on the page; the posed stills still carry the sections.

| File | Job id | Model | Settings |
|---|---|---|---|
| `hero/video/loop-test-v1.mp4` | `545e29c1-26f2-40cf-ac27-fc047be31082` | Kling 3.0 pro, sound off | 5 s, 1:1, 1440x1440, 24 fps, 121 frames, 1.1 MB, 8.75 credits |

Start and end image are the same file, `hero/2k/F1-square.png` (media id `033f3064-c01c-4b46-b9a6-23936ae828d0`): a 2160x2160 crop of the 2k rest frame centred at three quarters of the frame width, which is where the room sits. Using one image for both ends is what makes the loop close.

Prompt:

```
Locked-off camera, no camera movement at all. Idle looping animation: the three small voxel creatures type at their keyboards with small quick hand movements, and each monitor flickers very softly. Nothing else moves; the room, desks, shelf, plant, rug and lighting stay perfectly still. Calm and cosy. The last frame matches the first frame exactly so the clip loops seamlessly.
```

Measured at 540 px (mean absolute pixel difference, 0 to 255): first frame vs source still 2.05, first vs last frame 0.46, camera drift in a static wall region at most 0.48, and the only pixels that change more than 20 levels are the three keyboard areas. Contact sheet, motion map and desk-band strip are alongside the clip.
