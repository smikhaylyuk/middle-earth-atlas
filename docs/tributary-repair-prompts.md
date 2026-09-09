# Tributary artwork provenance — 8 September 2026

Built-in ImageGen: exactly two edits, generated together, with no retries.
Only registered river and bank strips are accepted. Full candidate crops
are retained as reproducible inputs, not displayed wholesale.

## Shire

Use case: precise-object-edit.
Asset type: painted Tolkien atlas river correction.
Input images: Image 1, shire-target.png, is the ONLY edit target: a 900 by 600 pixel landscape painted map. Image 2, shire-reference.jpg, is geography reference only. Never copy its labels, lettering, symbols, paper color, or graphic style.
Primary request: Add ONLY The Water and Withywindle as fine connected streams in the target. Match the target's existing hand-painted muted olive, ochre, dark forest green and blue-green palette, fine brushwork, grain, aerial map perspective, lighting, terrain texture, and sharpness precisely.
Composition/framing: Preserve the entire target crop's exact composition, boundaries, view, positions, and aspect ratio. Pixel coordinates below refer to the ORIGINAL 900x600 target and must be proportionally respected if output resolution is higher. Do not zoom, crop, shift, warp, redesign, or repaint unrelated areas.

The Water: a continuous fine 4–7 pixel muted blue-green stream, much smaller than the existing Baranduin. Begin in the northwest low hills near (140,60), descend toward (190,140), bend east and south to pass immediately south of the EXISTING Hobbiton village at (305,189), then continue via (280,214) and (340,220), with a tiny naturally widened Bywater pool at the latter point. Continue through (405,215) and (450,231), and visibly join the WEST bank of the EXISTING Baranduin near (493,238). This mouth must lie NORTH of the ORIGINAL East Road stone bridge near (495,260). Water must flow continuously all the way into Baranduin: join the river water, with no grassy divider and no floating or disconnected ends. Keep the original East Road bridge and Baranduin's course, width, banks and texture EXACTLY as they are. Very short minor split-and-rejoin marsh threads near (180,100) and north of the road near (400,218) may be restrained and tiny. Fine natural painted banks only.

Withywindle: add a thin 3–6 pixel winding muted blue-green brook through the SOUTHERN Old Forest. Begin near the northeastern forest edge at (742,368), at the foot of the Barrow-downs. Follow southwest through (693,394), (650,416), (600,438), (566,461), and join the EAST bank of existing Baranduin near (542,478). Preserve the forest; clear only the immediate slender stream corridor among the trees. Make the mouth visibly open into Baranduin, with no grassy divider or floating end.

Constraints: Change ONLY immediate stream corridors. Preserve original villages and Hobbiton houses, Bree at the right, all roads and paths, the stone bridge, original Baranduin, hills, mountains, coastline, land colors, forest composition and every unrelated feature. Do not add or move any settlement, building, bridge, label, writing, border or map symbol. No bright cyan, no thick dominant rivers, no new tributaries, no new lakes except the tiny Bywater pool, no broad forest removal. The published reference determines geography only; target determines all visual appearance. Output only the edited version of Image 1.


## Westfold

Use case: precise-object-edit.
Asset type: painted Tolkien atlas river correction.
Input images: Image 1, westfold-target.png, is the ONLY edit target: a 1350 by 740 pixel landscape painted map. Image 2, west-published-crop.png, is geography reference only; its LOWER portion shows Adorn south of Isen coming from the western White Mountains. Never copy reference labels, lettering, symbols, paper background, or graphic style.
Primary request: Add ONLY the Adorn river and the KNOWN LOCAL northward Deeping-stream course to the target. Match precisely the target's existing painted muted grassy olive and ochre, blue-green water, fine brushwork, grain, aerial map perspective, terrain, light, and sharpness.
Composition/framing: Keep the entire target crop's original exact framing, aspect ratio, boundaries, perspective and positions. Pixel coordinates below refer to ORIGINAL 1350x740 target and must be proportionally respected if output resolution is higher. No zoom, crop, shift, warping, or redesign.

Adorn: add a slender 6–10 pixel natural muted blue-green river, distinctly smaller than existing Isen. Source it on the WEST side of the White Mountain foothills near (790,582). It flows as one continuous meandering channel NORTHWEST through (700,520), (600,490), (525,455), (440,380), (350,330), (260,285), (210,240), then joins the SOUTH bank of the EXISTING Isen at approximately (165,164). Follow this source-to-mouth route around natural foothills, modifying only the immediate slender river corridor. Its mouth must visibly join Isen water with no grassy barrier or floating end. The junction is far WEST/downstream of the existing island/Fords around (670,120). Preserve existing Isen's course and all original banks, width, island and Fords exactly. Do not attach Adorn to any northwest inlet or to the Fords.

Deeping-stream: show ONLY the known LOCAL northward outflow. A very slender brook emerges from the gorge at the feet of the EXISTING fortress around (1090,620), passes through the BASE of the EXISTING defensive wall near (1055,580), then flows north around the foot of the Hornburg rock through (1020,550), (1010,500), (960,450), (920,414). Its downstream continuation then becomes naturally OCCLUDED UNDER an existing alder/woodland stand near (900,400). Keep the channel subtle and narrow, scaled much smaller than Isen or Adorn. Its far end MUST vanish naturally beneath foliage; never end abruptly in bare open ground. Do not invent unknown downstream geography: NO connection whatsoever from Deeping-stream to Isen, Adorn, Snowbourn, Entwash, or another river. Only remove any false tiny blue rivulet pointing south from the fortress where necessary to establish this northward local outflow. Preserve the fortress, gorge, cliff, wall, roads and vegetation outside the immediate brook corridor exactly.

Constraints: Change ONLY these two immediate stream corridors. Preserve the entire original terrain and mountain silhouettes, existing fortress structures, coast at lower left, roads, forest patches and all distant features. Keep the ORIGINAL Snowbourn at the FAR RIGHT and all its banks and course EXACTLY where they are. No new settlements, buildings, labels, lettering, symbols, bridges, map borders, large lakes, other rivers, bright colors, or broad terrain repainting. The reference informs geography only; the target controls all appearance. Output only the edited version of Image 1.


## Saved assets and integration

- `public/images/repairs/shire-waterways-source.webp`: 900×600 lossless resampling of the 1536×1024 candidate.
- `public/images/repairs/westfold-waterways-source.webp`: 1350×740 lossless resampling of the 1694×929 candidate.
- `public/images/repairs/shire-waterways.webp`: transparent registered river strips, placed at world (500,180).
- `public/images/repairs/westfold-waterways.webp`: transparent registered river strips, placed at world (1150,1960).
- `scripts/register-tributaries.mjs` records source and destination controls, source-channel sampling, raster registration and feathering.

The Water’s candidate passed north of Hobbiton: the accepted strip is moved
south of the village, with its confluence retained above Brandywine Bridge.
Withywindle’s strip is moved into the southern Old Forest. Adorn is accepted
only as far upstream as the western mountain foothills; its invented extension
toward the Hornburg is excluded. Deeping-stream is restricted to a short local
gorge reach. Its final destination remains unknown, not invented.
