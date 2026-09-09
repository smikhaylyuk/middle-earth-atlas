# Morgul Vale artwork prompts

Generated with the built-in ImageGen tool: one main sheet and one selected road-junction inset, one request per asset.

## Main sheet

Asset: `public/images/morgul-painted.webp`. Source: 1225 × 1284, registered to 1430 × 1500.

```text
Use case: compositing.
Asset type: one seamless painted extension crop for an existing Middle-earth atlas.

INPUTS: Image 1, extension-target.png, is the EDIT TARGET, a 1430 by 1500 pixel north-up map crop. Image 2, canonical-morgul.png, is supporting geographic reference only; do not copy its text, red ink, contours, diagram style or exact image framing. Image 3, current-overview.png, is supporting painterly STYLE and scale context only; do not copy its black blank regions, broad framing or other landmarks.

PRIMARY REQUEST: Edit Image 1 in place. Complete the beige unpainted right side as a continuous Morgul Vale and Shadow Mountains expansion. Open and connect the narrow middle-left valley to that new terrain. Preserve the composition and framing of Image 1. Return a single 1430x1500 image if supported, otherwise exactly the same near-square portrait aspect ratio with the coordinate layout proportionally registered. No borders.

PRESERVE INVARIANTS: Lock the big blue Anduin river and its shoreline along the left, the original Osgiliath ruins on its banks, the already painted northern Mordor terrain at the top, and the western and southwestern painted forests and ridges. Keep them in their original positions and at their original scale. Only the small tributary mouth and narrow local road/valley connections may touch existing terrain. Do not enlarge, move, redraw or duplicate the Anduin, Osgiliath or existing mountains. Completely fill the beige right area with painted landscape: no beige void left and no obvious seam or fade.

STYLE: Same north-up high-oblique painterly cartography as Image 1, finely etched brush texture, delicate miniature trees and buildings, mountains as clustered natural ridges. View from high above, no sky or horizon. Muted ochre and olive landscape in the west, ash-grey earth and dark slate mountains in the east. Neutral daylight painting throughout. No global night tint, no cinematic mist, no neon green cast.

GEOGRAPHY AND LANDMARKS: Pixel locations below use Image 1's 1430x1500 coordinate system, origin at top left, x east/right, y south/down. They are intended registration positions, not text to draw.
- Cross-roads at approximately (390,680), among a few large healthy trees, with four recognizable directions. Its west road reaches the ORIGINAL Osgiliath ruins at about (160,720). A north-south Harad Road passes through this junction along the western mountain foot; its north and south continuations connect naturally to the existing landscape and continue to image boundaries. Its east road enters Morgul Vale.
- The new Morgul Vale opens from the existing valley around (600,700) and continues east to the right boundary, between the northern and southern Shadow Mountain ridges. The broad pass must remain visibly distinct from a narrow stair-route climbing north.
- Minas Morgul is one miniature pale marble walled city centered around (1000,690), on the SOUTH side of the approach road and of the small Morgulduin stream. White/ivory walls enclose a compact city with a small somewhat taller central tower. Its faint pallid ivory corpse-light is restricted to the architecture, not green, not a halo over the valley and not a lightbeam. Keep city scale subordinate to the mountains.
- A thin slate-teal Morgulduin stream descends from the upper vale in the east near (1300,650), flows WEST just below the approach road via (930,670), (780,715), (560,765), (340,820), then joins the EXISTING Anduin's EAST bank around (125,890), distinctly downstream/south of Osgiliath. It is a SMALL tributary, far narrower than the Anduin. Connect naturally at the existing shoreline; preserve the big river exactly. Do not add a second large river or a disconnected blue line.
- The eastbound approach road stays NORTH of this small stream. At Minas Morgul it turns a short distance SOUTH across one small WHITE bridge over the Morgulduin, entering a gate in the city's NORTH wall. Make bridge, north gate and road connection legible at miniature scale. No bridge across the Anduin.
- Sparse poison-flower meadow patches lie only in the barren vale close to the city. Healthy olive-green tree groves remain outside its western mouth, around the Cross-roads and western lowlands.
- Before the road reaches the city bridge, a separate tiny stair-path branches NORTH around (920,490). Render straight climbing steps followed by narrow winding steps on the northern mountain slope, climbing toward a dark cave/cut around (1100,410). The path stops at the cave mouth; no road painted over cave interior.
- Cirith Ungol is one SMALL dark fortress centered around (1200,475), on the EAST/Mordor side of this northern ridge, north/northeast of Minas Morgul. A round turret rises above three pointed bastion tiers, facing east. It is visibly a separate mountain fortress, distinct from the white city below. The stairs approach the cave west of the ridge; the fortress belongs beyond the ridge on its eastern side.
- Behind Minas Morgul, the BROAD main Morgul pass continues east separately from the narrow northern stairs. On the right add a lower parallel Morgai ridge, with an open dry trough between it and the main Shadow Mountains. Connect all new upper and lower ridges coherently to the original painted ridge ends. Finish the remaining lower-right beige area as connected shadow-mountain foothills and dry grey Mordor terrain.

AVOID: No text, labels, letters, numbers, symbols, map pins, UI, compass, watermark, armies, figures, giant spiders, cinematic sky or horizon. No additional rivers, cities, castles, bridges or disconnected roads. Do not substitute a wide stream for the broad pass. Make exactly the requested single white city and single dark fortress in the new region. Natural road continuations should leave the crop at boundaries.

```

