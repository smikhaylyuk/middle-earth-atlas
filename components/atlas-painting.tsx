'use client';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { assetPath } from '@/lib/atlas/asset-path';
import { type MapSize, type MapView } from '@/lib/atlas/map-view';
import { renderAtlasPainting } from '@/lib/atlas/painting';

export type AtlasPaintingHandle={paint:(view:MapView,size:MapSize)=>void};

// The backing surface stays viewport-sized at every zoom level. No scaled SVG
// masks, offscreen world-sized filters, or image replacement during gestures.
export const AtlasPainting=memo(forwardRef<AtlasPaintingHandle,{onLoad:()=>void;onError:()=>void}>(function AtlasPainting({onLoad,onError},ref){
  const canvas=useRef<HTMLCanvasElement>(null),bitmap=useRef<HTMLImageElement|null>(null);
  const camera=useRef<{view:MapView;size:MapSize}|null>(null);
  const draw=useCallback(()=>{
    const element=canvas.current,image=bitmap.current,current=camera.current;
    if(!element||!image||!current)return;
    const {view,size}=current;
    if(!renderAtlasPainting(element,image,view,size,window.devicePixelRatio))onError();
  },[onError]);
  useImperativeHandle(ref,()=>({paint(view,size){camera.current={view,size};draw();}}),[draw]);
  useEffect(()=>{
    const image=new window.Image();
    image.onload=()=>{bitmap.current=image;draw();onLoad();};
    image.onerror=onError;
    image.src=assetPath('/images/atlas-painted-polished.webp');
    return()=>{image.onload=null;image.onerror=null;bitmap.current=null;};
  },[draw,onLoad,onError]);
  return <><link rel="preload" as="image" href={assetPath('/images/atlas-painted-polished.webp')}/><canvas ref={canvas} className="atlas-painting" aria-hidden="true"/></>;
}));
