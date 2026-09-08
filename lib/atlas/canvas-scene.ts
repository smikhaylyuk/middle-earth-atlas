import { assetPath } from './asset-path';
import { atmosphereAt, type MotionIntensity } from './day-cycle';
import { sceneRegions, travellerPath, anduinJoinPath, type SceneRegion } from './scene-data';
import { type MapSize, type MapView } from './map-view';

type Sample={x:number;y:number;alpha:number};
type Track={points:Sample[];length:number};
type Region=SceneRegion & {opacity:(x:number,y:number)=>number;water:Track[];roadTracks:Track[];birdTracks:Track[]};
export type CanvasScene={regions:Region[];bird:HTMLImageElement;traveller:Track;join:Track};
export type SceneSettings={hour:number;elapsed:number;intensity:MotionIntensity;route:boolean};

export const loadImage=(src:`/${string}`)=>new Promise<HTMLImageElement>((resolve,reject)=>{
  const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error(`Could not load ${src}`));image.src=assetPath(src);
});

function samplePath(d:string,x:number,y:number,opacity:(x:number,y:number)=>number):Track{
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);
  const length=path.getTotalLength(),count=Math.max(2,Math.ceil(length/5)),points:Sample[]=[];
  for(let i=0;i<=count;i++){const p=path.getPointAtLength(i/count*length);points.push({x:p.x+x,y:p.y+y,alpha:opacity(p.x,p.y)});}
  return {points,length};
}
const paths=(d:string)=>d.match(/M[^M]+/g)??[];
export function trackPoint(track:Track,progress:number):Sample{
  const index=Math.max(0,Math.min(1,progress))*(track.points.length-1),i=Math.floor(index),a=track.points[i],b=track.points[Math.min(i+1,track.points.length-1)],t=index-i;
  return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,alpha:a.alpha+(b.alpha-a.alpha)*t};
}
export async function loadCanvasScene():Promise<CanvasScene>{
  const regions=await Promise.all(sceneRegions.map(async region=>{
    const image=await loadImage(`/images/atlas-masks/${region.id}.png`);
    const mask=document.createElement('canvas');mask.width=image.naturalWidth;mask.height=image.naturalHeight;
    const ctx=mask.getContext('2d',{willReadFrequently:true});if(!ctx)throw new Error('Canvas unavailable');
    ctx.drawImage(image,0,0);const rgba=ctx.getImageData(0,0,mask.width,mask.height).data;
    const alpha=new Uint8Array(mask.width*mask.height);for(let i=0;i<alpha.length;i++)alpha[i]=rgba[i*4+3];
    const width=mask.width,height=mask.height;mask.width=mask.height=1;
    const opacity=(x:number,y:number)=>x<0||y<0||x>=width||y>=height?0:alpha[Math.floor(y)*width+Math.floor(x)]/255;
    const water=paths(region.rivers).map(d=>samplePath(d,region.x,region.y,opacity));
    // The old paths diverge in this band. The shared join below owns it.
    if(region.id==='anduin'||region.id==='rohan')for(const t of water)for(const p of t.points)if(p.x>3200&&p.x<3460&&p.y>1780&&p.y<2040)p.alpha=0;
    return {...region,opacity,water,roadTracks:region.roads.flatMap(d=>paths(d).map(part=>samplePath(part,region.x,region.y,opacity))),birdTracks:region.flocks.map(f=>samplePath(f.path,region.x,region.y,opacity))};
  }));
  return {regions,bird:await loadImage('/images/raven-overhead.png'),traveller:samplePath(travellerPath.path,travellerPath.x,travellerPath.y,()=>1),join:samplePath(anduinJoinPath,0,0,()=>1)};
}

