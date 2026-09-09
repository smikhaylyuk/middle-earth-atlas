# Northern Gondor and Ithilien

The atlas now follows the Anduin south from Nindalf to Cair Andros, with
Henneth Annûn in North Ithilien and Drúadan Forest and Amon Dîn to the west.
Minas Tirith, Osgiliath and the southern approaches are covered by the
subsequent [Pelennor expansion](pelennor-expansion.md).

## Reference and interpretation

The principal geographic reference is Christopher Tolkien’s
[Map of Rohan, Gondor, and Mordor](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_Map_of_Rohan,_Gondor,_and_Mordor.png).
The four new place cards link their supporting book references.

- [Cair Andros](https://tolkiengateway.net/wiki/Cair_Andros) is a long wooded
  island, with a rocky northern prow dividing the current. Both arms join
  downstream. No continuous bridge or invented city crosses the river.
- [Henneth Annûn](https://tolkiengateway.net/wiki/Henneth_Ann%C3%BBn) lies
  northeast of the island, west of the mountains of Mordor. Its west-facing
  waterfall conceals a cave above a shaded pool; the atlas uses a small
  woodland inset, not a visible palace. See Book IV, chapters 5–6.
- [Drúadan Forest](https://tolkiengateway.net/wiki/Dr%C3%BAadan_Forest) lies
  in Anórien by the northeastern White Mountains. Its northern margin faces
  the Great West Road. See Book V, chapter 5.
- [Amon Dîn](https://tolkiengateway.net/wiki/Amon_D%C3%AEn) stands east of
  these woods and west of Anduin. It is the easternmost warning beacon.
  It stays unlit: changing the hour does not summon Gondor’s armies.

This is a pictorial atlas, with enlarged landmarks and compressed distances.
Cair Andros is deliberately legible at browsing scale; the island’s dimensions,
individual trees, rock formations and minor bends are artistic interpretations.
The illustrated western road leaves the sheet toward Rohan; a broader western
Anórien connection and the remaining beacon hills belong to a later expansion.

## Integration

The main generated sheet is 1448 × 1086, registered to 2400 × 1800 at
world (2964, 2650). Its Anduin outlet determined the registration. Earlier
opaque terrain is composited above it, so the existing Gate, mountains,
Rohan and Nindalf remain in place. The resulting world is 6030 × 4450.

A short river insert resolves doubled banks in the earlier paper fade.
It is clipped out of every previously opaque pixel. A separate small
woodland insert places Henneth Annûn in visible North Ithilien; generated
surrounding river geometry is discarded. Exact prompts are retained in
`gondor-artwork-prompts.md`.

This stage’s asset is `public/images/atlas-gondor.webp`, retained beneath
the subsequent Pelennor sheet.
`scripts/extend-gondor.mjs` runs after the Mordor stage of `build:atlas`.
All earlier positive water coverage and all water/land values under previous
opaque terrain remain exact on the two-world-unit grid. New river coverage
comes from the painted water near inspected channel guides. The wooded
island remains excluded. Both branches use the existing flowing-brushwork
renderer, shared clock and viewport canvas. Quiet mist and occasional birds
use the same established animation layers.

Regression checks protect earlier terrain and water coordinates, test
connected flow through both island arms, and check landmark relationships.
The river surface checks cover the extended channels, bank sampling and
loop transitions as well as the previous Rauros river field.
