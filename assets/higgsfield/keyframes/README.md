# Generated art

What remains of the generated art for the landing page. Earlier directions (the voxel room diorama, its section stills and the ambient hero loop) were removed once the page moved to a plain surface with pixel mascots; their prompts and job ids are in git history before 2026-09-10. Reference for the creature designs is `../mascot-sheet.jpg`.

## Desk row, `row/`

New hero direction, 2026-09-07: the five pixel-art mascots (Lincoln's reference, `row/crew-reference.jpg`, media id `eaeda595-6d84-4813-a388-fef42a6f3214`) seen from behind at a row of desks, monitors facing the viewer, on the Reading lamp cream. Nano Banana 2, 21:9, 1k, 1.5 credits each.

| File | Job id | Result |
|---|---|---|
| `row/row-a.png` | `f0b4dbf0-95b9-4d5a-9756-7e1ad7aaee87` | monitors overlap the heads, screens tinted per agent, tighter chairs |
| `row/row-b.png` | `1ab1db48-4f5e-4559-99b1-ca0703b0f5cc` | monitors sit above the heads, more screen visible, evenly spaced |

Prompt:

```
Use the five pixel-art mascot characters from the reference image, same order left to right, same colours and same chunky 8-bit pixel style: salmon-orange crab with side claws, teal robot with two antennae, dark green trapezoid bucket, red L-shaped block, purple C shape. Draw them seen from BEHIND, backs to the viewer, no faces visible, each one sitting on a small pixel chair at its own small pixel desk, arms reaching forward to type on a keyboard. In front of each character, past its head, stands a small monitor whose screen faces the viewer and glows a pale tint of that character's colour. Five identical desks in one straight horizontal row, evenly spaced, camera straight on from behind at seat height, orthographic, no perspective. Flat 2D pixel art, crisp large pixels, no outlines, no gradients, no shading, no shadows, no floor line, no text, no labels. Solid plain cream background colour #FAF6EA everywhere. Wide composition with the row centred and generous empty cream space above.
```

Both came back with soft pixel edges and a background around #F4EEDC rather than the requested cream, which is the usual generative drift. If this direction is chosen, the row should be redrawn as real sprites (or these traced) so the pixels are crisp and the background is transparent.
