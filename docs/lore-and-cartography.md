# Eriador atlas: art direction and geographic reference

The user wants a richly illustrated, living 2D atlas that stays true to the actual LOTR map as much as possible, with reasonable artistic liberties. Both requirements apply together. Preserve the painterly presentation while correcting major geography; a white book-map scan is not an acceptable visual substitute. The user explicitly rejected that change.

Geographic authority: Christopher Tolkien, *The West of Middle-earth at the End of the Third Age* (1980), https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_The_West_of_Middle-earth.png . Match major settlement relationships, road crossings, river topology and mountain ranges. Textured terrain, vegetation and modestly enlarged pictorial landmark buildings are artistic interpretation. Do not claim exact scale, surveyed terrain or perfect reconstruction.

The reference crop is source x=1050, y=400, width=1050, height=750, from a 3840×2931 image. Within it: Bree (181,408); Weathertop (366,372); Last Bridge (589,366); Ford (774,396); Rivendell (809,378). The Weather Hills extend north from Weathertop. East Road passes south of it. Last Bridge crosses Hoarwell west of Trollshaws. Two upper Bruinen streams join southwest of Rivendell, with the Ford just downstream. Bruinen joins Hoarwell farther southwest at roughly (553,590).

The expanded world is 2500×1940. `lib/atlas/world.ts` places the original 1500×1000 eastern sheet at x=1000. Keep its artwork and interaction geometry aligned through `lib/atlas/illustration.ts`; those local coordinates are unchanged. `lib/atlas/western-illustration.ts` uses the western sheet's 1500×1000 display plane. All are illustration coordinates rather than geographic coordinates. Any different artwork requires re-aligning pins, lights, smoke, moving water and road overlays together.

The user chose regional expansion before further landmark detail: extend west through the Shire to the Grey Havens. A future “look closer” should reveal a whole town, then individual buildings. Retain the existing Prancing Pony study without presenting it as a complete view of Bree. This revision adds no new interior/town screens.

The western painting is `public/images/eriador-west.jpg`, generated once from the approved eastern painting and the published map as references. A shaped feather joins it near Bree and extends farther east in the south to keep the painted Brandywine intact without exposing a second river underneath. The original Bree, Weathertop, Rivendell, Last Bridge, and corrected Bruinen ford remain on the eastern sheet. All, West, East and South controls frame the expanded geography; smaller labels appear as the viewer zooms in. The southern expansion initially frames the south; All returns to the complete atlas.

Western relationships checked: the Grey Havens occupy opposing shores of a gulf opening west; the Lhûn and Brandywine have separate drainage; the Brandywine emerges from Lake Evendim and crosses the East Road at a bridge north of Old Forest. Hobbiton's selected village symbol is north of the East Road and west/north of the bridge; Michel Delving is southwest of Hobbiton. The road highlight is geographic guidance, not Frodo's outward route: he used the ferry. New place notes have no invented journey dates.

Western limits: the painting compresses distances and enlarges settlement symbols. The Havens, lake outline and southern Brandywine bends are pictorial approximations, not traced boundaries. Hobbiton and Michel Delving use village symbols within the correct relative areas; this is not a street map. Do not claim accurate survey scale or a complete map of the Shire. References: https://tolkiengateway.net/wiki/Grey_Havens ; https://tolkiengateway.net/wiki/The_Shire ; https://tolkiengateway.net/wiki/Hobbiton ; https://tolkiengateway.net/wiki/Michel_Delving ; https://tolkiengateway.net/wiki/Brandywine_Bridge .

The current painting is `public/images/eriador-painted.jpg` (1536×1024). It restores the illustrated presentation and follows the reference's major relationships: Weather Hills north of Weathertop, East Road south of it, Last Bridge across Hoarwell, Trollshaws between the rivers, and Rivendell west of the Misty Mountains. Weathertop is a low ruined ring. The lower Hoarwell/Bruinen confluence has no invented bridge. The earlier painted asset remains available as `eriador-illustrated.jpg`.

Known artistic limits: terrain and buildings are pictorial rather than to scale; river bends and distances are approximate. The highlighted road ends at the downstream crossing; it does not invent an exact continuation through the valley. Do not claim a precise reconstruction.

The Bruinen correction uses generated `eriador-ford-correction.jpg` only inside two feathered image regions: source pixel (1001,573,80,69) for the ford and (1097,504,47,48) for removal of the upstream arch. Keep the original base visible everywhere else: the full generated edit mistakenly removed Last Bridge. The clipped correction preserves that canonical bridge and the approved map. Water effects continue through the ford; the gold route annotation breaks at its banks. Source: https://tolkiengateway.net/wiki/Ford_of_Bruinen , citing Book I chapter 12 and the published map.

