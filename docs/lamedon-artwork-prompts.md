# Lamedon artwork

Created with the built-in ImageGen tool. The main sheet and the small ford inset are separate selected assets; both are saved in the project. The inset replaces the generated bridge at Calembel with the book’s shallow Ciril ford.

## Main sheet — `public/images/lamedon-painted.webp`

```text
Use case: precise-object-edit / painterly map expansion.
Create ONE final original map artwork tile, portrait 3:5 aspect ratio, ideally 2160 x 3600 pixels or the highest available resolution at this exact ratio (the tile represents 1800 x 3000 world units).

INPUT ROLES:
Image 1, extension-reference.png, is the PRECISE EDITING CANVAS. Preserve its existing painted terrain at the top and right, the mountains, rivers and scale, and seamlessly replace ALL blank beige territory with new painted map terrain. Keep composition and camera fixed. Do not copy blank paper, feathered blank edges, or seams into the final. The entire image must be fully painted edge-to-edge.
Image 2, canonical-west.png, is a geographic context reference ONLY. Do not copy its art style, lettering, printed contours, graphic symbols or typography. Follow the explicit positions below over any reference ambiguity.

SUBJECT: Southern slopes of the White Mountains, Erech / Blackroot Vale and Lamedon in Middle-earth.
STYLE INVARIANTS: Match Image 1's fine tiny hand-painted woodland, small pale stone mountains and elevated painterly atlas view exactly, at identical small map scale. Warm muted olive and gold land; slate blue-green rivers; gentle lower green valleys, small woodland patches and restrained fields. Neutral consistent midday light across the whole tile. No separate haze, nighttime, spotlights or regional color filters.

PLACEMENT SPECIFICATION: Every coordinate below is a percentage of WHOLE OUTPUT, x from left, y from top. Preserve the old northern edge, with Dunharrow around (37,4). There must be no surface road through its mountains.
Erech at (32,30) is a SMALL grassy hill bearing a DARK SMOOTH HALF-BURIED SPHERICAL STONE. Make this stone recognizably rounded and low, never a tower, monolith or city.
Tarlang's Neck at (42,43) is a low pass OVER a rocky spur; the southward spur continues down to (34,64), dividing the western Blackroot Vale from Lamedon on the east. Preserve open valley space either side.
Calembel at (50,65) is a modest compact tiny pale hill-town immediately EAST of the Ciril ford, very small compared with the terrain.
Ethring at (67,79) is ONE SMALL STONE BRIDGE over the Ringlo. There is NO town, fortress, village or castle at Ethring.

HYDROGRAPHY — exactly THREE new continuous natural rivers, no tributary spaghetti, no water disappearing in fields. Thin coherent painterly watercourses with continuous channels:
1. Morthond emerges from mountain shadow at (28,12), flows south WEST of Erech via (26,30), (22,50), (16,75), and exits the bottom edge at (8,100).
2. Ciril emerges under the mountain slope at (52,47), flows south through (49,55), (47,65) at the ford WEST of Calembel, then runs to (43,88), where it JOINS the Ringlo.
3. Ringlo emerges from the foothills at (78,67), flows southwest through (72,73), (67,79) beneath Ethring bridge, (56,83), and (43,88) at its Ciril confluence, then continues southwest to EXIT bottom at (20,100).
Morthond and Ringlo stay SEPARATE throughout this tile; their eventual confluence is BEYOND the bottom edge, outside the image. Do not join them within the tile. Keep Image 1's pre-existing upper and right-side rivers unchanged. New channels belong in the former blank area.

ROAD — ONE coherent narrow pale earth road: starts at Erech (32,30), goes southeast OVER Tarlang's Neck (42,43), then to the Ciril FORD (47,65), then into Calembel (50,65), then southeast across the short Ethring bridge (67,79), then continues SOUTHEAST to bottom edge at (85,100), heading toward Linhir which is outside the tile. Make the intended pass, ford and short river bridge understandable in the terrain. No random extra roads, dead ends in fields or long bridges across valleys. No connection north through the White Mountains.

AVOID: all text, letters, labels, typography, legend, UI, compass, border, watermark, coastline, sea, invented castles, large cities, extra settlements, superfluous branching roads or rivers, giant landmarks, detached water segments. Preserve all old painted top and right features, fill all blank beige areas seamlessly, and output ONLY map artwork.

```

