'use client';
import { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import { places, type PlaceId } from '@/lib/atlas/places';
import { type MapView } from '@/lib/atlas/map-view';
import { renderMapLabels, type LabelDetail } from '@/lib/atlas/map-labels';

export type AtlasLabelsHandle = { paint: (view: MapView, selected: PlaceId | null) => void };

export const AtlasLabels = memo(forwardRef<AtlasLabelsHandle, { selected: PlaceId | null; onSelect: (id: PlaceId) => void }>(function AtlasLabels({ selected, onSelect }, ref) {
  const layer = useRef<HTMLDivElement>(null);
  const detail = useRef<LabelDetail>({ names: false, major: false, minor: false });
  useImperativeHandle(ref, () => ({
    paint(view, selection) {
      if (layer.current) renderMapLabels(layer.current, view, selection, detail.current, window.devicePixelRatio);
    },
  }), []);
  return <div ref={layer} className="map-pins">{places.map(place => <button key={place.id} className={`map-pin pin-${place.id} ${place.major ? 'pin-major' : 'pin-minor'}`} aria-label={`Explore ${place.name} on the map`} aria-pressed={selected === place.id} onClick={() => onSelect(place.id)}><span className="pin-stem"/><span className="pin-title"><span className="pin-full-name">{place.name}</span><span className="pin-overview-name">{place.overviewLabel}</span></span><span className="pin-subtitle">{place.pinSubtitle}</span></button>)}</div>;
}));
