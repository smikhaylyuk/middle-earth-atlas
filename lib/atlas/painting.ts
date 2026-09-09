import { MAP_WIDTH, MAP_HEIGHT, type MapSize, type MapView } from './map-view';
import { atmosphereAt } from './day-cycle';

export type PaintingCache={canvas:HTMLCanvasElement;key:string;builds:number};
export function renderCachedPainting(target:HTMLCanvasElement,cache:PaintingCache,image:CanvasImageSource,view:MapView,size:MapSize,pixelRatio:number){
  const key=`${view.x}/${view.y}/${view.scale}/${size.width}/${size.height}/${pixelRatio}`;
  if(cache.key!==key){
    if(!renderAtlasPainting(cache.canvas,image,view,size,pixelRatio))return false;
    cache.key=key;cache.builds++;
  }
  const {width,height}=cache.canvas;
  if(target.width!==width||target.height!==height){target.width=width;target.height=height;}
  const ctx=target.getContext('2d');if(!ctx)return false;
  // Copy the already scaled, full-resolution view. Lighting and motion are
  // composited afresh; neither can become baked into the cached geography.
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='copy';ctx.drawImage(cache.canvas,0,0);
  ctx.globalCompositeOperation='source-over';
  const ratio=Math.min(pixelRatio||1,2,Math.sqrt(8_000_000/(size.width*size.height)));
  ctx.setTransform(ratio,0,0,ratio,0,0);
  return true;
}

export function renderAtlasPainting(canvas:HTMLCanvasElement,image:CanvasImageSource,view:MapView,size:MapSize,pixelRatio:number){
  const ratio=Math.min(pixelRatio||1,2,Math.sqrt(8_000_000/(size.width*size.height)));
  const width=Math.max(1,Math.round(size.width*ratio)),height=Math.max(1,Math.round(size.height*ratio));
  // Resizing clears the backing store. Zooming must never resize it.
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  const context=canvas.getContext('2d');
  if(!context)return false;
  context.setTransform(ratio,0,0,ratio,0,0);
  context.clearRect(0,0,size.width,size.height);
  context.imageSmoothingEnabled=true;
  context.imageSmoothingQuality='high';
  context.drawImage(image,view.x,view.y,MAP_WIDTH*view.scale,MAP_HEIGHT*view.scale);
  return true;
}

// One tone for every painted pixel. Source-atop preserves the paper feather.
export function lightAtlasPainting(context:CanvasRenderingContext2D,size:MapSize,hour:number){
  const a=atmosphereAt(hour);
  context.save();context.globalCompositeOperation='source-atop';
  const wash=(color:string,alpha:number)=>{if(alpha<=0)return;context.globalAlpha=alpha;context.fillStyle=color;context.fillRect(0,0,size.width,size.height);};
  wash('#a0a39b',(1-a.saturation)*.24);
  wash(a.brightness<1?'#000000':'#ffffff',a.brightness<1?1-a.brightness:(a.brightness-1)*.45);
  wash('#e8ad61',a.warmth*.28);
  wash('#173d65',a.night*.36);
  context.restore();
}
