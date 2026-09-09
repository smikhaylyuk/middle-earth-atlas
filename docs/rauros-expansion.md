# Nen Hithoel and Rauros expansion

This adjoining sheet extends the existing Argonath reach south through Nen
Hithoel to Rauros, the mouths of Entwash, and Nindalf. It is a pictorial atlas,
not a traced survey. The selected artwork uses oblique relief and compresses
distances; its river relationships and named landmarks follow the books.

## Geographic checks

The primary comparison is Christopher Tolkien's *Map of Rohan, Gondor, and
Mordor*, published with *The Return of the King*. A reproduction is catalogued
[here](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_Map_of_Rohan,_Gondor,_and_Mordor.png).
The narrative references are *The Fellowship of the Ring*, Book II, chapters
9–10, “The Great River” and “The Breaking of the Fellowship”.

- The Anduin enters Nen Hithoel from the north through the Argonath and leaves
  its southern end over Rauros. Both connections are continuous in the final
  combined painting.
- Tol Brandir is the single steep island at the southern outlet. Amon Hen is
  on the west bank; Amon Lhaw is on the east bank. The latter is depicted as
  a wooded height, without inventing a settlement or a detailed monument.
- Parth Galen is the green western lawn beneath Amon Hen, beside the lake.
- The Entwash remains west of the Anduin and divides into mouths joining it
  below Rauros. It does not enter Nen Hithoel.
- Nindalf occupies low marshland east of the Anduin below the falls. The Dead
  Marshes lie farther northeast, beyond the current painted extent.
- The Emyn Muil surround the lake and extend eastward. Individual crags,
  vegetation, minor delta arms and the waterfall's appearance are artistic
  interpretation, not individually documented features.

Place cards link to supporting entries for
[Nen Hithoel](https://tolkiengateway.net/wiki/Nen_Hithoel),
[Parth Galen](https://tolkiengateway.net/wiki/Parth_Galen), and
[Rauros](https://tolkiengateway.net/wiki/Rauros), with book chapter references.
No historical journey dates are inferred from the animated day/night clock.
No new road overlays, towns, fires or settlement lights are added.

## Artwork and registration

The selected asset is `public/images/rauros-painted.webp`. It was made in
built-in ImageGen mode from a registered crop of the existing Argonath
painting; the exact prompt is preserved in [rauros-artwork-prompt.md](rauros-artwork-prompt.md).
One generation was used. The 1355 × 1161 output is registered as a 1400 × 1200
sheet at world (2950, 2100). The original upper Argonath painting is retained,
with the blend beginning downstream of it. `rauros-layout.json` records place
anchors and river motion paths measured from the selected painting.

`scripts/extend-atlas.mjs` composites the sheet onto the existing, repaired
3700 × 2800 painting. The expanded base is `atlas-expanded.webp`,
4350 × 3300. Existing landmark and shoreline coordinates do not move. The
previous base, repairs and coast masks remain available unchanged.
The displayed painting now includes the subsequent
[Eriador style harmonization](eriador-style-harmonization.md).

Lighting and animation use the same single viewport canvas and map-wide
clock. Water coverage extends at the same two-world-units-per-pixel scale;
shoreline foam retains its original coast coordinate plane. Region masks
only delimit local mist and wildlife, not independent day/night lighting.

Regression checks compare the old coast alpha and painting registration,
trace connected water through the displayed overlap, lake, falls and delta,
and check motion guides against the painted channels. These checks detect
rendering and registration regressions; they do not certify every incidental
brushstroke as canonical geography.
