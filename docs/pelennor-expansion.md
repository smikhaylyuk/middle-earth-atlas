# Minas Tirith and the Pelennor

This continuation follows the Anduin from northern Gondor to the country of
Minas Tirith. It adds four selectable places: Minas Tirith, Osgiliath,
Harlond and Emyn Arnen. The Pelennor’s farms, orchards and enclosing wall
belong to the terrain, with their main roads tied to the city and river.

## Geographic and historical basis

The principal reference is Christopher Tolkien’s
[Map of Rohan, Gondor, and Mordor](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_Map_of_Rohan,_Gondor,_and_Mordor.png).
The setting remains the late Third Age before the March 3019 siege, matching
the intact Black Gate and Dark Tower elsewhere in the atlas.

- [Minas Tirith](https://tolkiengateway.net/wiki/Minas_Tirith) sits southwest
  of Osgiliath, joined to Mindolluin by a rocky shoulder. Its seven levels
  face east. The outermost city wall is dark; the upper city and tower are
  white stone. Book V, chapter 1 supplies these details.
- [The Pelennor](https://tolkiengateway.net/wiki/Pelennor_Fields) is cultivated
  country, with farms, orchards and pastures, rather than an empty battle
  plain. The [Rammas Echor](https://tolkiengateway.net/wiki/Rammas_Echor)
  encloses these townlands. The city stands near their southwestern corner.
- [Osgiliath](https://tolkiengateway.net/wiki/Osgiliath) occupies both banks
  of the Anduin. Its last bridge fell in June 3018. The river stays open
  between the ruined bridge ends; the map does not show a restored crossing.
- [Harlond](https://tolkiengateway.net/wiki/Harlond_(Gondor)) lies south of
  Minas Tirith on the west bank, beside the southern Rammas. Its quays serve
  river traffic; they do not bridge or block the channel.
- [Emyn Arnen](https://tolkiengateway.net/wiki/Emyn_Arnen) is a group of hills
  east of the Anduin and south of Osgiliath. The river bends around their
  feet. Faramir’s later household is not placed in this prewar landscape.

The published map determines landmark and river-bank relationships. The
atlas keeps its existing pictorial projection: architecture is enlarged for
legibility, distances are compressed, and individual fields, buildings and
minor bends are artistic interpretation. The exact circuit of the Rammas
and the quays is schematic; narrative details guide their relationships.

## Registered artwork and motion

The main ImageGen output is 1499 × 1049, registered to a 2000 × 1400
sheet at world (3440, 4150). The existing northern river fixes its position;
all earlier opaque artwork remains above it. The completed world is
6030 × 5550. The new river’s individual bends are pictorial; guides were
measured from the final painting rather than imposed over its banks.

A separate city-and-harbour defences inset corrects the dark outer city wall
and southern enclosure. Its 1263 × 1246 source is normalized to 760 × 750
at tile (340,350). The city remains enlarged for legibility. Exact prompts
are retained in `pelennor-artwork-prompts.md`.

`scripts/extend-pelennor.mjs` follows the Gondor stage in `build:atlas`.
The current display uses `public/images/atlas-pelennor.webp`. Earlier
water and bank coordinates remain fixed on the same two-world-unit grid;
new water is classified only near the inspected channel. The ruins, quays
and hills remain subject to the same bank-sampling safeguards as the old
river surface. There is no independent regional lighting pass.

Road annotations join the northern approach, Great Gate, western Osgiliath,
Harlond and southern Rammas gate. They stop on the western bank at Osgiliath;
no annotation invents an intact bridge. Quiet city and quay lights, a small
chimney plume, river mist and occasional birds use the existing canvas,
shared atmospheric clock and motion controls.
