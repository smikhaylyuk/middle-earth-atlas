# Cartographic comparison — 8 September 2026

Compared the complete current 3700 × 2800 painting, including enlarged crops,
against Christopher Tolkien's **The West of Middle-earth at the End of the
Third Age** (1980). Checked the southern drainage against the published
**Map of Rohan, Gondor, and Mordor** as well. This is a comparison of named
places, crossings and connections; the painting is not a traced projection.

Primary maps, reproduced for consultation:

- [1980 map](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_The_West_of_Middle-earth.png)
- [A Part of the Shire](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_A_Part_of_the_Shire.jpg)
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
| The Water / Withywindle | The Water passes Hobbiton and Bywater, then reaches Baranduin above the Bridge. Withywindle flows southwest through Old Forest into Baranduin. | **Repaired in the follow-up:** both have deliberately placed channels and identifiable confluences. The Water passes south of the Hobbiton anchor and north of the East Road. Fine marsh bifurcations and minor Shire tributaries are below this depiction’s level of detail. |
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
| Adorn / Deeping-stream | Adorn joins Isen from the western White Mountains; Deeping-stream passes through the wall and around the Hornburg. Its ultimate confluence is not established in the published maps. | **Repaired in the follow-up:** Adorn now reaches the Isen from the south, well downstream of the Fords. Only Deeping-stream’s local gorge course is illustrated; it is not connected speculatively to Isen, Adorn or Entwash. The Helm’s Deep entry explains the limit. |
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
The named omissions identified above have been addressed at this atlas’s scale.
Deeping-stream’s unknown final destination is retained as a source limitation.
This is still a pictorial atlas, not a complete reconstruction of every minor
Shire brook, marsh branch or village lane. Broadly plausible generated scenery
is insufficient evidence for naming additional features.

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


## Follow-up: tributaries and coastal surf

Consulted Christopher Tolkien’s published **A Part of the Shire** in addition
to the 1980 map. The Water’s northwestern course, passage beside Hobbiton,
Bywater pool and confluence above the Bridge provide the controls for its
placement. Withywindle is distinct on the opposite bank and flows southwest
through the southern Old Forest. Adorn is drawn from the western White
Mountains into Isen, south of Isen and west of the Fords. None of these edits
moves a town, the original main rivers, or the Fords.

Deeping-stream needs a different evidential treatment. *The Two Towers*,
Book III, “Helm’s Deep” and “The Road to Isengard”, describe the wall, rock
and coomb. The final confluence is not established on the published maps;
[the reference notes](https://tolkiengateway.net/wiki/Deeping-stream) distinguish
that unknown from courses invented by adaptations. We depict only the local
gorge reach, with its downstream end occluded in the rock detail. This is
not a claim that the river terminates there, nor that its whole course is mapped.

Two built-in ImageGen edits supplied river and bank material. Their full
crops were rejected because their stream positions did not consistently
follow the brief. `scripts/register-tributaries.mjs` extracts narrow raster
strips, registers those strips to the reviewed locations, and preserves the
surrounding original painting. It never adopts the candidate’s whole terrain.
Adorn’s candidate extension toward the fortress was excluded, and the
Deeping-stream candidate’s high outflow was moved to the known local gorge.
The exact prompts and registrations are documented in
[tributary-repair-prompts.md](tributary-repair-prompts.md).

At close zoom, The Water, Withywindle and Adorn gain restrained labels. Current
highlights follow sampled positions from the integrated raster corridors and
still check water coverage. The Water flows east; the other added reaches
flow toward their downstream ends rather than using the input image’s drawing
order. These samples constrain animation, not independent geographic evidence.

Coastal surf uses full connected water coverage, including the pale Gulf of
Lune shallows that the open-sea highlight mask excludes. A narrow baked distance
field follows the mainland shore. Enclosed paint-texture holes do not seed surf.
Small rocks retain their painted wave detail.

Short, staggered patches of granular foam approach shore on an 8.4-second
cycle. Each has a brighter breaking edge and a softer wash that dissolves
behind it. Fixed world-space grains and smooth envelopes avoid crawling noise
and continuous contour lines. Their full footprint checks the water mask.
Surf respects Subtle/Lively, pause, reduced motion and the common day/night
clock. It uses the existing canvas without new DOM layers or lighting boundaries.
