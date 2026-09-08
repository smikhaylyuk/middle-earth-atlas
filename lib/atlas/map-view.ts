import { mapPlaces, MAP_WIDTH, MAP_HEIGHT, type RegionId } from './world';
export { mapPlaces, MAP_WIDTH, MAP_HEIGHT } from './world';
export type MapView={x:number;y:number;scale:number};
export type MapSize={width:number;height:number};
export type MapPlaceId=keyof typeof mapPlaces;
const clamp=(n:number,min:number,max:number)=>Math.min(max,Math.max(min,n));
export function homeView(size:MapSize):MapView{
  const scale=Math.max(.12,Math.min((size.width-32)/MAP_WIDTH,(size.height-225)/MAP_HEIGHT));
  return {scale,x:size.width/2-MAP_WIDTH*.5*scale,y:size.height*.47-MAP_HEIGHT*.5*scale};
}
export function regionView(region:RegionId,size:MapSize):MapView{
  if(region==='all')return homeView(size);
  const center=region==='west'?(size.width<650?750:800):1720;
  const scale=Math.max(size.width<650?.4:.28,Math.min((size.width-64)/1350,(size.height-220)/850));
  return boundView({scale,x:size.width*.5-center*scale,y:size.height*.47-470*scale},size);
}
export function boundView(view:MapView,size:MapSize):MapView{
  const home=homeView(size),scale=clamp(view.scale,home.scale*.78,Math.max(home.scale*3.2,1.65));
  const w=MAP_WIDTH*scale,h=MAP_HEIGHT*scale;
  const x=w<size.width-40?(size.width-w)/2:clamp(view.x,size.width-w-90,90);
  const y=clamp(view.y,Math.min(size.height*.45-h,80),Math.max(size.height*.55,80));
  return {x,y,scale};
}
export function zoomView(view:MapView,size:MapSize,factor:number,point={x:size.width*.5,y:size.height*.44}):MapView{
  const home=homeView(size),scale=clamp(view.scale*factor,home.scale*.78,Math.max(home.scale*3.2,1.65)),ratio=scale/view.scale;
  return boundView({scale,x:point.x-(point.x-view.x)*ratio,y:point.y-(point.y-view.y)*ratio},size);
}
export function placeView(id:MapPlaceId,size:MapSize):MapView{
  const p=mapPlaces[id],scale=Math.min(1.5,Math.max(homeView(size).scale*2.5,.9));
  return boundView({scale,x:size.width*(size.width<700?.5:.46)-p.x*scale,y:size.height*(size.width<700?.30:.40)-p.y*scale},size);
}
