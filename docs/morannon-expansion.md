# Emyn Muil to the Morannon

This adjoining eastern sheet adds four selectable places: eastern Emyn Muil,
the Dead Marshes, Dagorlad and the Black Gate. It extends the pictorial atlas
from 4350 × 3300 to 5500 × 3500, with the old world coordinates unchanged.

## Geographic basis

The principal spatial reference is Christopher Tolkien’s
[Map of Rohan, Gondor, and Mordor](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_Map_of_Rohan,_Gondor,_and_Mordor.png),
published with The Return of the King. Narrative checks use The Two Towers,
Book IV, chapters 1–3: The Taming of Sméagol, The Passage of the Marshes and
The Black Gate is Closed.

- Emyn Muil’s eastern crags descend toward lower country. The Dead Marshes
  lie southeast of them and northeast of Nindalf, which remains a distinct
  named wetland beside the lower Anduin.
- Dagorlad lies east/southeast of the marshes and north of the Morannon.
- The Black Gate closes the northern mouth of Cirith Gorgor between the
  western Ephel Dúath and northern Ered Lithui. The mountain ranges enclose
  the beginning of Udûn, south of the Gate. The Gate and its two flanking
  towers are intact, before the fall of Sauron.
- The marsh habitat is dominated by low reeds, peat and pools. A separate
  insert removes woody vegetation from the marsh interior. Woodland remains
  on adjoining dry hill country and the pre-existing Nindalf illustration.

Linked place cards point to the corresponding reference entries. Incidental
pool shapes, crags, road bends and building detail are artistic interpretation;
the atlas is not a traced survey or a depiction of one precise journey date.
This stage stopped beyond the northern pass and the southern Anduin. The next stage continues northern Mordor; the lower Anduin remains unfinished. No new major river or marsh current is invented.

## Artwork and continuity

Built-in ImageGen supplied two distinct assets, one request for each:

- public/images/morannon-painted.webp: the main extension painting. Its
  1341 × 1173 output is registered as 1600 × 1400 at world (3900, 2100).
- public/images/repairs/marsh-habitat.webp: the wetland vegetation repair.
  Its 1402 × 1122 output is registered into the 850 × 680 crop at local
  (330, 210), feathered and kept off the northern dry cliff.

The original overlap was reinterpreted by generation, so the compositor puts
new art underneath the approved atlas. All previously opaque painting stays
in place. The earlier feather reveals the new landscape without a paper seam.
The southwest mask retreats from Nindalf and the Anduin’s southern outlet.
The output of this stage is public/images/atlas-morannon.webp; the subsequent [Mordor expansion](mordor-expansion.md) preserves it beneath the final atlas.

scripts/extend-morannon.mjs is a stage of npm run build:atlas, after
Eriador’s style harmonization. It expands the water grid at the same fixed
resolution by copying every old coverage pixel. Existing river surfaces and
coastal foam retain their exact sampling coordinates. The new marsh pools
have no directional flow guides. Local low mist and the map-wide day/night
wash share the existing clock and single viewport canvas.

Regression checks compare approved pixels, alpha, the old river exit, every
old water-grid value, continuous coverage through the joining band and the
new place relationships. The river-animation checks sample the displayed
final painting. Browser review covers the region selector, place cards,
panning, zooming, motion pause and the day/night cycle.
