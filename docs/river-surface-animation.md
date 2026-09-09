# Painted river surface animation

River motion now advects the existing water brushwork inside the registered
channels. The earlier evenly spaced centreline strokes have been removed.
Soft interfering reflections move across the surface, while the motion slows
and fades toward the banks. This is an atmospheric illustration, not a
hydrological simulation or a change to the mapped watercourses.

The surface field is computed once on a fixed world grid from the existing
river guides and painted water mask. Each moving pixel requires a clear
footprint inside the channel. Its upstream source corridor is checked in
advance so texture displacement cannot pull land, islands or crossings into
the water, or snap back abruptly at the edge. Overlapping guides share one
pixel field rather than stacking independent effects.

Two weighted texture samples crossfade as they move downstream. A sample has
zero weight and zero weight slope when its offset resets. The original
painting supplies the colour and fine detail; the added reflection stays
within a small luminance range. The atmosphere clock lights the completed
water and land together.

Only visible cached tiles update. They are composited into the existing
viewport back buffer before the global daylight wash, and the completed
frame is presented in one canvas. Pan and zoom do not resize the water
textures or add DOM layers, filters, masks, or blend surfaces. Pausing the
map freezes the same elapsed clock used by wildlife and shore foam.

Regression checks exercise the actual expanded artwork, broad channel
coverage, source and destination bank clearance, texture-loop continuity,
palette preservation and deterministic pause behaviour. Existing shoreline,
map registration, daylight, label and viewport tests remain in place.
