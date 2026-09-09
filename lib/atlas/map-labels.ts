import { places, type PlaceId } from './places';
import { mapPlaces, type MapView } from './map-view';
import { zoomDetail } from './frame-queue';

export type LabelDetail = { names: boolean; major: boolean; minor: boolean };
const overviewPlaces = new Set<PlaceId>(['grey-havens','bree','rivendell','tharbad','moria-west-gate','isengard','caras-galadhon','dol-guldur','gladden-fields','edoras','argonath','rauros','dead-marshes','black-gate','mount-doom','barad-dur','cair-andros','henneth-annun','minas-tirith','osgiliath','minas-morgul','cirith-ungol']);

// The camera owns label geometry. React owns their content and selection only.
// Keep text on one viewport layer instead of promoting every moving button.
export function renderMapLabels(layer: HTMLDivElement, view: MapView, selected: PlaceId | null, detail: LabelDetail, pixelRatio: number) {
  detail.names = zoomDetail(view.scale, detail.names, .38);
  detail.major = zoomDetail(view.scale, detail.major, .28);
  detail.minor = zoomDetail(view.scale, detail.minor, .62);
  const density = detail.names ? 'detail' : 'overview';
  if (layer.dataset.density !== density) layer.dataset.density = density;
  const ratio = Math.max(1, pixelRatio || 1);
  places.forEach((place, index) => {
    const label = layer.children[index] as HTMLButtonElement | undefined;
    if (!label) return;
    const point = mapPlaces[place.id];
    const left = `${Math.round((view.x + point.x * view.scale) * ratio) / ratio}px`;
    const top = `${Math.round((view.y + point.y * view.scale) * ratio) / ratio}px`;
    const visibility = (place.major && (detail.major || overviewPlaces.has(place.id))) || detail.minor || selected === place.id ? 'visible' : 'hidden';
    if (label.style.left !== left) label.style.left = left;
    if (label.style.top !== top) label.style.top = top;
    if (label.style.visibility !== visibility) label.style.visibility = visibility;
  });
}
