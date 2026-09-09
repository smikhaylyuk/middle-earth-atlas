# From Udûn to the Dark Tower

This sheet continues the existing Morannon south and east into northern
Mordor. Four selectable places cover Udûn, the Isenmouthe, Mount Doom and
Barad-dûr. It is a bounded continuation of the atlas; southern Gorgoroth,
Nurn and the lower Anduin remain beyond the completed terrain.

## Geographic reference

The principal reference is Christopher Tolkien’s
[Map of Rohan, Gondor, and Mordor](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_Map_of_Rohan,_Gondor,_and_Mordor.png).
The narrative checks use *The Return of the King*, Book VI, chapters 2–3,
“The Land of Shadow” and “Mount Doom”.

- The Black Gate guards the northern entrance to Udûn. The Isenmouthe
  closes its southern entrance between inward-reaching mountain spurs.
  Beyond it the land opens onto Gorgoroth.
- Ephel Dúath forms the western boundary; Ered Lithui runs east along the
  north. Barad-dûr stands on the end of a southwestern spur from Ered Lithui,
  east of the isolated volcano Orodruin (Mount Doom).
- Sauron’s Road connects the Dark Tower to the eastern side of Mount Doom.
  The northern road connects the Tower to the Isenmouthe and Udûn. These are
  illustrated roads, not an assertion that Frodo passed through the Gate.
- The Isenmouthe has an earthen barrier, iron stakes and a ditch crossed by
  a bridge. It is not a second copy of the Morannon.
- The Dark Tower and Gate remain intact. The shared atmospheric clock does
  not advance the date of the War of the Ring or trigger their destruction.

Supporting reference entries:
[Udûn](https://tolkiengateway.net/wiki/Ud%C3%BBn_(valley)),
[Carach Angren](https://tolkiengateway.net/wiki/Carach_Angren),
[Mount Doom](https://tolkiengateway.net/wiki/Mount_Doom),
[Barad-dûr](https://tolkiengateway.net/wiki/Barad-d%C3%BBr), and
[Gorgoroth](https://tolkiengateway.net/wiki/Plateau_of_Gorgoroth).

The atlas retains a pictorial projection and artistic scale. Landmark
relationships and mountain/road connections are checked against the published
map; individual outcrops, pits, architecture and road bends are interpretation.
The change to ash-grey ground follows the terrain, rather than a separate
regional lighting layer. There is no floating film-style Eye above the Tower.

## Painting and registration

Built-in ImageGen supplied three separate composited assets, one request for
each: the main sheet, a mountain-spur connection, and the Isenmouthe earthworks.
The main output is 1295 × 1214, registered to 1600 × 1500 at world (4430, 2830).
Registration aligns its northern Gate to the existing one; the approved
painting is then composited above it, protecting all previous opaque pixels.

- `public/images/mordor-painted.webp`: source painting.
- `public/images/repairs/barad-dur-spur.webp`: continuation of the northern
  mountain spur to the Dark Tower’s foundation.
- `public/images/repairs/isenmouthe-earthwork.webp`: the low barrier and dry
  crossing at the southern end of Udûn.
- `public/images/atlas-mordor.webp`: this stage’s 6030 × 4330 atlas,
  preserved by the subsequent [Gondor expansion](gondor-expansion.md).

The original generated plate relocated the Gate and left the Tower’s rocky
base detached from Ered Lithui. Coordinate registration and the two explicit
geography inserts address those discrepancies before integration. The
compositor feathers insert boundaries without shifting the existing atlas.
Sauron’s Road is a checked map annotation from the Tower’s western gate to
Orodruin’s eastern approach, using the existing road layer and highlight control.
Exact generation prompts are retained in `mordor-artwork-prompts.md`.

`scripts/extend-mordor.mjs` runs after `extend-morannon.mjs` and before
`extend-gondor.mjs` in `npm run build:atlas`. The new regional alpha belongs only to uncovered
terrain. Atmospheric effects continue on the same viewport canvas and clock;
the volcano’s gentle smoke uses the existing smoke renderer. No new river,
water grid classification, ocean treatment or camera layer is introduced.

Regression checks compare previous opaque painting and the Gate, protect the
open Anduin outlet, verify every previous water-coverage value, and check the
joined basin and new landmark relationships. River-surface tests use the new
displayed asset and enlarged coverage mask.
