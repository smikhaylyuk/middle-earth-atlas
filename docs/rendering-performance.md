# Rendering performance

The atlas previously shaded every visible river sample with repeated trigonometry,
coordinate arrays and per-channel interpolation setup, and rescaled the complete
painting on each animation frame even when the camera was stationary.

The optimized renderer factors each river wave into fixed spatial coefficients
and shared time values. Bilinear weights are reused across RGB channels, native
ImageData metadata is read outside the pixel loop, and the original brushwork,
water coverage, resolution, phase, speed and reflection functions are retained.

A full-resolution viewport cache stores only the unlit painting. Pan, zoom,
viewport size and display-density changes invalidate it. The shared day cycle
and all animated effects are still drawn onto one buffered presentation canvas;
there are no new visible compositor layers. The extra cache uses about 10 MB
at the measured viewport and is bounded by the existing 8-million-pixel limit
(about 32 MB). This trades bounded memory for less repeated scaling work.

Paused and hidden maps no longer schedule animation callbacks. The map renderer
also sleeps while the full-screen Bree detail is open; the shared clock continues
serving the visible inn. Explicit time changes and navigation still repaint a
paused map once. The existing animation frame cap is unchanged.

## Measurements

On the same local browser, Morgul Vale, day held at 10:00, subtle motion enabled,
road highlighting disabled, with 52,749 visible water samples and a 2,500,560-pixel
presentation surface:

| Measurement | Before | After |
| --- | ---: | ---: |
| Mean measured draw work | 13.78 ms | 5.05 ms |
| 95th-percentile draw work | 17.3 ms | 6.0 ms |
| Mean river work | 13.32 ms | 4.44 ms |

A separate warmed JavaScript benchmark over 50,000 synthetic samples measured
10.07 ms versus 3.14 ms for the shader loop (3.2× faster). Comparing 2.4 million
channel values across both motion intensities and phase boundaries produced
zero changed values. A captured original-shader fixture protects that parity.

Browser figures are rolling 180-frame main-thread timings, after initial loading
and navigation settled. They do not measure total GPU work, system power, fan
speed, or guarantee the same gains on every device. The atlas still decodes a
6030 × 5550 painting and actively animates visible effects, so it remains heavier
than a static image. Existing geometry and animation checks remain in place.

The cache follows the [MDN canvas optimization guidance](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas).
Visibility handling uses the [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API).
