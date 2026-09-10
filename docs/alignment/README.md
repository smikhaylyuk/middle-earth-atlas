# Whole-map alignment study

Status: first review milestone, 10 September 2026. Open `/alignment/` to compare the locked reference, the current painting under a uniform fit, and a conservative regional fitting study. The root living atlas, its animations and its geography are unchanged.

## Geographic reference

The master frame is Christopher Tolkien's **The West of Middle-earth at the End of the Third Age**, the 1980 general map. The digitization uses a 3840 × 2931 scan, with x increasing east and y south. These are reference-image coordinates, not latitude/longitude, miles or a claim of survey accuracy.

- [General map and scan provenance](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_The_West_of_Middle-earth.png)
- [Detailed map of Rohan, Gondor and Mordor](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_Map_of_Rohan,_Gondor,_and_Mordor.png)
- [Known Celos/Sirith map correction](https://tolkiengateway.net/wiki/Celos): Celos enters Sirith from the west. Do not reproduce the erroneous branch labels in the general scan.

The original general-map PNG SHA-256 is `4455ee862b1498d7fc7d819d67f93eaf0abd4c7ca66219bc3e32b5fe5847b9f2`. Its lossless WebP derivative is the comparison image. The detailed Gondor map has been inspected for topology but is **not yet registered into this coordinate system**. Mixing pixel positions from these two maps without registration would introduce another alignment error.

`lib/atlas/alignment/reference.json` is the curated input. It records 22 manually digitized mapped controls, 11 approximate support points and 14 reservations for future coverage. Supports include regional centres and places whose exact site is not resolved on the general map. Their larger uncertainty is explicit; they do not influence the global baseline fit. Tolerances are editorial estimates in scan pixels, not statistical confidence intervals. Secondary positions must be checked against the detailed maps and text before replacing the production geography.

## Findings

A least-squares similarity transform uses the 22 controls to establish one uniform scale, rotation and translation. The median control displacement after that fit is **211 reference pixels**; the largest is **462 pixels** at Dol Amroth. This measures inconsistency of the existing layout against this baseline, not the final error of corrected terrain.

| Span | Current span after uniform fit / reference span |
| --- | ---: |
| Hobbiton–Rivendell | 0.45 |
| Dol Amroth–Minas Tirith | 1.17 |
| Isengard–Minas Tirith | 1.20 |

The different ratios show why a global resize cannot solve the problem. Eriador is compressed relative to the southern regions in the current composition. These are straight-line anchor distances, not road lengths.

The provisional mesh has 56 triangles: 5 modest refits, 15 requiring inspection and 36 withheld for repainting. Six reverse orientation. A folded triangle would mirror or overlap terrain; those areas are never rendered as fitted artwork. Any triangle with a stretch ratio above 2 is also withheld. Ratios between 1.35 and 2 are displayed only as review material, not approved art. The thresholds are conservative visual screening rules, not a geographic accuracy certificate. Triangles spanning approximate supports can change when those positions are resolved.

| Area | Reuse / reconstruction approach |
| --- | --- |
| Eriador | Retain painting as a style and detail source. Rebuild the broad east–west spacing; do not stretch Hobbiton, Bree or Rivendell architecture. |
| Misty Mountains / Anduin corridor | Establish one continuous mountain spine and drainage network before fitting adjacent terrain. Control-point agreement alone does not fix river bends. |
| Rohan / Gondor | Register the detailed southern map, then refit modestly distorted terrain and reconstruct larger changes. |
| Mordor | Resolve the basin, gates and mountain boundaries as one geographic unit; retain local surface detail where it survives the correction. |
| Western Gondor / coast | Verify headlands, estuaries and Dol Amroth placement together. The current art cannot supply a reliable coastline simply by moving its labels. |

This is **not a completion percentage**. Mesh area and triangle counts do not translate into repaint effort. No full coastline, river, ridge or road network has yet been digitized into the master frame; the reference image currently supplies those outlines for review.

## Detail and zoom contract

Geographic extent and texture resolution are independent. The original 6030 × 7500 painting remains intact. The preview generates 512-pixel lossless WebP tiles at native resolution, plus two overview levels. Native tiles preserve the decoded source pixels, including thin details at tile boundaries. Blank tiles are omitted only after examining every alpha pixel.

The renderer requests visible detail on demand, retains up to 48 tile images, limits concurrent loads to six and redraws only after camera, controls or imagery change. This limits retained tile handles; it is not a hard cap on the browser's total decoded-image memory. The review has no continuously running animation loop. Its resolution strategy does not change the living map's existing animation implementation.

Use **Original detail** to inspect an existing landmark at approximately its present close-up scale without regional deformation. **Inspect location** centres its reference position. **Fitted study** is a geographic diagnostic; the missing rust-coloured areas are explicit repaint reservations, not a proposed final visual style.

Final replacement art must provide at least the present perceived detail at close zoom in the corrected geographic frame. Where the new frame enlarges an area, supply additional high-resolution painting instead of magnifying or squashing its buildings. Ocean, rivers, day/night lighting and labels must all use this same frame once the geographic pass is approved.

## Still to register

Of 64 existing interactive places, 33 have a control or support entry. These 31 remain unregistered and must retain their content during migration:

Michel Delving, Brandywine Bridge, Ost-in-Edhil, Lond Daer, Cerin Amroth, Dunharrow, Argonath, Amon Hen, Parth Galen, Tol Brandir, Nindalf, Emyn Muil, Dagorlad, Udûn, Henneth Annûn, Drúadan Forest, Amon Dîn, Harlond, Emyn Arnen, the Cross-roads, Morgul Stairs, Cirith Ungol, Tarlang's Neck, Calembel, Ethring, Drúwaith Iaur, Lefnui, Cobas Haven, Gilrain, Serni and western Lebennin.

## Next implementation gates

1. Register the detailed southern reference and resolve approximate supports and all secondary places.
2. Trace shared coastlines, continuous drainage, major ridges and roads in the master frame. Record source and uncertainty per feature; check confluences and crossings.
3. Produce one representative repainted area at final close-up detail and assess it beside reusable artwork before rebuilding all regions.
4. Rebuild the full painting in tiles against that fixed geometry, with shared overlap guides and coherent water/terrain colours.
5. Migrate labels, interactions and animation masks together, using the existing global clock and visibility controls. Validate continuity at close zoom and overview before replacing the root atlas.

Generate the study and detail tiles with `node scripts/alignment/build-study.mjs`. The tile outputs are reproducible and ignored by Git; normal development, test and build scripts generate them. The curated reference and generated manifests are tracked. Geometry tests verify registration and fold detection; pixel checks verify that the native detail survives tiling.