function glow(ctx:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,color:string,alpha:number){
  if(alpha<.005)return;
  ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);ctx.globalAlpha=alpha;
  const gradient=ctx.createRadialGradient(0,0,0,0,0,1);gradient.addColorStop(0,color);gradient.addColorStop(1,'transparent');
  ctx.fillStyle=gradient;ctx.fillRect(-1,-1,2,2);ctx.restore();
}
function currents(ctx:CanvasRenderingContext2D,track:Track,time:number){
  ctx.strokeStyle='#d7e8db';ctx.lineWidth=1.4;ctx.lineCap='round';
  for(let distance=(time*8)%95;distance<track.length;distance+=95){
    const a=trackPoint(track,distance/track.length),b=trackPoint(track,Math.min(1,(distance+8)/track.length));
    if(a.alpha<.1||b.alpha<.1)continue;
    ctx.globalAlpha=.26*Math.min(a.alpha,b.alpha);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  }
}
export function drawCanvasScene(ctx:CanvasRenderingContext2D,scene:CanvasScene,view:MapView,size:MapSize,settings:SceneSettings){
  const {elapsed:time,hour,intensity,route}=settings,a=atmosphereAt(hour),strength=intensity==='subtle'?.45:1;
  ctx.save();ctx.translate(view.x,view.y);ctx.scale(view.scale,view.scale);
  const inView=(x:number,y:number,pad=100)=>x*view.scale+view.x>-pad&&x*view.scale+view.x<size.width+pad&&y*view.scale+view.y>-pad&&y*view.scale+view.y<size.height+pad;
  for(const region of scene.regions){
    if(route)for(const track of region.roadTracks){
      ctx.strokeStyle='#d8bf82';ctx.lineWidth=1.6;ctx.setLineDash([2,8]);
      for(let i=1;i<track.points.length;i++){const p=track.points[i-1],q=track.points[i];if(p.alpha<.1||!inView(p.x,p.y))continue;ctx.globalAlpha=.7*p.alpha;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
      ctx.setLineDash([]);
    }
    for(const track of region.water)currents(ctx,track,time);
    for(const label of region.labels){
      const x=label.x+region.x,y=label.y+region.y,opacity=region.opacity(label.x,label.y);if(opacity<.2||!inView(x,y))continue;
      const light=label.kind==='forest'||label.kind==='mountain'||label.kind==='water';
      ctx.save();ctx.translate(x,y);ctx.rotate((label.angle??0)*Math.PI/180);ctx.globalAlpha=.72*opacity;ctx.font=`500 ${label.size??20}px "Cormorant Garamond", Georgia, serif`;ctx.textAlign='center';ctx.letterSpacing='4px';
      ctx.lineWidth=3;ctx.strokeStyle=light?'#374b43':'#e3d8b6';ctx.fillStyle=light?'#e1d8b7':'#344c3d';ctx.strokeText(label.text,0,0);ctx.fillText(label.text,0,0);ctx.restore();
    }
    for(const mist of region.mist){const x=region.x+mist.x+mist.w*.5+Math.sin((time-mist.delay)/31)*45,y=region.y+mist.y+mist.h*.5;if(!inView(x,y,mist.w))continue;glow(ctx,x,y,mist.w*.6,mist.h*.45,'#eeecd6',.21*a.mist*strength*region.opacity(mist.x,mist.y));}
    for(const [i,p] of region.lights.entries()){
      const x=region.x+p.x,y=region.y+p.y;if(!inView(x,y))continue;const opacity=region.opacity(p.x,p.y)*(a.night*.85+a.warmth*.15)*(.85+.15*Math.sin(time*1.2+i));
      glow(ctx,x,y,14,14,region.id==='anduin'?'#e5e5b0':'#efb068',opacity*.65);ctx.globalAlpha=opacity;ctx.fillStyle='#ffe5a3';ctx.beginPath();ctx.arc(x,y,1.6,0,Math.PI*2);ctx.fill();
    }
    for(const [i,p] of region.chimneys.entries()){
      const progress=((time+i*3.4)%11)/11,x=region.x+p.x+progress*26,y=region.y+p.y-progress*60;if(!inView(x,y))continue;glow(ctx,x,y,5+progress*9,10+progress*20,'#eae7da',Math.sin(progress*Math.PI)*.24*strength*region.opacity(p.x,p.y));
    }
    region.birdTracks.slice(0,intensity==='subtle'?1:2).forEach((track,i)=>{
      const flock=region.flocks[i],progress=((time-flock.delay)%flock.duration)/flock.duration,p=trackPoint(track,progress),q=trackPoint(track,Math.min(1,progress+.005));if(!inView(p.x,p.y))return;
      const alpha=Math.min(1,progress*12,(1-progress)*8)*p.alpha*a.birds*strength*.65;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(q.y-p.y,q.x-p.x)+Math.PI/2);ctx.globalAlpha=alpha;
      for(let bird=0;bird<3;bird++){const wing=.82+.18*Math.sin(time*4-bird);ctx.drawImage(scene.bird,-9*wing-bird*20,bird%2?10:-8,18*wing,12);}
      ctx.restore();
    });
  }
  currents(ctx,scene.join,time);
  // Weather coordinates span the atlas, not a separate field per painting.
  for(let i=0;i<3;i++){const x=((time*10+i*1400)%4500)-400,y=600+i*730;glow(ctx,x,y,430,150,'#243d32',.08*(1-a.night)*strength);}
  if(route){const p=trackPoint(scene.traveller,(time%65)/65);glow(ctx,p.x,p.y,13,13,'#f7d994',.5);ctx.globalAlpha=.7;ctx.fillStyle='#fff0bd';ctx.beginPath();ctx.arc(p.x,p.y,1.7,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}
