import { assetPath } from './asset-path';
import { MAP_WIDTH, MAP_HEIGHT, BASE_MAP_WIDTH, BASE_MAP_HEIGHT } from './world';
import { atmosphereAt, type MotionIntensity } from './day-cycle';
import { sceneRegions, travellerPath, anduinJoinPath, type SceneRegion } from './scene-data';
import { type MapSize, type MapView } from './map-view';
import { cycleProgress, motionMetrics } from './motion';
import { roadGuides, correctedRivers, tributaryLabels } from './cartography';
import { drawShoreWaves, type ShoreWaveField } from './shore-waves';

type Sample={x:number;y:number;alpha:number};
type Track={points:Sample[];length:number};
type Region=SceneRegion & {opacity:(x:number,y:number)=>number;water:Track[];roadTracks:Track[];birdTracks:Track[]};
export type CanvasScene={regions:Region[];bird:HTMLImageElement;traveller:Track;join:Track;sea:(x:number,y:number)=>number;water:(x:number,y:number)=>number;shore:ShoreWaveField;roads:Track[];corrections:Track[]};
export type SceneSettings={hour:number;elapsed:number;intensity:MotionIntensity;route:boolean};

export const loadImage=(src:`/${string}`)=>new Promise<HTMLImageElement>((resolve,reject)=>{
  const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error(`Could not load ${src}`));image.src=assetPath(src);
});

async function loadCoverage(name:'sea'|'water'){
  const image=await loadImage(`/images/atlas-masks/${name==='water'?'gondor-water':name}.png`),canvas=document.createElement('canvas');
  const width=image.naturalWidth,height=image.naturalHeight;canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw new Error('Canvas unavailable');
  ctx.drawImage(image,0,0);const rgba=ctx.getImageData(0,0,width,height).data,values=new Uint8Array(width*height);
  for(let i=0;i<values.length;i++)values[i]=rgba[i*4];canvas.width=canvas.height=1;
  return (x:number,y:number)=>{const sx=Math.floor(x/(name==='water'?MAP_WIDTH:BASE_MAP_WIDTH)*width),sy=Math.floor(y/(name==='water'?MAP_HEIGHT:BASE_MAP_HEIGHT)*height);return sx<0||sy<0||sx>=width||sy>=height?0:values[sy*width+sx]/255;};
}

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
    const image=await loadImage(`/images/atlas-masks/${region.id==='rohan'?'rohan-expanded':region.id}.png`);
    const mask=document.createElement('canvas');mask.width=image.naturalWidth;mask.height=image.naturalHeight;
    const ctx=mask.getContext('2d',{willReadFrequently:true});if(!ctx)throw new Error('Canvas unavailable');
    ctx.drawImage(image,0,0);const rgba=ctx.getImageData(0,0,mask.width,mask.height).data;
    const alpha=new Uint8Array(mask.width*mask.height);for(let i=0;i<alpha.length;i++)alpha[i]=rgba[i*4+3];
    const width=mask.width,height=mask.height;mask.width=mask.height=1;
    const opacity=(x:number,y:number)=>x<0||y<0||x>=width||y>=height?0:alpha[Math.floor(y)*width+Math.floor(x)]/255;
    const riverParts=paths(region.rivers);
    // The previous Glanduin followed the erroneous confluence in the painting.
    if(region.id==='south')riverParts.splice(1,1);
    const water=riverParts.map(d=>samplePath(d,region.x,region.y,opacity));
    // The old paths diverge in this band. The shared join below owns it.
    if(region.id==='anduin'||region.id==='rohan')for(const t of water)for(const p of t.points)if(p.x>3200&&p.x<3460&&p.y>1780&&p.y<2040)p.alpha=0;
    return {...region,opacity,water,roadTracks:region.roads.flatMap(d=>paths(d).map(part=>samplePath(part,region.x,region.y,opacity))),birdTracks:region.flocks.map(f=>samplePath(f.path,region.x,region.y,opacity))};
  }));
  const [sea,water,shore,tributaries]=await Promise.all([loadCoverage('sea'),loadCoverage('water'),fetch(assetPath('/images/atlas-masks/shore-wave-field.json')).then(r=>{if(!r.ok)throw new Error('Could not load shoreline');return r.json() as Promise<ShoreWaveField>;}),fetch(assetPath('/images/atlas-masks/tributaries.json')).then(r=>{if(!r.ok)throw new Error('Could not load watercourses');return r.json() as Promise<{points:[number,number][]}[]>;})]);
  const roads=roadGuides.flatMap(r=>paths(r.path).map(p=>samplePath(p,r.x??0,r.y??0,()=>1)));
  const corrections=Object.values(correctedRivers).map(p=>samplePath(p,0,0,()=>1));
  for(const river of tributaries)corrections.push(samplePath(river.points.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' '),0,0,()=>1));
  return {regions,sea,water,shore,roads,corrections,bird:await loadImage('/images/raven-overhead.png'),traveller:samplePath(travellerPath.path,travellerPath.x,travellerPath.y,()=>1),join:samplePath(anduinJoinPath,0,0,()=>1)};
}

