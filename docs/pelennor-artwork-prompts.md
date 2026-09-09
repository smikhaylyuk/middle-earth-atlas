# Pelennor artwork prompts

Two distinct assets created with built-in ImageGen, one request each.

## Main terrain sheet

```text
Use case: precise-object-edit.
Asset type: ONE continuous painterly Tolkien atlas terrain sheet for an interactive map.
Primary request: Complete the beige empty area of image 1 as a seamless southward terrain continuation. Produce exactly one edge-to-edge 2000 x 1400 pixel landscape sheet. North is up; x increases right/east and y increases down/south. The world-coordinate origin of this tile is (3440,4150). All coordinates below are LOCAL PIXELS in the requested 2000 x 1400 output, not labels to draw.

INPUT IMAGE ROLES
Image 1, extension-target.png: THE EDIT TARGET. Its first approximately 300 pixels contain the approved map corridor to preserve and extend. Keep the established upper-strip river, mountains, woods, and road registered in precisely their current positions; remove the beige transition/fade by completing the terrain. The entire remaining beige blank area must become painted map terrain.
Image 2, current-south.png: STYLE AND EXISTING CORRIDOR REFERENCE ONLY. Match its delicate muted olive-gold vegetation, gray stone, fine painterly rock detail, small tree clusters, and high-oblique atlas viewpoint. Do not copy its composition, crop, small tower, or paper-fade edge.
Image 3, canonical-pelennor.png: GEOGRAPHIC RELATIONSHIP REFERENCE ONLY. Observe Minas Tirith backed by Mindolluin to the west, Pelennor between mountain and river, Osgiliath north-east across both banks, Harlond on the western riverbank south-east of Minas Tirith, and the compact Emyn Arnen east of the westward river bend. Do not copy any lettering, red marks, black contour symbols, or graphic style.

STYLE AND VIEW
A restrained, beautiful atlas continuation at the same terrain scale as the approved top strip, not a cinematic city poster. Consistent high-oblique map view, north up, neutral daylight, delicate fine-brush terrain, muted olive-gold fields and woods with soft gray rock. White Mountains continue naturally down from the upper left. The main eastern Ephel Duath mountains may continue along the far right edge. All terrain must reach all four frame edges: no sky, horizon, vignette, blank paper, beige mist/fade, border, decorative frame, compass, text, labels, symbols, UI, watermark, or legend.

HIGHEST-PRIORITY CONTINUITY: THE ANDUIN
Preserve the river in the approved top strip at local centerline points (980,0), (1040,150), (1080,250), and (1090,300). Continue it smoothly and without any seam south through Osgiliath at (1140,460), then bend southwest through (1090,630), (1010,730), and (1020,870), then southeast to (1130,1050), then gently southwest through (1110,1190), exiting the bottom edge at (1040,1400). These are one uninterrupted river's centerline anchors. The river stays gray-teal and approximately 120 pixels wide, with both banks clearly continuous. Match its width, perspective and texture to the approved northern strip. The river must remain open and recognizable all the way from the top edge to the bottom edge. No extra major river, tributary, ocean, lake, dam, full bridge, blocked river, or dead-end bright water streak. Ruins and quays stay at the banks and do not sever or cross the water.

MINAS TIRITH AND MINDOLLUIN
Place Minas Tirith centered at (720,630), with only about a 150 x 140 pixel atlas-scale footprint, attached to the western mountain by a substantial rocky shoulder. Mount Mindolluin rises immediately WEST/LEFT of the city and visibly belongs to the White Mountains continuing from the upper-left approved terrain. The city FACES EAST/RIGHT across the Pelennor toward the river. Show seven stepped white-stone walled tiers embracing the hill, a charcoal/black outermost defensive wall, a narrow tall white tower on top, the eastern stone prow, and the Great Gate at the EASTERN/RIGHT foot. At this small map scale, the tiers must read as a compact terraced city with fine detailed masonry. No giant isolated castle, no city facing left or south, no second white city, no green living White Tree visible.

PELENNOR AND RAMMAS ECHOR
Place cultivated townlands mainly NORTHEAST and EAST of Minas Tirith, between the mountains and the river. Include small tilled fields, orchards, pasture, and only a few tiny scattered farmsteads in the same muted atlas palette. One LOW Rammas Echor boundary wall encloses these townlands. Connect that wall to the mountain at the northwest and southwest and take its eastern boundary near, but wholly on the west side of, the river. The wall should enclose the agricultural area rather than make a second city fortress or run across the river or over mountains. Include the southern Harlond quays within or at its riverside boundary. The northern road enters through a north gate, and the eastward road leaves through the eastern Rammas gate/causeway forts.

OSGILIATH
Center Osgiliath at (1140,460), north-east of Minas Tirith. Show scattered roofless weathered old-stone ruins on BOTH banks. Broken bridge stumps extend only a little way from the two banks, separated by a very clear OPEN WATER gap. No intact crossing, no roadway painted continuously across the river, no thriving town, no intact fortified second city, no armies. The east road resumes separately on the east bank and continues toward the far-right boundary.

HARLOND
Center the tiny Harlond quays approximately at (965,790), on the WEST bank of the Anduin southeast of Minas Tirith. Small quays run PARALLEL to the riverbank with a handful of tiny warehouses behind them, and a short road spur joins them to the southern city road. Harlond is a modest riverside port, not a bridge, dam, or city, and does not cross the river.

EMYN ARNEN
Center a compact wooded group of hills at (1300,840), EAST of the river, SOUTH of Osgiliath, on the inside/eastern side of the river's westward bend. It is a distinct small cluster with woods and low ridges separated by lower land from the main Ephel Duath range far to the right. No Faramir palace or new settlement.

ROADS
Continue the EXISTING north road seen just west of the top-strip river, bring it through the north gate of Rammas, and connect it to Minas Tirith. The main northeast road runs from the city's EASTERN Great Gate, through the Rammas gate and small causeway forts, to the WEST Osgiliath ruins. It stops at the broken crossing; a separate continuation resumes on the EAST bank toward the far-right boundary. A southern road leaves Minas Tirith, stays on the WEST riverbank, and exits the bottom edge; add the short connected Harlond quay spur. Roads are restrained thin dusty tracks, with connected sensible junctions. Avoid random disconnected road networks.

TIME AND EXCLUSIONS
Late Third Age shortly before the March 3019 siege, after Osgiliath's last bridge has fallen. No Minas Morgul, Cirith Ungol, Pelargir, extra fortresses, battle fire, armies, siege trenches, siege equipment, destruction at Minas Tirith, or postwar settlements. No text anywhere.

FINAL PRIORITIES
1. Preserve approved upper-strip registration and seamlessly continue its river/mountains/road.
2. Draw the ONE Anduin continuously through the specified bend anchors, with open water at Osgiliath.
3. Keep all settlements very small at atlas scale and in the specified locations, with Minas Tirith connected to its mountain and facing east.
4. Match the source terrain's restrained painterly style and fully paint the sheet edge to edge.

```

