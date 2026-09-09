# Northern Gondor artwork prompts

Three distinct assets, one built-in ImageGen request each; no regeneration variants.

## Main northern Gondor sheet

```text
Use case: compositing.
Asset type: one seamless painterly atlas terrain expansion tile, exactly 2400 × 1800 pixels, landscape 4:3.

Input roles:
Image 1, extension-target.png, is the EDIT TARGET and exact coordinate system. Keep every already painted feature in its original position and scale. Paint the beige unfinished left/middle/lower areas with continuous new landscape, replacing all beige and faded edges with finished terrain.
Image 2, river-outlet.png, is the same existing Anduin outlet at closer scale, reference only for its width, color, riverbanks and flow.
Image 3, canonical-north-gondor.png, is GEOGRAPHY ONLY. Do not copy its ink style, lettering, labels, symbols or coloring.
Image 4, adjacent-terrain.png, is wider approved artwork context, reference only for brushwork and terrain style, not a replacement composition.

Primary request: Complete only the unpainted area of Image 1 into northern Gondor, smoothly joined to the approved terrain at the top and right. North remains up. Use the same high-oblique aerial atlas camera, finely painted stones, soft tree clusters, geographic scale, muted olive-gold land and grey-teal water, with consistent neutral daylight across the whole canvas. Terrain biome changes naturally; no regional lighting. No horizon or sky. The entire rectangular canvas must be finished painted landscape with no labels, UI, border, parchment, beige blank areas or paper fades.

Registration invariants, in Image 1's 2400 × 1800 pixel coordinates: The existing Black Gate stays centered near (2225,420), exactly where it is. Keep the existing right-hand Ephel Duath ridge and Mordor terrain and their west-side green foothills in place, continuing them seamlessly to the lower edge. Keep the existing northern terrain, Rauros waterfall and Nindalf marshes in place. The SAME existing Anduin crosses (1109,535), then (1199,644) where the unfinished region starts. Do not shift, redraw into a different position, rescale, crop or zoom any of those existing terrain features. No additional Black Gate or Mount Doom.

Highest priority is river continuity: Continue THIS SAME Anduin directly and uninterruptedly out of (1199,644), through approximately (1330,805) and (1490,1030), around the island described next, then to (1600,1305), (1605,1500), and exiting the BOTTOM EDGE around (1640,1800). It is one connected major river, typically 60–85 pixels wide, matching the existing outlet's width, muted grey-teal palette and bank scale. Never end it on land, dam it, pinch it shut with land, cover the outlet, or insert a crossing ridge. Keep recognizable dark open water continuously visible all the way to the bottom edge. No ice-white or bright cyan water.

CAIR ANDROS, centered near (1580,1200): one long narrow wooded island, about 160 pixels tall and 40 pixels wide, north-south orientation with a pointed rocky north prow. The Anduin splits into TWO visibly OPEN water channels around the two sides of this island and recombines south near (1600,1305). Make this a real island surrounded by uninterrupted water; NO land connection across either channel. Only tiny restrained Gondorian watch structures partly concealed among the island's trees, no large castle, city, or complete stone bridge across the river. Cair Andros is southeast of existing Rauros/Nindalf and west of Mordor.

WEST BANK, ANORIEN: muted olive-gold open country. The northern foothills of the White Mountains arrive from the left near (0,600) and run southeast toward the lower-left/bottom. The mountains remain SOUTH of Druadan Forest, with open Anorien country NORTH of the forest. DRUADAN FOREST is a compact dark pinewood on these foothills, centered near (1090,1470), entirely WEST of the Anduin. AMON DIN is just EAST of that wood near (1340,1650): a small rugged foothill, a modest stone watchpost and an UNLIT beacon platform. No castle or giant fire. A purposeful Great West Road enters near upper-left (145,150), follows the open foothill country, skirts NORTH of Druadan Forest, then turns southeast to exit beyond the bottom toward future Minas Tirith. The road must not cut through the central forest. Avoid random decorative filigree lanes.

EAST BANK, NORTHERN ITHILIEN: green and wooded country between the Anduin and the EXISTING Ephel Duath range at right. HENNETH ANNUN near (1890,1070) is a hidden refuge behind a SMALL west-facing waterfall and pool tucked into a wooded rocky escarpment. It should read as a secluded natural waterfall recess, with NO palace, visible door, town, tower or grand architecture. Its little watercourse can disappear beneath tree cover. Do not invent a major tributary connecting it to the Anduin.

Keep every new landmark small at the existing map scale, with high detail only where meaningful, and avoid noisy repeated AI texture. Do not introduce Minas Tirith, Osgiliath, Minas Morgul or any additional named landmark; those lie south beyond this bounded sheet. No new ocean or lake, gigantic waterfalls, other major river, labels, lettering, compass, decorative border, map pins, UI, sky, horizon or beige margins. Return exactly one finished 2400 × 1800 image.

```

