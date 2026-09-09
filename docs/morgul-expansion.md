# Ithilien and Morgul Vale

This sheet continues east from Osgiliath to the Cross-roads, Minas Morgul,
the northern stairs and the Tower of Cirith Ungol. It fills the southeastern
gap within the existing 6030 × 5550 canvas. The common lighting clock and
viewport renderer continue to serve the entire atlas.

## Geographic reference

The principal reference is Christopher Tolkien’s
[Map of Rohan, Gondor, and Mordor](https://tolkiengateway.net/wiki/File:Christopher_Tolkien_-_Map_of_Rohan,_Gondor,_and_Mordor.png),
with narrative details from Book IV, chapters 7–9, and Book VI, chapter 1.
The setting remains the late Third Age before the siege of Minas Tirith.

- The [Cross-roads](https://tolkiengateway.net/wiki/Cross-roads) joins the
  Osgiliath–Morgul road to the north–south Harad Road among large trees.
  The king’s statue is still defaced; the later restoration is not shown.
- [Minas Morgul](https://tolkiengateway.net/wiki/Minas_Morgul) stands within
  the valley on the southern side of the approach. Its white bridge leads
  to the northern gate. Pale masonry and a restrained ivory light follow
  the book’s description; there is no cinematic green beacon.
- The [Morgulduin](https://tolkiengateway.net/wiki/Morgulduin) runs west
  below the approach road, then southwest to the Anduin south of Osgiliath.
  The bridge and its banks are excluded from animated water sampling.
- The [stairs](https://tolkiengateway.net/wiki/Stairs_of_Cirith_Ungol)
  branch before the city bridge and climb the northern wall. The cave
  passage is distinct from the broad Morgul Pass; no surface road claims
  to show the interior of Shelob’s lair.
- The [Tower of Cirith Ungol](https://tolkiengateway.net/wiki/Tower_of_Cirith_Ungol)
  stands on the eastern side of the ridge and faces into Mordor. The
  round upper turret and lower bastions are enlarged for browsing scale.

## Registration and limits

The main generated painting is registered to 1430 × 1500 at world
(4600,3930). `scripts/extend-morgul.mjs` fills transparent ground and blends
a bounded amendment around the Cross-roads and tributary valley. A separate inset joins the northern Harad Road, the tree-lined junction and
its real tributary crossing. Only those selected portions are used. Earlier
named landmarks and Anduin water coordinates stay fixed. Existing terrain
outside that amendment is preserved.

This remains an illustrated interpretation. Architecture, tiny statues,
stair treads, individual trees and road bends use artistic scale. The
relationships among city, river, road, stairs and eastern tower are the
geographic constraints; the painting is not a measured terrain survey.

The new tributary is registered from the inspected painting on the same
two-world-unit water grid. Every earlier positive water sample is retained.
The existing surface animation carries the river’s own brushwork downstream.
Bridge decks and overhanging tree canopies stay still; connectivity checks
inspect the visible reaches on either side of these natural occlusions.
Quiet valley mist, pale city light, tower window light and occasional birds
in western Ithilien share the established motion and time controls.

Selected built-in ImageGen assets and their exact prompts are recorded in
`morgul-artwork-prompts.md`.
