# Mordor artwork prompts

Built-in ImageGen; one request for each of three separately composited assets.

## Main sheet

Use case: compositing
Asset type: a single continuous raster expansion tile for a living illustrated Tolkien atlas.

Edit input image 1 into ONE finished 1600 × 1500 pixel, north-up map painting. Paint into its blank beige expansion area and remove its temporary internal beige feather/fade by continuing the terrain seamlessly. Preserve the existing approved painted atlas in the top-left 800 × 600 region, its scale, geography, relief, and the Black Gate at exactly (325,170); do not reposition or redraw the existing Gate. All coordinates below are pixel locations on this 1600 × 1500 canvas, origin at its top-left, x east/right and y south/down.

Input roles:
1. extension-target.png is the EDIT TARGET. Its top-left contains the existing approved atlas; all remaining beige canvas is to be filled with continuous map terrain.
2. gate-context.png is only the approved mountain, rock, paint, and architecture STYLE REFERENCE. It is the same Gate context, not a second gate to insert.
3. canonical-mordor.png is Christopher Tolkien's published GEOGRAPHIC REFERENCE ONLY. Follow its major directional geography, not its black contour-line drawing style or any text. No labels from this reference may appear.

Style and atmosphere:
Match input 1 and input 2's high oblique painted atlas perspective, fine restrained muted ochre and grey brushwork, hand-painted relief and feature scale. The viewpoint looks downward at map terrain; north remains up. Neutral shared daylight across the entire map. Warm grey stone transitions naturally to brown/charcoal ash, in the same palette and lighting. No independent night filter over Mordor. Not photographic, not rendered 3D, no cinematic horizon or sky. Edge-to-edge paint with no labels, text, UI, decorative border, symbols, vignette, parchment, or paper fade anywhere.

Geographic construction:
Keep the existing Black Gate at (325,170) and its enclosing top-left ridges. The old Udun basin widens southeast of the Gate around (460,430). Continue western Ephel Duath generally SOUTH through the left side along x200–400, separating a narrow muted olive western exterior strip from barren Mordor. Continue northern Ered Lithui EAST across the upper third. Close Udun's southern bowl with a mountain ridge curving inward, leaving one narrow fortified Isenmouthe exit at (550,670). Isenmouthe is a small pass barrier belonging to the inner bowl, distinct in shape and smaller than the existing outer Black Gate. Broad open Gorgoroth plateau lies SOUTH and EAST beyond Isenmouthe.

From the Ered Lithui in the upper-right, extend a coherent LONG SOUTHWEST-POINTING MOUNTAIN SPUR toward (1280,1030). Build Barad-dur on the END of this spur at (1280,1030), not on the volcano: a layered black stone fortress with an iron-crowned principal tower, courts, and defensive walls on a rocky spur. Its architecture is ancient massive stone, at the restrained scale of this atlas, not enormous generic fantasy spires or modern architecture. No floating flaming eye.

Place ONE isolated volcanic Mount Doom on the open Gorgoroth plateau: base center at (920,1060), summit about (920,940). Its cone stands clear of the enclosing mountain ranges. The volcano lies WEST and slightly SOUTH of Barad-dur by base positions. Leave readable empty plateau and a clear separation between them. The summit has a restrained dark crater with only a tiny dull ember-red glow inside it; a short faint smoke veil immediately above the crater. No extensive lava, no red rivers, no spiderweb glowing cracks, no giant smoke plume.

Roads must have understandable continuous destinations:
A purposeful road leads from the existing Black Gate through Udun, through Isenmouthe at (550,670), then southeast over Gorgoroth and onward toward Barad-dur. Sauron's Road leads WEST from Barad-dur's western gate and ends at the EAST FLANK of Mount Doom. Avoid random intersecting hairlines. Road strokes are quiet painted features suited to the existing atlas.

Terrain:
Gorgoroth is barren charcoal/brown ash with subtle ash flats and sparse rocky outcrops. Keep the plateau readable and mostly open, not lush, densely scattered with high-contrast black noise, or filled with extra mountains. The adjacent western strip outside Ephel Duath may remain muted olive terrain, with no new landmark and no invented river. Lower and eastern margins continue naturally as dry country awaiting future map expansion.