function glow(ctx:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,color:string,alpha:number){
  if(alpha<.005)return;
  ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);ctx.globalAlpha=alpha;
  const gradient=ctx.createRadialGradient(0,0,0,0,0,1);gradient.addColorStop(0,color);gradient.addColorStop(1,'transparent');
  ctx.fillStyle=gradient;ctx.fillRect(-1,-1,2,2);ctx.restore();
}
export function drawCanvasScene(ctx:CanvasRenderingContext2D,scene:CanvasScene,view:MapView,size:MapSize,settings:SceneSettings){
  const {elapsed:time,hour,intensity,route}=settings,a=atmosphereAt(hour),metrics=motionMetrics(view.scale,intensity),{strength}=metrics;
  let visibleBirds=0,waterHighlights=0;
  ctx.save();ctx.translate(view.x,view.y);ctx.scale(view.scale,view.scale);
  const inView=(x:number,y:number,pad=100)=>x*view.scale+view.x>-pad&&x*view.scale+view.x<size.width+pad&&y*view.scale+view.y>-pad&&y*view.scale+view.y<size.height+pad;
  for(const track of scene.roads){
    ctx.strokeStyle=route?'#ead39e':'#dfd2ae';ctx.lineWidth=Math.max(1.5,Math.min(4,.8/view.scale));ctx.globalAlpha=route?.66:.3;ctx.setLineDash(route?[3,8]:[]);
    ctx.beginPath();track.points.forEach((p,i)=>{if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);});ctx.stroke();ctx.setLineDash([]);
  }
  for(const region of scene.regions){
    for(const label of region.labels){
      const x=label.x+region.x,y=label.y+region.y,opacity=region.opacity(label.x,label.y);if(opacity<.2||!inView(x,y))continue;
      const light=label.kind==='forest'||label.kind==='mountain'||label.kind==='water';
      ctx.save();ctx.translate(x,y);ctx.rotate((label.angle??0)*Math.PI/180);ctx.globalAlpha=.72*opacity;ctx.font=`500 ${label.size??20}px "Cormorant Garamond", Georgia, serif`;ctx.textAlign='center';ctx.letterSpacing='4px';
      ctx.lineWidth=3;ctx.strokeStyle=light?'#374b43':'#e3d8b6';ctx.fillStyle=light?'#e1d8b7':'#344c3d';ctx.strokeText(label.text,0,0);ctx.fillText(label.text,0,0);ctx.restore();
    }
    for(const mist of region.mist){const x=region.x+mist.x+mist.w*.5+Math.sin((time-mist.delay)/18)*85,y=region.y+mist.y+mist.h*.5+Math.sin(time/13)*9;if(!inView(x,y,mist.w))continue;const opacity=.36*a.mist*strength*region.opacity(mist.x,mist.y);glow(ctx,x,y,mist.w*.6,mist.h*.52,'#eeecd6',opacity);glow(ctx,x+mist.w*.2,y-12,mist.w*.32,mist.h*.34,'#f6f2df',opacity*.75);}
    for(const [i,p] of region.lights.entries()){
      const x=region.x+p.x,y=region.y+p.y;if(!inView(x,y))continue;const opacity=region.opacity(p.x,p.y)*(a.night*.85+a.warmth*.15)*(.85+.15*Math.sin(time*1.2+i));
      const radius=Math.max(14,Math.min(30,7/view.scale));glow(ctx,x,y,radius,radius,region.id==='anduin'?'#e5e5b0':'#efb068',opacity*.75);ctx.globalAlpha=opacity;ctx.fillStyle='#ffe5a3';ctx.beginPath();ctx.arc(x,y,Math.max(1.6,Math.min(3,1/view.scale)),0,Math.PI*2);ctx.fill();
    }
    for(const [i,p] of region.chimneys.entries()){
      for(let wisp=0;wisp<3;wisp++){
        const progress=cycleProgress(time,10.2,i*1.1+wisp*3.4),s=metrics.smokeScale,x=region.x+p.x+(progress*28+Math.sin(progress*5)*5)*s,y=region.y+p.y-progress*60*s;
        if(!inView(x,y))continue;glow(ctx,x,y,(4+progress*8)*s,(8+progress*18)*s,'#f0ece2',Math.sin(progress*Math.PI)*.46*strength*region.opacity(p.x,p.y));
      }
    }
    region.birdTracks.forEach((track,i)=>{
      const flock=region.flocks[i],progress=cycleProgress(time,flock.duration,-flock.delay),p=trackPoint(track,progress),q=trackPoint(track,Math.min(1,progress+.005));if(!inView(p.x,p.y))return;
      const alpha=Math.min(1,progress*12,(1-progress)*8)*p.alpha*a.birds*.9;
      if(alpha>.05)visibleBirds+=intensity==='subtle'?3:4;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(q.y-p.y,q.x-p.x)+Math.PI/2);ctx.globalAlpha=alpha;
      for(let bird=0;bird<(intensity==='subtle'?3:4);bird++){const wing=.78+.22*Math.sin(time*4.8-bird),w=metrics.birdWidth*(1-bird*.06);ctx.drawImage(scene.bird,-w*.5*wing-bird*w*.95,(bird%2?1:-1)*bird*w*.45,w*wing,w*.66);}
      ctx.restore();
    });
  }
  const labelOpacity=Math.max(0,Math.min(1,(view.scale-.4)/.2));
  if(labelOpacity>0)for(const label of tributaryLabels){
    if(!inView(label.x,label.y))continue;
    ctx.save();ctx.translate(label.x,label.y);ctx.rotate(label.angle*Math.PI/180);
    ctx.font=`italic 500 ${Math.min(32,14/view.scale)}px "Cormorant Garamond", Georgia, serif`;ctx.textAlign='center';ctx.letterSpacing='1.6px';ctx.globalAlpha=.78*labelOpacity;
    ctx.lineWidth=3;ctx.strokeStyle='#d8ceab';ctx.fillStyle='#354f48';ctx.strokeText(label.text,0,0);ctx.fillText(label.text,0,0);ctx.restore();
  }
  // Open-water highlights use one coast mask; they never move across land.
  ctx.strokeStyle=a.night>.5?'#a9cbe2':'#e3eee3';ctx.lineWidth=Math.max(1,Math.min(4,.65/view.scale));
  for(let row=0;row<50;row++)for(let col=0;col<19;col++){
    const x=col*76+(row%2)*37+Math.sin(time/7+row)*8,y=row*58+Math.sin(col*2.3)*17+cycleProgress(time,12,col+row)*10;
    if(!inView(x,y)||scene.sea(x,y)<.9||scene.sea(x+38,y)<.9)continue;
    ctx.globalAlpha=(.06+.17*Math.pow((Math.sin(time*1.1+col*2+row)+1)/2,2))*strength;
    ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+18,y-3,x+38,y);ctx.stroke();waterHighlights++;
  }
  const shoreSegments=drawShoreWaves(ctx,scene.shore,time,view,size,intensity,a.night,scene.water);
  // Weather coordinates span the atlas, not a separate field per painting.
  for(let i=0;i<4;i++){const x=((time*18+i*1100)%4500)-400,y=420+i*600+Math.sin(time/30+i)*60;glow(ctx,x,y,430,150,'#243d32',.18*(1-a.night)*strength);glow(ctx,x+210,y-40,270,100,'#243d32',.12*(1-a.night)*strength);}
  if(route){const p=trackPoint(scene.traveller,(time%65)/65);glow(ctx,p.x,p.y,13,13,'#f7d994',.5);ctx.globalAlpha=.7;ctx.fillStyle='#fff0bd';ctx.beginPath();ctx.arc(p.x,p.y,1.7,0,Math.PI*2);ctx.fill();}
  ctx.restore();
  return {visibleBirds,waterHighlights,shoreSegments};
}
