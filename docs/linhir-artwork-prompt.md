# Linhir artwork

One ImageGen edit of the adjoining-sheet template.

```text
Use case: compositing
Asset type: seamless painted map tile for an existing Middle-earth atlas.
Edit target: Image 1, linhir-template.png, a 960 by 1520 portrait canvas. Image 2, context.png, is ONLY supporting context for matching the existing painted map's style, terrain scale, and continuity; do not copy its black blank area.
Primary request: Complete all blank parchment in Image 1 with Linhir and WESTERN Lebennin. Keep Image 1's exact framing, scale, orientation, and registration. Preserve the already-painted top strip (about top 10.5%) and left strip (about left 16.7%) in place, including mountains, woods, old roads, existing river, and ocean. Fill the pale transition at the blank boundary seamlessly with finished detailed landscape, without haze or a seam.

Style: Match the supplied art precisely: painterly tilted relief atlas, miniature landscape viewed from high above, ochre and olive meadows, irregular clustered deep-green forests, hand-painted stony mountain outliers with fine sunlit edges, muted blue/slate/teal water with delicate natural flowing lines and fine shoreline foam. Existing terrain scale and warm natural lighting. Subtle irregular detail, no dense repeating texture. No camera horizon.

Critical geographical anchors: All positions below are percentages of Image 1's full width and height, measured from its upper-left corner. They specify terrain location, and MUST NOT appear as visible coordinates, labels, lines, marks, or text.
1. ANDUIN: The large existing river enters the blank near (57.4%,10.5%). Continue this same broad river flowing southeast across the UPPER RIGHT corner, leaving the RIGHT edge at (100%,36.3%). Both banks remain terrestrial riverbanks all the way to the edge. This is a river passing off-map, NOT an ocean, lake, or river mouth. NO bridge, ford, road crossing, or port across this large river.
2. GILRAIN: A smaller river rises at (20.4%,11.8%), just below the existing mountain outliers; flow south through (22%,25%) and (27%,38%) to the confluence at (39.2%,50.5%).
3. SERNI: A second smaller river rises at (50%,17.4%), south of the eastern White Mountain outliers. It flows southwest to the SAME confluence at (39.2%,50.5%). Gilrain is the WEST branch, Serni is the EAST branch. These two smaller streams NEVER connect to the Anduin. Maintain clear intervening dry land.
4. The joined river continues south from that confluence, through a shallow crossing at (40.8%,57.4%), to its coast mouth at (44.2%,78.4%). Make this a visibly continuous uninterrupted river channel to the SEA. No dry gap and no road closing its channel.
5. LINHIR: A small Gondorian haven on the WEST bank BELOW the confluence, centered at (33.3%,56.8%). A modest cluster of weathered pale stone medieval buildings at the supplied terrain scale, not a giant fortress. It sits beside the shallow ford and small ferry landings at (40.8%,57.4%). No monumental bridge. Ferry landings are minor, restrained bank features.
6. ROAD: The existing west road reaches the blank at (16.7%,29.7%). Continue it winding southeast over land into Linhir and the shallow river crossing; then continue east through the meadows to the RIGHT edge at (100%,62.1%), toward distant off-map Pelargir. Do not extend this road north to cross the Anduin.
7. COAST: Continue the existing mainland coast from the OLD LEFT strip's inner edge near y=70%; it runs generally east through the joined river mouth at (44.2%,78.4%), then reaches the RIGHT edge at y=82.6%. Ocean fills the entire area below this coast, continuously matching the old lower-left ocean, its palette, and shoreline. Retain a natural coast with small irregularities, avoiding large additional bays or islands.
8. WESTERN LEBENNIN: The land east of the small river and toward the eastern road is pastoral: scattered fields, meadow, tree clusters, restrained hill relief. Include no invented major settlement.

Constraints: Exactly one completed bitmap. Preserve old painted top and left registration without redesigning or shifting it. Fully paint the blank remainder. No labels, lettering, symbols, icons, compass, UI, frame, border, watermark, title, or any generated text. No large haze. No extra major roads or rivers. Do NOT include Pelargir, Sirith, Celos, or Erui inside this bounded western slice.

```

The returned drawing shifted the confluence and town north/east of the requested anchors. River guides and destination coordinates were registered to the inspected painting. The modest crossing is an interpretation of the ford/ferrybridge traditions.