## Ford inset — `public/images/repairs/lamedon-ciril-ford.webp`

```text
Use case: precise-object-edit.
Edit the attached painterly map crop as a very precise local repair. Preserve the EXACT composition, camera, terrain positions, tiny object scale, palette, lighting and fine brushwork of the reference. Its aspect ratio is 225:215 (almost square); maintain that exact composition and framing. Do not zoom, pan, rotate, recenter, add scenery, or redesign the town.

CHANGE ONLY the small arched stone bridge in the middle of the crop. Completely remove the stone arches, bridge deck, stone parapets, pillars and all masonry from that crossing. In their identical location, make a shallow natural river FORD: the pale earthen road from the upper left gently descends to a gravelly river margin, crosses directly through shallow slate blue-green flowing water, and gently ascends the opposite margin to continue lower right past the tiny hill-town. A short faint stony track may be visible beneath the shallow water, but there must be no raised dry deck, no spanning structure, no long stepping stones and no bridge. Keep the river visibly continuous, flowing from the top of the image to the bottom through this shallow crossing. Paint subtly lighter, shallow flowing water at the crossing, with little gravel at the banks.

KEEP UNCHANGED: the river path, width and banks upstream and downstream; road entering from upper left and leaving lower right; tiny pale hill-town at right; every surrounding woodland patch, hillside, field, cliff, rock, tree and terrain contour. Match the original muted warm olive and gold land, slate blue-green water, tiny hand-painted texture and neutral midday lighting seamlessly. Do not enlarge the settlement or the crossing. No words, labels, UI, frame, new buildings or bridges anywhere. Output only the edited map artwork.

```

## Watershed inset — `public/images/repairs/lamedon-watershed.webp`

```text
Use case: precise-object-edit.
Make ONE narrowly localized correction to this painterly mountain-map crop. Maintain the exact 650:550 aspect ratio, exact composition, framing, terrain scale, colors and brushwork. Do not zoom, pan, rotate, recenter, redesign, or expand the image.

The reference incorrectly joins a small northern stream to a large south-flowing river through a mountain crest. Correct this watershed division by changing ONLY the narrow central river/waterfall corridor at original-image x150–235, y145–280 (approximately x23%–36%, y26%–51% of the full output).

REMOVE the continuous blue stream, waterfall and wet channel within that correction corridor. In their place paint a continuous DRY White Mountain saddle and rocky ridge: pale grey jagged stone, dry cliff faces, muted olive/gold exposed slopes, matching the tiny mountain brushwork immediately to either side. Connect those neighboring mountain walls into a convincing unbroken rocky watershed divide. No water is to cross this new dry ridge, on the surface or in any visible opening.

The existing small stream north of the corrected ridge must terminate independently at a separate small NORTH-FACING spring above original y145. Its unchanged upper channel leads northwards toward the top edge. The Morthond SOUTH of the ridge must instead emerge INDEPENDENTLY from a shaded SOUTH-FACING rocky cleft at original y280 (about 51% down the image), then flow along its EXACT existing broad blue lower channel all the way to the bottom edge. There must be a clearly visible substantial stretch of dry rocky terrain between the northern spring and southern source. Do not add a pool, lake, white waterfall ribbon, blue line, tunnel, cave passage diagram, road, bridge or path joining these two separate waters.

Strict preservation: keep ALL terrain outside this narrow central correction unchanged, especially every edge pixel, the northern stream above the ridge, lower Morthond channel below y280, forest patches, mountain shapes to left and right, trees, fields, and existing pale-grey mountain brushwork. Preserve the original warm muted olive and gold terrain, slate blue-green water, neutral midday light, detailed tiny painted atlas texture and elevated map perspective. No labels, text, border, UI or watermark. Output only the corrected map artwork.

```