The Prancing Pony detail is a separate pictorial scene, not a replacement town map or a surveyed building plan. Its three front storeys, courtyard and hill relationship follow Book I chapter 9. Roof shapes and materials are artistic choices; the rear ground junction is obscured by roofs. The selectable notes cite https://tolkiengateway.net/wiki/The_Prancing_Pony . Window polygons and chimney anchors in `lib/atlas/bree.ts` were measured on `prancing-pony.jpg`. Window lighting is staggered through dusk and dawn, with continuity at midnight. The scene uses the atlas clock and motion controls; no invented visitors or story events are animated.

The highlighted road is illustrative geographic guidance, NOT Frodo's exact off-road itinerary. Do not identify the travelling glow as a specific character. The party travelled via Midgewater and the Weather Hills and through the Trollshaws.

Story chronology follows *The Lord of the Rings*, Appendix B, T.A. 3018: Bree on 29 September; Weathertop attack on 6 October; escape across the Ford on 20 October; Frodo wakes in Rivendell on 24 October. Cross-check: https://tolkiengateway.net/wiki/Third_Age_3018 . Descriptions refer to *The Fellowship of the Ring*, Book I chapters 9, 11 and 12 and Book II chapter 1. Keep book references in place details.

The 24-hour clock is a compressed atmosphere cycle and does not advance story dates or reconstruct exact weather, sunrise times or astronomy. Birds, smoke and settlement lights are ambient accents. Avoid invented narrative events, speculative major geography, or movie/game-specific additions presented as book facts.

## Southern expansion

The south extends the atlas through Eregion and Minhiriath into Enedwaith and the western edge of Isengard. These latter lands extend beyond Eriador proper, so the edition caption identifies “Eriador & the southern lands.” This is a late-Third-Age landscape, with the new place notes avoiding invented travel dates. Existing dated northern notes keep their original chronology.

A separate 2500×1300 painting begins at world y=800. The two approved northern paintings remain above it, feathering only across their southern terrain edge. All previous landmark anchors and the Bruinen corrections are preserved. The original reference map and both existing paintings guide the generated extension. This is an artistic illustration with compressed distances; it does not establish precise coordinates for disputed or weakly documented sites.

The Baranduin and Gwathló drain separately into the sea. The Glanduin flows west from the Misty Mountains to the Swanfleet marshes and the Hoarwell/Greyflood drainage. Tharbad belongs downstream of that confluence. Minhiriath is west/northwest of the Greyflood; Enedwaith lies southeast of it. Dunland lies west of the mountains. Isengard sits at their southern end, with Fangorn to the east. The Isen is a separate drainage.

Tharbad is deserted after the floods of T.A. 2912: show broken bridge remains and ruins, with no settlement lighting or chimney smoke. Ost-in-Edhil was destroyed in S.A. 1697 and is also unlit ruins. Lond Daer is an ancient harbour, not a thriving Elven city in T.A. 3018. Moria's pin marks only the western entrance; the realm itself is underground. No glowing door inscription, Balrog, Watcher, armies or named travellers are added as ambient effects. Isengard is shown before its destruction by the Ents, with one Orthanc inside its ring.

The new atmosphere uses the existing shared clock and motion settings. Water highlights are aligned to the final painting and stop short of ambiguous joins. Mist drifts over the marshes and mountain valleys. Daylight birds are ambient wildlife, without identifying them as Saruman's spies. Abandoned places remain dark through the night. Road annotations remain geographic suggestions rather than an exact itinerary.

Sources checked for this expansion:

- Christopher Tolkien, *The West of Middle-earth at the End of the Third Age* (1980), linked above — regional relationships and river topology.
- https://tolkiengateway.net/wiki/Eregion — geography, destruction and the southern Glanduin boundary, citing *The Fellowship of the Ring* and *Unfinished Tales*.
- https://tolkiengateway.net/wiki/Ost-in-Edhil — the ruined Second-Age capital.
- https://tolkiengateway.net/wiki/Tharbad — bridge ruins, abandonment and the ford; *Appendix B*, T.A. 2912 and *Unfinished Tales*.
- https://tolkiengateway.net/wiki/Greyflood — drainage and the Swanfleet confluence.
- https://tolkiengateway.net/wiki/Lond_Daer — ancient harbour at the mouth of the Greyflood; *Unfinished Tales*, “The Port of Lond Daer.”
- https://tolkiengateway.net/wiki/Doors_of_Durin — western gate; *The Fellowship of the Ring*, Book II chapter 4.
- https://tolkiengateway.net/wiki/Isengard — ring, Orthanc, valley and southern mountain setting; *The Two Towers*, Book III chapter 8.

The generated sheet has 1736×906 pixels and is displayed in a 2500×1300 plane. Its bottom 160 display units are excluded: the source painting invents an eastward Isen bend and continues ridges beyond the intended southern boundary. The visible atlas therefore ends shortly below Isengard, without claiming to map the Gap of Rohan or the lower Isen. Eastern trees north of Fangorn are unnamed pictorial woodland, not an asserted continuous forest boundary. Minor anonymous ruins at the Baranduin mouth are decorative remnants, not a new named canonical settlement.