## Concealed refuge inset

```text
Use case: precise-object-edit.
Asset type: one small local terrain inset for an existing painterly atlas, matching the supplied 430 × 360 pixel crop.
Input image: refuge-target.png is the EDIT TARGET and exact composition. Preserve its entire existing Anduin river at the left, island, riverbanks, mountains, woodland, painted brushwork, daylight and muted olive-gold palette. Do not reframe, zoom, shift or redraw the landscape.

Change only a small patch centered at approximately (270,160) in the input's 430 × 360 coordinate system. Paint an understated Henneth Annûn refuge as a SMALL WEST-FACING natural waterfall and oval shaded pool tucked into wooded rocky foothills. The waterfall itself is only about 25 pixels high at this target scale, with a slender stream of softly muted grey-blue water falling left/west over a short stone ledge. It is a minor hidden natural feature, not a major landmark waterfall. Suggest a dark concealed recess behind the falling water, almost hidden by rock and trees; no visible constructed door or architecture. Keep the pool small, oval, sheltered and grey-teal. A tiny outlet disappears naturally beneath woodland westward in the direction of the Anduin. Keep all of this tightly local, with natural banks and no disconnected bright water streaks.

The entire crop remains the same finely painted high-oblique north-up atlas landscape, with soft tree clusters and realistic tiny map scale, neutral daylight, continuous surrounding brushwork and muted colors. Keep all original river and mountain features exactly in place. No village, tower, palace, labels, lettering, UI, border, sky, horizon, grand waterfall, large tributary, bright cyan water or white glowing water. Do not introduce an isolated water stripe unrelated to the pool. Return exactly one finished image at the original 430 × 360 framing and aspect ratio.

```

## Anduin joining band

```text
Use case: precise-object-edit.
Asset type: one small river seam repair inset for an existing painted atlas.
Input image: outlet-target.png is the EDIT TARGET, exactly 420 × 350 pixels in composition. It shows the same Anduin river running diagonally from upper-left to lower-right, with a doubled/ghosted bank and watery land overlay across its middle.

Primary request: Repair ONLY that short central join, making it one clean, natural, continuous grey-teal Anduin river with ONE coherent left bank and ONE coherent right bank. Remove the ghosted/doubled riverbanks and translucent overlapping woodland/land shapes from the central water. The main river follows the EXISTING diagonal course, entering the TOP EDGE centered near (30,0) and exiting the BOTTOM EDGE centered near (300,350), in the input's 420 × 350 coordinate system. Keep the same width and smoothly connect the existing upper and lower river segments. Keep uninterrupted clearly readable open water all the way through. Do not shift the entry or exit, reframe, zoom or alter the whole composition.

Preserve the surrounding painted woodland, marsh reeds, rocks and banks outside the small seam repair. Maintain the same high-oblique painterly atlas style, scale, soft tree clusters, olive-gold land, muted grey-teal water, modest flow lines and neutral daylight. The finished middle should look like a single naturally painted river channel, without blur, ghosting, duplicate banks, transparent overlapping terrain or a visible compositing seam. The repaired banks should blend into the existing woodland and reeds.

No new island, road, waterfall, bridge, building, label, text, border, UI, horizon or sky. No extra river branch, land barrier, cyan water, bright white water streak or invented landmark. Return exactly one finished image with the original 420 × 350 framing and aspect ratio.

```
