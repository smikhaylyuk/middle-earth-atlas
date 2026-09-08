import { MAP_WIDTH, MAP_HEIGHT, type MapSize, type MapView } from './map-view';

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
