'use client';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, type RefObject } from 'react';
import { assetPath } from '@/lib/atlas/asset-path';
import { type MapSize, type MapView } from '@/lib/atlas/map-view';
import { renderCachedPainting, lightAtlasPainting, type PaintingCache } from '@/lib/atlas/painting';
import { loadCanvasScene, loadImage, drawCanvasScene, type CanvasScene } from '@/lib/atlas/canvas-scene';
import { type MotionIntensity } from '@/lib/atlas/day-cycle';
import {buildRiverField,createRiverSurface,drawRiverSurface,type RiverSurface} from '@/lib/atlas/river-surface';

export type AtlasPaintingHandle={paint:(view:MapView,size:MapSize)=>void;diagnostics:()=>{renderer:string;frames:number;surfaceResizes:number;p95DrawMs:number;maxDrawMs:number;meanDrawMs:number;paintingBuilds:number;stages:Record<string,number>;surfacePixels:number;animationSeconds:number;visibleBirds:number;waterHighlights:number;shoreSegments:number;riverPixels:number}};
type Props={onLoad:()=>void;onError:()=>void;hour:RefObject<number>;running:boolean;visible:boolean;intensity:MotionIntensity;route:boolean;timeRevision:number};

// One opaque presentation surface. No live CSS masks, filters, blend layers,
// world-sized transforms, or separate regional clock rendering in the DOM.
export const AtlasPainting=memo(forwardRef<AtlasPaintingHandle,Props>(function AtlasPainting(props,ref){
  const canvas=useRef<HTMLCanvasElement>(null),buffer=useRef<HTMLCanvasElement|null>(null);
  const assets=useRef<{image:HTMLImageElement;scene:CanvasScene;rivers:RiverSurface}|null>(null);
  const camera=useRef<{view:MapView;size:MapSize}|null>(null),settings=useRef(props);
  const stages=useRef<number[][]>([]),paintingCache=useRef<PaintingCache|null>(null);
  useEffect(()=>{settings.current=props;},[props]);
  const elapsed=useRef(0),measurements=useRef<number[]>([]),frames=useRef(0),resizes=useRef(0),lastDraw=useRef(0),sceneCounts=useRef({visibleBirds:0,waterHighlights:0,shoreSegments:0,riverPixels:0});
  const draw=useCallback(()=>{
    const element=canvas.current,current=camera.current,loaded=assets.current,back=buffer.current,cache=paintingCache.current;
    if(!element||!current||!loaded||!back||!cache)return;
    const started=performance.now(),{view,size}=current;
    if(!renderCachedPainting(back,cache,loaded.image,view,size,window.devicePixelRatio)){settings.current.onError();return;}
    const painted=performance.now();
    const layer=back.getContext('2d');if(!layer)return;
    const riverPixels=drawRiverSurface(layer,loaded.rivers,elapsed.current,view,size,settings.current.intensity);
    const flowed=performance.now();
    lightAtlasPainting(layer,size,settings.current.hour.current);
    const lit=performance.now();
    layer.save();layer.globalCompositeOperation='source-atop';
    sceneCounts.current={...drawCanvasScene(layer,loaded.scene,view,size,{hour:settings.current.hour.current,elapsed:elapsed.current,intensity:settings.current.intensity,route:settings.current.route}),riverPixels};
    layer.restore();
    const decorated=performance.now();
    if(element.width!==back.width||element.height!==back.height){element.width=back.width;element.height=back.height;resizes.current++;}
    const ctx=element.getContext('2d',{alpha:false});if(!ctx){settings.current.onError();return;}
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    ctx.fillStyle='#e4dbc0';ctx.fillRect(0,0,element.width,element.height);ctx.drawImage(back,0,0);
    lastDraw.current=performance.now();
    stages.current.push([painted-started,flowed-painted,lit-flowed,decorated-lit,lastDraw.current-decorated]);if(stages.current.length>180)stages.current.shift();
    frames.current++;measurements.current.push(performance.now()-started);if(measurements.current.length>180)measurements.current.shift();
  },[]);
  useImperativeHandle(ref,()=>({
    paint(view,size){camera.current={view,size};draw();},
    diagnostics(){const times=[...measurements.current].sort((a,b)=>a-b);return {...sceneCounts.current,renderer:'unified-canvas',animationSeconds:Math.round(elapsed.current*100)/100,frames:frames.current,surfaceResizes:resizes.current,p95DrawMs:Math.round((times[Math.floor(times.length*.95)]??0)*100)/100,maxDrawMs:Math.round((times.at(-1)??0)*100)/100,meanDrawMs:Math.round(times.reduce((a,b)=>a+b,0)/Math.max(1,times.length)*100)/100,paintingBuilds:paintingCache.current?.builds??0,stages:Object.fromEntries(['painting','rivers','lighting','scene','present'].map((name,i)=>[name,Math.round(stages.current.reduce((sum,s)=>sum+s[i],0)/Math.max(1,stages.current.length)*100)/100])),surfacePixels:(canvas.current?.width??0)*(canvas.current?.height??0)};},
  }),[draw]);
  useEffect(()=>{
    let alive=true;
    buffer.current=document.createElement('canvas');
    paintingCache.current={canvas:document.createElement('canvas'),key:'',builds:0};
    void Promise.all([loadImage('/images/atlas-lamedon.webp'),loadCanvasScene()]).then(([image,scene])=>{
      if(!alive)return;
      const tracks=[...scene.regions.flatMap(region=>region.water),scene.join,...scene.corrections];
      const rivers=createRiverSurface(image,buildRiverField(tracks,scene.water));
      assets.current={image,scene,rivers};draw();settings.current.onLoad();
      void document.fonts.ready.then(()=>{if(alive)draw();});
    }).catch(()=>{if(alive)settings.current.onError();});
    return()=>{alive=false;assets.current=null;buffer.current=null;paintingCache.current=null;};
  },[draw]);
  useEffect(()=>{
    if(props.visible)draw();
  },[draw,props.visible,props.running,props.intensity,props.route,props.timeRevision]);
  useEffect(()=>{
    // Paused and hidden maps have no animation callback at all. Camera and
    // explicit setting changes still paint once through their event handlers.
    if(!props.visible||!props.running)return;
    let frame=0,last=performance.now();
    function tick(now:number){
      const delta=Math.min(.1,(now-last)/1000);last=now;
      elapsed.current+=delta;
      if(now-lastDraw.current>=1000/30)draw();
      frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(frame);
  },[draw,props.visible,props.running]);
  return <><link rel="preload" as="image" href={assetPath('/images/atlas-lamedon.webp')}/><canvas ref={canvas} className="atlas-painting" data-renderer="unified-canvas" aria-hidden="true"/></>;
}));