Strict constraints:
The existing Black Gate is the only northern outer gate. One Mount Doom, one Barad-dur, one narrow Isenmouthe passage. No lakes, ocean, settlements, invented forts, extra landmarks, duplicate volcanoes, rivers, decorative markings, UI, labels, borders, or faded edges. Preserve all major directional geography and exact landmark placement as closely as possible. This is an artistic book-map interpretation of late Third Age Mordor with the Gate and Dark Tower intact. Return only the single completed 1600 × 1500 map painting.


## Mountain-spur connection

Use case: precise-object-edit
Asset type: small landscape insert for an existing painted Tolkien atlas.
Edit ONLY the supplied 295 × 545 pixel crop. This is a portrait crop from a larger finished map, not a standalone composition. Preserve exactly its crop, camera, painted detail scale, lighting, palette, and landmark positions. Return one completed crop with continuous edge-to-edge paint, ideally at 295 × 545 pixels.

The north-up high oblique atlas painting shows the Ered Lithui rocky mountain ridge entering from the top and right, and Barad-dur in the lower half. Complete the missing geographic connection: extend the existing upper/right ridge SOUTHWEST continuously through the flat ash gap to the fortress's NORTHERN/EASTERN rocky foundation. There must be an unbroken believable mountain spur of barren angular grey-brown rock leading from the top/right mountain mass to the rocky land on which Barad-dur stands. The connection descends naturally in height toward the fortress; behind and east/right of the tower, join the existing rocky foundation seamlessly. No intervening gap of flat ash may separate this spur from the fortress foundation.

Locked landmarks and boundaries: tower summit at local (130,270), main fortress base at local (130,450), origin top left; keep these at exactly the same coordinates and visual size. Keep all of Barad-dur's black stone architecture unchanged. Keep the mountain ridge entering along the top/right image boundaries unchanged. Preserve the western approach road and the existing lower rocky foundation. Fill only the missing terrain connection, without moving or magnifying any object. The tower must remain fully legible with its existing silhouette. No extra tower, fort, buildings, volcano, road, river, text, labels, symbols, or decorative elements.

Match the source's fine muted grey/ochre rock brushwork and neutral shared daylight exactly. This is restrained painted atlas relief, not photographic or rendered 3D. No background replacement, no sky or horizon, no paper edges, no vignette or fade. The final crop will be resized exactly to the source and feathered into the original map, so preserve existing geometry and edge alignment aggressively. Return only the edited portrait crop.


## Isenmouthe earthworks

Use case: precise-object-edit
Asset type: small landmark correction insert for an existing painted Tolkien atlas.
Edit ONLY the supplied 205 × 145 pixel crop. This is a tiny landscape crop from a larger finished map, not a standalone composition. Preserve exactly its crop, camera, existing mountain spurs, north–south road alignment, painted detail scale, lighting, palette, and all surrounding terrain. Return one completed crop with continuous edge-to-edge paint, ideally at 205 × 145 pixels.

At the narrow central gap, the current little arched stone gate centered at local (85,75) must be replaced ONLY with Isenmouthe's low defensive works: a low earthen rampart crossing the gap from the left mountain spur to the right mountain spur, closely spaced dark iron stakes along its top, and a dry transverse ditch across the gap directly alongside the rampart. One narrow simple bridge crosses that ditch and carries the EXISTING north–south road through the opening. Preserve the existing road's connection to the northern and southern crop edges. The bridge runs along the road, not along the ditch. Keep one continuous understandable route.

The replacement must be very small defensive works integrated into the map landscape: a low bank, dark iron stake fence, dry ditch, and one narrow bridge, all at the size and location of the current gate. Remove the arched stone gate and its little towers. No large gate, tall masonry towers, new forts, grand fortress, Black Gate, extra buildings, extra roads, river, water, text, labels, or symbols. Do not turn this into a close-up or a foreground fortress. Do not move or repaint the surrounding mountain spurs.

Match the source's exact fine muted rocky grey/ochre brushwork, texture, neutral daylight and oblique downward map perspective. Keep surrounding terrain and all crop edges unchanged. No background replacement, sky, horizon, paper edges, vignette, border, or fade. The final crop will be resized exactly to the source and feathered into the original map, so preserve existing geometry and edge alignment aggressively. Return only the edited landscape crop.