## City and harbour defences inset

```text
Use case: precise-object-edit.
Asset type: a seamless replacement inset for an existing painterly Tolkien terrain atlas.
Edit the ONE supplied image, defences-target.png. It is the edit target, not a loose style reference. Return one image at exactly 760 x 750 pixels, same crop, scale, camera, composition, palette, and terrain registration. All coordinates below are LOCAL PIXELS of this 760 x 750 target. North is up, east is right. This crop begins at atlas coordinate (3780,4500).

MAKE ONLY TWO LOCAL CORRECTIONS:
1. Refine and slightly shrink Minas Tirith while making its outermost city wall black.
2. Extend the low Rammas Echor agricultural boundary south around Harlond, with a southern road gate.

STRICT PRESERVATION
Keep the existing Anduin, both visible banks, the eastern/right-bank land, all Harlond quays and warehouses, and the three main connected roads in their exact pixel positions. Preserve mountain mass, surrounding farms and orchards, and all four crop edges. The main city Great Gate must remain anchored at (414,329), meeting the same roads at exactly the same place. Harlond remains near (623,483). Maintain the current olive-gold fields and vegetation, gray rocks, delicate painterly high-oblique atlas style, neutral daylight, and very fine terrain detail. Do not zoom, pan, rotate, recolor, redesign the surrounding geography, or generate an alternative composition.

CORRECTION 1 — MINAS TIRITH
The current city has its main mass centered near (285,284), Great Gate at (414,329), and tower near (247,148), with an approximately 300 x 280 pixel footprint.
Reduce this city modestly to approximately 220 x 220 pixels including its narrow summit tower. Shrink inward toward its fixed eastern Great Gate, not toward the crop's center. An appropriate new overall extent is roughly x210–430, y155–375. The Great Gate itself remains at exactly (414,329), at the EASTERN/RIGHT foot, attached to the existing road junction.
Maintain a recognizable compact seven-level white-stone city, stepped up a hill, with the white tower narrow and tall on the summit. ALL upper defensive walls and tiers remain white stone. Only the single OUTERMOST CITY defensive wall must become distinctly BLACK/CHARCOAL masonry, including its entire visible lower curved circuit and the Great Gate facade. It must visibly read as black stone, not pale gray, a shadow, or a black line. The upper walls should still be unmistakably white and remain distinct from the black lower wall.
Orient the terraced city's front, eastern rock prow and Great Gate EAST/RIGHT across the fields. Keep a substantial WESTERN/LEFT rocky shoulder physically attaching the back of the city to Mount Mindolluin; do not turn it into a freestanding castle. Show the characteristic eastern stone prow as a narrow rocky projection among the tiers without cutting the city into disconnected buildings.
Keep the surrounding mountain unchanged, blending its rock into the subtly reduced city footprint. No green living White Tree at the citadel. If a tiny tree is visible there, it must be dead and bare. No giant castle, extra city, added tower outside the city, or forest on top of the citadel.

CORRECTION 2 — RAMMAS ECHOR AROUND HARLOND
The existing LOW field-boundary wall presently ends near (630,440), north of the little port near (623,483). Extend this SAME low agricultural boundary farther SOUTH past the full extent of the quays and warehouses, then turn it WEST back to the city-south mountain foothills. The southernmost quay and warehouses must clearly lie NORTH/INSIDE the new southern boundary rather than outside it.
A suitable southern return runs on dry land just south of the lowest quay, around y580–610, passes through a small gate where it meets the existing south road near (555,610), and continues west across the lower fields to join the existing western mountain foothills. Blend its exact shape into the existing terrain and trees. Keep the harbour quays and riverbanks in place.
The wall is LOW pale gray stone enclosing farmland and orchards at a much lower scale than the city walls. It is not another ring or terrace of Minas Tirith. Its river-side portion hugs the dry land margin; leave the entire harbour's water frontage open. Never extend a wall, bridge, dam, boom, or barrier across any part of the Anduin or across a harbour mouth. Do not move a quay or fill water to make space.
The existing southern road must pass continuously THROUGH a real, small, open gate in this new low field wall, then continue along its current route to the bottom edge. Keep the city-to-port road spur connected, and keep all existing road junctions and the northeast city road unchanged.

No text, labels, UI, symbols, sky, border, beige paper fade, armies, siege activity, flame, or new settlements. Preserve all terrain outside these two local corrections. Produce only this one corrected inset.

```
