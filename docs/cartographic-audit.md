# Cartographic comparison — 8 September 2026

Compared the complete current 3700 × 2800 painting, including enlarged crops,
against Christopher Tolkien's **The West of Middle-earth at the End of the
Third Age** (1980). Checked the southern drainage against the published
**Map of Rohan, Gondor, and Mordor** as well. This is a comparison of named
places, crossings and connections; the painting is not a traced projection.

Primary maps, reproduced for consultation:

- [1980 map](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_The_West_of_Middle-earth.png)
- [Rohan, Gondor and Mordor](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_Map_of_Rohan,_Gondor,_and_Mordor.png)
- [Tolkien Estate: original map development](https://www.tolkienestate.com/painting/maps/)

The reference images are used for comparison, not added to the published
painting. Earlier assertions that all visible linework was authoritative
were too broad: the generated terrain contains details absent from these maps.

| Area or feature | Published geography | Finding and action |
| --- | --- | --- |
| Lhûn and Baranduin | Separate rivers, with separate mouths | Main drainage remains separate. Retained. Minor tributaries and exact shoreline are not certified. |
| Lake Evendim / Brandywine Bridge | Baranduin flows out of the lake and crosses the East Road north of Old Forest | Main relationship matches. Retained; the lake and bends are pictorial. |
| Hobbiton / Shire roads | Hobbiton is north of the East Road; local lanes require the detailed Shire map | Main placement retained. The painting's numerous tiny field lines and lanes are not a verified Shire road network. |
| The Water / Withywindle | Named tributaries shown in the Shire's more detailed geography | They are not reliably identifiable in this painting. Do not label an arbitrary painted line as either river. A detailed Shire hydrology pass remains necessary. |
| Bree / Weather Hills | Bree is a crossroads; East Road passes south of Weathertop | Main relationship matches. Restored a connected Greenway annotation southward from Bree. |
| Last Bridge / Bruinen ford | East Road crosses Hoarwell at Last Bridge, then Bruinen at a ford | Existing bridge and bounded ford correction retained. No new arch bridge at Bruinen. The visible road annotation stops in the illustrated valley; it does not assert a surveyed High Pass continuation. |
| Hoarwell / Bruinen | Bruinen joins Hoarwell southwest of Rivendell | Main confluence retained. Animated highlights now also check the painted water coverage to avoid lighting adjacent land. |
| Glanduin / Swanfleet / Tharbad | Glanduin feeds the marshes at the Hoarwell confluence upstream of Tharbad | **Error corrected:** the painted eastern branch entered directly at the ruined town. Its western portion now feeds the marshes north of the crossing. The old town-bound branch is removed. |
| Greyflood / Lond Daer | Gwathló flows southwest past Tharbad to the sea at Lond Daer | Main connection matches. Existing ruined crossing retained; no intact new bridge. Estuary details remain pictorial. |
| Moria / Mirrormere / Silverlode | Eastern Moria, the dale and lake lie east of the mountains; Silverlode reaches Anduin through Lórien | Main relationships retained. Fine source streams are not claimed as a surveyed reconstruction. |
| Gladden / Lórien | Gladden confluence lies north of Moria and Lórien; Lórien is west of Anduin | Main connections and sides match. Retained. |
| Limlight / Fangorn | Limlight runs east along Fangorn's northern side to Anduin; it is distinct from Entwash | **Error corrected:** the painted stream faded into trees. A continuous narrow channel now reaches the Anduin. Its former descending dead end is removed. |
| North–South Road / Isengard / Fords | The road continues through the Gap to the Fords; Isengard is not its southern terminus | **Error corrected:** the annotation stopped at Isengard. The connected network now has an Isengard spur and a separate continuation to the Fords. |
| Isen | Runs south past Isengard, then west at the Fords; separate from Entwash | Original main river and ford retained. A generated cleanup candidate moved the ford banks and was rejected there. Only its upper road and bounded dry-ground cleanup are integrated. A tiny remaining inlet near the ford is not promoted to a named tributary. |
| Adorn / Deeping-stream | Adorn joins Isen from the White Mountains; Deeping-stream belongs to Helm's Deep | Not reliably distinguishable in the current painterly detail. Do not relabel the former northwestern spur as Adorn. These require a dedicated terrain correction, rather than an invented connection. |
| Snowbourn / Edoras / Entwash | Snowbourn flows north through Harrowdale, past Edoras, then east into Entwash | The existing north-then-east course is consistent with the published maps. Retained. A westward outflow suggested by one secondary place article was not adopted. |
| Entwash / Anduin / Nen Hithoel | Entwash joins Anduin downstream of Rauros, not directly into Nen Hithoel | The prior southeastern exclusion remains. It is not presented as a complete Entwash delta. The river continues beyond this atlas's illustrated extent. |
| Great West Road | Connects the Fords and Edoras, continuing toward Gondor along the mountain region | Added connected cartographic guidance over the existing illustration. Local curves follow the pictorial terrain; the southern endpoint is the map edge, not a claimed road terminus. |

## What this pass establishes

The two corrected rivers are visibly connected; the road annotations form a
connected network at named crossings. The original coastline, outer crop,
Anduin join repair, settlement anchors and shared day lighting are preserved.
No canonical settlement or historical event was added. The road toggle now
highlights the network; a quiet base line remains, like the roads already
painted into the terrain.

This does **not** certify every small track, brook, ruin or terrain mark.
The missing named tributaries above are explicit gaps. Before a close-up region
is described as geographically complete, its named watercourses and crossings
must be mapped from the appropriate published detail map and then its terrain
edited to match. Broadly plausible generated scenery is insufficient evidence.

## Motion restoration

The stable canvas renderer had reduced visible motion too far: sea shimmer
was omitted, particles became subpixel-sized at overview, chimney smoke was
reduced to one faint puff, and navigation froze both atmosphere and the clock.
This pass restores ocean highlights, three staggered chimney wisps, two
daylight flock paths per region, moving water, drifting mist and cloud shadows,
and readable night lights. Sizes account for zoom. Navigation no longer stops
time, while explicit pause and reduced-motion settings still work.

The single visible canvas remains the same size during pan and zoom. Scene
effects are drawn into its existing buffer, clipped by the painting's alpha.
No large CSS masks, filters, blend surfaces or transformed regional DOM layers
are reintroduced. Ocean coverage is sampled once from a connected sea mask;
current segments require water-colored pixels at both ends. These coverage
masks are rendering constraints, not independent geographic evidence.

## Asset provenance

Built-in ImageGen produced one edit each for Limlight, Glanduin and Greenway,
with no retries. Full prompts are in [cartographic-repair-prompts.md](cartographic-repair-prompts.md).
The resampled assets live in `public/images/repairs/`; only registered corridors
from `scripts/repair-atlas-geography.mjs` enter `atlas-cartographic.webp`.
The larger generated images were not used as wholesale replacements. In
particular, the Greenway candidate's shifted river banks were not accepted.

The original `atlas-continuous.webp` remains available. Named road relationships
and corrected current guides are explicit data in `lib/atlas/cartography.ts`.