## Ithilien junction inset

Asset: `public/images/repairs/ithilien-crossroads.webp`. Source: 1268 × 1240, registered to 920 × 900. Only the northern approach, statue, junction and true tributary crossing are composited. The generated lower half added an unwanted second stream and bridge; that area is excluded entirely.

```text
Use case: precise-object-edit.
Asset type: one road-junction integration inset for an existing painterly Middle-earth atlas.

INPUT: junction-target.png is the sole EDIT TARGET. It is 920x900 pixels, north up, a high-oblique illustrated atlas crop showing Osgiliath beside the Anduin at left and the western Shadow Mountain foothills at right.

PRIMARY REQUEST: Make a tightly localized edit to ONLY the roads and immediately adjacent ground: repair the continuous north-south Harad Road through the Cross-roads, remove the old dead-end road stub, and add a very small ruined seated statue. Preserve the original framing and landmark registration. Return one 920x900 image if supported, otherwise precisely the same aspect ratio with every location proportionally registered.

LOCKED INVARIANTS: Keep the big blue Anduin's exact course, width and shoreline; preserve every original Osgiliath ruin and riverbank structure. Keep the small slate-teal Morgulduin's existing course, width and natural mouth unchanged. Preserve all mountains except the smallest immediate road-edge ground adjustments, and preserve existing trees except individual trees displaced by the specified road corridor. Keep the existing main east-west road from Osgiliath through the junction and onward east unchanged. Keep the same neutral daylight, ochre/olive western ground, charcoal mountain palette, fine etched painterly brush texture, tiny miniature scale and high-oblique north-up cartographic perspective. Do not redraw the whole map.

ROAD EDIT GEOMETRY: The following coordinates are in the 920x900 edit target, origin top-left; x increases east/right and y increases south/down. Coordinates are directions for placement, never text to draw.
1. Keep the Cross-roads intersection FIXED at (548,438).
2. From that junction, the northern Harad Road turns NORTHWEST through the western foothill corridor, tracing approximately (485,300), (340,205), (220,150), (90,80), and leaving the TOP BORDER near (55,0). It stays on land EAST of the Anduin the whole way, winds naturally between foothill trees, and remains visibly continuous all the way out of the crop. Use the existing road's narrow width. No cliff-top dead end.
3. REMOVE the original short northbound road stub immediately above the junction that currently climbs almost vertically into the mountain. Replace that old stub with matching local earth, grass and woodland so only the new continuous northwest road remains.
4. From the same fixed junction, the southern Harad Road curves SOUTH to the existing narrow Morgulduin at approximately (520,520). Carry it across the tiny stream with ONE tiny LOW STONE BRIDGE, subordinate in scale to all buildings and spanning only the small stream. The stream continues visibly and unchanged beneath it. After crossing, continue the road southwest via (470,580) and (390,680), then south via (430,780), finally curving to (490,900) and leaving the BOTTOM BORDER. Keep it visibly continuous along the existing western foothill corridor through the trees. Do not leave it as scattered disconnected paths.
5. Preserve the main east-west Osgiliath-to-Morgul road and its intersection position. Add no other roads or bridges. The only new bridge is the small Harad Road crossing of the narrow Morgulduin, never a bridge over the Anduin.

SMALL STATUE: Beside the westbound road immediately west of the Cross-roads, among a group of large old trees, place a VERY SMALL weathered stone statue of a SEATED Gondorian king. The statue is HEADLESS, with its separate fallen stone head partly hidden in groundcover near its feet. It should occupy only a tiny miniature footprint comparable to a small existing ruin detail and substantially smaller than the old tree canopies. This is a neglected stone relic, not a living person, not a standing heroic human, not a giant monument. It must not obstruct the road.

AVOID: No new villages, castles, buildings, rivers, watercourses, extra bridges, disconnected roads, dashes, labels, lettering, numbers, symbols, UI, figures, armies, glow, night tint, sky, horizon, borders or watermark. Preserve the original map's scale and texture outside these limited edits.

```
