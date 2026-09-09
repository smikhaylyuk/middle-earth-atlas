import { mapPlaces, MAP_WIDTH, MAP_HEIGHT, type RegionId } from './world';
export { mapPlaces, MAP_WIDTH, MAP_HEIGHT } from './world';
export type MapView={x:number;y:number;scale:number};
export type MapSize={width:number;height:number};
export type MapPlaceId=keyof typeof mapPlaces;
const clamp=(n:number,min:number,max:number)=>Math.min(max,Math.max(min,n));
// The atlas combines paintings with less native detail than the world grid.
// Beyond this scale, magnification exposes texture without useful new detail.
const detailScale=.9;
const zoomLimits=(size:MapSize)=>({min:homeView(size).scale*.78,max:Math.max(homeView(size).scale,detailScale)});
export function homeView(size:MapSize):MapView{
  const top=size.width<650?100:110,bottom=size.height-(size.width<650?205:232);
  const scale=Math.max(.06,Math.min((size.width-40)/MAP_WIDTH,(bottom-top)/MAP_HEIGHT));
  return {scale,x:size.width/2-MAP_WIDTH*.5*scale,y:(top+bottom-MAP_HEIGHT*scale)/2};
}
export function regionView(region:RegionId,size:MapSize):MapView{
  if(region==='all')return homeView(size);
  if(region==='morannon'){
    const scale=Math.max(.24,Math.min((size.width-64)/1480,(size.height-235)/1250));
    return boundView({scale,x:size.width*.5-4720*scale,y:size.height*.43-2770*scale},size);
  }
  if(region==='rauros'){
    const scale=Math.max(.24,Math.min((size.width-60)/1250,(size.height-230)/1040));
    return boundView({scale,x:size.width*.5-3650*scale,y:size.height*.43-2750*scale},size);
  }
  if(region==='rohan'){
    const scale=Math.max(.22,Math.min((size.width-64)/1770,(size.height-225)/1200));
    return boundView({scale,x:size.width*.5-2640*scale,y:size.height*.43-2390*scale},size);
  }
  if(region==='anduin'){
    const scale=Math.max(.23,Math.min((size.width-64)/1300,(size.height-225)/1400));
    return boundView({scale,x:size.width*.5-2910*scale,y:size.height*.46-1120*scale},size);
  }
  if(region==='south'){
    const scale=Math.max(.22,Math.min((size.width-64)/1550,(size.height-220)/1100));
    return boundView({scale,x:size.width*.5-1690*scale,y:size.height*.46-1450*scale},size);
  }
  const center=region==='west'?(size.width<650?750:800):1720;
  const scale=Math.max(size.width<650?.4:.28,Math.min((size.width-64)/1350,(size.height-220)/850));
  return boundView({scale,x:size.width*.5-center*scale,y:size.height*.47-470*scale},size);
}
export function boundView(view:MapView,size:MapSize):MapView{
  const limits=zoomLimits(size),scale=clamp(view.scale,limits.min,limits.max);
  const w=MAP_WIDTH*scale,h=MAP_HEIGHT*scale;
  const x=w<size.width-40?(size.width-w)/2:clamp(view.x,size.width-w-90,90);
  const y=clamp(view.y,Math.min(size.height*.45-h,80),Math.max(size.height*.55,80));
  return {x,y,scale};
}
export function zoomView(view:MapView,size:MapSize,factor:number,point={x:size.width*.5,y:size.height*.44}):MapView{
  const limits=zoomLimits(size),scale=clamp(view.scale*factor,limits.min,limits.max),ratio=scale/view.scale;
  return boundView({scale,x:point.x-(point.x-view.x)*ratio,y:point.y-(point.y-view.y)*ratio},size);
}
export function placeView(id:MapPlaceId,size:MapSize):MapView{
  const p=mapPlaces[id],scale=Math.min(.8,Math.max(homeView(size).scale*2.2,.66));
  return boundView({scale,x:size.width*(size.width<700?.5:.46)-p.x*scale,y:size.height*(size.width<700?.30:.40)-p.y*scale},size);
}
